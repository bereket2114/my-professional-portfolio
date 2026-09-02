/**
 * Main Application Logic for Bereket Woldemariyam Portfolio
 */

const App = (function () {
  // State
  let state = {
    profile: null,
    skills: [],
    projects: [],
    activeSkillCategory: 'All',
    skillSearchQuery: '',
    activeProjectCategory: 'All',
    projectSearchQuery: '',
    isSyncing: false
  };

  // Toast Notification System
  function showToast(message, type = 'info', duration = 4000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast-item flex items-center gap-3 p-4 rounded-xl shadow-2xl border text-sm font-medium transition-all duration-300 backdrop-blur-lg';

    let iconSvg = '';
    let bgClasses = '';

    if (type === 'success') {
      bgClasses = 'bg-emerald-950/90 text-emerald-100 border-emerald-500/30';
      iconSvg = `<svg class="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`;
    } else if (type === 'error') {
      bgClasses = 'bg-rose-950/90 text-rose-100 border-rose-500/30';
      iconSvg = `<svg class="w-5 h-5 text-rose-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`;
    } else {
      bgClasses = 'bg-indigo-950/90 text-indigo-100 border-indigo-500/30';
      iconSvg = `<svg class="w-5 h-5 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
    }

    toast.className += ` ${bgClasses}`;
    toast.innerHTML = `
      ${iconSvg}
      <div class="flex-1">${message}</div>
      <button class="text-slate-400 hover:text-white transition ml-2" onclick="this.parentElement.remove()">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    `;

    container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // Auto remove
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // API Client Helpers
  async function fetchAPI(url, options = {}) {
    try {
      const res = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        },
        ...options
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `HTTP Error ${res.status}`);
      }
      return data;
    } catch (err) {
      console.error(`API Error on ${url}:`, err);
      throw err;
    }
  }

  // Load All Initial Data
  async function loadData() {
    try {
      const [profile, skills, projects, status] = await Promise.all([
        fetchAPI('/api/profile'),
        fetchAPI('/api/skills'),
        fetchAPI('/api/projects'),
        fetchAPI('/api/status').catch(() => ({ storageMode: 'Local JSON' }))
      ]);

      state.profile = profile;
      state.skills = skills;
      state.projects = projects;

      // Update storage mode badge
      const storageBadge = document.getElementById('storage-mode-badge');
      if (storageBadge) {
        storageBadge.textContent = status.storageMode || 'Storage Ready';
      }

      renderProfile();
      renderSkills();
      renderProjects();
      renderStats();
    } catch (err) {
      showToast(`Error initializing portfolio data: ${err.message}`, 'error');
    }
  }

  // Render Profile & Hero
  function renderProfile() {
    const p = state.profile;
    if (!p) return;

    const heroName = document.getElementById('hero-name');
    const heroTitle = document.getElementById('hero-title');
    const brandName = document.getElementById('brand-name');
    const brandTitle = document.getElementById('brand-title');
    const heroSummary = document.getElementById('hero-summary');
    const bioText = document.getElementById('about-bio-text');
    const githubLink = document.getElementById('hero-github-link');
    const linkedinLink = document.getElementById('hero-linkedin-link');

    if (heroName && p.name) heroName.textContent = p.name;
    if (heroTitle && p.title) heroTitle.textContent = p.title;
    if (brandName && p.name) brandName.textContent = p.name;
    if (brandTitle && p.title) brandTitle.textContent = p.title;
    if (heroSummary && p.summary) heroSummary.textContent = p.summary;
    if (bioText && p.detailedBio) bioText.textContent = p.detailedBio;
    if (githubLink && p.github) githubLink.href = p.github;
    if (linkedinLink && p.linkedin) linkedinLink.href = p.linkedin;

    const email = p.email || 'bereketwoldemariam369@gmail.com';
    const heroEmailText = document.getElementById('hero-email-text');
    const contactEmailLink = document.getElementById('contact-email-link');
    if (heroEmailText) heroEmailText.textContent = email;
    if (contactEmailLink) {
      contactEmailLink.href = `mailto:${email}`;
      contactEmailLink.textContent = email;
    }
  }

  // Render Stats Counter
  function renderStats() {
    const totalProjectsEl = document.getElementById('stat-total-projects');
    const totalSkillsEl = document.getElementById('stat-total-skills');
    const totalStarsEl = document.getElementById('stat-total-stars');

    if (totalProjectsEl) totalProjectsEl.textContent = state.projects.length;
    if (totalSkillsEl) totalSkillsEl.textContent = state.skills.length;
    if (totalStarsEl) {
      const stars = state.projects.reduce((acc, curr) => acc + (curr.stars || 0), 0);
      totalStarsEl.textContent = stars;
    }
  }

  // ==========================================
  // SKILLS RENDERING & LOGIC
  // ==========================================
  function renderSkills() {
    const container = document.getElementById('skills-list-container');
    const emptyState = document.getElementById('skills-empty-state');
    if (!container) return;

    const query = state.skillSearchQuery.toLowerCase();
    const category = state.activeSkillCategory;

    const filtered = state.skills.filter(s => {
      const matchCat = category === 'All' || s.category === category;
      const matchQuery = !query || s.name.toLowerCase().includes(query) || (s.description && s.description.toLowerCase().includes(query));
      return matchCat && matchQuery;
    });

    if (filtered.length === 0) {
      container.innerHTML = '';
      if (emptyState) emptyState.classList.remove('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    const categoryColors = {
      'Frontend': {
        border: 'hover:border-indigo-500/60 dark:hover:border-indigo-400/60',
        badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60',
        glow: 'group-hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]'
      },
      'Backend': {
        border: 'hover:border-emerald-500/60 dark:hover:border-emerald-400/60',
        badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
        glow: 'group-hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]'
      },
      'Database': {
        border: 'hover:border-amber-500/60 dark:hover:border-amber-400/60',
        badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
        glow: 'group-hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]'
      },
      'Tools & DevOps': {
        border: 'hover:border-cyan-500/60 dark:hover:border-cyan-400/60',
        badge: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800/60',
        glow: 'group-hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]'
      },
      'Other': {
        border: 'hover:border-purple-500/60 dark:hover:border-purple-400/60',
        badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800/60',
        glow: 'group-hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]'
      }
    };

    container.innerHTML = filtered.map(skill => {
      const theme = categoryColors[skill.category] || categoryColors['Other'];
      const safeId = skill.id;

      return `
        <div class="group relative flex flex-col justify-between p-4 bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 backdrop-blur-md shadow-sm hover:shadow-xl transition-all duration-300 ${theme.border} ${theme.glow}" data-skill-id="${safeId}">
          <div class="flex items-start justify-between gap-2 mb-2">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold text-sm">
                ${getSkillIconSvg(skill.name, skill.icon)}
              </div>
              <div>
                <h4 class="font-bold text-slate-900 dark:text-white text-base leading-tight">${escapeHtml(skill.name)}</h4>
                <span class="inline-block text-[11px] font-medium px-2 py-0.5 mt-1 rounded-full border ${theme.badge}">
                  ${skill.category}
                </span>
              </div>
            </div>
            
            <!-- Quick Actions -->
            <div class="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
              <button 
                class="edit-skill-btn p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition" 
                title="Edit Skill" 
                data-id="${safeId}">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
              </button>
              <button 
                class="delete-skill-btn p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition" 
                title="Delete Skill" 
                data-id="${safeId}"
                data-name="${escapeHtml(skill.name)}">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
          </div>

          ${skill.description ? `
            <p class="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">${escapeHtml(skill.description)}</p>
          ` : ''}

          <div class="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span class="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> ${skill.level || 'Advanced'}
            </span>
          </div>
        </div>
      `;
    }).join('');

    // Attach Action Listeners
    container.querySelectorAll('.edit-skill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const skill = state.skills.find(s => s.id === id);
        if (skill) {
          ModalManager.openSkillModal(skill);
        }
      });
    });

    container.querySelectorAll('.delete-skill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name');
        ModalManager.openConfirmDelete({
          title: 'Delete Skill',
          message: `Are you sure you want to remove this skill from your portfolio?`,
          itemName: name,
          onConfirm: () => handleDeleteSkill(id)
        });
      });
    });

    renderStats();
  }

  // Icon SVG Helper
  function getSkillIconSvg(name, iconKey) {
    const n = (name || '').toLowerCase();
    if (n.includes('js') || n.includes('javascript')) {
      return `<span class="text-amber-500 text-xs font-black">JS</span>`;
    }
    if (n.includes('node')) {
      return `<svg class="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l10 5.8v11.4L12 25 2 19.2V7.8L12 2z"/></svg>`;
    }
    if (n.includes('react')) {
      return `<svg class="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zM12 14a2 2 0 100-4 2 2 0 000 4z"></path></svg>`;
    }
    if (n.includes('mongo')) {
      return `<span class="text-emerald-500 text-xs font-black">🍃</span>`;
    }
    if (n.includes('git')) {
      return `<svg class="w-4 h-4 text-rose-500" fill="currentColor" viewBox="0 0 24 24"><path d="M2.6 10.59L8.38 4.8a2.53 2.53 0 013.58 0l1.41 1.41-2.2 2.2a2.3 2.3 0 00-1.89.5 2.33 2.33 0 00-.51 2.58l-2.43 2.43a2.34 2.34 0 00-1.63-.48 2.34 2.34 0 00-2.11 2.34 2.34 2.34 0 002.34 2.34 2.34 2.34 0 002.34-2.11c0-.42-.11-.82-.31-1.17l2.39-2.39c.35.2.75.31 1.17.31 1.12 0 2.06-.79 2.28-1.85l2.4 1.39a2.34 2.34 0 101.44-1.39l-2.45-1.42a2.32 2.32 0 00-.52-1.25l2.2-2.2 5.79 5.79a2.53 2.53 0 010 3.58l-5.79 5.79a2.53 2.53 0 01-3.58 0L2.6 14.17a2.53 2.53 0 010-3.58z"/></svg>`;
    }
    if (n.includes('tailwind')) {
      return `<svg class="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z"/></svg>`;
    }
    return `<svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>`;
  }

  // ==========================================
  // PROJECTS RENDERING & LOGIC
  // ==========================================
  function renderProjects() {
    const container = document.getElementById('projects-grid');
    const emptyState = document.getElementById('projects-empty-state');
    if (!container) return;

    const query = state.projectSearchQuery.toLowerCase();
    const category = state.activeProjectCategory;

    const filtered = state.projects.filter(p => {
      const matchCat = category === 'All' || p.category === category;
      const tagsStr = Array.isArray(p.tags) ? p.tags.join(' ').toLowerCase() : '';
      const matchQuery = !query || 
        (p.title && p.title.toLowerCase().includes(query)) ||
        (p.name && p.name.toLowerCase().includes(query)) ||
        (p.description && p.description.toLowerCase().includes(query)) ||
        (p.language && p.language.toLowerCase().includes(query)) ||
        tagsStr.includes(query);

      return matchCat && matchQuery;
    });

    if (filtered.length === 0) {
      container.innerHTML = '';
      if (emptyState) emptyState.classList.remove('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    container.innerHTML = filtered.map(proj => {
      const safeId = proj.id;
      const langClass = `lang-${proj.language || 'default'}`;
      const hasLiveDemo = Boolean(proj.homepage && proj.homepage.trim().length > 0);
      const hasGithub = Boolean(proj.githubUrl && proj.githubUrl.trim().length > 0);
      const tagsList = Array.isArray(proj.tags) ? proj.tags : (proj.tags ? proj.tags.split(',') : []);

      return `
        <article class="glass-card card-glow group relative flex flex-col justify-between bg-white/90 dark:bg-slate-900/90 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-md hover:shadow-2xl transition-all duration-300" data-project-id="${safeId}">
          
          <div>
            <!-- Header Row: Category / Featured / Actions -->
            <div class="flex items-center justify-between gap-2 mb-3">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/50">
                  <span class="lang-dot ${langClass}"></span>
                  ${escapeHtml(proj.language || 'Code')}
                </span>

                ${proj.featured ? `
                  <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/50">
                    <svg class="w-3 h-3 text-amber-500 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    Featured
                  </span>
                ` : ''}

                ${proj.isCustom ? `
                  <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                    Custom
                  </span>
                ` : ''}
              </div>

              <!-- Card Action Controls -->
              <div class="flex items-center gap-1">
                <button 
                  class="edit-project-btn p-2 rounded-xl text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 transition" 
                  title="Edit Project Details"
                  data-id="${safeId}">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                </button>
                <button 
                  class="delete-project-btn p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-800 transition" 
                  title="Remove Project Card"
                  data-id="${safeId}"
                  data-name="${escapeHtml(proj.title || proj.name)}">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
            </div>

            <!-- Title -->
            <h3 class="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2">
              ${escapeHtml(proj.title || proj.name)}
            </h3>

            <!-- Description -->
            <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4 line-clamp-3">
              ${escapeHtml(proj.description || 'No description provided yet.')}
            </p>

            <!-- Tech Tags -->
            <div class="flex flex-wrap gap-1.5 mb-6">
              ${tagsList.slice(0, 5).map(tag => `
                <span class="inline-block px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                  ${escapeHtml(tag.trim())}
                </span>
              `).join('')}
              ${tagsList.length > 5 ? `
                <span class="inline-block px-2 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-500">
                  +${tagsList.length - 5}
                </span>
              ` : ''}
            </div>
          </div>

          <!-- Card Footer Links & GitHub Stars -->
          <div class="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
            <div class="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span class="flex items-center gap-1" title="GitHub Stars">
                <svg class="w-4 h-4 text-amber-500 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                ${proj.stars || 0}
              </span>
              ${proj.forks ? `
                <span class="flex items-center gap-1" title="GitHub Forks">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2m-6 0h6m-6 0H6a2 2 0 00-2 2v10a2 2 0 002 2h2"></path></svg>
                  ${proj.forks}
                </span>
              ` : ''}
            </div>

            <div class="flex items-center gap-2">
              ${hasGithub ? `
                <a 
                  href="${escapeHtml(proj.githubUrl)}" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                  title="View Source on GitHub">
                  <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                  Code
                </a>
              ` : ''}

              ${hasLiveDemo ? `
                <a 
                  href="${escapeHtml(proj.homepage)}" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all transform hover:-translate-y-0.5"
                  title="Open Live Application">
                  <span>Live Demo</span>
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                </a>
              ` : `
                <span class="text-[11px] text-slate-400 italic px-2 py-1">Source only</span>
              `}
            </div>
          </div>

        </article>
      `;
    }).join('');

    // Attach Project Listeners
    container.querySelectorAll('.edit-project-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const proj = state.projects.find(p => p.id === id || String(p.githubId) === String(id));
        if (proj) {
          ModalManager.openProjectModal(proj);
        }
      });
    });

    container.querySelectorAll('.delete-project-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name');
        ModalManager.openConfirmDelete({
          title: 'Remove Project Card',
          message: 'Are you sure you want to remove this project card from your portfolio display?',
          itemName: name,
          onConfirm: () => handleDeleteProject(id)
        });
      });
    });

    renderStats();
  }

  // ==========================================
  // CRUD HANDLERS
  // ==========================================
  // Skill Create / Update Form Submit
  async function handleSkillSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('skill-id').value;
    const name = document.getElementById('skill-name').value.trim();
    const category = document.getElementById('skill-category').value;
    const level = document.getElementById('skill-level').value;
    const description = document.getElementById('skill-desc').value.trim();
    const icon = document.getElementById('skill-icon').value;

    if (!name) {
      showToast('Please enter a skill name', 'error');
      return;
    }

    try {
      if (id) {
        // Edit Skill
        const res = await fetchAPI(`/api/skills/${id}`, {
          method: 'PUT',
          body: JSON.stringify({ name, category, level, description, icon })
        });
        const idx = state.skills.findIndex(s => s.id === id);
        if (idx >= 0) state.skills[idx] = res.skill;
        showToast(`Skill "${name}" updated successfully!`, 'success');
      } else {
        // Add Skill
        const res = await fetchAPI('/api/skills', {
          method: 'POST',
          body: JSON.stringify({ name, category, level, description, icon })
        });
        state.skills.push(res.skill);
        showToast(`New skill "${name}" added!`, 'success');
      }

      ModalManager.close();
      renderSkills();
    } catch (err) {
      showToast(`Skill operation failed: ${err.message}`, 'error');
    }
  }

  // Skill Delete
  async function handleDeleteSkill(id) {
    try {
      await fetchAPI(`/api/skills/${id}`, { method: 'DELETE' });
      state.skills = state.skills.filter(s => s.id !== id);
      showToast('Skill deleted successfully', 'success');
      renderSkills();
    } catch (err) {
      showToast(`Failed to delete skill: ${err.message}`, 'error');
    }
  }

  // Skill Reset
  async function handleResetSkills() {
    try {
      const res = await fetchAPI('/api/skills/reset', { method: 'POST' });
      state.skills = res.skills;
      showToast('Skills restored to initial defaults', 'info');
      renderSkills();
    } catch (err) {
      showToast(`Failed to reset skills: ${err.message}`, 'error');
    }
  }

  // Project Create / Update Form Submit
  async function handleProjectSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('project-id').value;
    const title = document.getElementById('project-title').value.trim();
    const description = document.getElementById('project-description').value.trim();
    const language = document.getElementById('project-language').value;
    const rawTags = document.getElementById('project-tags').value;
    const homepage = document.getElementById('project-homepage').value.trim();
    const githubUrl = document.getElementById('project-github').value.trim();
    const category = document.getElementById('project-category').value;
    const featured = document.getElementById('project-featured').checked;

    const tags = rawTags.split(',').map(t => t.trim()).filter(Boolean);

    if (!title) {
      showToast('Project title is required', 'error');
      return;
    }

    try {
      if (id) {
        // Edit Project
        const res = await fetchAPI(`/api/projects/${id}`, {
          method: 'PUT',
          body: JSON.stringify({ title, description, language, tags, homepage, githubUrl, category, featured })
        });
        const idx = state.projects.findIndex(p => p.id === id || String(p.githubId) === String(id));
        if (idx >= 0) state.projects[idx] = res.project;
        showToast(`Project "${title}" updated!`, 'success');
      } else {
        // Add Project
        const res = await fetchAPI('/api/projects', {
          method: 'POST',
          body: JSON.stringify({ title, description, language, tags, homepage, githubUrl, category, featured })
        });
        state.projects.unshift(res.project);
        showToast(`Custom project "${title}" added!`, 'success');
      }

      ModalManager.close();
      renderProjects();
    } catch (err) {
      showToast(`Project operation failed: ${err.message}`, 'error');
    }
  }

  // Project Delete
  async function handleDeleteProject(id) {
    try {
      await fetchAPI(`/api/projects/${id}`, { method: 'DELETE' });
      state.projects = state.projects.filter(p => p.id !== id && String(p.githubId) !== String(id));
      showToast('Project removed successfully', 'success');
      renderProjects();
    } catch (err) {
      showToast(`Failed to delete project: ${err.message}`, 'error');
    }
  }

  // GitHub Manual Sync
  async function handleSyncGithub() {
    if (state.isSyncing) return;
    state.isSyncing = true;

    const syncButtons = document.querySelectorAll('.sync-github-btn');
    const syncIcons = document.querySelectorAll('.sync-icon');

    syncButtons.forEach(btn => btn.disabled = true);
    syncIcons.forEach(icon => icon.classList.add('spin-sync'));

    showToast('Fetching latest repositories from GitHub (bereket2114)...', 'info', 3000);

    try {
      const res = await fetchAPI('/api/projects/sync-github', { method: 'POST' });
      state.projects = res.projects;
      showToast(res.message, 'success', 5000);
      renderProjects();
    } catch (err) {
      showToast(`GitHub Sync failed: ${err.message}`, 'error', 6000);
    } finally {
      state.isSyncing = false;
      syncButtons.forEach(btn => btn.disabled = false);
      syncIcons.forEach(icon => icon.classList.remove('spin-sync'));
    }
  }

  // Reset Projects
  async function handleResetProjects() {
    try {
      const res = await fetchAPI('/api/projects/reset', { method: 'POST' });
      state.projects = res.projects;
      showToast('Projects restored to initial state', 'info');
      renderProjects();
    } catch (err) {
      showToast(`Failed to reset projects: ${err.message}`, 'error');
    }
  }

  // Contact Form Submission
  async function handleContactSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) {
      showToast('Please fill out all required fields', 'error');
      return;
    }

    try {
      const res = await fetchAPI('/api/contact', {
        method: 'POST',
        body: JSON.stringify({ name, email, subject, message })
      });
      showToast(res.message, 'success', 5000);
      document.getElementById('contact-form').reset();
    } catch (err) {
      showToast(`Failed to send message: ${err.message}`, 'error');
    }
  }

  // Escape HTML helper for security
  function escapeHtml(str) {
    if (typeof str !== 'string') return str || '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Initialize Event Listeners
  function initEvents() {
    // Skills Filter Buttons
    document.querySelectorAll('.skill-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.skill-filter-btn').forEach(b => {
          b.classList.remove('active', 'bg-indigo-600', 'text-white');
          b.classList.add('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-400');
        });
        btn.classList.add('active', 'bg-indigo-600', 'text-white');
        btn.classList.remove('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-400');

        state.activeSkillCategory = btn.getAttribute('data-category');
        renderSkills();
      });
    });

    // Skills Search Input
    const skillSearchInput = document.getElementById('skill-search-input');
    if (skillSearchInput) {
      skillSearchInput.addEventListener('input', (e) => {
        state.skillSearchQuery = e.target.value;
        renderSkills();
      });
    }

    // Projects Filter Buttons
    document.querySelectorAll('.project-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.project-filter-btn').forEach(b => {
          b.classList.remove('active', 'bg-indigo-600', 'text-white');
          b.classList.add('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-400');
        });
        btn.classList.add('active', 'bg-indigo-600', 'text-white');
        btn.classList.remove('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-400');

        state.activeProjectCategory = btn.getAttribute('data-category');
        renderProjects();
      });
    });

    // Projects Search Input
    const projectSearchInput = document.getElementById('project-search-input');
    if (projectSearchInput) {
      projectSearchInput.addEventListener('input', (e) => {
        state.projectSearchQuery = e.target.value;
        renderProjects();
      });
    }

    // Add Skill Button
    const addSkillBtn = document.getElementById('add-skill-btn');
    if (addSkillBtn) {
      addSkillBtn.addEventListener('click', () => ModalManager.openSkillModal());
    }

    // Add Project Button
    const addProjectBtn = document.getElementById('add-project-btn');
    if (addProjectBtn) {
      addProjectBtn.addEventListener('click', () => ModalManager.openProjectModal());
    }

    // Reset Skills Button
    const resetSkillsBtn = document.getElementById('reset-skills-btn');
    if (resetSkillsBtn) {
      resetSkillsBtn.addEventListener('click', () => {
        ModalManager.openConfirmDelete({
          title: 'Reset Skills List',
          message: 'Restore the skills list back to initial default configuration?',
          itemName: 'All Default Skills',
          onConfirm: handleResetSkills
        });
      });
    }

    // Reset Projects Button
    const resetProjectsBtn = document.getElementById('reset-projects-btn');
    if (resetProjectsBtn) {
      resetProjectsBtn.addEventListener('click', () => {
        ModalManager.openConfirmDelete({
          title: 'Reset Projects List',
          message: 'Restore all project cards and curated descriptions back to default seed state?',
          itemName: 'All Curated Projects',
          onConfirm: handleResetProjects
        });
      });
    }

    // Sync GitHub Buttons
    document.querySelectorAll('.sync-github-btn').forEach(btn => {
      btn.addEventListener('click', handleSyncGithub);
    });

    // Form Submissions
    const skillForm = document.getElementById('skill-form');
    if (skillForm) skillForm.addEventListener('submit', handleSkillSubmit);

    const projectForm = document.getElementById('project-form');
    if (projectForm) projectForm.addEventListener('submit', handleProjectSubmit);

    const contactForm = document.getElementById('contact-form');
    if (contactForm) contactForm.addEventListener('submit', handleContactSubmit);

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });
      // Close mobile menu on link click
      mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
      });
    }

    // Copy Email to clipboard button
    const copyEmailBtn = document.getElementById('copy-email-btn');
    if (copyEmailBtn) {
      copyEmailBtn.addEventListener('click', () => {
        const email = (state.profile && state.profile.email) || 'bereketwoldemariam369@gmail.com';
        navigator.clipboard.writeText(email);
        showToast(`Email address copied to clipboard (${email})!`, 'success');
      });
    }
  }

  // Init
  function init() {
    initEvents();
    loadData();
  }

  return {
    init,
    showToast,
    loadData
  };
})();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', App.init);
} else {
  App.init();
}
