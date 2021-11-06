const express = require('express');
const morgan = require('morgan');
const createError = require('http-errors');
const cors = require('cors');
require('dotenv').config();

// Establish connection to database
require('./server/db/connectDB');
require('./server/auth/redis_init');


// initialize express 
const app = express();
app.use(cors());

app.set('view engine', 'ejs');

if (process.env.NODE_MODE.toLowerCase() === 'development') { app.use(morgan('dev')) };
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes handler 
app.use('/', require('./server/routes/indexRoute'));
app.use('/api', require('./server/routes/apiRoute'));

app.use((req, res, next) => {
    next(createError.NotFound(`The page you are trying to access does not exist`))
});

// Error handler 
app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        status: error.status,
        message: error.message
    })
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, (err) => {
    if(err) return console.log(err);
    console.log(`server is started in ${process.env.NODE_MODE} mode...\nRunning on http://localhost:${PORT}`)
});
