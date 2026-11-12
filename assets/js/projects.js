
// Global State
let monumentsData = [];
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
  loadMonuments();
  setupFilterListeners();
  setupModalListeners();
});

/**
 * Fetches monuments data from JSON file
 */
async function loadMonuments() {
  const gridContainer = document.getElementById('bentoGrid');
  if (!gridContainer) return;

  try {
    gridContainer.innerHTML = `
      <div class="col-span-12 py-24 text-center">
        <div class="inline-block w-10 h-10 border-2 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p class="text-neutral-400 font-royal tracking-widest text-sm">ARCHIVING ROYAL MONUMENTS...</p>
      </div>
    `;

    const response = await fetch('data/monuments.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    monumentsData = await response.json();
    renderBentoGrid(monumentsData);
  } catch (error) {
    console.error('Failed to load monuments JSON:', error);
    gridContainer.innerHTML = `
      <div class="col-span-12 py-20 text-center glass-panel rounded-3xl p-8 border-red-500/20">
        <p class="text-red-400 font-royal text-lg mb-2">Notice: Loading Local Monuments Archive</p>
        <p class="text-neutral-400 text-sm max-w-lg mx-auto mb-6">Unable to load data/monuments.json via fetch. Please ensure you are running through a local web server (e.g. VS Code Live Server or python -m http.server).</p>
      </div>
    `;
  }
}

/**
 * Renders the Asymmetric Bento Grid matching the screenshot & user request
 */
function renderBentoGrid(monuments) {
  const gridContainer = document.getElementById('bentoGrid');
  const countDisplay = document.getElementById('monumentCount');
  if (!gridContainer) return;

  // Filter based on selected category
  const filtered = currentFilter === 'all'
    ? monuments
    : monuments.filter(item => item.era.toLowerCase() === currentFilter.toLowerCase());

  if (countDisplay) {
    countDisplay.textContent = `Showing ${filtered.length} Architectural Masterpieces`;
  }

  if (filtered.length === 0) {
    gridContainer.innerHTML = `
      <div class="col-span-12 py-24 text-center glass-panel rounded-3xl p-8">
        <p class="text-xl font-royal text-white mb-2">No Monuments Found</p>
        <p class="text-neutral-400 text-sm">Try selecting another architectural era from the filter dock.</p>
      </div>
    `;
    return;
  }

  gridContainer.innerHTML = filtered.map((monument, index) => {
    const eraClass = monument.era.toLowerCase();
    
    return `
      <div class="${monument.bentoSpan} ${monument.heightClass} bento-card rounded-2xl md:rounded-3xl group" 
           onclick="openMonumentModal('${monument.id}')"
           role="button"
           tabindex="0"
           aria-label="View details of ${monument.name}"
           onkeydown="if(event.key === 'Enter' || event.key === ' ') openMonumentModal('${monument.id}')">
        
        <!-- Image with hover blur & zoom -->
        <img src="${monument.image}" 
             alt="${monument.name}" 
             loading="lazy"
             onerror="this.onerror=null; this.src='assets/images/monuments/taj-mahal.jpg';"
             class="w-full h-full object-cover">
        
        <!-- Dark gradient overlay -->
        <div class="bento-overlay"></div>

        <!-- Top Right Era Tag -->
        <div class="absolute top-4 right-4 z-10">
          <span class="era-badge ${eraClass}">
            <span class="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
            ${monument.era}
          </span>
        </div>

        <!-- Left Bottom Information & Click To Open -->
        <div class="bento-meta text-left">
          <h3 class="font-royal text-xl md:text-2xl font-bold text-white tracking-wide leading-tight group-hover:text-amber-300 transition-colors">
            ${monument.name}
          </h3>
          <p class="text-xs md:text-sm text-neutral-300/90 font-medium tracking-wide mt-1 flex items-center gap-2">
            <span>${monument.period}</span>
            <span class="text-red-400">•</span>
            <span class="text-neutral-300">${monument.location}</span>
          </p>
          
          <!-- Click to Open Button indicator -->
          <div class="mt-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md text-white border border-white/20 group-hover:bg-gradient-to-r group-hover:from-red-700 group-hover:to-amber-600 group-hover:text-white group-hover:border-amber-400/40 transition-all duration-300">
            <span>Click to Open</span>
            <svg class="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Sets up right-side middle floating filter rail buttons
 */
function setupFilterListeners() {
  const filterButtons = document.querySelectorAll('.filter-btn');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selected = btn.getAttribute('data-filter');
      currentFilter = selected;

      // Update active UI classes on filter buttons
      filterButtons.forEach(b => {
        b.classList.remove('active', 'bg-red-700', 'bg-amber-400', 'text-black', 'border-amber-400', 'border-red-600');
        b.classList.remove('text-white');
        b.classList.add('text-neutral-300');
      });

      btn.classList.add('active', 'bg-red-700', 'text-white', 'border-red-600');
      btn.classList.remove('text-neutral-300');

      // Re-render grid with transition
      const grid = document.getElementById('bentoGrid');
      if (grid) {
        grid.style.opacity = '0.4';
        setTimeout(() => {
          renderBentoGrid(monumentsData);
          grid.style.opacity = '1';
        }, 150);
      }
    });
  });
}

/**
 * Opens the deep Architectural Detail Modal Popup with smooth scroll behavior
 */
function openMonumentModal(monumentId) {
  const monument = monumentsData.find(item => item.id === monumentId);
  if (!monument) return;

  const modal = document.getElementById('monumentModal');
  const modalBody = document.getElementById('modalDynamicContent');
  if (!modal || !modalBody) return;

  const eraClass = monument.era.toLowerCase();

  modalBody.innerHTML = `
    <!-- Top Monument Hero Image Banner -->
    <div class="relative w-full h-72 md:h-96 rounded-t-3xl overflow-hidden">
      <img src="${monument.image}" alt="${monument.name}" onerror="this.onerror=null; this.src='assets/images/monuments/taj-mahal.jpg';" class="w-full h-full object-cover">
      <div class="absolute inset-0 bg-gradient-to-t from-[#140e0c] via-[#140e0c]/40 to-transparent"></div>
      
      <!-- Close button overlay for convenient mobile access -->
      <button onclick="closeMonumentModal()" class="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-red-700 hover:text-white hover:border-red-500 transition-all" aria-label="Close modal">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Monument Title & Location overlay -->
      <div class="absolute bottom-6 left-6 md:left-8 right-6 z-10">
        <span class="era-badge ${eraClass} mb-2">
          ${monument.era} Architecture
        </span>
        <h2 class="font-royal text-2xl md:text-4xl font-extrabold text-white tracking-wide">
          ${monument.name}
        </h2>
        <p class="text-sm md:text-base text-amber-300 font-medium mt-1">
          ${monument.location} &bull; Built ${monument.period}
        </p>
      </div>
    </div>

    <!-- Scrollable Detail Body Container -->
    <div class="p-6 md:p-8 space-y-8">
      
      <!-- Quick Metadata Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
        <div>
          <span class="text-xs uppercase tracking-wider text-neutral-400 block">Patron / Ruler</span>
          <span class="text-sm font-semibold text-white mt-1 block">${monument.patron}</span>
        </div>
        <div>
          <span class="text-xs uppercase tracking-wider text-neutral-400 block">Chief Architect</span>
          <span class="text-sm font-semibold text-white mt-1 block">${monument.architect}</span>
        </div>
        <div>
          <span class="text-xs uppercase tracking-wider text-neutral-400 block">Style Paradigm</span>
          <span class="text-sm font-semibold text-white mt-1 block">${monument.style}</span>
        </div>
        <div>
          <span class="text-xs uppercase tracking-wider text-neutral-400 block">Era Classification</span>
          <span class="text-sm font-semibold text-amber-300 mt-1 block">${monument.era} Epoch</span>
        </div>
      </div>

      <!-- Historical & Architectural Narrative -->
      <div>
        <h4 class="font-royal text-lg font-bold text-white mb-3 flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-red-600"></span>
          Architectural History & Significance
        </h4>
        <p class="text-neutral-300 text-sm md:text-base leading-relaxed">
          ${monument.fullDesc}
        </p>
      </div>

      <!-- Architectural Highlights with Icons -->
      <div>
        <h4 class="font-royal text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          Key Structural & Decorative Innovations
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          ${monument.highlights.map(item => `
            <div class="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
              <span class="text-amber-400 flex-shrink-0 mt-0.5">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
              </span>
              <span class="text-xs md:text-sm text-neutral-300 leading-snug">${item}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Materials & Structural Vocabulary -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
        <div class="p-4 rounded-xl bg-red-950/25 border border-red-800/30">
          <span class="text-xs font-royal uppercase tracking-wider text-amber-300 font-semibold block mb-1">
            Materials Employed
          </span>
          <p class="text-sm text-neutral-200">${monument.keyMaterials}</p>
        </div>
        <div class="p-4 rounded-xl bg-amber-950/25 border border-amber-800/30">
          <span class="text-xs font-royal uppercase tracking-wider text-amber-300 font-semibold block mb-1">
            Architectural Vocabulary
          </span>
          <p class="text-sm text-neutral-200">${monument.architecturalElements}</p>
        </div>
      </div>

    </div>
  `;

  // Open modal and lock page scroll
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

/**
 * Closes the detail modal and restores scroll
 */
function closeMonumentModal() {
  const modal = document.getElementById('monumentModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/**
 * Sets up global modal close triggers (Escape key, click outside)
 */
function setupModalListeners() {
  const modal = document.getElementById('monumentModal');
  const closeBtn = document.getElementById('closeModalBtn');

  if (closeBtn) {
    closeBtn.addEventListener('click', closeMonumentModal);
  }

  if (modal) {
    // Click on backdrop to close
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeMonumentModal();
      }
    });
  }

  // Escape key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMonumentModal();
    }
  });
}
