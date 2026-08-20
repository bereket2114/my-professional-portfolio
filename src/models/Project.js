const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  githubId: { type: Number, default: null },
  name: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  language: { type: String, default: 'JavaScript' },
  tags: [{ type: String, trim: true }],
  stars: { type: Number, default: 0 },
  forks: { type: Number, default: 0 },
  githubUrl: { type: String, default: '' },
  homepage: { type: String, default: '' },
  featured: { type: Boolean, default: false },
  category: { type: String, default: 'Full-Stack' },
  isCustom: { type: Boolean, default: false },
  hidden: { type: Boolean, default: false },
  customOverride: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.models.Project || mongoose.model('Project', projectSchema);
