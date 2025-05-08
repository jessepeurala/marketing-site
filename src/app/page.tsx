'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const MAX_NAME_LENGTH = 100;
const MAX_MESSAGE_LENGTH = 1000;
const MIN_MESSAGE_LENGTH = 10;
const RATE_LIMIT_COOLDOWN = 3600; // 1 hour in seconds

export default function Home() {
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formMessage, setFormMessage] = useState('');
  const [cooldownTime, setCooldownTime] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: '',
  });

  // Handle rate limit cooldown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldownTime > 0) {
      timer = setInterval(() => {
        setCooldownTime(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldownTime]);

  // Format cooldown time
  const formatCooldownTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  };

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'name':
        if (value.length < 2) return 'Name must be at least 2 characters';
        if (value.length > MAX_NAME_LENGTH) return `Name must be less than ${MAX_NAME_LENGTH} characters`;
        return '';
      case 'email':
        if (!value) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        return '';
      case 'message':
        if (value.length < MIN_MESSAGE_LENGTH) return `Message must be at least ${MIN_MESSAGE_LENGTH} characters`;
        if (value.length > MAX_MESSAGE_LENGTH) return `Message must be less than ${MAX_MESSAGE_LENGTH} characters`;
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {
      name: validateField('name', formData.name),
      email: validateField('email', formData.email),
      message: validateField('message', formData.message),
    };
    
    setErrors(newErrors);
    
    // Check if there are any errors
    if (Object.values(newErrors).some(error => error)) {
      return;
    }

    setFormStatus('loading');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setFormStatus('success');
        setFormMessage(result.message);
        setFormData({ name: '', email: '', message: '' });
      } else {
        setFormStatus('error');
        setFormMessage(result.error || 'Something went wrong. Please try again.');
        
        // Handle rate limit error
        if (response.status === 429) {
          setCooldownTime(RATE_LIMIT_COOLDOWN);
        }
      }
    } catch (error) {
      setFormStatus('error');
      setFormMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-90"></div>
        <div className="absolute inset-0 bg-grid-white/[0.2] bg-[size:50px_50px]"></div>
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 animate-fade-in">
            Transforming Ideas into
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              Digital Excellence
            </span>
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Expert software consulting services to help your business thrive in the digital age
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="#contact"
              className="px-8 py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-opacity-90 transition-all transform hover:scale-105"
            >
              Get Started
            </Link>
            <Link
              href="#services"
              className="px-8 py-3 border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition-all transform hover:scale-105"
            >
              Our Services
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Let's Build Something Amazing</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Ready to transform your business? Get in touch with us today.
            </p>
          </div>
          <div className="max-w-xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  maxLength={MAX_NAME_LENGTH}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Your name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  maxLength={MAX_MESSAGE_LENGTH}
                  rows={4}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.message ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Tell us about your project"
                ></textarea>
                {errors.message && (
                  <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  {formData.message.length}/{MAX_MESSAGE_LENGTH} characters
                </p>
              </div>
              
              {cooldownTime > 0 && (
                <div className="p-4 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-100 rounded-lg">
                  <p className="font-medium">Rate limit reached</p>
                  <p className="text-sm mt-1">
                    Please wait {formatCooldownTime(cooldownTime)} before submitting again.
                  </p>
                </div>
              )}

              {formMessage && (
                <div
                  className={`p-4 rounded-lg ${
                    formStatus === 'success'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100'
                      : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100'
                  }`}
                >
                  {formMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={formStatus === 'loading' || cooldownTime > 0}
                className={`w-full px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold transition-all transform hover:scale-105 ${
                  (formStatus === 'loading' || cooldownTime > 0)
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-blue-700'
                }`}
              >
                {formStatus === 'loading' ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : cooldownTime > 0 ? (
                  `Wait ${formatCooldownTime(cooldownTime)}`
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

const services = [
  {
    title: "Web Development",
    description: "Custom web applications built with modern technologies and best practices.",
    icon: (
      <svg
        className="w-6 h-6 text-blue-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    title: "Mobile Apps",
    description: "Native and cross-platform mobile applications for iOS and Android.",
    icon: (
      <svg
        className="w-6 h-6 text-blue-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    title: "Enterprise Solutions",
    description: "Scalable software solutions for businesses of all sizes.",
    icon: (
      <svg
        className="w-6 h-6 text-blue-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),
  },
];
