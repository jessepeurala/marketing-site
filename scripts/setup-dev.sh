#!/bin/bash

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
  echo "Creating .env file..."
  cat > .env << EOL
# Database
DATABASE_URL="file:./prisma/dev.db"

# Email Configuration (Gmail)
EMAIL_SERVER_USER="your-gmail@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-specific-password"
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_FROM="your-gmail@gmail.com"
ADMIN_EMAIL="your-admin-email@example.com"
EOL
fi

# Create prisma directory if it doesn't exist
mkdir -p prisma

# Initialize database
echo "Initializing database..."
npx prisma generate
npx prisma db push

echo "Setup complete!" 