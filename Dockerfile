FROM python:3.9-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    zip unzip \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements từ ladifinal subfolder và install Python packages
COPY ladifinal/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Create necessary directories với correct permissions
RUN mkdir -p uploads published static/uploads app/data logs && \
    chmod 755 uploads published static/uploads app/data logs

# Create non-root user
RUN useradd --create-home --shell /bin/bash flask-user && \
    chown -R flask-user:flask-user /app

# Switch to non-root user
USER flask-user

EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

# Environment variables
ENV FLASK_APP=ladifinal/main.py
ENV FLASK_ENV=production
ENV PYTHONPATH=/app

CMD ["python", "ladifinal/main.py"]