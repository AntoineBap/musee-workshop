const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRoutes = require('./routes/user');
const favoriteRoutes = require('./routes/favorite');
require('dotenv').config();

app.use(express.json())

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(err => console.error("Erreur de connexion MongoDB :", err.message));



app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use('/api/auth', userRoutes);
app.use('/api/user', favoriteRoutes);

module.exports = app;