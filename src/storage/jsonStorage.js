const fs = require('fs');
const path = require('path');
const { initialProfile, initialSkills, initialProjects } = require('./initialData');

const DATA_DIR = path.join(__dirname, '../../data');
const PROFILE_FILE = path.join(DATA_DIR, 'profile.json');
const SKILLS_FILE = path.join(DATA_DIR, 'skills.json');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');

// Ensure directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Atomic file write
function writeJsonAtomic(filePath, data) {
  ensureDataDir();
  const tempPath = `${filePath}.${Date.now()}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tempPath, filePath);
}

// Read JSON with fallback initializer
function readJson(filePath, defaultData) {
  ensureDataDir();
  if (!fs.existsSync(filePath)) {
    writeJsonAtomic(filePath, defaultData);
    return JSON.parse(JSON.stringify(defaultData));
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${filePath}, re-initializing with defaults:`, err.message);
    writeJsonAtomic(filePath, defaultData);
    return JSON.parse(JSON.stringify(defaultData));
  }
}

// Initializer
function initJsonStorage() {
  ensureDataDir();
  if (!fs.existsSync(PROFILE_FILE)) {
    writeJsonAtomic(PROFILE_FILE, initialProfile);
  }
  if (!fs.existsSync(SKILLS_FILE)) {
    writeJsonAtomic(SKILLS_FILE, initialSkills);
  }
  if (!fs.existsSync(PROJECTS_FILE)) {
    writeJsonAtomic(PROJECTS_FILE, initialProjects);
  }
  console.log('📁 [JSON Storage] Local storage ready at /data');
}

// Profile API
function getProfile() {
  return readJson(PROFILE_FILE, initialProfile);
}

function updateProfile(updated) {
  const current = getProfile();
  const merged = { ...current, ...updated, updatedAt: new Date().toISOString() };
  writeJsonAtomic(PROFILE_FILE, merged);
  return merged;
}

// Skills API
function getSkills() {
  return readJson(SKILLS_FILE, initialSkills);
}

function saveSkills(skills) {
  writeJsonAtomic(SKILLS_FILE, skills);
  return skills;
}

function addSkill(skillData) {
  const skills = getSkills();
  const newSkill = {
    id: skillData.id || `skill-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    name: skillData.name.trim(),
    category: skillData.category || 'Frontend',
    level: skillData.level || 'Advanced',
    icon: skillData.icon || 'code',
    description: skillData.description || '',
    order: skillData.order || (skills.length + 1),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  skills.push(newSkill);
  saveSkills(skills);
  return newSkill;
}

function updateSkill(id, skillData) {
  const skills = getSkills();
  const index = skills.findIndex(s => s.id === id);
  if (index === -1) return null;

  skills[index] = {
    ...skills[index],
    ...skillData,
    id: skills[index].id, // preserve id
    updatedAt: new Date().toISOString()
  };
  saveSkills(skills);
  return skills[index];
}

function deleteSkill(id) {
  const skills = getSkills();
  const index = skills.findIndex(s => s.id === id);
  if (index === -1) return false;
  const deleted = skills.splice(index, 1)[0];
  saveSkills(skills);
  return deleted;
}

function resetSkills() {
  writeJsonAtomic(SKILLS_FILE, initialSkills);
  return JSON.parse(JSON.stringify(initialSkills));
}

// Projects API
function getProjects() {
  return readJson(PROJECTS_FILE, initialProjects);
}

function saveProjects(projects) {
  writeJsonAtomic(PROJECTS_FILE, projects);
  return projects;
}

function addProject(projectData) {
  const projects = getProjects();
  const newProject = {
    id: projectData.id || `proj-custom-${Date.now()}`,
    githubId: projectData.githubId || null,
    name: projectData.name || projectData.title,
    title: projectData.title || projectData.name,
    description: projectData.description || '',
    language: projectData.language || 'JavaScript',
    tags: Array.isArray(projectData.tags) ? projectData.tags : (projectData.tags ? projectData.tags.split(',').map(t => t.trim()).filter(Boolean) : []),
    stars: Number(projectData.stars) || 0,
    forks: Number(projectData.forks) || 0,
    githubUrl: projectData.githubUrl || '',
    homepage: projectData.homepage || '',
    featured: Boolean(projectData.featured),
    category: projectData.category || 'Full-Stack',
    isCustom: true,
    hidden: false,
    customOverride: false,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };
  projects.unshift(newProject);
  saveProjects(projects);
  return newProject;
}

function updateProject(id, projectData) {
  const projects = getProjects();
  const index = projects.findIndex(p => p.id === id || String(p.githubId) === String(id));
  if (index === -1) return null;

  const current = projects[index];
  const tags = Array.isArray(projectData.tags) 
    ? projectData.tags 
    : (projectData.tags !== undefined ? projectData.tags.split(',').map(t => t.trim()).filter(Boolean) : current.tags);

  projects[index] = {
    ...current,
    ...projectData,
    id: current.id,
    githubId: current.githubId,
    tags,
    customOverride: true,
    updatedAt: new Date().toISOString()
  };
  saveProjects(projects);
  return projects[index];
}

function deleteProject(id) {
  const projects = getProjects();
  const index = projects.findIndex(p => p.id === id || String(p.githubId) === String(id));
  if (index === -1) return false;
  const deleted = projects.splice(index, 1)[0];
  saveProjects(projects);
  return deleted;
}

function resetProjects() {
  writeJsonAtomic(PROJECTS_FILE, initialProjects);
  return JSON.parse(JSON.stringify(initialProjects));
}

module.exports = {
  initJsonStorage,
  getProfile,
  updateProfile,
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill,
  resetSkills,
  getProjects,
  saveProjects,
  addProject,
  updateProject,
  deleteProject,
  resetProjects
};
