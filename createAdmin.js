// createAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const hashedPassword = await bcrypt.hash('futsal_taim20', 10);
    const admin = new Admin({ username: 'futsalTaim', password: hashedPassword });

    await admin.save();
    console.log('Admin creato!');
    mongoose.disconnect();
});
