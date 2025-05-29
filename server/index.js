require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const db = require('./models');

const app = express();
const port = process.env.PORT || 8080; // Railway usually uses 8080

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('API is working 🎉');
});

db.sequelize.sync()
  .then(() => {
    console.log('✅ Database connected');
    app.listen(port, '0.0.0.0', () => {
      console.log(`✅ Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('❌ Sequelize Sync Error:', err.message);
    process.exit(1); // Exit if DB is broken
  });
