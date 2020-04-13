//Imports nedb library
const Datastore = require('nedb');

//var nedb = new Datastore({
//    filename: 'db.db',
//    autoload: true
//});

//Main constructor for the database
class MilestoneDB{
    constructor(dbFilePath){
        //Run database as file
        if(dbFilePath){
            this.db = new Datastore({filename: dbFilePath, autoload: true});
            console.log("DB connected to file: ", dbFilePath);
        }else{
            //Run database in memory
            this.db = new Datastore();
            console.log("Database is running in memory");
        }
    }

    //Fills the database with prewritter entries
    init(){
        this.db.insert({
            milestoneNameField : 'First presentation',
            milestoneDateField : '12.08.2020',
            milestonedescriptionField: 'A new milestone for implementation',
            milestoneCompletionDateField : '',
            courseworkIDField : ''
        });
        this.db.insert({
            milestoneNameField : 'Second presentation',
            milestoneDateField : '18.08.2020',
            milestonedescriptionField: 'A second milestone for implementation',
            milestoneCompletionDateField : '',
            courseworkIDField : ''
        });
        this.db.insert({
            milestoneNameField : 'Final presentation',
            milestoneDateField : '24.09.2020',
            milestonedescriptionField: 'A third milestone for implementation',
            milestoneCompletionDateField : '',
            courseworkIDField : ''
        });
        console.log('New entry inserted into milestones database');
    }

    //Returns all entries in the database
    all(){
        return new Promise((resolve, reject) => {
            this.db.find({},function (err, entries){
                if (err){
                    reject(err);
                    console.log('Rejected');
                }else{
                    resolve(entries);
                    console.log('Resolved');
                }
            });
        });
    }

    //Adds a new entry to the database if given correct variables
    add(milestoneName, milestoneDate, milestoneDescription, courseworkID){
        var entry = {
            milestoneNameField : milestoneName,
            milestoneDateField : milestoneDate,
            milestonedescriptionField: milestoneDescription,
            courseworkIDField : courseworkID
        };
        this.db.insert(entry, function(err, doc){
            if (err){
                console.log("Can't insert milestone: ", milestoneName);
            }
        });
    }
    
    //Removes all entries from the database, only used during development.
    deleteAllEntries(){
        this.db.remove({}, { multi: true }, function (err, numRemoved) {});
    }

    getSpecific(courseworkID){
        return new Promise((resolve, reject)=>{
            this.db.find({courseworkIDField : courseworkID}, function(err, entries){
                if (err){
                    reject(err);
                    console.log('Rejected');
                }else{
                    resolve(entries);
                    console.log('Resolved');
                }
            });
        });
    }
}

//Module exports
module.exports = MilestoneDB;

