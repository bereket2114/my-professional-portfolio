const express = require('express');
const router = express.Router();
const dataManager = require('../storage/dataManager');
const githubService = require('../services/githubService');

// System status & storage mode
router.get('/status', (req, res) => {
  res.json({
    status: 'online',
    storageMode: dataManager.getStorageMode(),
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// PROFILE ROUTES
// ==========================================
router.get('/profile', async (req, res, next) => {
  try {
    const profile = await dataManager.getProfile();
    res.json(profile);
  } catch (err) {
    next(err);
  }
});

router.put('/profile', async (req, res, next) => {
  try {
    const updated = await dataManager.updateProfile(req.body);
    res.json({ success: true, profile: updated });
  } catch (err) {
    next(err);
  }
});

// ==========================================
// SKILLS ROUTES (CRUD)
// ==========================================
// GET all skills
router.get('/skills', async (req, res, next) => {
  try {
    const skills = await dataManager.getSkills();
    res.json(skills);
  } catch (err) {
    next(err);
  }
});

// POST add new skill
router.post('/skills', async (req, res, next) => {
  try {
    const { name, category, level, icon, description } = req.body;
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Skill name is required' });
    }

    const newSkill = await dataManager.addSkill({
      name: name.trim(),
      category: category || 'Frontend',
      level: level || 'Advanced',
      icon: icon || 'code',
      description: description || ''
    });

    res.status(201).json({ success: true, skill: newSkill });
  } catch (err) {
    next(err);
  }
});

// PUT update existing skill
router.put('/skills/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, category, level, icon, description } = req.body;

    const updated = await dataManager.updateSkill(id, {
      ...(name && { name: name.trim() }),
      ...(category && { category }),
      ...(level && { level }),
      ...(icon && { icon }),
      ...(description !== undefined && { description })
    });

    if (!updated) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    res.json({ success: true, skill: updated });
  } catch (err) {
    next(err);
  }
});

// DELETE remove skill
router.delete('/skills/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await dataManager.deleteSkill(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    res.json({ success: true, message: 'Skill deleted successfully', id });
  } catch (err) {
    next(err);
  }
});

// POST reset skills to default initial list
router.post('/skills/reset', async (req, res, next) => {
  try {
    const skills = await dataManager.resetSkills();
    res.json({ success: true, message: 'Skills restored to initial defaults', skills });
  } catch (err) {
    next(err);
  }
});

// ==========================================
// PROJECTS ROUTES (CRUD & GITHUB SYNC)
// ==========================================
// GET all projects
router.get('/projects', async (req, res, next) => {
  try {
    const projects = await dataManager.getProjects();
    res.json(projects);
  } catch (err) {
    next(err);
  }
});

// POST add new custom project
router.post('/projects', async (req, res, next) => {
  try {
    const { title, name, description, language, tags, githubUrl, homepage, category, featured } = req.body;
    if (!title && !name) {
      return res.status(400).json({ error: 'Project title is required' });
    }

    const newProj = await dataManager.addProject({
      title: (title || name).trim(),
      name: (name || title).trim(),
      description: description || '',
      language: language || 'JavaScript',
      tags: tags || [],
      githubUrl: githubUrl || '',
      homepage: homepage || '',
      category: category || 'Full-Stack',
      featured: Boolean(featured)
    });

    res.status(201).json({ success: true, project: newProj });
  } catch (err) {
    next(err);
  }
});

// PUT update project (overrides description, tags, homepage, etc.)
router.put('/projects/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await dataManager.updateProject(id, req.body);

    if (!updated) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ success: true, project: updated });
  } catch (err) {
    next(err);
  }
});

// DELETE remove or hide project
router.delete('/projects/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await dataManager.deleteProject(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ success: true, message: 'Project removed successfully', id });
  } catch (err) {
    next(err);
  }
});

// POST trigger manual GitHub repository sync
router.post('/projects/sync-github', async (req, res, next) => {
  try {
    const syncResult = await githubService.syncWithGithub();
    const currentProjects = await dataManager.getProjects();
    res.json({
      success: true,
      message: `Successfully synchronized GitHub repositories. (${syncResult.totalFetched} fetched, ${syncResult.newlyAdded} new, ${syncResult.updated} updated)`,
      syncResult,
      projects: currentProjects
    });
  } catch (err) {
    console.error('GitHub sync error:', err.message);
    res.status(500).json({
      success: false,
      error: `Failed to sync with GitHub API: ${err.message}`
    });
  }
});

// POST reset projects to initial seed state
router.post('/projects/reset', async (req, res, next) => {
  try {
    const projects = await dataManager.resetProjects();
    res.json({ success: true, message: 'Projects restored to initial state', projects });
  } catch (err) {
    next(err);
  }
});

// ==========================================
// CONTACT / INTERACTION ROUTE
// ==========================================
router.post('/contact', (req, res) => {
  const { name, email, message, subject } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required fields.' });
  }
  
  console.log(`📨 [Contact Message Received] From: ${name} (${email}) | Subject: ${subject || 'General'} | Message: ${message}`);
  
  res.json({
    success: true,
    message: `Thank you, ${name}! Your message has been received. Bereket will get back to you soon.`
  });
});

module.exports = router;
