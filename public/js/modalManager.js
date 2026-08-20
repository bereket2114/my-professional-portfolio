/**
 * Modal Manager for Portfolio Application
 */

const ModalManager = (function () {
  let activeModal = null;
  let confirmCallback = null;

  function initModals() {
    // Backdrop click listener for all modals
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeActiveModal();
        }
      });
    });

    // Close button handlers
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', closeActiveModal);
    });

    // ESC key handler
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && activeModal) {
        closeActiveModal();
      }
    });

    // Confirm Delete button handler
    const confirmBtn = document.getElementById('confirm-delete-action-btn');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        if (typeof confirmCallback === 'function') {
          confirmCallback();
        }
        closeActiveModal();
      });
    }
  }

  function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    if (activeModal && activeModal !== modal) {
      activeModal.classList.remove('active');
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    activeModal = modal;

    // Auto-focus first input
    const firstInput = modal.querySelector('input:not([type=hidden]), textarea, select');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  }

  function closeActiveModal() {
    if (activeModal) {
      activeModal.classList.remove('active');
      document.body.style.overflow = '';
      activeModal = null;
      confirmCallback = null;
    }
  }

  // Skill Modal
  function openSkillModal(skill = null) {
    const titleEl = document.getElementById('skill-modal-title');
    const form = document.getElementById('skill-form');
    const idInput = document.getElementById('skill-id');
    const nameInput = document.getElementById('skill-name');
    const categoryInput = document.getElementById('skill-category');
    const levelInput = document.getElementById('skill-level');
    const descInput = document.getElementById('skill-desc');
    const iconInput = document.getElementById('skill-icon');

    form.reset();

    if (skill) {
      titleEl.textContent = 'Edit Skill';
      idInput.value = skill.id || '';
      nameInput.value = skill.name || '';
      categoryInput.value = skill.category || 'Frontend';
      levelInput.value = skill.level || 'Advanced';
      descInput.value = skill.description || '';
      iconInput.value = skill.icon || 'code';
    } else {
      titleEl.textContent = 'Add New Skill';
      idInput.value = '';
      categoryInput.value = 'Frontend';
      levelInput.value = 'Advanced';
      iconInput.value = 'code';
    }

    showModal('skill-modal');
  }

  // Project Modal (Add or Edit)
  function openProjectModal(project = null) {
    const titleEl = document.getElementById('project-modal-title');
    const form = document.getElementById('project-form');
    const idInput = document.getElementById('project-id');
    const titleInput = document.getElementById('project-title');
    const descInput = document.getElementById('project-description');
    const langInput = document.getElementById('project-language');
    const tagsInput = document.getElementById('project-tags');
    const homeInput = document.getElementById('project-homepage');
    const githubInput = document.getElementById('project-github');
    const categoryInput = document.getElementById('project-category');
    const featuredInput = document.getElementById('project-featured');

    form.reset();

    if (project) {
      titleEl.textContent = `Edit Project: ${project.name || project.title}`;
      idInput.value = project.id || '';
      titleInput.value = project.title || project.name || '';
      descInput.value = project.description || '';
      langInput.value = project.language || 'JavaScript';
      tagsInput.value = Array.isArray(project.tags) ? project.tags.join(', ') : (project.tags || '');
      homeInput.value = project.homepage || '';
      githubInput.value = project.githubUrl || '';
      categoryInput.value = project.category || 'Full-Stack';
      featuredInput.checked = Boolean(project.featured);
    } else {
      titleEl.textContent = 'Add Custom Project';
      idInput.value = '';
      langInput.value = 'JavaScript';
      categoryInput.value = 'Full-Stack';
      featuredInput.checked = false;
    }

    showModal('project-modal');
  }

  // Delete Confirmation Modal
  function openConfirmDelete({ title, message, itemName, onConfirm }) {
    const titleEl = document.getElementById('confirm-delete-title');
    const descEl = document.getElementById('confirm-delete-message');
    const itemEl = document.getElementById('confirm-delete-item-name');

    if (titleEl) titleEl.textContent = title || 'Confirm Deletion';
    if (descEl) descEl.textContent = message || 'Are you sure you want to delete this item? This action cannot be undone.';
    if (itemEl) itemEl.textContent = itemName ? `"${itemName}"` : '';

    confirmCallback = onConfirm;
    showModal('confirm-delete-modal');
  }

  return {
    init: initModals,
    openSkillModal,
    openProjectModal,
    openConfirmDelete,
    close: closeActiveModal
  };
})();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ModalManager.init);
} else {
  ModalManager.init();
}
