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

//Render new milestone page
router.get('/newMilestone',ensureAuthenticated,  function(req,res){
    res.render('newMilestone');
    courseworkID = req.query.ID;
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
        errors.push({msg: 'Please enter all fields'});
    } else {

        mongoose.connect(db, function (err, db) {

            assert.equal(null, err);

            db.collection('milestone').insertOne(milestone, function (err, result) {

                assert.equal(null, err);
                console.log(courseworkID);
                console.log('Milestone inserted');
                req.flash('success_msg', 'Item added successfully');
                res.redirect("/coursework/dashboard")
            });
        });
    }
});


//Display all milestones
router.get('/milestones*', ensureAuthenticated, function (req,res){

    courseworkID =req.query.ID;

    var milestonesArray = []
    mongoose.connect(db, function (err, db) {

        assert.equal(null, err);
        var cursor = db.collection('milestone').find({courseworkIDField: courseworkID});
        
        cursor.forEach(function (doc, err) {
            assert.equal(null, err);
            milestonesArray.push(doc);

        }, function () {

            res.render("milestones", {'milestone': milestonesArray});
        });
    });
});

//Delete milestone
router.post('/delete-milestone/', ensureAuthenticated, function(req, res, next) {
    milestoneID =req.body.milestoneId;
    mongoose.connect(db, function(err, db) {
        assert.equal(null, err);

        db.collection('milestone').deleteOne({"_id": objectId(milestoneID)}, function(err, result) {
            assert.equal(null, err);
            console.log(milestoneID)
            console.log('Milestone deleted');
            res.redirect("/coursework/dashboard");
        });
    });
});

router.get('/editMilestone*', ensureAuthenticated, function(req, res){
    milestoneID = req.query.ID;
    console.log(milestoneID);
    mongoose.connect(db, async function(err, db){
        assert.equal(null,err);
        var milestone = await db.collection('milestone').find({_id : objectId(milestoneID)}).toArray();
        res.render("editMilestone", {milestone : milestone});
    });
});

router.post('/editMilestone*', ensureAuthenticated, function(req, res){
    milestoneID = req.query.ID;

    console.log(milestoneID);
    mongoose.connect(db, async function(err, db){
        assert.equal(null,err);

        var newMilestone = {
            milestoneNameField : req.body.milestoneName,
            milestoneDateField : req.body.milestoneDate,
            milestonedescriptionField : req.body.milestoneDescription,
        }

        db.collection('milestone').updateOne({_id : objectId(milestoneID)}, {$set: newMilestone}, function(err){
            //console.log("I got here");

            assert.equal(null,err);
            console.log("Milestone updated");
            res.redirect("/coursework/dashboard");
        });
    });

});
module.exports = router;
