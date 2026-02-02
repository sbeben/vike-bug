# Use the official Node.js image as the base image
FROM node:20-slim as builder

ARG PUBLIC_ENV__HOST
# Set them as environment variables - AND THESE
ENV PUBLIC_ENV__HOST=${PUBLIC_ENV__HOST}

# Set the working directory
WORKDIR /app

# Install and setup pnpm
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"
ENV SHELL="/bin/sh"

RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN pnpm install

# Copy the source code
COPY . .



# Build the application
RUN pnpm run build

FROM node:20-slim

ARG PUBLIC_ENV__HOST
# Set them as environment variables - AND THESE
ENV PUBLIC_ENV__HOST=${PUBLIC_ENV__HOST}

# Set production environment
ENV NODE_ENV=production
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"
ENV SHELL="/bin/sh"


WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files and install only production dependencies
COPY package*.json ./
RUN pnpm install --prod

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Expose the port the app will run on
EXPOSE 4000

# Start the server directly without cross-env since we're setting NODE_ENV in the container
CMD ["node", "./dist/cli/server/index"]


