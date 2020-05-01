# WebPlatformDevGit

This web application aims to help students with coursework management. It allows the user to create coursework with information like the due date and the completion date. In addition, it allows the user to create and attach milestones to these courseworks.

Code example, this piece of code displays all courseworks of the logged in user:

The website can be accessed through: https://web-coursework-browser.herokuapp.com/coursework/dashboard

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

This project exists to make coursework less stressful. This application helps by allowing the user to record the due date of courseworks and create milestones for the coursework. 
This project is a Glasgow Caledonian University coursework for the Web Platform Development unit and was based on infromation found in the university labs.

To install/run the application, first use the git commands to clone this repository to a folder on your personal computer.
This can be done by accessing a console, navigation to the desired folder where the application will be downloaded using the "cd" command. 
Once you have navigated to the desired folder input the command "git clone [link]". The [link] can be received through this git repository.
Once the application has been cloned from the github, run the command "node app.js" to run the application. This will allow you to access the application through "localhost:3000" using a browser.

This application uses the Express.js framework.

API References:
Mustache - https://mustache.github.io/
Express - https://expressjs.com/en/api.html
Mongoose - https://mongoosejs.com/docs/api.html
Passport - http://www.passportjs.org/docs/
BCrypt - https://www.npmjs.com/package/bcrypt

