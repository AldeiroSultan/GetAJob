FROM node:18-alpine

WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install --production

# Install frontend dependencies and build
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

# Copy all source code
COPY backend/ ./backend/
COPY frontend/ ./frontend/

# Build the React frontend
RUN cd frontend && npm run build

# Copy the built frontend into backend/public so Express can serve it
RUN cp -r frontend/dist backend/public

# Make sure uploads folder exists
RUN mkdir -p backend/uploads

WORKDIR /app/backend

EXPOSE 4000

CMD ["node", "server.js"]
