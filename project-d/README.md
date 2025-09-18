# Multi-Vendor Firewall Converter

A professional web application for converting firewall configurations between different vendors, developed by AIT Cybersecurity Team.

## ⚠️ **IMPORTANT DISCLAIMER**
**This application is developed by Cybersecurity team AIT. Please use internal only.**

This tool is designed for internal use within AIT organization. All converted configurations should be reviewed by qualified network security professionals before deployment. AIT Cybersecurity Team is not responsible for any issues arising from the use of converted configurations in production environments.

## 🚀 Features

### Multi-Vendor Support
- **Cisco ASA** - Adaptive Security Appliance
- **Cisco FTD** - Firepower Threat Defense  
- **FortiGate** - Next-Generation Firewall
- **Palo Alto** - PAN-OS

### Bidirectional Conversion
All vendors can convert to all other vendors with professional-grade accuracy:
- Cisco ASA ↔ FortiGate
- Cisco FTD ↔ Palo Alto
- And all other combinations

### Supported Configuration Elements
- **Interfaces** (physical & logical)
- **Security Policies** (ACLs & firewall rules)
- **NAT Rules** (static & dynamic)
- **VPN Tunnels** (IPSec & SSL VPN)
- **Objects** (address & service objects)
- **Routes** (static & dynamic routing)
- **Users** (local & LDAP)
- **System Services** (SNMP, SSH, HTTP, Logging)

## 🛠️ Technology Stack

### Backend
- Node.js with Express
- Socket.io for real-time updates
- Multi-vendor parser/generator architecture
- File upload with Multer
- CORS enabled for cross-origin requests

### Frontend
- React 18 with modern hooks
- Tailwind CSS for styling
- Lucide React for icons
- React Dropzone for file uploads
- Socket.io-client for real-time communication

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd multi-vendor-firewall-converter
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd server
   npm install
   
   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. **Start the application**
   ```bash
   # From the root directory
   npm run dev
   
   # Or start servers individually:
   # Backend (Terminal 1)
   cd server
   npm start
   
   # Frontend (Terminal 2)
   cd client
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🎯 Usage

1. **Select Vendors**
   - Choose your source vendor (where your config comes from)
   - Choose your target vendor (where you want to convert to)

2. **Upload Configuration**
   - Upload your configuration file (.txt, .cfg, .xml)
   - Watch real-time progress tracking

3. **Download Result**
   - Download the converted configuration
   - Review the conversion report

## 🔧 API Endpoints

### Vendors
- `GET /api/vendors` - Get supported vendors
- `GET /api/vendors/:sourceVendor/options` - Get conversion options for source vendor

### Conversion
- `POST /upload` - Upload and convert configuration
- `GET /download/:filename` - Download converted configuration

## 📁 Project Structure

```
multi-vendor-firewall-converter/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.js         # Main application
│   │   └── index.js       # Entry point
│   └── package.json
├── server/                # Node.js backend
│   ├── vendors/           # Multi-vendor parsers/generators
│   ├── index.js          # Main server
│   └── package.json
├── converted/            # Generated configurations
├── uploads/             # Temporary uploads
└── README.md
```

## 🔒 Security Features

- File type validation
- Secure file handling
- CORS protection
- Input sanitization
- Error handling

## 📊 Conversion Complexity

| From → To | Cisco ASA | Cisco FTD | FortiGate | Palo Alto |
|-----------|-----------|-----------|-----------|-----------|
| **Cisco ASA** | ✅ | Medium | High | High |
| **Cisco FTD** | Medium | ✅ | High | High |
| **FortiGate** | High | High | ✅ | High |
| **Palo Alto** | High | High | High | ✅ |

## 🤝 Contributing

This is an internal AIT tool. For contributions or issues, please contact the AIT Cybersecurity Team.

## 📄 License

© 2024 AIT Cybersecurity Team. Multi-Vendor Firewall Converter - Internal Use Only.

## 🆘 Support

For technical support or questions, please contact the AIT Cybersecurity Team.

---

**Developed with ❤️ by AIT Cybersecurity Team**