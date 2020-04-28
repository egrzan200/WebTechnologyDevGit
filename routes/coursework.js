const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const objectId = require('mongodb').ObjectID;

// DB Config
const passport = require('passport');
const session = require('express-session');
//Connect database
const db = require('../config/keys').mongoURI;
const assert = require('assert');

const url = require('url');

const {
    ensureAuthenticated,
    forwardAuthenticated
} = require('../config/auth');

//Render Add new item page
router.get('/addCoursework', ensureAuthenticated, (req, res) => res.render('addCourseWork'));


// Get coursework assosiated with the logged in account
router.get('/dashboard',ensureAuthenticated, function (req, res) {

    var resultArray = []
    mongoose.connect(db, function (err, db) {

        assert.equal(null, err);
        var cursor = db.collection('courseWork').find({
            ownerID: req.user.id
        });

        cursor.forEach(function (doc, err) {
            assert.equal(null, err);
            resultArray.push(doc);
        }, function () {
            user = req.user;
            //console.log(resultArray);
            //console.log("Printed Resutls");
            res.render("dashboard", {'entries': resultArray, 'name': req.user.name});
        });
    });
});

// Add new coursework to the database
router.post('/insert-coursework', ensureAuthenticated,  function (req, res) {

    var item = {
        courseworkNameField: req.body.title,
        moduleField: req.body.subject,
        dueDateField: req.body.dueDate,
        completionDateField:"", 
        ownerID: req.user.id

    };
    let errors = [];

    if (!req.body.title || !req.body.subject || !req.body.dueDate) {

        errors.push({
            msg: 'Please enter all fields'
        });

    } else {

        mongoose.connect(db, function (err, db) {

            assert.equal(null, err);

            db.collection('courseWork').insertOne(item, function (err, result) {

                assert.equal(null, err);
                console.log('Item inserted');
                req.flash('success_msg', 'Item added successfully');
                res.redirect("/coursework/dashboard")
            });
        });
    }
});

router.post('/delete-coursework/', ensureAuthenticated, function(req, res, next) {
    courseworkID =req.body.courseworkId;
    
    mongoose.connect(db, function(err, db) {
        assert.equal(null, err);
        db.collection('courseWork').deleteOne({_id: objectId(courseworkID)}, function(err) {
            assert.equal(null, err);
            console.log(courseworkID);
            console.log('Coursework deleted');
            res.redirect("/coursework/dashboard");
        });
        
    });
});

//Renders the share coursework page and sends the coursework information as well as the array of milestones
router.get('/shareCoursework*', function(req, res){
    courseworkID = req.query.ID;

    mongoose.connect(db, async function(err, db){
        assert.equal(null,err);
        var milestones = [];
        var coursework = await db.collection('courseWork').find({_id : objectId(courseworkID)}).toArray();
        //console.log(coursework);

        var cursor = db.collection('milestone').find({courseworkIDField : courseworkID});
        //console.log(cursor);

        cursor.forEach(function(result, err){
            assert.equal(null, err);
            milestones.push(result);
            //console.log(result);

        }, function(){
            res.render("shareCoursework", {coursework : coursework, milestones : milestones});    
        });
    });
});

router.get('/editCoursework*', ensureAuthenticated, function(req, res){
    courseworkID = req.query.ID;

    mongoose.connect(db, async function(err, db){
        assert.equal(null,err);
        var coursework = await db.collection('courseWork').find({_id : objectId(courseworkID)}).toArray();
        res.render("editCoursework", {coursework : coursework});
    });
});

router.post('/editCoursework*', ensureAuthenticated, function(req, res){
    courseworkID = req.query.ID;

    mongoose.connect(db, async function(err, db){
        assert.equal(null,err);

        var newCoursework = {
            courseworkNameField : req.body.title,
            moduleField : req.body.subject,
            dueDateField : req.body.dueDate,
            completionDateField : req.body.completionDate,
        }

        db.collection('courseWork').updateOne({_id : objectId(courseworkID)}, {$set: newCoursework}, function(err){
            //console.log("I got here");

            assert.equal(null,err);

            console.log("Coursework updated");
            res.redirect("/coursework/dashboard");
        });
    });

});

module.exports = router;