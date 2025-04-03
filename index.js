const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { initializeSocket } = require('./socket');

const app = express();
const port = process.env.PORT;
const server = http.createServer(app); // Dùng http server cho Socket.io

// Khởi tạo Socket.io
const io = initializeSocket(server);

// Middleware truyền io vào request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Kết nối database
const { sequelize } = require('./src/app/models/index');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3001",
  credentials: true,
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization"
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

// Import Router
const router = require('./src/router');
app.use('/api', router);
app.use('/uploads', express.static(path.join(__dirname, '/src/uploads')));

// Chạy server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
