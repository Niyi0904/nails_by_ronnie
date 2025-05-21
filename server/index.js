const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./models');
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/booking');
const usersRoutes = require('./routes/userRoute');
const cartRoutes = require('./routes/cart');

const port = 3030

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/cart', cartRoutes);

db.sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`server is running on port ${port}`); 
    });
})

