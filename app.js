// app.js - Batik Sejawat Brand Hub Core JS

async function loadSiteConfig() {
  try {
    const res = await fetch('data/site-config.json');
    return await res.json();
  } catch(e) {
    console.error('Failed to load site config', e);
    return { pages: [] };
  }
}

function buildNav(pages) {
  const nav = document.getElementById('nav');
  nav.innerHTML = '';
  pages.forEach(p => {
    const a = document.createElement('a');
    a.href = '#/' + p.id;
    a.textContent = p.title;
    a.id = 'nav-link-' + p.id;
    nav.appendChild(a);
  });
}

function updateNavActive(pageId) {
  document.querySelectorAll('.main-nav a').forEach(a => {
    a.classList.remove('active');
  });
  const activeLink = document.getElementById('nav-link-' + pageId);
  if (activeLink) activeLink.classList.add('active');
}

function parseHash() {
  const hash = location.hash || '#/brand-bible';
  // Remove leading '#' and optional '/'
  const clean = hash.replace(/^#\/?/, '');
  const parts = clean.split('/');
  return {
    pageId: parts[0] || 'brand-bible',
    anchorId: parts[1] || null
  };
}

async function loadPage(pageId, anchorId) {
  const app = document.getElementById('app');
  
  // If we are already on this page, just scroll to the anchor
  if (app.dataset.currentPage === pageId) {
    updateNavActive(pageId);
    if (anchorId) {
      scrollToAnchor(anchorId);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return;
  }
  
  // Start transition
  app.classList.add('loading');
  
  try {
    const res = await fetch('pages/' + pageId + '.html');
    if (!res.ok) {
      app.innerHTML = '<div class="error-page"><h2>Halaman tidak ditemukan</h2><p>Maaf, halaman yang Anda cari tidak tersedia.</p></div>';
      app.dataset.currentPage = '';
      app.classList.remove('loading');
      return;
    }
    
    const htmlText = await res.text();
    
    // Parse HTML using DOMParser to separate head/styles/body/scripts
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');
    
    // Extract styles and scripts
    const styles = Array.from(doc.querySelectorAll('style'));
    const scripts = Array.from(doc.querySelectorAll('script'));
    
    // Extract body content
    let bodyContent = '';
    const bodyNode = doc.querySelector('body');
    if (bodyNode) {
      bodyContent = bodyNode.innerHTML;
    } else {
      // Fallback if no body tag exists
      bodyContent = htmlText;
      bodyContent = bodyContent.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, '');
      bodyContent = bodyContent.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '');
    }
    
    // Wrap content inside a scoped page wrapper div
    const wrappedContent = `
      <div class="page-wrapper page-${pageId}">
        ${styles.map(s => s.outerHTML).join('\n')}
        ${bodyContent}
      </div>
    `;
    
    // Set HTML content
    app.innerHTML = wrappedContent;
    app.dataset.currentPage = pageId;
    
    // Highlight correct link in navigation
    updateNavActive(pageId);
    
    // Find and execute the scripts extracted
    executeScripts(app);
    
    // Run initialization for specific pages
    initPage(pageId);
    
    // Wait a brief moment for DOM render then scroll and fade-in
    setTimeout(() => {
      app.classList.remove('loading');
      if (anchorId) {
        scrollToAnchor(anchorId);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
    
  } catch(e) {
    app.innerHTML = '<div class="error-page"><h2>Gagal memuat halaman</h2><p>Terjadi kesalahan saat mengambil dokumen.</p></div>';
    console.error(e);
    app.dataset.currentPage = '';
    app.classList.remove('loading');
  }
}

function executeScripts(container) {
  const scripts = Array.from(container.querySelectorAll('script'));
  scripts.forEach(oldScript => {
    const newScript = document.createElement('script');
    // Copy all attributes (like src, type, etc)
    Array.from(oldScript.attributes).forEach(attr => {
      newScript.setAttribute(attr.name, attr.value);
    });
    // Copy text content
    newScript.textContent = oldScript.textContent;
    // Replace script to execute it
    oldScript.parentNode.replaceChild(newScript, oldScript);
  });
}

function scrollToAnchor(anchorId) {
  const element = document.getElementById(anchorId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    // Fallback: try to find by name attribute
    const nameElem = document.querySelector(`[name="${anchorId}"]`);
    if (nameElem) {
      nameElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

function initPage(pageId) {
  if (pageId === 'buyer-persona') {
    initBuyerPersona();
  }
}

function initBuyerPersona() {
  const ctx = document.getElementById('personaChart');
  if (!ctx) return;
  
  // Custom styled Chart.js using brand colors
  const data = {
    labels: ['Dokter Residen', 'Koas & Dokter Muda', 'Perawat & Bidan', 'Mahasiswa FK', 'Institusi'],
    datasets: [{
      label: 'Prioritas Engagement (%)',
      data: [85, 75, 70, 65, 60],
      backgroundColor: [
        'rgba(184, 146, 42, 0.85)',  // Accent Gold
        'rgba(29, 122, 106, 0.85)',  // Accent Teal
        'rgba(91, 63, 168, 0.85)',   // Accent Violet
        'rgba(45, 90, 39, 0.85)',    // Accent Forest
        'rgba(196, 68, 42, 0.85)'    // Accent Coral
      ],
      borderColor: [
        '#b8922a',
        '#1d7a6a',
        '#5b3fa8',
        '#2d5a27',
        '#c4442a'
      ],
      borderWidth: 1.5,
      borderRadius: 6
    }]
  };
  
  new Chart(ctx, {
    type: 'bar',
    data,
    options: {
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1a1a1a',
          titleFont: { family: 'DM Sans', size: 13 },
          bodyFont: { family: 'DM Sans', size: 12 },
          padding: 10,
          cornerRadius: 6
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          grid: { color: 'rgba(0,0,0,0.05)' },
          ticks: { font: { family: 'DM Sans', size: 11 } }
        },
        x: {
          grid: { display: false },
          ticks: { font: { family: 'DM Sans', size: 11 } }
        }
      },
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

function handleRouter() {
  const { pageId, anchorId } = parseHash();
  loadPage(pageId, anchorId);
}

// Bootstrap
(async function() {
  const cfg = await loadSiteConfig();
  buildNav(cfg.pages || []);
  
  // Listen for hash changes
  window.addEventListener('hashchange', handleRouter);
  
  // Trigger initial route
  handleRouter();
})();
