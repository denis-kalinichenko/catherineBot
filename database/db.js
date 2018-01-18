const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/catherineBot', err => {
    if (err) {
        console.log('DB connection error', err);
    }
});

module.exports = mongoose;