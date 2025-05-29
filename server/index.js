const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./models');
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/booking');
const cookieParser = require('cookie-parser');
const usersRoutes = require('./routes/userRoute');
const cartRoutes = require('./routes/cart');

const port = 3030

app.use(cors({
  origin: 'http://localhost:3000', // your frontend
  credentials: true,              // ✅ must match frontend
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/cart', cartRoutes);

db.sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`server is running on port ${port}`); 
    });
})

