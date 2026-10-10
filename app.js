/**
 * San Andreas Penal Code Application Logic
 * IME RolePlay / MotionLife RolePlay Edition
 */

(function () {
  'use strict';

  // --- APPLICATION STATE ---
  const state = {
    lang: localStorage.getItem('sapc_lang') || 'id', // 'id' or 'en'
    theme: localStorage.getItem('sapc_theme') || 'dark',
    viewMode: localStorage.getItem('sapc_view_mode') || 'grid', // 'grid' or 'table'
    activeTab: 'tab-articles',
    filterCategory: 'all', // 'all', 'Felony', 'Misdemeanor', 'Infraction'
    filterTitle: 'all', // 'all' or title number (0-9)
    searchQuery: '',
    docket: JSON.parse(localStorage.getItem('sapc_docket') || '[]'),
    docketMeta: {
      suspect: '',
      officer: '',
      gangEnhancement: false,
      repeatOffender: false,
      resistingAggravator: false,
      pleaDeal: false
    },
    activeModalArticle: null
  };

  // Translations dictionary for UI
  const i18n = {
    id: {
      stateTitle: "STATE OF SAN ANDREAS",
      deptTitle: "DEPARTMENT OF JUSTICE & LAW ENFORCEMENT",
      heroTitle: "San Andreas Penal Code",
      heroSubtitle: "Database Hukum Pidana & Kalkulator Dakwaan Resmi untuk IME & MotionLife RolePlay.",
      totalArticles: "Total Pasal",
      felonies: "Kejahatan Berat (Felony)",
      misdemeanors: "Pelanggaran Sedang (Misdemeanor)",
      infractions: "Pelanggaran Ringan (Infraction)",
      tabArticles: "Daftar Pasal (Penal Articles)",
      tabCalculator: "Kalkulator Dakwaan (MDT)",
      tabChapters: "Definisi & Doktrin (Bab 1-9)",
      tabWeapons: "Klasifikasi Senjata",
      tabProcedures: "SOP & Prosedur (Title 10-12)",
      searchPlaceholder: "Cari nomor pasal, nama kejahatan, kata kunci, denda...",
      allCategories: "Semua Kategori",
      allTitles: "Semua Bab (Title 0-9)",
      monthsSuffix: "Bulan",
      courtVerdict: "Putusan Pengadilan",
      specialSentence: "Hukuman Khusus / Pengadilan",
      addDocket: "Tambah Dakwaan",
      added: "Ditambahkan",
      viewDetails: "Detail",
      copyCitation: "Salin Kutipan",
      docketTitle: "MDT Arrest Docket / Kalkulator Dakwaan",
      suspectNameLabel: "Nama Tersangka",
      officerSignLabel: "Petugas / Call Sign",
      noCharges: "Belum ada pasal dakwaan yang dipilih.",
      noChargesHint: "Klik tombol '+ Tambah Dakwaan' pada pasal di daftar untuk mulai menghitung.",
      modifiersTitle: "Faktor Pemberat & Pengurang (Modifiers)",
      modGang: "Keterlibatan Geng (+15 Bulan, +$20,000)",
      modRepeat: "Pelaku Berulang (+25% Penjara & Denda)",
      modResisting: "Melawan Petugas / Resisting (+10 Bulan, +$15,000)",
      modPlea: "Plea Deal / Mengaku Bersalah (-25% Penjara)",
      totalPrisonTime: "Total Kurungan Penjara",
      totalFines: "Total Denda",
      copyMdtReport: "Salin Laporan MDT (Discord)",
      clearDocket: "Kosongkan Semua Dakwaan",
      courtNotice: "Perhatian: Terdapat dakwaan dengan ancaman Hukuman Mati atau Sidang Pengadilan (HUT).",
      detailsTitle: "Informasi Lengkap Pasal",
      categoryLabel: "Klasifikasi Hukum",
      statutoryPenalty: "Sanksi Berdasarkan Undang-Undang",
      fullDescription: "Deskripsi Lengkap Pelanggaran",
      close: "Tutup",
      copiedToast: "Kutipan berhasil disalin ke clipboard!",
      reportCopiedToast: "Laporan MDT berhasil disalin ke format Discord!",
      clearedToast: "Docket dakwaan telah dikosongkan.",
      addedToast: "Pasal ditambahkan ke kalkulator dakwaan."
    },
    en: {
      stateTitle: "STATE OF SAN ANDREAS",
      deptTitle: "DEPARTMENT OF JUSTICE & LAW ENFORCEMENT",
      heroTitle: "San Andreas Penal Code",
      heroSubtitle: "Official Penal Code Database & Charge Calculator for IME & MotionLife RolePlay.",
      totalArticles: "Total Articles",
      felonies: "Felonies",
      misdemeanors: "Misdemeanors",
      infractions: "Infractions",
      tabArticles: "Penal Articles",
      tabCalculator: "MDT Charge Calculator",
      tabChapters: "Definitions & Doctrines (Ch 1-9)",
      tabWeapons: "Weapon Classifications",
      tabProcedures: "SOP & Procedures (Title 10-12)",
      searchPlaceholder: "Search article code, crime title, keywords, fines...",
      allCategories: "All Categories",
      allTitles: "All Titles (Title 0-9)",
      monthsSuffix: "Months",
      courtVerdict: "Court Verdict",
      specialSentence: "Special Sentence / Court Case",
      addDocket: "Add Charge",
      added: "Added",
      viewDetails: "Details",
      copyCitation: "Copy Citation",
      docketTitle: "MDT Arrest Docket / Charge Calculator",
      suspectNameLabel: "Suspect Name",
      officerSignLabel: "Arresting Officer / Call Sign",
      noCharges: "No charges selected yet.",
      noChargesHint: "Click '+ Add Charge' on any penal article to begin calculating.",
      modifiersTitle: "Sentencing Modifiers & Enhancements",
      modGang: "Gang Enhancement (+15 Months, +$20,000)",
      modRepeat: "Repeat Offender (+25% Jail & Fine)",
      modResisting: "Resisting / Aggravated (+10 Months, +$15,000)",
      modPlea: "Plea Bargain (-25% Jail Time)",
      totalPrisonTime: "Total Prison Time",
      totalFines: "Total Fines",
      copyMdtReport: "Copy MDT Report (Discord)",
      clearDocket: "Clear All Charges",
      courtNotice: "Notice: Contains charges requiring Hold Until Trial (HUT) or Court Verdict.",
      detailsTitle: "Statutory Article Details",
      categoryLabel: "Legal Classification",
      statutoryPenalty: "Statutory Penalty Provision",
      fullDescription: "Full Offense Description",
      close: "Close",
      copiedToast: "Citation copied to clipboard!",
      reportCopiedToast: "MDT report copied in Discord format!",
      clearedToast: "Arrest docket cleared.",
      addedToast: "Charge added to docket."
    }
  };

  // Helper function to get text based on current language
  function t(key) {
    return (i18n[state.lang] && i18n[state.lang][key]) || key;
  }

  // --- INITIALIZATION ---
  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(state.theme);
    updateLanguageTexts();
    renderStats();
    renderSidebarNav();
    renderArticles();
    renderChapters();
    renderWeapons();
    renderProcedures();
    renderDocketUI();
    setupEventListeners();
  });

  // --- EVENT LISTENERS ---
  function setupEventListeners() {
    // Language Toggle
    const btnLang = document.getElementById('btn-lang-toggle');
    if (btnLang) {
      btnLang.addEventListener('click', () => {
        state.lang = state.lang === 'id' ? 'en' : 'id';
        localStorage.setItem('sapc_lang', state.lang);
        updateLanguageTexts();
        renderSidebarNav();
        renderArticles();
        renderChapters();
        renderWeapons();
        renderProcedures();
        renderDocketUI();
        if (state.activeModalArticle) {
          openArticleModal(state.activeModalArticle);
        }
      });
    }

    // Theme Toggle
    const btnTheme = document.getElementById('btn-theme-toggle');
    if (btnTheme) {
      btnTheme.addEventListener('click', () => {
        state.theme = state.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('sapc_theme', state.theme);
        applyTheme(state.theme);
      });
    }

    // View Mode Toggle (Grid vs Table)
    const btnViewGrid = document.getElementById('btn-view-grid');
    const btnViewTable = document.getElementById('btn-view-table');
    if (btnViewGrid && btnViewTable) {
      btnViewGrid.addEventListener('click', () => {
        state.viewMode = 'grid';
        localStorage.setItem('sapc_view_mode', 'grid');
        btnViewGrid.classList.add('active');
        btnViewTable.classList.remove('active');
        renderArticles();
      });
      btnViewTable.addEventListener('click', () => {
        state.viewMode = 'table';
        localStorage.setItem('sapc_view_mode', 'table');
        btnViewTable.classList.add('active');
        btnViewGrid.classList.remove('active');
        renderArticles();
      });
    }

    // Search Box
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value.toLowerCase().trim();
        renderArticles();
      });
    }

    // Category Badges
    document.querySelectorAll('.filter-badge-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-badge-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.filterCategory = btn.getAttribute('data-cat');
        renderArticles();
      });
    });

    // Title Select Dropdown
    const selectTitle = document.getElementById('select-title-filter');
    if (selectTitle) {
      selectTitle.addEventListener('change', (e) => {
        state.filterTitle = e.target.value;
        // Also update sidebar active state
        document.querySelectorAll('.title-nav-btn').forEach(b => {
          b.classList.toggle('active', b.getAttribute('data-title') === state.filterTitle);
        });
        renderArticles();
      });
    }

    // Navigation Tabs (Articles, Calculator, Chapters, Weapons, Procedures)
    document.querySelectorAll('.nav-tab-item').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.nav-tab-item').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const targetId = tab.getAttribute('data-tab');
        const targetPane = document.getElementById(targetId);
        if (targetPane) targetPane.classList.add('active');
        state.activeTab = targetId;

        // If user clicks Calculator tab, open drawer or scroll to it
        if (targetId === 'tab-calculator') {
          openDocketDrawer();
        }
      });
    });

    // Drawer Open / Close
    const btnOpenDocket = document.getElementById('btn-open-docket');
    const btnCloseDocket = document.getElementById('btn-close-docket');
    const drawerOverlay = document.getElementById('calculator-drawer-overlay');
    if (btnOpenDocket) {
      btnOpenDocket.addEventListener('click', openDocketDrawer);
    }
    if (btnCloseDocket && drawerOverlay) {
      btnCloseDocket.addEventListener('click', closeDocketDrawer);
      drawerOverlay.addEventListener('click', (e) => {
        if (e.target === drawerOverlay) closeDocketDrawer();
      });
    }

    // Modifiers Checkboxes
    ['mod-gang', 'mod-repeat', 'mod-resisting', 'mod-plea'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('change', () => {
          state.docketMeta.gangEnhancement = document.getElementById('mod-gang').checked;
          state.docketMeta.repeatOffender = document.getElementById('mod-repeat').checked;
          state.docketMeta.resistingAggravator = document.getElementById('mod-resisting').checked;
          state.docketMeta.pleaDeal = document.getElementById('mod-plea').checked;
          renderDocketUI();
        });
      }
    });

    // Suspect & Officer Inputs
    const suspectInput = document.getElementById('docket-suspect-name');
    const officerInput = document.getElementById('docket-officer-sign');
    if (suspectInput) {
      suspectInput.addEventListener('input', (e) => { state.docketMeta.suspect = e.target.value; });
    }
    if (officerInput) {
      officerInput.addEventListener('input', (e) => { state.docketMeta.officer = e.target.value; });
    }

    // Clear Docket Button
    const btnClearDocket = document.getElementById('btn-clear-docket');
    if (btnClearDocket) {
      btnClearDocket.addEventListener('click', () => {
        if (confirm(state.lang === 'id' ? 'Apakah Anda yakin ingin mengosongkan seluruh daftar dakwaan?' : 'Are you sure you want to clear all charges?')) {
          state.docket = [];
          localStorage.setItem('sapc_docket', '[]');
          renderDocketUI();
          renderArticles();
          showToast(t('clearedToast'));
        }
      });
    }

    // Copy MDT Report Button
    const btnCopyReport = document.getElementById('btn-copy-mdt-report');
    if (btnCopyReport) {
      btnCopyReport.addEventListener('click', copyDiscordReport);
    }

    // Modal Close
    const btnCloseModal = document.getElementById('btn-close-modal');
    const modalOverlay = document.getElementById('article-detail-modal');
    if (btnCloseModal && modalOverlay) {
      btnCloseModal.addEventListener('click', closeModal);
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
      });
    }

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && document.activeElement.tagName !== 'INPUT')) {
        e.preventDefault();
        const searchBox = document.getElementById('search-input');
        if (searchBox) {
          searchBox.focus();
          searchBox.select();
        }
      } else if (e.key === 'Escape') {
        closeModal();
        closeDocketDrawer();
      }
    });
  }

  // --- THEME MANAGEMENT ---
  function applyTheme(theme) {
    if (theme === 'light') {
      document.body.classList.add('theme-light');
      const icon = document.getElementById('theme-icon');
      if (icon) icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>'; // moon
    } else {
      document.body.classList.remove('theme-light');
      const icon = document.getElementById('theme-icon');
      if (icon) icon.innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>'; // sun
    }
  }

  // --- TEXT / I18N UPDATE ---
  function updateLanguageTexts() {
    const isId = state.lang === 'id';
    document.getElementById('brand-dept-text').textContent = isId ? 'DEPARTEMEN KEHAKIMAN & KEPOLISIAN' : 'DEPARTMENT OF JUSTICE & LAW ENFORCEMENT';
    document.getElementById('hero-title-text').textContent = t('heroTitle');
    document.getElementById('hero-subtitle-text').textContent = t('heroSubtitle');
    document.getElementById('search-input').placeholder = t('searchPlaceholder');

    // Stats Labels
    document.getElementById('stat-label-total').textContent = t('totalArticles');
    document.getElementById('stat-label-felony').textContent = t('felonies');
    document.getElementById('stat-label-misdemeanor').textContent = t('misdemeanors');
    document.getElementById('stat-label-infraction').textContent = t('infractions');

    // Navigation Tabs
    document.getElementById('tab-btn-articles').innerHTML = `<span>📜</span> ${t('tabArticles')}`;
    document.getElementById('tab-btn-calculator').innerHTML = `<span>⚖️</span> ${t('tabCalculator')}`;
    document.getElementById('tab-btn-chapters').innerHTML = `<span>📖</span> ${t('tabChapters')}`;
    document.getElementById('tab-btn-weapons').innerHTML = `<span>🔫</span> ${t('tabWeapons')}`;
    document.getElementById('tab-btn-procedures').innerHTML = `<span>👮</span> ${t('tabProcedures')}`;

    // Filter Buttons
    document.getElementById('filter-btn-all').textContent = isId ? 'Semua Kategori' : 'All Categories';
    document.getElementById('filter-btn-felony').textContent = 'Felony';
    document.getElementById('filter-btn-misdemeanor').textContent = 'Misdemeanor';
    document.getElementById('filter-btn-infraction').textContent = 'Infraction';

    // Lang toggle button label
    const langBtnText = document.getElementById('lang-btn-text');
    if (langBtnText) {
      langBtnText.textContent = isId ? '🇮🇩 IDN' : '🇺🇸 ENG';
    }

    // Docket Drawer Texts
    document.getElementById('drawer-title-text').textContent = t('docketTitle');
    document.getElementById('label-suspect-name').textContent = t('suspectNameLabel');
    document.getElementById('label-officer-sign').textContent = t('officerSignLabel');
    document.getElementById('modifiers-title-text').textContent = t('modifiersTitle');
    document.getElementById('label-mod-gang').textContent = t('modGang');
    document.getElementById('label-mod-repeat').textContent = t('modRepeat');
    document.getElementById('label-mod-resisting').textContent = t('modResisting');
    document.getElementById('label-mod-plea').textContent = t('modPlea');
    document.getElementById('summary-label-time').textContent = t('totalPrisonTime');
    document.getElementById('summary-label-fine').textContent = t('totalFines');
    document.getElementById('btn-copy-mdt-report').innerHTML = `📋 ${t('copyMdtReport')}`;
    document.getElementById('btn-clear-docket').textContent = t('clearDocket');

    // Populate Select Title Filter
    const selectTitle = document.getElementById('select-title-filter');
    if (selectTitle && window.PENAL_CODE_DATA) {
      const currentVal = selectTitle.value;
      selectTitle.innerHTML = `<option value="all">${t('allTitles')}</option>`;
      window.PENAL_CODE_DATA.titles_meta.forEach(tm => {
        const titleName = isId ? tm.name_id : tm.name_en;
        const opt = document.createElement('option');
        opt.value = tm.num;
        opt.textContent = `${tm.code_prefix} ${titleName}`;
        selectTitle.appendChild(opt);
      });
      selectTitle.value = currentVal || 'all';
    }
  }

  // --- STATS ---
  function renderStats() {
    if (!window.PENAL_CODE_DATA) return;
    const articles = window.PENAL_CODE_DATA.articles;
    document.getElementById('stat-val-total').textContent = articles.length;
    document.getElementById('stat-val-felony').textContent = articles.filter(a => a.category === 'Felony').length;
    document.getElementById('stat-val-misdemeanor').textContent = articles.filter(a => a.category === 'Misdemeanor').length;
    document.getElementById('stat-val-infraction').textContent = articles.filter(a => a.category === 'Infraction').length;
  }

  // --- SIDEBAR NAV ---
  function renderSidebarNav() {
    const list = document.getElementById('title-nav-list');
    if (!list || !window.PENAL_CODE_DATA) return;
    const isId = state.lang === 'id';
    list.innerHTML = '';

    // "All Titles" item
    const allItem = document.createElement('li');
    allItem.innerHTML = `
      <button class="title-nav-btn ${state.filterTitle === 'all' ? 'active' : ''}" data-title="all">
        <span>${isId ? 'Semua Bab (Titles)' : 'All Titles'}</span>
        <span class="title-nav-count">${window.PENAL_CODE_DATA.articles.length}</span>
      </button>
    `;
    list.appendChild(allItem);

    window.PENAL_CODE_DATA.titles_meta.forEach(tm => {
      const count = window.PENAL_CODE_DATA.articles.filter(a => a.title_num === tm.num).length;
      const titleName = isId ? tm.name_id : tm.name_en;
      const shortName = titleName.split('.')[1] || titleName;
      const li = document.createElement('li');
      li.innerHTML = `
        <button class="title-nav-btn ${state.filterTitle == tm.num ? 'active' : ''}" data-title="${tm.num}">
          <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${titleName}">
            <strong style="color:var(--accent-primary); font-family:var(--font-mono);">${tm.code_prefix}</strong> ${shortName}
          </span>
          <span class="title-nav-count">${count}</span>
        </button>
      `;
      list.appendChild(li);
    });

    // Add click listeners to sidebar buttons
    list.querySelectorAll('.title-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.getAttribute('data-title');
        state.filterTitle = val;
        list.querySelectorAll('.title-nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const sel = document.getElementById('select-title-filter');
        if (sel) sel.value = val;
        renderArticles();
      });
    });
  }

  // --- ARTICLES RENDERING ---
  function renderArticles() {
    const container = document.getElementById('articles-render-container');
    if (!container || !window.PENAL_CODE_DATA) return;
    const isId = state.lang === 'id';

    // Filter articles
    let filtered = window.PENAL_CODE_DATA.articles.filter(article => {
      // Title Filter
      if (state.filterTitle !== 'all' && article.title_num != state.filterTitle) {
        return false;
      }
      // Category Filter
      if (state.filterCategory !== 'all' && article.category !== state.filterCategory) {
        return false;
      }
      // Search Query
      if (state.searchQuery) {
        const q = state.searchQuery;
        const inCode = article.code.toLowerCase().includes(q);
        const inTitleEn = article.title_en.toLowerCase().includes(q);
        const inTitleId = article.title_id.toLowerCase().includes(q);
        const inDescEn = article.desc_en.toLowerCase().includes(q);
        const inDescId = article.desc_id.toLowerCase().includes(q);
        const inPenEn = article.penalty_en.toLowerCase().includes(q);
        const inPenId = article.penalty_id.toLowerCase().includes(q);
        if (!inCode && !inTitleEn && !inTitleId && !inDescEn && !inDescId && !inPenEn && !inPenId) {
          return false;
        }
      }
      return true;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding:4rem 1rem; color:var(--text-dim); background:var(--bg-card); border-radius:var(--radius-lg); border:1px dashed var(--border-subtle);">
          <div style="font-size:2.5rem; margin-bottom:1rem;">🔍</div>
          <h3 style="font-size:1.2rem; color:var(--text-main); font-weight:800;">
            ${isId ? 'Tidak ada pasal yang cocok dengan pencarian' : 'No articles match your search criteria'}
          </h3>
          <p style="margin-top:0.5rem; font-size:0.9rem;">
            ${isId ? 'Coba ganti kata kunci pencarian atau ubah filter kategori/bab.' : 'Try adjusting your search terms or filter selection.'}
          </p>
        </div>
      `;
      return;
    }

    // Group articles by Title
    const grouped = {};
    filtered.forEach(art => {
      if (!grouped[art.title_num]) grouped[art.title_num] = [];
      grouped[art.title_num].push(art);
    });

    container.innerHTML = '';

    // Render grouped clusters
    Object.keys(grouped).sort((a,b) => Number(a) - Number(b)).forEach(titleNum => {
      const titleMeta = window.PENAL_CODE_DATA.titles_meta.find(t => t.num == titleNum);
      const titleHeaderName = titleMeta ? (isId ? titleMeta.name_id : titleMeta.name_en) : `TITLE ${titleNum}`;
      const titleHeaderDesc = titleMeta ? (isId ? titleMeta.desc_id : titleMeta.desc_en) : '';

      const clusterWrap = document.createElement('div');
      clusterWrap.className = 'title-cluster-block';

      // Cluster Header
      clusterWrap.innerHTML = `
        <div class="title-cluster-header">
          <div class="cluster-title-text">${titleHeaderName}</div>
          <div class="cluster-desc-text">${titleHeaderDesc}</div>
        </div>
      `;

      if (state.viewMode === 'table') {
        // Table View Mode
        const tableWrap = document.createElement('div');
        tableWrap.className = 'articles-table-wrapper';
        tableWrap.innerHTML = `
          <table class="articles-table">
            <thead>
              <tr>
                <th style="width: 100px;">Code</th>
                <th>${isId ? 'Nama Pelanggaran' : 'Crime / Offense'}</th>
                <th style="width: 130px;">Kategori</th>
                <th style="width: 120px;">Kurungan</th>
                <th style="width: 120px;">Denda</th>
                <th style="width: 150px; text-align: right;">Aksi</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        `;
        const tbody = tableWrap.querySelector('tbody');
        grouped[titleNum].forEach(art => {
          const row = renderTableRow(art);
          tbody.appendChild(row);
        });
        clusterWrap.appendChild(tableWrap);
      } else {
        // Grid View Mode
        const grid = document.createElement('div');
        grid.className = 'articles-grid';
        grouped[titleNum].forEach(art => {
          const card = renderArticleCard(art);
          grid.appendChild(card);
        });
        clusterWrap.appendChild(grid);
      }

      container.appendChild(clusterWrap);
    });
  }

  // --- RENDER ARTICLE CARD ---
  function renderArticleCard(article) {
    const isId = state.lang === 'id';
    const title = isId ? article.title_id : article.title_en;
    const desc = isId ? article.desc_id : article.desc_en;
    const catClass = article.category.toLowerCase();

    // Check if in docket
    const inDocket = state.docket.find(d => d.code === article.code);

    const card = document.createElement('div');
    card.className = 'article-card';
    card.id = `art-card-${article.code.replace(/[\(\)]/g, '')}`;

    let penaltyChips = '';
    if (article.is_special) {
      penaltyChips = `
        <span class="penalty-chip special">
          <span>⚖️</span> ${isId ? 'Sidang / Hukuman Mati' : 'Court Verdict / Death'}
        </span>
      `;
    } else {
      if (article.months > 0) {
        penaltyChips += `
          <span class="penalty-chip time">
            <span>⏱️</span> ${article.months} ${t('monthsSuffix')}
          </span>
        `;
      }
      if (article.fine > 0) {
        penaltyChips += `
          <span class="penalty-chip fine">
            <span>💵</span> $${article.fine.toLocaleString()}
          </span>
        `;
      }
    }

    card.innerHTML = `
      <div>
        <div class="card-top-meta">
          <span class="article-code-pill">${article.code}</span>
          <span class="category-tag ${catClass}">${article.category}</span>
        </div>
        <h4 class="article-title-heading">${title}</h4>
        <p class="article-desc-preview">${desc || article.penalty_en}</p>
      </div>

      <div>
        <div class="penalty-chips-row">
          ${penaltyChips}
        </div>
        <div class="card-actions-row">
          <button class="btn-add-ticket ${inDocket ? 'active' : ''}" data-code="${article.code}">
            <span>${inDocket ? '✓' : '+'}</span>
            <span>${inDocket ? `${t('added')} (${inDocket.count})` : t('addDocket')}</span>
          </button>
          <button class="btn-card-icon btn-detail" title="${t('viewDetails')}" data-code="${article.code}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
          <button class="btn-card-icon btn-copy-cite" title="${t('copyCitation')}" data-code="${article.code}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          </button>
        </div>
      </div>
    `;

    // Add Ticket Handler
    card.querySelector('.btn-add-ticket').addEventListener('click', () => {
      addToDocket(article.code);
    });

    // Detail Handler
    card.querySelector('.btn-detail').addEventListener('click', () => {
      openArticleModal(article);
    });

    // Copy Citation Handler
    card.querySelector('.btn-copy-cite').addEventListener('click', () => {
      copyCitationToClipboard(article);
    });

    return card;
  }

  // --- RENDER TABLE ROW ---
  function renderTableRow(article) {
    const isId = state.lang === 'id';
    const title = isId ? article.title_id : article.title_en;
    const catClass = article.category.toLowerCase();
    const inDocket = state.docket.find(d => d.code === article.code);

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="article-code-pill" style="font-size:0.75rem;">${article.code}</span></td>
      <td>
        <div style="font-weight:700;">${title}</div>
        <div style="font-size:0.78rem; color:var(--text-muted); max-width:350px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
          ${(isId ? article.desc_id : article.desc_en) || ''}
        </div>
      </td>
      <td><span class="category-tag ${catClass}">${article.category}</span></td>
      <td><span style="font-family:var(--font-mono); font-weight:700; color:#38bdf8;">${article.is_special ? 'Sidang / HUT' : (article.months ? `${article.months} Mo` : '-')}</span></td>
      <td><span style="font-family:var(--font-mono); font-weight:700; color:#34d399;">${article.fine ? `$${article.fine.toLocaleString()}` : '-'}</span></td>
      <td style="text-align: right;">
        <button class="btn-nav btn-add-table-ticket" data-code="${article.code}" style="padding:0.35rem 0.65rem; font-size:0.75rem;">
          ${inDocket ? `✓ (${inDocket.count})` : '+ Add'}
        </button>
        <button class="btn-card-icon btn-table-detail" data-code="${article.code}" style="display:inline-flex; width:28px; height:28px; margin-left:4px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </button>
      </td>
    `;

    tr.querySelector('.btn-add-table-ticket').addEventListener('click', () => {
      addToDocket(article.code);
    });
    tr.querySelector('.btn-table-detail').addEventListener('click', () => {
      openArticleModal(article);
    });

    return tr;
  }

  // --- ARREST CALCULATOR / DOCKET LOGIC ---
  function addToDocket(code) {
    const existing = state.docket.find(d => d.code === code);
    if (existing) {
      existing.count += 1;
    } else {
      state.docket.push({ code, count: 1 });
    }
    localStorage.setItem('sapc_docket', JSON.stringify(state.docket));
    renderDocketUI();
    renderArticles();
    showToast(t('addedToast'));
  }

  function changeDocketCount(code, delta) {
    const idx = state.docket.findIndex(d => d.code === code);
    if (idx === -1) return;
    state.docket[idx].count += delta;
    if (state.docket[idx].count <= 0) {
      state.docket.splice(idx, 1);
    }
    localStorage.setItem('sapc_docket', JSON.stringify(state.docket));
    renderDocketUI();
    renderArticles();
  }

  function renderDocketUI() {
    // Update badge count in navbar
    const badge = document.getElementById('cart-count-badge');
    const totalChargesCount = state.docket.reduce((acc, curr) => acc + curr.count, 0);
    if (badge) {
      badge.textContent = totalChargesCount;
      badge.style.display = totalChargesCount > 0 ? 'inline-block' : 'none';
    }

    const container = document.getElementById('charges-container');
    if (!container || !window.PENAL_CODE_DATA) return;
    const isId = state.lang === 'id';

    if (state.docket.length === 0) {
      container.innerHTML = `
        <div class="empty-charges-state">
          <div style="font-size:2rem;">📋</div>
          <div style="font-weight:700; color:var(--text-main); margin-top:0.5rem;">${t('noCharges')}</div>
          <p>${t('noChargesHint')}</p>
        </div>
      `;
      document.getElementById('summary-val-time').textContent = `0 ${t('monthsSuffix')}`;
      document.getElementById('summary-val-fine').textContent = '$0';
      document.getElementById('court-alert-banner').style.display = 'none';
      return;
    }

    container.innerHTML = '';
    let totalMonths = 0;
    let totalFine = 0;
    let hasCourtVerdict = false;

    state.docket.forEach(item => {
      const art = window.PENAL_CODE_DATA.articles.find(a => a.code === item.code);
      if (!art) return;

      const title = isId ? art.title_id : art.title_en;
      const subtotalMonths = (art.months || 0) * item.count;
      const subtotalFine = (art.fine || 0) * item.count;

      totalMonths += subtotalMonths;
      totalFine += subtotalFine;
      if (art.is_special) hasCourtVerdict = true;

      const chargeRow = document.createElement('div');
      chargeRow.className = 'docket-charge-item';
      chargeRow.innerHTML = `
        <div class="charge-details">
          <div class="charge-title-row">
            <span class="charge-code-mono">${art.code}</span>
            <span class="charge-name-text">${title}</span>
          </div>
          <div class="charge-penalties-small">
            ${art.is_special ? '⚖️ Sidang Pengadilan / Death' : `⏱️ ${art.months} Mo | 💵 $${art.fine.toLocaleString()}`}
          </div>
        </div>

        <div class="charge-qty-controls">
          <button class="btn-qty btn-minus" data-code="${art.code}">-</button>
          <span class="qty-display">${item.count}</span>
          <button class="btn-qty btn-plus" data-code="${art.code}">+</button>
          <button class="btn-remove-charge" data-code="${art.code}" title="Hapus">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      `;

      chargeRow.querySelector('.btn-minus').addEventListener('click', () => changeDocketCount(art.code, -1));
      chargeRow.querySelector('.btn-plus').addEventListener('click', () => changeDocketCount(art.code, 1));
      chargeRow.querySelector('.btn-remove-charge').addEventListener('click', () => changeDocketCount(art.code, -item.count));

      container.appendChild(chargeRow);
    });

    // Apply Modifiers
    if (state.docketMeta.gangEnhancement) {
      totalMonths += 15;
      totalFine += 20000;
    }
    if (state.docketMeta.resistingAggravator) {
      totalMonths += 10;
      totalFine += 15000;
    }
    if (state.docketMeta.repeatOffender) {
      totalMonths = Math.round(totalMonths * 1.25);
      totalFine = Math.round(totalFine * 1.25);
    }
    if (state.docketMeta.pleaDeal) {
      totalMonths = Math.round(totalMonths * 0.75);
    }

    // Update Summary Values
    document.getElementById('summary-val-time').textContent = `${totalMonths} ${t('monthsSuffix')}`;
    document.getElementById('summary-val-fine').textContent = `$${totalFine.toLocaleString()}`;

    // Court Alert Banner
    const courtBanner = document.getElementById('court-alert-banner');
    if (courtBanner) {
      courtBanner.style.display = hasCourtVerdict ? 'flex' : 'none';
      courtBanner.innerHTML = `⚠️ ${t('courtNotice')}`;
    }
  }

  function openDocketDrawer() {
    const overlay = document.getElementById('calculator-drawer-overlay');
    if (overlay) overlay.classList.add('open');
  }

  function closeDocketDrawer() {
    const overlay = document.getElementById('calculator-drawer-overlay');
    if (overlay) overlay.classList.remove('open');
  }

  // Copy Discord / MDT Formatted Report
  function copyDiscordReport() {
    if (state.docket.length === 0) {
      alert(state.lang === 'id' ? 'Silakan pilih minimal satu pasal dakwaan.' : 'Please select at least one charge.');
      return;
    }

    const isId = state.lang === 'id';
    const suspect = state.docketMeta.suspect || 'UNKNOWN / TIDAK DIKETAHUI';
    const officer = state.docketMeta.officer || 'ON-DUTY OFFICER';
    const dateStr = new Date().toLocaleString(isId ? 'id-ID' : 'en-US');

    let totalMonths = 0;
    let totalFine = 0;
    let hasCourt = false;

    let chargesList = '';
    state.docket.forEach((item, idx) => {
      const art = window.PENAL_CODE_DATA.articles.find(a => a.code === item.code);
      if (!art) return;
      const title = isId ? art.title_id : art.title_en;
      const subMo = (art.months || 0) * item.count;
      const subFi = (art.fine || 0) * item.count;
      totalMonths += subMo;
      totalFine += subFi;
      if (art.is_special) hasCourt = true;

      chargesList += `${idx + 1}. **${art.code} ${title}** (x${item.count}) [${art.category}]\n   ↳ *Hukuman:* ${art.is_special ? '⚖️ Court Verdict / HUT' : `${subMo} Bulan, Denda $${subFi.toLocaleString()}`}\n`;
    });

    let modLines = '';
    if (state.docketMeta.gangEnhancement) {
      totalMonths += 15; totalFine += 20000;
      modLines += `• + Gang Enhancement (+15 Bulan, +$20,000)\n`;
    }
    if (state.docketMeta.resistingAggravator) {
      totalMonths += 10; totalFine += 15000;
      modLines += `• + Resisting / Aggravated (+10 Bulan, +$15,000)\n`;
    }
    if (state.docketMeta.repeatOffender) {
      totalMonths = Math.round(totalMonths * 1.25);
      totalFine = Math.round(totalFine * 1.25);
      modLines += `• + Repeat Offender (+25% Multiplier)\n`;
    }
    if (state.docketMeta.pleaDeal) {
      totalMonths = Math.round(totalMonths * 0.75);
      modLines += `• - Plea Deal Discount (-25% Jail)\n`;
    }

    const reportText = 
`\`\`\`asciidoc
=== [ STATE OF SAN ANDREAS - ARREST & CHARGES REPORT ] ===
Petugas/Call Sign : ${officer}
Nama Tersangka    : ${suspect}
Waktu Booking     : ${dateStr}
Status            : ${hasCourt ? 'HOLD UNTIL TRIAL (HUT) / COURT VERDICT' : 'STANDARD INCARCERATION'}
\`\`\`
**DAFTAR DAKWAAN (CHARGES LIST):**
${chargesList}
${modLines ? `**FAKTOR PEMBERAT/PENGURANG:**\n${modLines}\n` : ''}
**TOTAL KALKULASI AKHIR:**
• **Total Kurungan Penjara:** \`${totalMonths} Bulan\`
• **Total Denda:** \`$${totalFine.toLocaleString()}\`
${hasCourt ? '\n⚠️ **PERHATIAN:** Tersangka dikenakan pasal dengan sanksi Sidang Pengadilan / Ancaman Hukuman Mati (Hold Until Trial)!' : ''}`;

    navigator.clipboard.writeText(reportText).then(() => {
      showToast(t('reportCopiedToast'));
    }).catch(err => {
      console.error(err);
      alert('Gagal menyalin otomatis. Silakan periksa izin browser.');
    });
  }

  // --- DETAIL MODAL ---
  function openArticleModal(article) {
    state.activeModalArticle = article;
    const modal = document.getElementById('article-detail-modal');
    if (!modal) return;
    const isId = state.lang === 'id';

    document.getElementById('modal-title-text').textContent = isId ? article.title_id : article.title_en;
    document.getElementById('modal-code-pill').textContent = article.code;
    const catTag = document.getElementById('modal-category-tag');
    catTag.className = `category-tag ${article.category.toLowerCase()}`;
    catTag.textContent = article.category;

    // Full Description
    document.getElementById('modal-desc-box').textContent = isId ? (article.desc_id || article.desc_en) : (article.desc_en || article.desc_id);

    // Penalty text
    const penaltyBox = document.getElementById('modal-penalty-box');
    penaltyBox.innerHTML = `
      <div style="font-family:var(--font-mono); font-weight:700; color:var(--text-main); font-size:0.9rem;">
        ${isId ? (article.penalty_id || article.penalty_en) : (article.penalty_en || article.penalty_id)}
      </div>
      <div style="display:flex; gap:0.75rem; margin-top:0.75rem;">
        ${article.is_special ? `<span class="penalty-chip special">⚖️ ${isId ? 'Putusan Pengadilan / Hukuman Mati' : 'Court Verdict / Death Sentence'}</span>` : ''}
        ${article.months > 0 ? `<span class="penalty-chip time">⏱️ ${article.months} ${t('monthsSuffix')}</span>` : ''}
        ${article.fine > 0 ? `<span class="penalty-chip fine">💵 $${article.fine.toLocaleString()}</span>` : ''}
      </div>
    `;

    // Modal action: Add to Docket button
    const btnModalAdd = document.getElementById('btn-modal-add-docket');
    btnModalAdd.onclick = () => {
      addToDocket(article.code);
      closeModal();
    };

    modal.classList.add('open');
  }

  function closeModal() {
    const modal = document.getElementById('article-detail-modal');
    if (modal) modal.classList.remove('open');
  }

  // Copy citation
  function copyCitationToClipboard(article) {
    const isId = state.lang === 'id';
    const text = `${article.code} ${isId ? article.title_id : article.title_en} [${article.category}]`;
    navigator.clipboard.writeText(text).then(() => {
      showToast(t('copiedToast'));
    });
  }

  // --- CHAPTERS RENDERING ---
  function renderChapters() {
    const container = document.getElementById('chapters-render-container');
    if (!container || !window.PENAL_CODE_DATA) return;
    const isId = state.lang === 'id';
    container.innerHTML = '';

    window.PENAL_CODE_DATA.chapters.forEach((ch, idx) => {
      const headerText = isId ? ch.header_id : ch.header_en;
      const lines = isId ? ch.lines_id : ch.lines_en;

      const card = document.createElement('div');
      card.className = 'chapter-card';
      card.innerHTML = `
        <div class="chapter-card-header" data-ch="${ch.id}">
          <div class="chapter-title-wrap">
            <span style="font-family:var(--font-mono); font-size:0.8rem; color:var(--accent-primary); font-weight:700;">#${idx}</span>
            <h3>${headerText}</h3>
          </div>
          <span class="chevron-icon">▼</span>
        </div>
        <div class="chapter-lines-content" id="content-${ch.id}" style="${idx === 0 || idx === 1 ? 'display:block;' : 'display:none;'}">
          ${lines.map(l => `<p>${l}</p>`).join('')}
        </div>
      `;

      card.querySelector('.chapter-card-header').addEventListener('click', () => {
        const content = card.querySelector('.chapter-lines-content');
        const isShown = content.style.display === 'block';
        content.style.display = isShown ? 'none' : 'block';
        card.querySelector('.chevron-icon').textContent = isShown ? '▼' : '▲';
      });

      container.appendChild(card);
    });
  }

  // --- WEAPONS RENDERING ---
  function renderWeapons() {
    const container = document.getElementById('weapons-render-container');
    if (!container || !window.PENAL_CODE_DATA) return;
    const isId = state.lang === 'id';
    container.innerHTML = '';

    const badgeClasses = {
      'Class 1': 'c1',
      'Class 2': 'c2',
      'Class 3': 'c3',
      'Government-Issue': 'cg'
    };

    window.PENAL_CODE_DATA.weapon_classes.forEach(wc => {
      const title = isId ? wc.title_id : wc.title_en;
      const desc = isId ? wc.desc_id : wc.desc_en;
      const legal = isId ? wc.legal_status_id : wc.legal_status_en;
      const badgeCls = badgeClasses[wc.class] || 'c1';

      const card = document.createElement('div');
      card.className = 'weapon-card';
      card.innerHTML = `
        <div class="weapon-class-header">
          <span class="weapon-class-badge ${badgeCls}">${wc.class}</span>
          <span style="font-size:0.75rem; color:var(--text-dim); text-transform:uppercase; font-weight:700;">Weapon Tier</span>
        </div>
        <div>
          <h3 style="font-size:1.25rem; font-weight:800; color:var(--text-main); margin-bottom:0.4rem;">${title}</h3>
          <p style="font-size:0.88rem; color:var(--text-muted); line-height:1.6;">${desc}</p>
        </div>
        <div style="background:var(--bg-surface); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
          <div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-dim); font-weight:800; margin-bottom:0.5rem;">
            ${isId ? 'Contoh Senjata di Lapangan:' : 'Registered Weapon Models:'}
          </div>
          <div class="weapon-examples-tag-group">
            ${wc.examples.map(ex => `<span class="weapon-tag">${ex}</span>`).join('')}
          </div>
        </div>
        <div style="background:rgba(56, 189, 248, 0.08); border-left:3px solid var(--accent-primary); padding:0.75rem 1rem; border-radius:0 var(--radius-sm) var(--radius-sm) 0; font-size:0.82rem; color:var(--text-main);">
          <strong>${isId ? 'Status Legalitas:' : 'Legal Status:'}</strong> ${legal}
        </div>
      `;
      container.appendChild(card);
    });
  }

  // --- PROCEDURES RENDERING (TITLE 10 - 12) ---
  function renderProcedures() {
    const container = document.getElementById('procedures-render-container');
    if (!container || !window.PENAL_CODE_DATA) return;
    const isId = state.lang === 'id';
    container.innerHTML = '';

    window.PENAL_CODE_DATA.special_titles.forEach(st => {
      const name = isId ? st.name_id : st.name_en;
      const rawContent = isId ? st.content_id : st.content_en;

      // Format line breaks
      const formattedLines = rawContent.splitlines ? rawContent.splitlines() : rawContent.split('\n');

      const card = document.createElement('div');
      card.className = 'chapter-card';
      card.style.marginBottom = '1.5rem';
      card.innerHTML = `
        <div class="chapter-card-header">
          <div class="chapter-title-wrap">
            <span style="font-family:var(--font-mono); font-size:0.8rem; color:var(--accent-primary); font-weight:700;">PROSEDUR #${st.num}</span>
            <h3>${name}</h3>
          </div>
        </div>
        <div class="chapter-lines-content" style="display:block;">
          ${formattedLines.map(line => {
            const l = line.trim();
            if (!l || l.startsWith('TITLE') || l.startsWith('___')) return '';
            if (l.endsWith(':')) {
              return `<h4 style="color:var(--accent-primary); margin-top:1rem; margin-bottom:0.35rem; font-size:1rem;">${l}</h4>`;
            }
            return `<p>${l}</p>`;
          }).filter(Boolean).join('')}
        </div>
      `;
      container.appendChild(card);
    });
  }

  // --- TOAST NOTIFICATIONS ---
  function showToast(message) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.innerHTML = `<span>✓</span> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

})();
