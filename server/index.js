const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./models');
const fileUpload = require('express-fileupload');
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/booking');
const cookieParser = require('cookie-parser');
const usersRoutes = require('./routes/userRoute');
const cartRoutes = require('./routes/cart');
const galleryRoutes = require('./routes/gallery');
const logger = require('./utils/logger');

const port = process.env.PORT || 8080;

app.use(cors({
  origin: ['https://nails-by-ronnie.vercel.app', 'http://localhost:3000'],
  credentials: true,           
}));
app.use(express.json());
app.use(fileUpload());
app.use(cookieParser());

app.use((req, res, next) => {
  logger.request(req);
  next();
});

app.get('/', (req, res) => {
  res.send('API is running...');
});
app.use('/api/auth', authRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/gallery', galleryRoutes);

app.use((err, req, res, next) => {
  logger.error(err, req);
  res.status(err.statusCode || 500).json({
    error: 'Something went wrong. Please try again later.',
  });
});

process.on('uncaughtException', (err) => {
  logger.fatal(err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.fatal(reason);
});

db.sequelize.sync({alter: true}).then(() => {
    app.listen(port, '0.0.0.0', () => {
        console.log(`server is running on port ${port}`); 
    });
})

