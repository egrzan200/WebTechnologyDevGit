const mongoose = require('mongoose');

const MilestoneSchema = new mongoose.Schema({
    milestoneNameField: {
    type: String,
    required: true
  },
  milestoneDateField:{
    type: String,
    required: true
  },
  milestonedescriptionField: {
    type: date,
    required: true
  },
  courseworkIDField: {
    type: date,
    required: false
  }
});

const Milestone = mongoose.model('milestone', MilestoneSchema);

module.exports = Milestone;