FROM node:20-bookworm

# Install Python and dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

# Set up the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node dependencies
RUN npm install

# Copy application source code
COPY . .

# Set up Python virtual environment and install dependencies
# We use a virtual environment to avoid PEP 668 restrictions in newer Debian
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install Pillow for the image processing script
RUN pip install Pillow

# Expose the server port
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
