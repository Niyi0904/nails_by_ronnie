const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./models');
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/booking');
const cookieParser = require('cookie-parser');
const usersRoutes = require('./routes/userRoute');
const cartRoutes = require('./routes/cart');
require('dotenv').config();


const port = process.env.PORT || 3030;

app.use(cors({
  origin: true, // your frontend
  credentials: true,              // ✅ must match frontend
}));
app.use(express.json());
app.use(cookieParser());
app.get('/', (req, res) => {
  res.send('API is running...');
});
app.use('/api/auth', authRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/cart', cartRoutes);

db.sequelize.sync().then(() => {
    app.listen(port, '0.0.0.0', () => {
        console.log(`server is running on port ${port}`); 
    });
})

