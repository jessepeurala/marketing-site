import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 3600000; // 1 hour in milliseconds
const MAX_REQUESTS = 5;
const requestCounts = new Map<string, { count: number; timestamp: number }>();

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: process.env.EMAIL_SERVER_PORT === '465',
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

// Validation functions
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidMessage = (message: string): boolean => {
  return message.length >= 10 && message.length <= 1000;
};

// Sanitize input
const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove potential JavaScript protocol
    .replace(/on\w+=/gi, ''); // Remove potential event handlers
};

export async function POST(request: Request) {
  const prisma = new PrismaClient();
  
  try {
    // Get client IP
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';

    // Check rate limit
    const now = Date.now();
    const userRequests = requestCounts.get(ip) || { count: 0, timestamp: now };

    if (now - userRequests.timestamp > RATE_LIMIT_WINDOW) {
      // Reset if window has passed
      requestCounts.set(ip, { count: 1, timestamp: now });
    } else if (userRequests.count >= MAX_REQUESTS) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    } else {
      // Increment count
      requestCounts.set(ip, {
        count: userRequests.count + 1,
        timestamp: userRequests.timestamp,
      });
    }

    // Parse and validate request body
    const body = await request.json();
    const { name, email, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedMessage = sanitizeInput(message);

    // Validate email format
    if (!isValidEmail(sanitizedEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate message length
    if (!isValidMessage(sanitizedMessage)) {
      return NextResponse.json(
        { error: 'Message must be between 10 and 1000 characters' },
        { status: 400 }
      );
    }

    // Store in database
    const contact = await prisma.contact.create({
      data: {
        name: sanitizedName,
        email: sanitizedEmail,
        message: sanitizedMessage,
      },
    });

    // Send notification email to admin
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: 'New Contact Form Submission',
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${sanitizedName}</p>
        <p><strong>Email:</strong> ${sanitizedEmail}</p>
        <p><strong>Message:</strong></p>
        <p>${sanitizedMessage.replace(/\n/g, '<br>')}</p>
        <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
      `,
    });

    // Send confirmation email to user
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: sanitizedEmail,
      subject: 'Thank you for contacting us',
      html: `
        <h2>Thank you for reaching out!</h2>
        <p>We have received your message and will get back to you as soon as possible.</p>
        <p>Here's a copy of your message:</p>
        <blockquote>${sanitizedMessage.replace(/\n/g, '<br>')}</blockquote>
        <p>Best regards,<br>Your Company Name</p>
      `,
    });

    await prisma.$disconnect();

    return NextResponse.json({
      message: 'Thank you for your message. We will get back to you soon!',
    });
  } catch (error) {
    console.error('Contact form error:', error);
    await prisma.$disconnect();
    return NextResponse.json(
      { error: 'Failed to process your request. Please try again later.' },
      { status: 500 }
    );
  }
} 