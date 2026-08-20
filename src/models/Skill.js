const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true, trim: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['Frontend', 'Backend', 'Database', 'Tools & DevOps', 'Other'],
    default: 'Frontend'
  },
  level: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Advanced' 
  },
  icon: { type: String, default: 'code' },
  description: { type: String, default: '' },
  order: { type: Number, default: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.models.Skill || mongoose.model('Skill', skillSchema);
