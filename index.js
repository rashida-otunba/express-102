const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const express = require('express');
const app = express();

const es6render = require('express-es6-template-engine');
app.engine('html', es6render); //allows us to use static template files in the application ; in this instance the 'engine' is the html 
app.set('views', 'templates'); // html files in the templates mkdir directory; you do not have to name it 'templates'
app.set('view engine', 'html');

const server = http.createServer(app);
const db = require('./db');
console.log(db);

app.get('/', (req, res) => {// req, res are both arguments that are used to execute the function 
    res.render('home', {
        partials: {
            head: '/partials/head'
        }
    }); //this will allow you to render what on 9-10;  this is referring to the templates/home file in the templates folder; the initial line 18 is making the route file to be 'home'; this is different from res.send as you are not sending any text to the server, you are rendering the html file 

});

app.get('/friends', (req, res) => {
    res.render('friends-list', {
        locals: {
            friends: db, //in this example; friends is the key representing the value of db 
            path: req.path
        },
        partials: {
            head: '/partials/head'
        }
    });

});

app.get('/friends/:handle', (req, res) => {
    const { handle } = req.params; // whatever comes after the colon will be used as the variable for the request params to search 
    const friend = db.find(f => f.handle === handle); // f represents each element or item in the array ; friend object that goes into the render 

    if (friend) {//this is checking if we have friend data; this will render the html 
        res.render('friend', {
            locals: {
                friend //make a key called friend setting it to the object that exists on line 24; this is the data is being sent to the html 

            }
        });
    } else {
        res.status(404)
            .send(`no friend with the handle ${handle}`);
    }



});

server.listen(port, () => {//server.listen always needs to be last 
    console.log(`the server is running at http://${hostname}:${port}`);
})