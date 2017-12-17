const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//db cn
mongoose.connect('mongodb://localhost/auth', { useMongoClient: true });
mongoose.Promise = global.Promise;

const app = express();

//Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use('/users', require('./routes/users'));
//Router

//catch 404 err and frwd them to err hndlr 
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
})

//Error handler funciton
app.use((err, req, res, next) => {
    const error = app.get('env') === 'development' ? err : {};
    const status = err.status || 500;
    //Respond to  client 
    res.status(status).json({
        error: {
            message: error.message
        }
    });
});

//Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Magic is Happening on port ${port}`))