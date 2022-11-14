const express = require("express");
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
const router =require('./routes/project')
app.use(express.json());
app.use((req, res, next) => {
    console.log("Hello from the middleware 👋");
    next();
  });
app.use(express.static('public'))
app.use('/project',router)
  app.get("/", (req, res) => {
    res.send("App is running on this server");
    res.end();
  });
  const DB="mongodb+srv://moiz:moiz@cluster0.zdwle.mongodb.net/portfolio?retryWrites=true"
  
  dotenv.config({ path: './config.env' });
  mongoose
  .connect(DB)
  .then(() => {
    // console.log(con.connection);
    console.log('succesfully connected to db');
  });
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, console.log(`Server started on port ${PORT}`));
  