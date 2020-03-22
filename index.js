//Imports the libraries
var express = require('express'),
    mustache = require('mustache-express'),
    path = require('path')
var app = express();
app.set('port', process.env.PORT || 3000);
//Imports the body parser library
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
    extended: true
})); 

//Creates instance of the database
var DAO = require('./model/nedb');
//Creates a file for the database
var dbFile = 'database.nedb.db';
//Runs the database in embedded mode
let dao = new DAO(dbFile);
//Initializes Database, only used during testing.
//dao.init();
//dao.deleteAllEntries();

//Handles mustache
app.engine('mustache', mustache());
app.set('view engine', 'mustache');
app.set('views', path.resolve(__dirname, 'mustache'));

//Main page handler. Passes the list of all database entries to the mustache as "entries"
app.get('/', function(req,res){
    dao.all()
    .then((list)=>{
        res.render("index",{'entries': list});
        console.log(list)
    })
    .catch((err)=>{
        res.status(200);
        res.type('text/plain');
        res.send('An error has occured while loading the entries from database');
        console.log('Error: '), 
        console.log(JSON.stringify(err))
    });
})

//New Entry page handler
app.get('/newEntry', function(req,res){
    res.render("newEntry");
});

//Handles the post action. Checks if all fields are filled and adds a new object to the database, then redirects to the index page. Or informs the user that fields need to be filled.
app.post('/newEntry', function(req,res){
    console.log("I got here");
    if (!req.body.courseworkName|| !req.body.moduleName|| !req.body.dueDate){
        res.status(400).send("Entries must have a coursework name, module and a due date!");
        return;
    }
    dao.add(req.body.courseworkName, req.body.moduleName, req.body.dueDate);
    console.log("A new entry has been added to the database")
    res.redirect('/');
});

//404 response
app.use(function(req,res){
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
});

//500 response
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.type('text/plain');
    res.status(500);
    res.send('500 - Server Error');
});

//Confirmation of the website starting
app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
