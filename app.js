require("dotenv").config();
const express = require('express');
const rateLimit = require("express-rate-limit");
const errorHandler = require('./src/helpers/middlewares/errorHandler')
const PORT = 3001 || process.env.PORT;
const app = express()
const http = require('http');
const cors = require("cors");
const clc = require("cli-color");
const eventRoutes =require('./src/routes/event-route')
const server = http.createServer(app);
app.use(cors());
app.use(express.json());
app.use(errorHandler);
// require('./src/helpers/connection');

app.use('/',eventRoutes);
server.listen(PORT,()=>{
    console.log(`Server Listening at ${PORT}`);
})