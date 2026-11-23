(() => {
  const plants = (window.PLANTS || []).slice().sort((a,b)=>a.name.localeCompare(b.name));
  const bySlug = Object.fromEntries(plants.map(p=>[p.slug,p]));
  const $ = (s, root=document) => root.querySelector(s);
  const esc = (v='') => String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const root = document.body;
  const pageSlug = root.dataset.plant || '';
  const current = pageSlug ? bySlug[pageSlug] : null;
  const base = root.dataset.base || '.';
  const plantUrl = p => `${base}/plants/${p.slug}.html`;
  const isSafe = s => s==='safe';
  const statusLabel = s => ({safe:'Listed as non-toxic',low:'Low concern',toxic:'Toxic',irritant:'Irritant / avoid ingestion',unknown:'Not established'}[s] || 'Not established');
  const statusClass = s => s==='safe'?'safe':((s==='unknown'||s==='low')?'unknown':'danger');
  const lightLabel = p => p.lowLight ? `${p.lightCategory==='low'?'Low-light tolerant':'Tolerates lower light'}` : ({low:'Low light',medium:'Medium light',bright:'Bright light'}[p.lightCategory] || 'Indirect light');

  const shell = `
    <div class="app-shell">
      <aside class="sidebar" aria-label="Plant navigation and filters">
        <a class="brand" href="${base}/index.html" style="text-decoration:none;color:inherit">
          <span class="brand-mark" aria-hidden="true">❧</span><span><h1>Houseplant Field Guide</h1><p>Care notes · identification · safety</p></span>
        </a>
        <div class="side-label">Find a plant</div>
        <div class="search-wrap"><span class="search-icon" aria-hidden="true">⌕</span><input id="plant-search" type="search" placeholder="Search name or botanical name…" autocomplete="off" aria-label="Search plants"></div>
        <div class="side-label">Filters</div>
        <div class="filter-grid">
          <div class="filter"><label for="difficulty-filter">Ease of care</label><select id="difficulty-filter"><option value="">Any level</option><option value="Very easy">Very easy</option><option value="Easy">Easy</option><option value="Moderate">Moderate</option><option value="Challenging">Challenging</option></select></div>
          <div class="filter"><label for="light-filter">Light needs</label><select id="light-filter"><option value="">Any light</option><option value="low">Low-light tolerant</option><option value="medium">Medium light</option><option value="bright">Bright light</option></select></div>
          <div class="filter"><label for="pet-filter">Cat / dog safety</label><select id="pet-filter"><option value="">Any status</option><option value="safe">Listed non-toxic</option><option value="toxic">Toxic</option><option value="irritant">Irritant / caution</option><option value="unknown">Not established</option></select></div>
          <div class="filter"><label for="human-filter">Human risk</label><select id="human-filter"><option value="">Any status</option><option value="safe">No known toxicity</option><option value="low">Low / mild concern</option><option value="irritant">Irritant</option><option value="toxic">Toxic</option><option value="unknown">Not established</option></select></div>
        </div>
        <div class="filter-actions"><span class="result-count" id="result-count">24 plants</span><button class="clear-btn" id="clear-filters" type="button">Clear filters</button></div>
        <div class="side-label">Plant catalogue</div>
        <nav class="plant-list" id="plant-list" aria-label="All plants"></nav>
        <p class="sidebar-note">Tip: select a plant to open its full profile. Filters apply to the list on every page.</p>
      </aside>
      <main class="main"><div class="main-inner" id="page-content"></div></main>
    </div>`;
  root.innerHTML = shell;

  const listEl = $('#plant-list'), countEl = $('#result-count');
  const searchEl = $('#plant-search'), diffEl = $('#difficulty-filter'), lightEl = $('#light-filter'), petEl = $('#pet-filter'), humanEl = $('#human-filter');
  function visiblePlants(){
    const q=searchEl.value.trim().toLowerCase(), d=diffEl.value, l=lightEl.value, pet=petEl.value, hum=humanEl.value;
    return plants.filter(p=>{
      const hay=`${p.name} ${p.scientific} ${p.family} ${p.summary} ${(p.tags||[]).join(' ')}`.toLowerCase();
      if(q && !hay.includes(q)) return false;
      if(d && p.difficulty!==d) return false;
      if(l==='low' && !p.lowLight) return false;
      if(l && l!=='low' && p.lightCategory!==l) return false;
      if(pet && p.petStatus!==pet) return false;
      if(hum && p.humanStatus!==hum) return false;
      return true;
    });
  }
  function renderList(){
    const filtered=visiblePlants();
    listEl.innerHTML=filtered.map(p=>`<a class="plant-link ${p.slug===pageSlug?'active':''}" href="${plantUrl(p)}" ${p.slug===pageSlug?'aria-current="page"':''}>${esc(p.name)}<small>${esc(p.scientific)}</small></a>`).join('') || '<div class="no-results">No matching plants. Try clearing a filter.</div>';
    countEl.textContent=`${filtered.length} of ${plants.length} plants`;
    if(current && !filtered.some(p=>p.slug===pageSlug)) countEl.textContent += ' · current profile hidden by filters';
  }
  [searchEl,diffEl,lightEl,petEl,humanEl].forEach(el=>el.addEventListener('input',renderList));
  $('#clear-filters').addEventListener('click',()=>{[searchEl,diffEl,lightEl,petEl,humanEl].forEach(el=>el.value='');renderList();});
  renderList();

  const content=$('#page-content');
  const footer=`<footer class="footer"><span>Houseplant Field Guide · A practical home-growing reference</span><span>Static site · no account or external service required</span></footer>`;
  const topLine=(label)=>`<div class="topline"><div class="breadcrumb"><a href="${base}/index.html">Catalogue</a> / ${label}</div><div class="top-actions"><a class="text-btn" href="${base}/index.html">All plants</a></div></div>`;

  if(!pageSlug){
    content.innerHTML=`${topLine('Overview')}
      <section class="hero"><div class="eyebrow">Indoor plant reference · 24 profiles</div><h2>Find the right care for every leaf.</h2><p>A practical houseplant library covering growing conditions, ease of care, propagation, common problems, and separate safety notes for pets and people. Use the filters on the left to narrow the catalogue.</p><div class="hero-meta"><span class="chip">✦ 24 plant profiles</span><span class="chip">☼ Light and watering guidance</span><span class="chip">⌁ Pet and human safety</span><span class="chip">✂ Propagation methods</span></div></section>
      <div class="section-head"><div><h3>Browse the collection</h3><p>Choose a plant to open its complete profile. Filters update this list as well.</p></div></div>
      <p class="filter-summary" id="filter-summary">Showing <strong>${plants.length}</strong> plants.</p>
      <section class="cards" id="plant-cards"></section>
      <div class="fine-print"><strong>How to read toxicity notes:</strong> “Listed as non-toxic” means the cited reference does not identify the plant as toxic to cats or dogs; it does not mean eating plants is recommended. Human effects are shown separately. “Not established” means the references used here did not provide enough species-specific information to make a confident claim. Plant cultivars and common names can be confusing, so confirm the botanical name on your plant label. In suspected poisoning, contact a veterinarian or your local poison center.</div>${footer}`;
    const cards=$('#plant-cards');
    function renderCards(){
      const items=visiblePlants();
      $('#filter-summary').innerHTML=`Showing <strong>${items.length}</strong> of <strong>${plants.length}</strong> plants.`;
      cards.innerHTML=items.map(p=>`<article class="plant-card"><div class="card-top"><div><h4>${esc(p.name)}</h4><div class="latin">${esc(p.scientific)}</div></div><span class="status ${statusClass(p.petStatus)}">${esc(p.difficulty)}</span></div><p class="card-summary">${esc(p.summary)}</p><div class="card-tags"><span class="mini-tag">${esc(lightLabel(p))}</span><span class="mini-tag ${isSafe(p.petStatus)?'safe':p.petStatus==='unknown'?'unknown':'danger'}">Pets: ${esc(statusLabel(p.petStatus))}</span></div><a class="open-link" href="${plantUrl(p)}">Open plant profile →</a></article>`).join('') || '<div class="no-results">No plants match those filters. Clear one or more filters in the sidebar.</div>';
    }
    [searchEl,diffEl,lightEl,petEl,humanEl].forEach(el=>el.addEventListener('input',renderCards));
    $('#clear-filters').addEventListener('click',renderCards);
    renderCards();
  } else if(!current){
    content.innerHTML=`${topLine('Not found')}<div class="no-results"><h2>Plant profile not found</h2><p>This page may have been renamed or the link may be incorrect.</p><a href="${base}/index.html">Return to the catalogue</a></div>${footer}`;
  } else {
    const statusBox=(title,status,text)=>`<div class="tox-block"><h4>${title} <span class="status ${statusClass(status)}">${esc(statusLabel(status))}</span></h4><p>${esc(text)}</p></div>`;
    content.innerHTML=`${topLine(esc(current.name))}
      <section class="plant-hero"><div class="eyebrow">Plant profile · ${esc(current.family)}</div><h2>${esc(current.name)}</h2><div class="scientific">${esc(current.scientific)}</div><p class="summary">${esc(current.summary)}</p></section>
      <section class="stat-grid" aria-label="Quick facts"><div class="stat"><small>Ease of care</small><strong>${esc(current.difficulty)}</strong></div><div class="stat"><small>Light range</small><strong>${esc(lightLabel(current))}</strong></div><div class="stat"><small>Watering style</small><strong>${esc(current.water.split('.')[0])}</strong></div><div class="stat"><small>Pet safety</small><strong><span class="status ${statusClass(current.petStatus)}">${esc(statusLabel(current.petStatus))}</span></strong></div></section>
      <section class="detail-grid">
        <article class="detail-card"><h3><span>⌕</span> Identification</h3><p>${esc(current.identification)}</p></article>
        <article class="detail-card"><h3><span>☼</span> Light requirements</h3><p>${esc(current.light)}</p></article>
        <article class="detail-card"><h3><span>💧</span> Watering</h3><p>${esc(current.water)}</p></article>
        <article class="detail-card"><h3><span>☁</span> Humidity and temperature</h3><p><strong>Humidity:</strong> ${esc(current.humidity)}<br><br><strong>Temperature:</strong> ${esc(current.temperature)}</p></article>
        <article class="detail-card"><h3><span>▧</span> Soil and drainage</h3><p>${esc(current.soil)}</p></article>
        <article class="detail-card"><h3><span>✦</span> Fertilizing</h3><p>${esc(current.fertilize)}</p></article>
        <article class="detail-card"><h3><span>✂</span> Propagation</h3><p>${esc(current.propagation)}</p></article>
        <article class="detail-card"><h3><span>⌁</span> Pruning and shaping</h3><p>${esc(current.pruning)}</p></article>
        <article class="detail-card"><h3><span>▣</span> Repotting</h3><p>${esc(current.repotting)}</p></article>
        <article class="detail-card wide"><h3><span>⚠</span> Toxicity and safety</h3><p style="margin-bottom:13px">Pet toxicity and human exposure are reported separately. The status describes the evidence in the linked references, not a guarantee that ingestion is harmless.</p><div class="tox-grid">${statusBox('Cats and dogs',current.petStatus,current.petText)}${statusBox('Humans',current.humanStatus,current.humanText)}</div></article>
        <article class="detail-card wide"><h3><span>⌕</span> Common problems and troubleshooting</h3><p>${esc(current.symptoms)}</p></article>
        <article class="detail-card wide"><h3><span>↗</span> References and further reading</h3><div class="source-list">${current.sources.map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.name)} ↗</a>`).join('')}</div></article>
      </section>
      <div class="fine-print"><strong>Care note:</strong> These are starting points for a typical indoor plant, not a fixed watering calendar. Pot size, soil mix, season, room temperature, grow lights, and root health change how quickly a plant uses water. Check the potting mix before watering and make sure excess water can drain. <strong>Identification note:</strong> common names can refer to multiple species; use the scientific name to confirm the profile matches your plant.</div>${footer}`;
  }
})();
