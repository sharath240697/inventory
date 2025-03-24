#!/bin/bash

export DISPLAY=:0
export XAUTHORITY=/home/manjushri/.Xauthority
export DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/$(id -u manjushri)/bus

# Define paths
REPO_PATH="/home/manjushri/Desktop/workspace/inventory"
SERVER_PATH="$REPO_PATH/server"
CLIENT_PATH="$REPO_PATH/client"

# Function to check if a process is running on a specific port
function is_port_in_use() {
  lsof -i:"$1" &>/dev/null
  return $?
}

# Create log directory if it doesn't exist
mkdir -p "$REPO_PATH/logs"

echo "$(date +"%Y-%m-%d %H:%M:%S"): Starting Inventory Application..." | tee -a "$REPO_PATH/logs/startup.log"

# Start server
cd "$SERVER_PATH" || exit
echo "$(date +"%Y-%m-%d %H:%M:%S"): Starting server..." | tee -a "$REPO_PATH/logs/startup.log"
if is_port_in_use 3000; then
  echo "$(date +"%Y-%m-%d %H:%M:%S"): Port 3000 is already in use. Server may already be running." | tee -a "$REPO_PATH/logs/startup.log"
else
  nohup node app.js > "$REPO_PATH/logs/server.log" 2>&1 &
  echo "$(date +"%Y-%m-%d %H:%M:%S"): Server started with PID $!" | tee -a "$REPO_PATH/logs/startup.log"
  
  # Wait for server to start
  sleep 3
fi

# Start client
cd "$CLIENT_PATH" || exit
echo "$(date +"%Y-%m-%d %H:%M:%S"): Starting client..." | tee -a "$REPO_PATH/logs/startup.log"
if is_port_in_use 5173; then
  echo "$(date +"%Y-%m-%d %H:%M:%S"): Port 5173 is already in use. Client may already be running." | tee -a "$REPO_PATH/logs/startup.log"
else
  nohup npm run dev > "$REPO_PATH/logs/client.log" 2>&1 &
  echo "$(date +"%Y-%m-%d %H:%M:%S"): Client started with PID $!" | tee -a "$REPO_PATH/logs/startup.log"
  sleep 15
  # Wait for client to start
  sleep 5
fi

# Open in Firefox browser
echo "$(date +"%Y-%m-%d %H:%M:%S"): Opening application in Firefox browser..." | tee -a "$REPO_PATH/logs/startup.log"
# Start Firefox (or any application)
nohup firefox http://localhost:5173 &
echo "$(date +"%Y-%m-%d %H:%M:%S"): Browser opened" | tee -a "$REPO_PATH/logs/startup.log"