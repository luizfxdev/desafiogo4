#!/bin/bash

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

start_backend() {
  cd "$ROOT_DIR/backend"
  go run main.go &
  BACKEND_PID=$!
  echo "Backend iniciado (PID: $BACKEND_PID)"
}

start_frontend() {
  cd "$ROOT_DIR/frontend"
  npm run dev &
  FRONTEND_PID=$!
  echo "Frontend iniciado (PID: $FRONTEND_PID)"
}

cleanup() {
  echo "\nEncerrando processos..."
  kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
  exit 0
}

trap cleanup SIGINT SIGTERM

start_backend
start_frontend

wait