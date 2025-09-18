# Deployment Guide - Multi-Vendor Firewall Converter

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/multi-vendor-firewall-converter.git
cd multi-vendor-firewall-converter
```

### 2. Install Dependencies
```bash
# Install all dependencies (root, server, and client)
npm run install-all

# Or install individually:
npm install
cd server && npm install
cd ../client && npm install
```

### 3. Start the Application
```bash
# Start both servers (recommended)
npm run dev

# Or start individually:
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend  
npm run client
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=5000
REACT_APP_API_URL=http://localhost:5000
```

### Production Build
```bash
# Build the React client
npm run build

# The built files will be in client/build/
```

## 📁 Project Structure
```
multi-vendor-firewall-converter/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/               # Source code
│   │   ├── components/    # React components
│   │   ├── App.js        # Main application
│   │   └── index.js      # Entry point
│   └── package.json
├── server/                # Node.js backend
│   ├── vendors/           # Multi-vendor parsers
│   ├── index.js          # Main server
│   └── package.json
├── converted/            # Generated configs (auto-created)
├── uploads/             # Temp uploads (auto-created)
├── README.md
├── DEPLOYMENT.md
└── package.json
```

## 🐳 Docker Deployment (Optional)

### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Install dependencies
RUN npm run install-all

# Copy source code
COPY . .

# Build client
RUN cd client && npm run build

# Expose ports
EXPOSE 3000 5000

# Start application
CMD ["npm", "run", "dev"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
      - "5000:5000"
    volumes:
      - ./converted:/app/converted
      - ./uploads:/app/uploads
```

## 🔒 Security Considerations

1. **File Upload Security**
   - Only allow specific file types (.txt, .cfg, .xml)
   - Validate file content before processing
   - Clean up temporary files

2. **API Security**
   - Implement rate limiting
   - Add authentication if needed
   - Validate all inputs

3. **Network Security**
   - Use HTTPS in production
   - Configure CORS properly
   - Implement proper firewall rules

## 📊 Monitoring

### Health Checks
- Backend: `GET http://localhost:5000/api/vendors`
- Frontend: `GET http://localhost:3000`

### Logs
- Server logs: Check console output
- Error logs: Monitor for conversion errors
- Access logs: Track file uploads/downloads

## 🚨 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill processes on ports 3000 and 5000
   npx kill-port 3000 5000
   ```

2. **Dependencies Issues**
   ```bash
   # Clear npm cache and reinstall
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **File Upload Issues**
   - Check file permissions
   - Ensure uploads/ and converted/ directories exist
   - Verify file size limits

4. **API Connection Issues**
   - Check if backend is running on port 5000
   - Verify CORS settings
   - Check network connectivity

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev
```

## 📈 Performance Optimization

1. **File Processing**
   - Implement file size limits
   - Add progress indicators
   - Use streaming for large files

2. **Memory Management**
   - Clean up temporary files
   - Implement garbage collection
   - Monitor memory usage

3. **Caching**
   - Cache vendor configurations
   - Implement result caching
   - Use CDN for static assets

## 🔄 Updates and Maintenance

### Updating Dependencies
```bash
# Update all dependencies
npm update
cd server && npm update
cd ../client && npm update
```

### Backup Strategy
- Regular backups of converted configurations
- Version control for all code changes
- Document all configuration changes

## 📞 Support

For technical support or questions:
- Contact: AIT Cybersecurity Team
- Internal use only
- Review all converted configurations before deployment

---

**© 2024 AIT Cybersecurity Team - Internal Use Only**
