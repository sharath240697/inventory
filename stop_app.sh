#!/bin/bash

# Function to stop a process given a port
stop_process() {
  local port=$1
  local pid=$(lsof -t -i:$port)
  
  if [ -n "$pid" ]; then
    echo "Stopping process on port $port (PID: $pid)"
    kill $pid && echo "Process on port $port stopped successfully" || echo "Failed to stop process on port $port" | tee -a "$REPO_PATH/logs/startup.log"
  else
    echo "No process found on port $port"
  fi
}

# Stop processes on ports 3000 and 5173
stop_process 3000
stop_process 5173
