/**
 * DevToolbox - Utilities & Helpers
 * Core utility functions for storage, clipboard, toast notifications, and DOM helpers.
 */

window.DevToolbox = window.DevToolbox || {};

(function (DT) {
  'use strict';

  // --- SVG Icons Registry ---
  const ICONS = {
    'search': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>',
    'copy': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>',
    'check': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>',
    'trash': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>',
    'star': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>',
    'star-filled': '<path fill="currentColor" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>',
    'sun': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>',
    'moon': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>',
    'menu': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>',
    'close': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>',
    'arrow-left': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>',
    'refresh': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>',
    'sparkles': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.286L13 21l-2.286-6.857L5 12l5.714-2.286L13 3z"/>',
    'info': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>',
    'alert': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>',
    'code': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>',
    'json': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>',
    'lock': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>',
    'palette': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4 8 8 0 0116 0 4 4 0 01-4 4 4 4 0 01-4-4 2 2 0 00-4 0 4 4 0 01-4 4z"/>',
    'text': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16"/>',
    'link': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>',
    'shield': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>',
    'grid': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>',
    'history': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>',
    'external': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>'
  };

  /**
   * Helper to render an SVG icon safely
   */
  DT.getIcon = function (name, className = 'icon') {
    const path = ICONS[name] || ICONS['info'];
    return `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${path}</svg>`;
  };

  // --- LocalStorage Manager ---
  DT.storage = {
    get(key, defaultValue = null) {
      try {
        const item = localStorage.getItem(key);
        return item !== null ? JSON.parse(item) : defaultValue;
      } catch (err) {
        console.warn(`[DevToolbox Storage] Error reading "${key}":`, err);
        return defaultValue;
      }
    },

    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (err) {
        console.warn(`[DevToolbox Storage] Error writing "${key}":`, err);
        return false;
      }
    },

    remove(key) {
      try {
        localStorage.removeItem(key);
      } catch (err) {
        console.warn(`[DevToolbox Storage] Error removing "${key}":`, err);
      }
    },

    // Favorites Management
    getFavorites() {
      return this.get('devtoolbox_favorites', []);
    },

    isFavorite(toolId) {
      const favs = this.getFavorites();
      return favs.includes(toolId);
    },

    toggleFavorite(toolId) {
      const favs = this.getFavorites();
      const index = favs.indexOf(toolId);
      let isNowFav = false;
      if (index > -1) {
        favs.splice(index, 1);
        isNowFav = false;
      } else {
        favs.push(toolId);
        isNowFav = true;
      }
      this.set('devtoolbox_favorites', favs);
      window.dispatchEvent(new CustomEvent('devtoolbox:favoritesUpdated', { detail: { toolId, isFavorite: isNowFav, favorites: favs } }));
      return isNowFav;
    },

    // Recents Management
    getRecents() {
      return this.get('devtoolbox_recents', []);
    },

    addRecent(toolId) {
      if (!toolId || toolId === 'dashboard') return;
      let recents = this.getRecents();
      // Remove previous occurrence of this tool
      recents = recents.filter(item => item.id !== toolId);
      // Prepend to top
      recents.unshift({
        id: toolId,
        timestamp: Date.now()
      });
      // Limit to 10 recents
      if (recents.length > 10) recents = recents.slice(0, 10);
      this.set('devtoolbox_recents', recents);
      window.dispatchEvent(new CustomEvent('devtoolbox:recentsUpdated', { detail: { recents } }));
    },

    clearRecents() {
      this.set('devtoolbox_recents', []);
      window.dispatchEvent(new CustomEvent('devtoolbox:recentsUpdated', { detail: { recents: [] } }));
    },

    // Theme Management
    getTheme() {
      const stored = this.get('devtoolbox_theme');
      if (stored) return stored;
      // Default to dark, or check prefers-color-scheme
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    },

    setTheme(theme) {
      this.set('devtoolbox_theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
      window.dispatchEvent(new CustomEvent('devtoolbox:themeChanged', { detail: { theme } }));
    }
  };

  // --- Toast Notification Manager ---
  DT.toast = {
    container: null,

    init() {
      if (!this.container) {
        this.container = document.createElement('div');
        this.container.id = 'toast-container';
        this.container.className = 'toast-container';
        this.container.setAttribute('aria-live', 'polite');
        document.body.appendChild(this.container);
      }
    },

    show(message, type = 'info', title = '', duration = 3000) {
      this.init();

      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      
      let iconName = 'info';
      if (type === 'success') iconName = 'check';
      if (type === 'error') iconName = 'alert';
      if (type === 'warning') iconName = 'alert';

      const iconHtml = DT.getIcon(iconName, 'toast-icon');

      toast.innerHTML = `
        <div class="toast-indicator"></div>
        <div class="toast-content">
          ${iconHtml}
          <div class="toast-text">
            ${title ? `<strong class="toast-title">${DT.escapeHtml(title)}</strong>` : ''}
            <span class="toast-message">${DT.escapeHtml(message)}</span>
          </div>
        </div>
        <button class="toast-close" aria-label="Close notification" type="button">
          ${DT.getIcon('close', 'toast-close-icon')}
        </button>
      `;

      const closeBtn = toast.querySelector('.toast-close');
      const dismiss = () => {
        toast.classList.add('toast-hiding');
        setTimeout(() => {
          if (toast.parentElement) toast.parentElement.removeChild(toast);
        }, 300);
      };

      closeBtn.addEventListener('click', dismiss);

      this.container.appendChild(toast);

      // Trigger enter animation
      requestAnimationFrame(() => {
        toast.classList.add('toast-visible');
      });

      // Auto dismiss timer
      if (duration > 0) {
        setTimeout(dismiss, duration);
      }

      return toast;
    },

    success(message, title = 'Success') {
      return this.show(message, 'success', title);
    },

    error(message, title = 'Error') {
      return this.show(message, 'error', title, 4500);
    },

    info(message, title = 'Note') {
      return this.show(message, 'info', title);
    },

    warning(message, title = 'Warning') {
      return this.show(message, 'warning', title, 4000);
    }
  };

  // --- Clipboard Helper ---
  DT.clipboard = {
    copy(text, successMessage = 'Copied to clipboard!', triggerBtn = null) {
      if (text === undefined || text === null || text === '') {
        DT.toast.warning('Nothing to copy!');
        return Promise.resolve(false);
      }

      const stringValue = String(text);

      const handleSuccess = () => {
        DT.toast.success(successMessage);
        if (triggerBtn) {
          triggerBtn.classList.add('copied');
          const originalContent = triggerBtn.innerHTML;
          // Temporarily show check icon
          triggerBtn.innerHTML = `${DT.getIcon('check', 'btn-icon')} Copied!`;
          setTimeout(() => {
            triggerBtn.innerHTML = originalContent;
            triggerBtn.classList.remove('copied');
          }, 1800);
        }
        return true;
      };

      if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(stringValue)
          .then(handleSuccess)
          .catch(err => {
            console.warn('[DevToolbox Clipboard] navigator.clipboard failed, using fallback:', err);
            return fallbackCopy(stringValue, handleSuccess);
          });
      } else {
        return Promise.resolve(fallbackCopy(stringValue, handleSuccess));
      }

      function fallbackCopy(val, cb) {
        try {
          const textarea = document.createElement('textarea');
          textarea.value = val;
          textarea.style.position = 'fixed';
          textarea.style.top = '-9999px';
          textarea.style.left = '-9999px';
          textarea.setAttribute('readonly', '');
          document.body.appendChild(textarea);
          textarea.select();
          const successful = document.execCommand('copy');
          document.body.removeChild(textarea);
          if (successful) {
            return cb();
          } else {
            DT.toast.error('Failed to copy to clipboard');
            return false;
          }
        } catch (e) {
          DT.toast.error('Copy not supported by your browser');
          return false;
        }
      }
    }
  };

  // --- Utility functions ---
  DT.escapeHtml = function (str) {
    if (typeof str !== 'string') return String(str);
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  DT.formatBytes = function (bytes, decimals = 2) {
    if (!+bytes) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  DT.debounce = function (func, wait = 250) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  DT.formatDateRelative = function (timestamp) {
    if (!timestamp) return '';
    const now = Date.now();
    const diff = Math.floor((now - timestamp) / 1000); // seconds
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

})(window.DevToolbox);
