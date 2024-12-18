#!/bin/bash

# Remove existing image if it exists
docker rmi file-service:latest 2>/dev/null || true

# Build new image
docker build -t file-service:latest .