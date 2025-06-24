require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { connectDB } = require("./lib/db.js");
const { app, server } = require("./lib/socket.js");

const authRoutes = require('./routes/auth')
const messageRoutes = require('./routes/message')


const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

// Load Swagger spec
const swaggerDocument = YAML.load('./swagger.yaml');

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  credentials: true 
}));


// Routes placeholder

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/auth', authRoutes);
app.use("/api/messages", messageRoutes);


// Start server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
  // Connect DB
  connectDB();
});
