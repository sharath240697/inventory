chmod +x start_app.sh
sudo mv inventory-app.service /etc/systemd/system/
sudo systemctl enable inventory-app.service

# Start the service manually to test it:
sudo systemctl start inventory-app.service

# Check the status to verify it's running:
sudo systemctl status inventory-app.service


#  you need to stop the service at any time, you can use:
sudo systemctl stop inventory-app.service