const mongoose = require('mongoose');

const courseWorkSchema = new mongoose.Schema({
  courseworkNameField: {
    type: String,
    required: true
  },
  moduleField:{
    type: String,
    required: true
  },
  dueDateField: {
    type: date,
    required: true
  },
  completionDateField: {
    type: date,
    required: false
  },
  ownerID: {
    type: String,
    required: true
  }

 
});

const CourseWork = mongoose.model('courseWork', courseWorkSchema);

module.exports = CourseWork;