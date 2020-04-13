//Imports nedb library
const Datastore = require('nedb');

//var nedb = new Datastore({
//    filename: 'db.db',
//    autoload: true
//});

//Main constructor for the database
class CourseworkDB{
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
            courseworkNameField : 'A web application',
            moduleField : 'Web Design Technology',
            dueDateField : '22.03.2020',
            completionDateField : 'none'
        });
        this.db.insert({
            courseworkNameField : 'Team project SMYO',
            moduleField : 'Integrated Project 2',
            dueDateField : '29.04.2020',
            completionDateField : 'none'
        });
        this.db.insert({
            courseworkNameField : 'Honours project research',
            moduleField : 'RSPI',
            dueDateField : '01.05.2020',
            completionDateField : 'none'
        });
        console.log('new entry inserted');
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
    add(courseworkName, module, dueDate){
        var entry = {
            courseworkNameField : courseworkName,
            moduleField : module,
            dueDateField : dueDate,
            completionDateField : 'none'
        };
        this.db.insert(entry, function(err, doc){
            if (err){
                console.log("Can't insert coursework: ", courseworkNameField);
            }
        });
    }
    
    //Removes all entries from the database, only used during development.
    deleteAllEntries(){
        this.db.remove({}, { multi: true }, function (err, numRemoved) {});
    }
}

//Module exports
module.exports = CourseworkDB;

