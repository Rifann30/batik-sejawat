async function loadSiteConfig(){
  try{
    const res = await fetch('data/site-config.json');
    return await res.json();
  }catch(e){
    console.error('Failed to load site config', e);
    return {pages:[]};
  }
}

function buildNav(pages){
  const nav = document.getElementById('nav');
  nav.innerHTML='';
  pages.forEach(p=>{
    const a = document.createElement('a');
    a.href = '#'+p.id;
    a.textContent = p.title;
    nav.appendChild(a);
  })
}

async function loadPage(pageId){
  const app = document.getElementById('app');
  try{
    const res = await fetch('pages/'+pageId+'.html');
    if(!res.ok){ app.innerHTML = '<h2>Halaman tidak ditemukan</h2>'; return; }
    const html = await res.text();
    app.innerHTML = html;
    if(typeof initPage === 'function') initPage(pageId);
  }catch(e){ app.innerHTML = '<h2>Gagal memuat halaman</h2>'; console.error(e); }
}

function getCurrentPage(){
  return (location.hash || '#brand-bible').replace('#','');
}

function initRouter(){
  window.addEventListener('hashchange', ()=>{
    loadPage(getCurrentPage());
  });
}

function initPage(pageId){
  if(pageId==='buyer-persona') initBuyerPersona();
}

function initBuyerPersona(){
  const ctx = document.getElementById('personaChart');
  if(!ctx) return;
  const data = {
    labels:['Dokter Residen','Koas & Dokter Muda','Perawat & Bidan','Mahasiswa FK','Institusi'],
    datasets:[{label:'Prioritas engagement',data:[85,75,70,65,60],backgroundColor:['#E1F5EE','#EEEDFE','#FAECE7','#E6F1FB','#EAF3DE'],borderColor:'#cbd5e1',borderWidth:1}]
  };
  new Chart(ctx,{type:'bar',data,options:{plugins:{legend:{display:false}},responsive:true}});
}

// bootstrap
(async function(){
  const cfg = await loadSiteConfig();
  buildNav(cfg.pages||[]);
  initRouter();
  loadPage(getCurrentPage());
})();
