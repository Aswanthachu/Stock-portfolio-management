#!/bin/bash

set -e

export NVM_DIR=$HOME/.nvm
. $NVM_DIR/nvm.sh

APP_DIR=/home/ubuntu/kks-backend
SERVER_NAME=server

# Move to the application directory
cd $APP_DIR

# Stop the running server if it exists
if pm2 describe $SERVER_NAME &>/dev/null; then
  echo "Stopping the running server..."
  pm2 stop $SERVER_NAME
fi

# Pull the latest changes from the repository
echo "Pulling the latest changes..."
git pull origin master

# Install dependencies
echo "Installing dependencies..."
nvm use --lts
npm ci --production

# Start the server
echo "Starting the server..."
pm2 start npm --name $SERVER_NAME -- run start

# Reload PM2 process list
echo "Reloading PM2 process list..."
pm2 reload all

echo "Deployment completed successfully!"
