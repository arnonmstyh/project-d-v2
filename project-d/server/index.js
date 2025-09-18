const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');
const { Server } = require('socket.io');
const http = require('http');
const { MultiVendorConverter } = require('./vendors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads';
    fs.ensureDirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/plain' || file.originalname.endsWith('.txt') || file.originalname.endsWith('.cfg') || file.originalname.endsWith('.xml')) {
      cb(null, true);
    } else {
      cb(new Error('Only .txt, .cfg, and .xml files are allowed'), false);
    }
  }
});

// Initialize Multi-Vendor Converter
const converter = new MultiVendorConverter();

// API Routes

// Get supported vendors
app.get('/api/vendors', (req, res) => {
  try {
    const vendors = converter.getSupportedVendors();
    res.json({ success: true, vendors });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get conversion options for a source vendor
app.get('/api/vendors/:sourceVendor/options', (req, res) => {
  try {
    const { sourceVendor } = req.params;
    const options = converter.getConversionOptions(sourceVendor);
    res.json({ success: true, options });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Upload and convert configuration
app.post('/upload', upload.single('configFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }

  const { sourceVendor, targetVendor } = req.body;
  
  if (!sourceVendor || !targetVendor) {
    return res.status(400).json({ 
      success: false, 
      error: 'Source and target vendors must be specified' 
    });
  }

  try {
    // Read uploaded file
    const filePath = req.file.path;
    const configText = fs.readFileSync(filePath, 'utf8');
    
    // Emit progress updates
    io.emit('conversion-progress', { 
      status: 'parsing', 
      message: `Parsing ${converter.vendors[sourceVendor]?.name || sourceVendor} configuration...`,
      progress: 25
    });

    // Convert configuration
    const result = converter.convertConfiguration(configText, sourceVendor, targetVendor);
    
    if (!result.success) {
      io.emit('conversion-progress', { 
        status: 'error', 
        message: result.error,
        progress: 0
      });
      return res.status(400).json(result);
    }

    io.emit('conversion-progress', { 
      status: 'generating', 
      message: `Generating ${converter.vendors[targetVendor]?.name || targetVendor} configuration...`,
      progress: 75
    });

    // Save converted configuration
    const outputDir = path.join(__dirname, 'converted');
    fs.ensureDirSync(outputDir);
    
    const filename = `${req.file.filename.replace(/\.[^/.]+$/, '')}_${targetVendor}.txt`;
    const outputPath = path.join(outputDir, filename);
    
    fs.writeFileSync(outputPath, result.convertedConfig);
    
    io.emit('conversion-progress', { 
      status: 'completed', 
      message: 'Conversion completed successfully!',
      progress: 100
    });

    // Clean up uploaded file
    fs.removeSync(filePath);

    res.json({
      success: true,
      sourceVendor: result.sourceVendor,
      targetVendor: result.targetVendor,
      parsedConfig: result.parsedConfig,
      convertedConfig: result.convertedConfig,
      downloadPath: `converted/${filename}`,
      stats: result.stats,
      complexity: result.complexity
    });

  } catch (error) {
    console.error('Conversion error:', error);
    io.emit('conversion-progress', { 
      status: 'error', 
      message: error.message,
      progress: 0
    });
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Download converted configuration
app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'converted', filename);

  console.log('Download request for:', filename);
  console.log('File path:', filePath);
  console.log('File exists:', fs.existsSync(filePath));

  if (fs.existsSync(filePath)) {
    res.download(filePath, filename);
  } else {
    console.log('File not found:', filePath);
    res.status(404).json({ error: 'File not found' });
  }
});

// Serve converted files
app.use('/converted', express.static(path.join(__dirname, 'converted')));

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Multi-Vendor Firewall Converter Server running on port ${PORT}`);
  console.log('Supported vendors:', Object.keys(converter.vendors).join(', '));
});
