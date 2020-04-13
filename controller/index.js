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
var CourseworkDB = require('../model/CourseworkDB');
//Creates a file for the database
var dbFile = 'database.nedb.coursework.db';
//Runs the database in embedded mode
let dao = new CourseworkDB(dbFile);
//Initializes Database, only used during testing.
//dao.init();
//dao.deleteAllEntries();

//Creates instance of the milestone database
var MilestoneDB = require('../model/MilestoneDB');
//Creates a file for the database
var milestoneDbFile = 'database.nedb.milestone.db';
//Runs the database in embedde mode
let mileDB = new MilestoneDB(milestoneDbFile);
//Initializes the milestone database with test data
//mileDB.init();

//Handles mustache
app.engine('mustache', mustache());
app.set('view engine', 'mustache');
app.set('views', path.resolve(__dirname, '../views'));

//Main page handler. Passes the list of all database entries to the mustache as "entries"
app.get('/', function(req,res){
    dao.all()
    .then((list)=>{
        res.render("index",{'entries': list});
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
    //console.log("I got here");
    if (!req.body.courseworkName|| !req.body.moduleName|| !req.body.dueDate){
        res.status(400).send("Entries must have a coursework name, module and a due date!");
        return;
    }
    dao.add(req.body.courseworkName, req.body.moduleName, req.body.dueDate);
    console.log("A new entry has been added to the database")
    res.redirect('/');
});

app.get('/milestones*', function (req,res){
    var url = req.url;
    courseworkID = url.slice(12, url.length - 11);
    //console.log(courseworkID);
    mileDB.getSpecific(courseworkID).then((milestones)=>{
        //console.log(milestones);
        res.render('milestones', {'milestone' : milestones});
    }).catch((err)=>{
        res.status(200);
        res.type('text/plain');
        res.send('An error has occured while loading the entries from database');
        console.log('Error: '), 
        console.log(JSON.stringify(err))
    })
});

app.get('/newMilestone', function(req,res){
    res.render('newMilestone');    
});

app.post('/newMilestone*', function(req, res){
    var url = req.url;
    courseworkID = url.slice(14, url.length - 18);
    //console.log(courseworkID);
    
    if(!req.body.milestoneName || !req.body.milestoneDate || !req.body.milestoneDescription){
        res.status(400).send("Entries must have a milestone name, date and a description");
        return;
    }
    mileDB.add(req.body.milestoneName, req.body.milestoneDate, req.body.milestoneDescription, courseworkID);
    console.log("A new entry has been added to the milestone database");
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
