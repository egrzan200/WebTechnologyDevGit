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
router.get('/dashboard',ensureAuthenticated, function (req, res, next) {

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


//Render new milestone page
router.get('/newMilestone',ensureAuthenticated,  function(req,res){
    res.render('newMilestone');
    courseworkID =req.query.ID;
      
});


//Add new milestone to the database
router.post('/newMilestone*', ensureAuthenticated , function(req, res){
    


    
    

    var milestone = {
        milestoneNameField: req.body.milestoneName,
        milestoneDateField: req.body.milestoneDate,
        milestonedescriptionField: req.body.milestoneDescription,
        courseworkIDField: courseworkID

    };
    let errors = [];

    if (!req.body.milestoneName || !req.body.milestoneDate || !req.body.milestoneDescription) {

        errors.push({
            msg: 'Please enter all fields'
        });

    } else {

        mongoose.connect(db, function (err, db) {

            assert.equal(null, err);

            db.collection('Milestones').insertOne(milestone, function (err, result) {

                assert.equal(null, err);
                console.log(courseworkID);
                console.log('Milestone inserted');
                req.flash('success_msg', 'Item added successfully');
                res.redirect("/coursework/dashboard")
            });
        });
    }



});


//Display milestones
router.get('/milestones*', ensureAuthenticated, function (req,res){

    courseworkID =req.query.ID;

    var milestonesArray = []
    mongoose.connect(db, function (err, db) {

        assert.equal(null, err);
        var cursor = db.collection('Milestones').find({
            courseworkIDField: courseworkID
        });
        cursor.forEach(function (doc, err) {
            assert.equal(null, err);
            milestonesArray.push(doc);

        }, function () {

            res.render("milestones", {'milestone': milestonesArray});


        });
    });

    


});



router.post('/delete-coursework/', ensureAuthenticated, function(req, res, next) {


    courseworkID =req.body.courseworkId;
    
    

    


        mongoose.connect(db, function(err, db) {
            assert.equal(null, err);
            db.collection('courseWork').deleteOne({"_id": objectId(courseworkID)}, function(err, result) {
              assert.equal(null, err);
              console.log(courseworkID)
              console.log('Coursework deleted');
              res.redirect("/coursework/dashboard");
             
                
              });
        
            });
            
        

    
  
    
  });

  router.post('/delete-milestone/', ensureAuthenticated, function(req, res, next) {


    milestoneID =req.body.milestoneId;
    
    

    


        mongoose.connect(db, function(err, db) {
            assert.equal(null, err);
            db.collection('Milestones').deleteOne({"_id": objectId(milestoneID)}, function(err, result) {
              assert.equal(null, err);
              console.log(milestoneID)
              console.log('Milestone deleted');
              res.redirect('back');
             
                
              });
        
            });
            
        

    
  
    
  });

module.exports = router;