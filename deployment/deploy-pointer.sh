#!/bin/bash
# Deploy files to your droplet using scp

# Set these variables to match your droplet
USER="root"      # Replace with your droplet's username
HOST="68.183.76.93"    # Replace with your droplet's IP address
DEST_PATH="~"  # Replace with the destination path on your droplet
IDENTITY_FILE="~/.ssh/droplet_pointer"  # Path to your SSH private key

# Files and directories to copy
FILES_TO_COPY=(
  "src"
  "package.json"
  "tsconfig.json"
)

# Copy files to the droplet
for item in "${FILES_TO_COPY[@]}"; do
  scp -r -i "$IDENTITY_FILE"  "$item" "$USER@$HOST:$DEST_PATH"
done

echo "Deployment complete."
