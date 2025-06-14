// Set up Express and load environment variables from .env
const express       = require('express');
const app           = express();
const dotenv        = require('dotenv');

dotenv.config();

const { errorHandler } = require('./middleware/errorHandler');

//Connecting to Mongo database
const database      = require('./config/database');
database.connectDB();


//--Import App routes
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');



//Middleware
app.use(express.json())


app.use('/blogs/auth', authRoutes);
app.use('/blogs', blogRoutes); 





//Use the PORT set in environment variables or default to port 5000.
const PORT = process.env.PORT || 5000;

app.get('/', (req,res) => {
    res.send('Connected to Blog API')
})

app.use(errorHandler);

// Set up server to listen for requests.
app.listen(PORT, ()=>{
    console.log(`Listening for requests on port ${PORT}`)
})

module.exports = {app}