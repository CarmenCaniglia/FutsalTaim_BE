// models/Admin.js
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true } // sarà hashata con bcrypt
});

module.exports = mongoose.model('Admin', adminSchema);
