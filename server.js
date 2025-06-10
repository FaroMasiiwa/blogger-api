// Set up Express and load environment variables from .env
const express       = require('express');
const app           = express();
require('dotenv').config();


//Use the PORT set in environment variables or default to port 5000.
const PORT = process.env.PORT || 5000;




// Set up server to listen for requests.
app.listen(PORT, ()=>{
    console.log(`Listening for requests on port ${PORT}`)
})