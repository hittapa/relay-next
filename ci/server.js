'use strict';

const express = require('express');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.use(function (req, res, next) {
    if (req.params.token === process.env.SECRET) {
        next();
    } else {
        res.status(400);
        res.send('Error');
    }
})

app.get('/deploy', (req, res) => {
    res.send('Hello World');
});

app.get('/revert', (req, res) => {
    res.send('Hello World');
});

app.get('/accept', (req, res) => {
    res.send('Hello World');
});

// blue up    
// green down
// green up
// blue down

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);