/**
 * DevToolbox - Main Application Controller
 * Handles SPA hash routing, state management, search, favorites, recents, theme switching, and navigation.
 */

window.DevToolbox = window.DevToolbox || {};

(function (DT) {
  'use strict';

  // --- Complete Tools Catalog ---
  const TOOLS = [
    {
      id: 'json-formatter',
      name: 'JSON Formatter',
      category: 'JSON Tools',
      categoryKey: 'json',
      icon: 'json',
      description: 'Format, beautify, and minify JSON with custom indentation and size compression stats.',
      tags: ['json', 'format', 'beautify', 'indent', 'minify', 'pretty print', 'clean']
    },
    {
      id: 'json-validator',
      name: 'JSON Validator',
      category: 'JSON Tools',
      categoryKey: 'json',
      icon: 'shield',
      description: 'Validate JSON syntax and detect parsing errors with line, column, and context indicators.',
      tags: ['json', 'validate', 'syntax', 'error', 'lint', 'schema', 'checker']
    },
    {
      id: 'b64-encoder',
      name: 'Base64 Encoder',
      category: 'Encoding Tools',
      categoryKey: 'encoding',
      icon: 'code',
      description: 'Encode plain text and UTF-8 Unicode characters into standard or URL-safe Base64 format.',
      tags: ['base64', 'encode', 'btoa', 'utf-8', 'url-safe', 'string', 'binary']
    },
    {
      id: 'b64-decoder',
      name: 'Base64 Decoder',
      category: 'Encoding Tools',
      categoryKey: 'encoding',
      icon: 'code',
      description: 'Decode Base64 strings back to clean UTF-8 plain text with instant error detection.',
      tags: ['base64', 'decode', 'atob', 'utf-8', 'binary', 'text', 'convert']
    },
    {
      id: 'url-encoder',
      name: 'URL Encoder',
      category: 'Encoding Tools',
      categoryKey: 'encoding',
      icon: 'link',
      description: 'Safely encode URL strings or URI components with support for standard %20 or + spaces.',
      tags: ['url', 'uri', 'encode', 'percent', 'query', 'params', 'http']
    },
    {
      id: 'url-decoder',
      name: 'URL Decoder',
      category: 'Encoding Tools',
      categoryKey: 'encoding',
      icon: 'link',
      description: 'Decode percent-encoded URL parameters and query strings back to human-readable text.',
      tags: ['url', 'uri', 'decode', 'query', 'params', 'unquote', 'http']
    },
    {
      id: 'case-converter',
      name: 'Case Converter',
      category: 'Text Tools',
      categoryKey: 'text',
      icon: 'text',
      description: 'Convert text between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case and kebab-case.',
      tags: ['case', 'converter', 'uppercase', 'lowercase', 'title', 'sentence', 'camelcase', 'snake_case', 'kebab-case']
    },
    {
      id: 'word-counter',
      name: 'Word Counter',
      category: 'Text Tools',
      categoryKey: 'text',
      icon: 'text',
      description: 'Analyze text metrics: count words, characters, sentences, paragraphs, reading time, and keyword density.',
      tags: ['words', 'counter', 'characters', 'sentences', 'paragraphs', 'reading time', 'density', 'stats']
    },
    {
      id: 'password-generator',
      name: 'Password Generator',
      category: 'Generator Tools',
      categoryKey: 'generator',
      icon: 'lock',
      description: 'Generate cryptographically secure passwords with entropy measurement, strength rating, and bulk mode.',
      tags: ['password', 'generator', 'crypto', 'random', 'security', 'entropy', 'hash', 'credentials']
    },
    {
      id: 'color-converter',
      name: 'Color Converter',
      category: 'Generator Tools',
      categoryKey: 'generator',
      icon: 'palette',
      description: 'Convert between HEX, RGB, HSL and CMYK color models with WCAG contrast scoring and color harmonies.',
      tags: ['color', 'converter', 'hex', 'rgb', 'hsl', 'cmyk', 'picker', 'palette', 'wcag', 'contrast']
    }
  ];

  DT.TOOLS_CATALOG = TOOLS;

  // --- Main App Controller ---
  DT.app = {
    currentRoute: 'dashboard',
    activeCategory: 'all',
    searchQuery: '',

    init() {
      // 1. Initialize Theme
      this.initTheme();

      // 2. Initialize Tool Controllers
      this.initTools();

      // 3. Render Navigation Sidebar
      this.renderSidebar();

      // 4. Render Dashboard Components
      this.renderDashboard();

      // 5. Setup Event Listeners
      this.setupEventListeners();

      // 6. Initialize Router from URL hash
      this.handleRouting();

      console.log('DevToolbox initialized with 10 production-ready developer tools.');
    },

    // --- Theme Controller ---
    initTheme() {
      const currentTheme = DT.storage.getTheme();
      DT.storage.setTheme(currentTheme);
      this.updateThemeToggleUI(currentTheme);
    },

    toggleTheme() {
      const currentTheme = DT.storage.getTheme();
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      DT.storage.setTheme(newTheme);
      this.updateThemeToggleUI(newTheme);
      DT.toast.info(`Switched to ${newTheme} mode`);
    },

    updateThemeToggleUI(theme) {
      const btns = document.querySelectorAll('.theme-toggle-btn');
      btns.forEach(btn => {
        const iconName = theme === 'dark' ? 'sun' : 'moon';
        const label = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
        btn.innerHTML = `${DT.getIcon(iconName, 'nav-icon')} <span class="theme-label">${label}</span>`;
        btn.setAttribute('aria-label', `Switch to ${label}`);
        btn.setAttribute('title', `Switch to ${label}`);
      });
    },

    // --- Tool Initializer ---
    initTools() {
      if (DT.tools.jsonFormatter) DT.tools.jsonFormatter.init();
      if (DT.tools.jsonValidator) DT.tools.jsonValidator.init();
      if (DT.tools.b64Encoder) DT.tools.b64Encoder.init();
      if (DT.tools.b64Decoder) DT.tools.b64Decoder.init();
      if (DT.tools.urlEncoder) DT.tools.urlEncoder.init();
      if (DT.tools.urlDecoder) DT.tools.urlDecoder.init();
      if (DT.tools.caseConverter) DT.tools.caseConverter.init();
      if (DT.tools.wordCounter) DT.tools.wordCounter.init();
      if (DT.tools.passwordGenerator) DT.tools.passwordGenerator.init();
      if (DT.tools.colorConverter) DT.tools.colorConverter.init();
    },

    // --- Render Sidebar Navigation ---
    renderSidebar() {
      const sidebarNav = document.getElementById('sidebar-nav');
      if (!sidebarNav) return;

      const categories = [
        { key: 'json', title: 'JSON Tools', icon: 'json' },
        { key: 'encoding', title: 'Encoding Tools', icon: 'code' },
        { key: 'text', title: 'Text Tools', icon: 'text' },
        { key: 'generator', title: 'Generators', icon: 'lock' }
      ];

      let navHtml = `
        <div class="nav-section">
          <a href="#dashboard" class="nav-item ${this.currentRoute === 'dashboard' ? 'active' : ''}" data-route="dashboard">
            ${DT.getIcon('grid', 'nav-icon')}
            <span class="nav-text">Dashboard</span>
          </a>
        </div>
      `;

      categories.forEach(cat => {
        const catTools = TOOLS.filter(t => t.categoryKey === cat.key);
        navHtml += `
          <div class="nav-group">
            <div class="nav-group-title">
              <span class="title-text">${cat.title}</span>
              <span class="badge-count">${catTools.length}</span>
            </div>
            <div class="nav-group-items">
        `;

        catTools.forEach(tool => {
          const isFav = DT.storage.isFavorite(tool.id);
          navHtml += `
            <a href="#${tool.id}" class="nav-item ${this.currentRoute === tool.id ? 'active' : ''}" data-route="${tool.id}" data-tool-id="${tool.id}">
              ${DT.getIcon(tool.icon, 'nav-icon')}
              <span class="nav-text">${tool.name}</span>
              <button type="button" class="nav-fav-star ${isFav ? 'active' : ''}" data-fav-tool="${tool.id}" title="${isFav ? 'Remove favorite' : 'Add favorite'}">
                ${DT.getIcon(isFav ? 'star-filled' : 'star', 'star-icon')}
              </button>
            </a>
          `;
        });

        navHtml += `
            </div>
          </div>
        `;
      });

      sidebarNav.innerHTML = navHtml;

      // Attach favorite click handlers on sidebar
      sidebarNav.querySelectorAll('[data-fav-tool]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const toolId = btn.getAttribute('data-fav-tool');
          const isNowFav = DT.storage.toggleFavorite(toolId);
          DT.toast.info(isNowFav ? 'Added to favourites' : 'Removed from favourites');
        });
      });
    },

    // --- Render Dashboard Views ---
    renderDashboard() {
      this.renderQuickStats();
      this.renderFavoritesSection();
      this.renderRecentsSection();
      this.renderAllToolsGrid();
    },

    renderQuickStats() {
      const elTotal = document.getElementById('stat-total-tools');
      const elFavs = document.getElementById('stat-favorite-tools');
      const elRecents = document.getElementById('stat-recent-tools');

      const favs = DT.storage.getFavorites();
      const recents = DT.storage.getRecents();

      if (elTotal) elTotal.textContent = TOOLS.length;
      if (elFavs) elFavs.textContent = favs.length;
      if (elRecents) elRecents.textContent = recents.length;
    },

    renderFavoritesSection() {
      const container = document.getElementById('dashboard-favorites-grid');
      const emptyState = document.getElementById('dashboard-favorites-empty');
      if (!container) return;

      const favIds = DT.storage.getFavorites();
      const favTools = TOOLS.filter(t => favIds.includes(t.id));

      if (favTools.length === 0) {
        container.classList.add('hidden');
        if (emptyState) emptyState.classList.remove('hidden');
      } else {
        container.classList.remove('hidden');
        if (emptyState) emptyState.classList.add('hidden');
        container.innerHTML = favTools.map(t => this.generateToolCardHtml(t, true)).join('');
        this.attachCardEvents(container);
      }
    },

    renderRecentsSection() {
      const container = document.getElementById('dashboard-recents-grid');
      const emptyState = document.getElementById('dashboard-recents-empty');
      const clearBtn = document.getElementById('btn-clear-recents');
      if (!container) return;

      const recents = DT.storage.getRecents();
      const recentTools = recents
        .map(r => {
          const tool = TOOLS.find(t => t.id === r.id);
          return tool ? { ...tool, usedAt: r.timestamp } : null;
        })
        .filter(Boolean);

      if (recentTools.length === 0) {
        container.classList.add('hidden');
        if (emptyState) emptyState.classList.remove('hidden');
        if (clearBtn) clearBtn.classList.add('hidden');
      } else {
        container.classList.remove('hidden');
        if (emptyState) emptyState.classList.add('hidden');
        if (clearBtn) clearBtn.classList.remove('hidden');

        container.innerHTML = recentTools.map(t => this.generateToolCardHtml(t, false, t.usedAt)).join('');
        this.attachCardEvents(container);
      }
    },

    renderAllToolsGrid() {
      const container = document.getElementById('dashboard-all-tools-grid');
      const emptySearch = document.getElementById('dashboard-search-empty');
      if (!container) return;

      let filtered = TOOLS;

      // Filter by category
      if (this.activeCategory !== 'all') {
        filtered = filtered.filter(t => t.categoryKey === this.activeCategory);
      }

      // Filter by search query
      if (this.searchQuery.trim()) {
        const q = this.searchQuery.toLowerCase().trim();
        filtered = filtered.filter(t => {
          return t.name.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
            t.category.toLowerCase().includes(q) ||
            t.tags.some(tag => tag.toLowerCase().includes(q));
        });
      }

      if (filtered.length === 0) {
        container.classList.add('hidden');
        if (emptySearch) {
          emptySearch.classList.remove('hidden');
          const queryText = emptySearch.querySelector('.search-query-text');
          if (queryText) queryText.textContent = `"${this.searchQuery}"`;
        }
      } else {
        container.classList.remove('hidden');
        if (emptySearch) emptySearch.classList.add('hidden');
        container.innerHTML = filtered.map(t => this.generateToolCardHtml(t)).join('');
        this.attachCardEvents(container);
      }
    },

    generateToolCardHtml(tool, isFavCard = false, timestamp = null) {
      const isFav = DT.storage.isFavorite(tool.id);
      const timeBadge = timestamp ? `<span class="tool-card-time">${DT.formatDateRelative(timestamp)}</span>` : '';

      return `
        <div class="tool-card glass-panel" data-tool-id="${tool.id}">
          <div class="tool-card-top">
            <div class="tool-card-icon-wrap cat-${tool.categoryKey}">
              ${DT.getIcon(tool.icon, 'tool-card-icon')}
            </div>
            <div class="tool-card-meta">
              <span class="tool-card-category">${tool.category}</span>
              ${timeBadge}
            </div>
            <button type="button" class="tool-card-fav-btn ${isFav ? 'active' : ''}" data-fav-tool="${tool.id}" aria-label="Toggle favourite" title="${isFav ? 'Remove from favourites' : 'Add to favourites'}">
              ${DT.getIcon(isFav ? 'star-filled' : 'star', 'star-icon')}
            </button>
          </div>
          <h3 class="tool-card-title">${tool.name}</h3>
          <p class="tool-card-desc">${tool.description}</p>
          <div class="tool-card-footer">
            <a href="#${tool.id}" class="btn btn-sm btn-outline btn-card-open">
              Open Tool ${DT.getIcon('external', 'btn-icon')}
            </a>
          </div>
        </div>
      `;
    },

    attachCardEvents(container) {
      // Favorite button clicks
      container.querySelectorAll('[data-fav-tool]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const toolId = btn.getAttribute('data-fav-tool');
          const isNowFav = DT.storage.toggleFavorite(toolId);
          DT.toast.info(isNowFav ? 'Added to favourites' : 'Removed from favourites');
        });
      });

      // Whole card click (optional navigation if clicking card body)
      container.querySelectorAll('.tool-card').forEach(card => {
        card.addEventListener('click', (e) => {
          if (e.target.closest('button') || e.target.closest('a')) return;
          const toolId = card.getAttribute('data-tool-id');
          if (toolId) window.location.hash = `#${toolId}`;
        });
      });
    },

    // --- Router & View Management ---
    handleRouting() {
      let hash = window.location.hash.replace(/^#/, '').trim();
      if (!hash) hash = 'dashboard';

      const toolExists = hash === 'dashboard' || TOOLS.some(t => t.id === hash);
      if (!toolExists) {
        hash = 'dashboard';
        window.location.hash = '#dashboard';
      }

      this.currentRoute = hash;

      // 1. Hide all views
      document.querySelectorAll('.view-section').forEach(view => {
        view.classList.remove('active');
      });

      // 2. Show active view
      const activeView = document.getElementById(hash === 'dashboard' ? 'view-dashboard' : `tool-${hash}`);
      if (activeView) {
        activeView.classList.add('active');
      }

      // 3. Update Breadcrumb & Top Bar
      const breadcrumbTool = document.getElementById('topbar-tool-title');
      const toolHeaderFav = document.getElementById('tool-header-fav-btn');

      if (hash === 'dashboard') {
        if (breadcrumbTool) breadcrumbTool.textContent = 'Dashboard';
        if (toolHeaderFav) toolHeaderFav.classList.add('hidden');
      } else {
        const currentTool = TOOLS.find(t => t.id === hash);
        if (currentTool) {
          if (breadcrumbTool) breadcrumbTool.textContent = currentTool.name;
          // Record recent use
          DT.storage.addRecent(hash);

          // Update tool-header favorite button if present in active view
          if (toolHeaderFav) {
            toolHeaderFav.classList.remove('hidden');
            const isFav = DT.storage.isFavorite(hash);
            toolHeaderFav.className = `btn btn-sm btn-outline ${isFav ? 'active' : ''}`;
            toolHeaderFav.setAttribute('data-fav-tool', hash);
            toolHeaderFav.innerHTML = `${DT.getIcon(isFav ? 'star-filled' : 'star', 'btn-icon')} ${isFav ? 'Favourited' : 'Add to Favourites'}`;
          }
        }
      }

      // 4. Update Sidebar active states
      document.querySelectorAll('#sidebar-nav .nav-item').forEach(item => {
        const itemRoute = item.getAttribute('data-route');
        if (itemRoute === hash) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });

      // 5. Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // 6. Close mobile sidebar if open
      const sidebar = document.getElementById('app-sidebar');
      const backdrop = document.getElementById('sidebar-backdrop');
      if (sidebar && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        if (backdrop) backdrop.classList.remove('visible');
      }
    },

    // --- Event Listeners Setup ---
    setupEventListeners() {
      // 1. Hash change routing
      window.addEventListener('hashchange', () => this.handleRouting());

      // 2. Global Theme Toggle buttons
      document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => this.toggleTheme());
      });

      // 3. Favorites updated event
      window.addEventListener('devtoolbox:favoritesUpdated', (e) => {
        this.renderSidebar();
        this.renderQuickStats();
        this.renderFavoritesSection();
        this.renderAllToolsGrid();

        // Update active tool favorite button if inside a tool view
        if (this.currentRoute !== 'dashboard') {
          const toolHeaderFav = document.getElementById('tool-header-fav-btn');
          if (toolHeaderFav) {
            const isFav = DT.storage.isFavorite(this.currentRoute);
            toolHeaderFav.className = `btn btn-sm btn-outline ${isFav ? 'active' : ''}`;
            toolHeaderFav.innerHTML = `${DT.getIcon(isFav ? 'star-filled' : 'star', 'btn-icon')} ${isFav ? 'Favourited' : 'Add to Favourites'}`;
          }
        }
      });

      // 4. Recents updated event
      window.addEventListener('devtoolbox:recentsUpdated', () => {
        this.renderQuickStats();
        this.renderRecentsSection();
      });

      // 5. Clear Recents button
      const clearRecentsBtn = document.getElementById('btn-clear-recents');
      if (clearRecentsBtn) {
        clearRecentsBtn.addEventListener('click', () => {
          DT.storage.clearRecents();
          DT.toast.info('Cleared recent tools history');
        });
      }

      // 6. Search Inputs (Dashboard & Topbar)
      const searchInputs = document.querySelectorAll('.tool-search-input');
      searchInputs.forEach(input => {
        input.addEventListener('input', DT.debounce((e) => {
          this.searchQuery = e.target.value;
          // Keep all search inputs in sync
          searchInputs.forEach(si => {
            if (si !== input) si.value = this.searchQuery;
          });
          // If not on dashboard, redirect to dashboard to see results
          if (this.searchQuery.trim() && this.currentRoute !== 'dashboard') {
            window.location.hash = '#dashboard';
          }
          this.renderAllToolsGrid();
        }, 200));
      });

      // 7. Clear Search Button
      const clearSearchBtn = document.getElementById('btn-clear-search');
      if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
          this.searchQuery = '';
          searchInputs.forEach(si => si.value = '');
          this.renderAllToolsGrid();
        });
      }

      // 8. Category Filter Pills
      document.querySelectorAll('.category-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.category-filter-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.activeCategory = btn.getAttribute('data-cat') || 'all';
          this.renderAllToolsGrid();
        });
      });

      // 9. Mobile Sidebar Drawer & Backdrop
      const hamburgerBtn = document.getElementById('hamburger-btn');
      const closeSidebarBtn = document.getElementById('sidebar-close-btn');
      const sidebar = document.getElementById('app-sidebar');
      const backdrop = document.getElementById('sidebar-backdrop');

      const toggleMobileSidebar = (open) => {
        if (!sidebar) return;
        if (open) {
          sidebar.classList.add('open');
          if (backdrop) backdrop.classList.add('visible');
        } else {
          sidebar.classList.remove('open');
          if (backdrop) backdrop.classList.remove('visible');
        }
      };

      if (hamburgerBtn) hamburgerBtn.addEventListener('click', () => toggleMobileSidebar(true));
      if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', () => toggleMobileSidebar(false));
      if (backdrop) backdrop.addEventListener('click', () => toggleMobileSidebar(false));

      // 10. Global Keyboard Shortcuts
      window.addEventListener('keydown', (e) => {
        // Ctrl+K or / focuses search input
        if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA')) {
          e.preventDefault();
          const firstSearch = document.querySelector('.tool-search-input');
          if (firstSearch) {
            firstSearch.focus();
            firstSearch.select();
          }
        }
        // Escape closes sidebar / clears search
        if (e.key === 'Escape') {
          toggleMobileSidebar(false);
        }
      });

      // 11. Tool Header Favorite button
      const toolHeaderFav = document.getElementById('tool-header-fav-btn');
      if (toolHeaderFav) {
        toolHeaderFav.addEventListener('click', () => {
          if (this.currentRoute !== 'dashboard') {
            const isNowFav = DT.storage.toggleFavorite(this.currentRoute);
            DT.toast.info(isNowFav ? 'Added to favourites' : 'Removed from favourites');
          }
        });
      }
    }
  };

  // Auto-init on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => DT.app.init());
  } else {
    DT.app.init();
  }

})(window.DevToolbox);
