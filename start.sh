#!/bin/bash

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Limpando processos anteriores..."
pkill -f "go run main.go" 2>/dev/null
pkill -f "next dev" 2>/dev/null
sleep 1

echo "Limpando cache do frontend..."
rm -rf "$ROOT_DIR/frontend/.next"

if [ ! -d "$ROOT_DIR/backend/assets" ]; then
  cp -r "$ROOT_DIR/frontend/public/assets" "$ROOT_DIR/backend/assets"
  echo "Assets copiados para backend/assets."
fi

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