const db = require('../config/db');
const jsonStorage = require('./jsonStorage');
const SkillModel = require('../models/Skill');
const ProjectModel = require('../models/Project');
const ProfileModel = require('../models/Profile');
const { initialProfile, initialSkills, initialProjects } = require('./initialData');

// Seed MongoDB if empty
async function seedMongoIfNeeded() {
  try {
    const profileCount = await ProfileModel.countDocuments();
    if (profileCount === 0) {
      await ProfileModel.create(initialProfile);
    }
    const skillCount = await SkillModel.countDocuments();
    if (skillCount === 0) {
      await SkillModel.insertMany(initialSkills);
    }
    const projectCount = await ProjectModel.countDocuments();
    if (projectCount === 0) {
      await ProjectModel.insertMany(initialProjects);
    }
  } catch (err) {
    console.error('Error seeding MongoDB:', err.message);
  }
}

function getStorageMode() {
  return db.getIsConnected() ? 'MongoDB' : 'Local JSON Storage';
}

// Profile
async function getProfile() {
  if (db.getIsConnected()) {
    let profile = await ProfileModel.findOne({ name: { $exists: true } }).lean();
    if (!profile) {
      const created = await ProfileModel.create(initialProfile);
      profile = created.toObject ? created.toObject() : created;
    }
    return profile;
  }
  return jsonStorage.getProfile();
}

async function updateProfile(data) {
  if (db.getIsConnected()) {
    let profile = await ProfileModel.findOne();
    if (!profile) {
      profile = new ProfileModel({ ...initialProfile, ...data });
    } else {
      Object.assign(profile, data);
    }
    await profile.save();
    return profile.toObject();
  }
  return jsonStorage.updateProfile(data);
}

// Skills
async function getSkills() {
  if (db.getIsConnected()) {
    const skills = await SkillModel.find().sort({ order: 1, createdAt: 1 }).lean();
    if (!skills || skills.length === 0) {
      await SkillModel.insertMany(initialSkills);
      return initialSkills;
    }
    return skills;
  }
  return jsonStorage.getSkills();
}

async function addSkill(skillData) {
  if (db.getIsConnected()) {
    const count = await SkillModel.countDocuments();
    const id = skillData.id || `skill-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const skill = new SkillModel({
      ...skillData,
      id,
      order: skillData.order || (count + 1)
    });
    await skill.save();
    return skill.toObject();
  }
  return jsonStorage.addSkill(skillData);
}

async function updateSkill(id, skillData) {
  if (db.getIsConnected()) {
    const updated = await SkillModel.findOneAndUpdate(
      { id },
      { $set: skillData },
      { new: true, runValidators: true }
    ).lean();
    return updated;
  }
  return jsonStorage.updateSkill(id, skillData);
}

async function deleteSkill(id) {
  if (db.getIsConnected()) {
    const deleted = await SkillModel.findOneAndDelete({ id }).lean();
    return !!deleted;
  }
  return !!jsonStorage.deleteSkill(id);
}

async function resetSkills() {
  if (db.getIsConnected()) {
    await SkillModel.deleteMany({});
    await SkillModel.insertMany(initialSkills);
    return initialSkills;
  }
  return jsonStorage.resetSkills();
}

// Projects
async function getProjects() {
  if (db.getIsConnected()) {
    const projects = await ProjectModel.find({ hidden: { $ne: true } })
      .sort({ featured: -1, stars: -1, updatedAt: -1 })
      .lean();
    if (!projects || projects.length === 0) {
      await ProjectModel.insertMany(initialProjects);
      return initialProjects;
    }
    return projects;
  }
  const all = jsonStorage.getProjects();
  return all.filter(p => !p.hidden);
}

async function getAllProjectsRaw() {
  if (db.getIsConnected()) {
    return await ProjectModel.find().lean();
  }
  return jsonStorage.getProjects();
}

async function addProject(projectData) {
  if (db.getIsConnected()) {
    const id = projectData.id || `proj-custom-${Date.now()}`;
    const tags = Array.isArray(projectData.tags) 
      ? projectData.tags 
      : (projectData.tags ? projectData.tags.split(',').map(t => t.trim()).filter(Boolean) : []);

    const project = new ProjectModel({
      ...projectData,
      id,
      tags,
      isCustom: true,
      hidden: false
    });
    await project.save();
    return project.toObject();
  }
  return jsonStorage.addProject(projectData);
}

async function updateProject(id, projectData) {
  if (db.getIsConnected()) {
    const tags = Array.isArray(projectData.tags) 
      ? projectData.tags 
      : (projectData.tags !== undefined ? projectData.tags.split(',').map(t => t.trim()).filter(Boolean) : undefined);

    const updatePayload = {
      ...projectData,
      customOverride: true
    };
    if (tags !== undefined) {
      updatePayload.tags = tags;
    }

    const updated = await ProjectModel.findOneAndUpdate(
      { $or: [{ id }, { githubId: Number(id) || -1 }] },
      { $set: updatePayload },
      { new: true, runValidators: true }
    ).lean();
    return updated;
  }
  return jsonStorage.updateProject(id, projectData);
}

async function deleteProject(id) {
  if (db.getIsConnected()) {
    const deleted = await ProjectModel.findOneAndDelete({
      $or: [{ id }, { githubId: Number(id) || -1 }]
    }).lean();
    return !!deleted;
  }
  return !!jsonStorage.deleteProject(id);
}

async function resetProjects() {
  if (db.getIsConnected()) {
    await ProjectModel.deleteMany({});
    await ProjectModel.insertMany(initialProjects);
    return initialProjects;
  }
  return jsonStorage.resetProjects();
}

async function saveProjectsBulk(projects) {
  if (db.getIsConnected()) {
    for (const proj of projects) {
      await ProjectModel.findOneAndUpdate(
        { $or: [{ id: proj.id }, { githubId: proj.githubId }] },
        { $set: proj },
        { upsert: true, new: true }
      );
    }
    return projects;
  }
  return jsonStorage.saveProjects(projects);
}

module.exports = {
  seedMongoIfNeeded,
  getStorageMode,
  getProfile,
  updateProfile,
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill,
  resetSkills,
  getProjects,
  getAllProjectsRaw,
  addProject,
  updateProject,
  deleteProject,
  resetProjects,
  saveProjectsBulk
};
