const dataManager = require('../storage/dataManager');

const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'bereket2114';
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`;

/**
 * Fetch repositories from GitHub REST API
 */
async function fetchGithubRepos() {
  const headers = {
    'User-Agent': 'Bereket-Portfolio-App/1.0',
    'Accept': 'application/vnd.github.v3+json'
  };

  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(GITHUB_API_URL, { headers });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`GitHub API request failed (${response.status} ${response.statusText}): ${errText}`);
  }

  const repos = await response.json();
  if (!Array.isArray(repos)) {
    throw new Error('Unexpected response format from GitHub API: expected an array.');
  }

  return repos;
}

/**
 * Infer default tags based on language & topics
 */
function inferTags(repo) {
  const tagsSet = new Set();
  if (repo.language) {
    tagsSet.add(repo.language);
  }
  if (Array.isArray(repo.topics)) {
    repo.topics.forEach(t => tagsSet.add(t));
  }
  
  const nameLower = (repo.name || '').toLowerCase();
  if (nameLower.includes('express') || nameLower.includes('node') || nameLower.includes('api')) {
    tagsSet.add('Node.js');
    tagsSet.add('Express.js');
    tagsSet.add('REST API');
  }
  if (nameLower.includes('react')) {
    tagsSet.add('React.js');
  }
  if (nameLower.includes('game')) {
    tagsSet.add('Game Logic');
    tagsSet.add('JavaScript');
  }
  if (nameLower.includes('tailwind')) {
    tagsSet.add('Tailwind CSS');
  }
  if (tagsSet.size === 0) {
    tagsSet.add('JavaScript');
    tagsSet.add('HTML5');
  }
  return Array.from(tagsSet);
}

/**
 * Infer category based on name and language
 */
function inferCategory(repo) {
  const nameLower = (repo.name || '').toLowerCase();
  if (nameLower.includes('flow') || nameLower.includes('findly') || nameLower.includes('portfolio') || nameLower.includes('fullstack') || nameLower.includes('hossana')) {
    return 'Full-Stack';
  }
  if (nameLower.includes('game') || nameLower.includes('tool') || nameLower.includes('generator')) {
    return 'Games & Tools';
  }
  if (nameLower.includes('solution') || nameLower.includes('algorithm') || nameLower.includes('codewars')) {
    return 'Algorithms';
  }
  if (repo.language === 'HTML' || repo.language === 'CSS') {
    return 'Frontend';
  }
  return 'Full-Stack';
}

/**
 * Sync GitHub repositories into database / storage
 */
async function syncWithGithub() {
  const rawRepos = await fetchGithubRepos();
  const existingProjects = await dataManager.getAllProjectsRaw();

  let newlyAdded = 0;
  let updated = 0;

  const defaultHiddenRepos = ['bereket2114', 'my_portfolio', 'rappersname'];

  // Filter out forks if desired or keep all
  const filteredRepos = rawRepos.filter(r => !r.fork);

  const mergedProjects = [...existingProjects];

  for (const repo of filteredRepos) {
    const existingIndex = mergedProjects.findIndex(
      p => p.githubId === repo.id || (p.name && p.name.toLowerCase() === repo.name.toLowerCase())
    );

    const isDefaultHidden = defaultHiddenRepos.includes((repo.name || '').toLowerCase());

    if (existingIndex >= 0) {
      // Existing project: update stars, forks, githubUrl, updatedAt if not overridden
      const current = mergedProjects[existingIndex];
      mergedProjects[existingIndex] = {
        ...current,
        githubId: repo.id,
        stars: repo.stargazers_count ?? current.stars,
        forks: repo.forks_count ?? current.forks,
        githubUrl: repo.html_url || current.githubUrl,
        homepage: current.customOverride && current.homepage ? current.homepage : (repo.homepage || current.homepage || ''),
        description: current.customOverride && current.description ? current.description : (repo.description || current.description || `Modern web project built with ${repo.language || 'JavaScript'}`),
        language: current.customOverride && current.language ? current.language : (repo.language || current.language || 'JavaScript'),
        category: (current.name && current.name.toLowerCase().includes('hossana')) ? 'Full-Stack' : (current.category || inferCategory(repo)),
        hidden: current.hidden || isDefaultHidden,
        updatedAt: repo.updated_at || current.updatedAt
      };
      updated++;
    } else {
      // New repo found
      const newProj = {
        id: `proj-${repo.id}`,
        githubId: repo.id,
        name: repo.name,
        title: repo.name.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        description: repo.description || `Dynamic web project built using ${repo.language || 'modern web technologies'}.`,
        language: repo.language || 'JavaScript',
        tags: inferTags(repo),
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        githubUrl: repo.html_url,
        homepage: repo.homepage || '',
        featured: repo.stargazers_count > 0,
        category: inferCategory(repo),
        isCustom: false,
        hidden: isDefaultHidden,
        customOverride: false,
        updatedAt: repo.updated_at || new Date().toISOString()
      };
      mergedProjects.push(newProj);
      newlyAdded++;
    }
  }

  await dataManager.saveProjectsBulk(mergedProjects);

  return {
    success: true,
    totalFetched: filteredRepos.length,
    newlyAdded,
    updated,
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  fetchGithubRepos,
  syncWithGithub
};
