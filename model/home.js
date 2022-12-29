const mongoose = require('mongoose');

const homeSchema = new mongoose.Schema(
    {
        
        images: [],
    }
)
const Home = mongoose.model('Home', homeSchema);
module.exports = Home;
