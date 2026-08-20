const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  summary: { type: String, required: true },
  detailedBio: { type: String, default: '' },
  location: { type: String, default: 'Addis Ababa, Ethiopia' },
  email: { type: String, default: 'bereket2114@gmail.com' },
  github: { type: String, default: 'https://github.com/bereket2114' },
  githubUsername: { type: String, default: 'bereket2114' },
  linkedin: { type: String, default: 'https://linkedin.com/in/bereket-woldemariyam' },
  yearsOfEngineering: { type: String, default: '3+' },
  disciplines: [{ type: String }]
}, {
  timestamps: true
});

module.exports = mongoose.models.Profile || mongoose.model('Profile', profileSchema);
