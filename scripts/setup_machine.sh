#!/bin/bash

set -e

echo "========== Setting timezone to Asia/Tokyo"
sudo timedatectl set-timezone Asia/Tokyo
echo "========== Updating packages"
sudo apt update
echo "========== Installing required packages"
sudo apt install -y awscli git curl wget unzip
echo "========== Installing Docker"
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

echo "Machine setup complete"
