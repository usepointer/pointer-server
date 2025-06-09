#!/bin/bash

USER="root"      # Replace with your droplet's username
HOST="68.183.76.93"    # Replace with your droplet's IP address
DEST_PATH="~"  # Replace with the destination path on your droplet
IDENTITY_FILE="~/.ssh/droplet_pointer"  # Path to your SSH private key
SCRIPT_NAME="run-pointer"

ssh ${USER}@${HOST} -i "$IDENTITY_FILE" << EOF
cd ${REMOTE_DIR}
pm2 restart "${SCRIPT_NAME}"
EOF
