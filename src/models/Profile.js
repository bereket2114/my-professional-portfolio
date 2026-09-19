const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  summary: { type: String, required: true },
  detailedBio: { type: String, default: '' },
  location: { type: String, default: 'Addis Ababa, Ethiopia' },
  email: { type: String, default: 'bereketwoldemariam369@gmail.com' },
  github: { type: String, default: 'https://github.com/bereket2114' },
  githubUsername: { type: String, default: 'bereket2114' },
  linkedin: { type: String, default: 'https://www.linkedin.com/in/bereket-woldemariyam-61377b437' },
  yearsOfEngineering: { type: String, default: '3+' },
  disciplines: [{ type: String }]
}, {
  timestamps: true,
  collection: 'portfolio_profiles'
});

module.exports = mongoose.models.PortfolioProfile || mongoose.model('PortfolioProfile', profileSchema, 'portfolio_profiles');

