/* ============================================================================
 * Last Resort — Frontend (Standalone)
 * Sections: CONSTANTS/STATE • UTIL • FLAGS • RECENT • API • AUTH • MAP/UI
 *           METRICS/TABLE • RESORT LIST • LEADERBOARD/DIRECTORY • PROFILE • TABS • BOOT
 * ========================================================================== */

/* -------------------------- CONSTANTS / STATE ---------------------------- */
var CONSTANTS = {
  USER_KEY: 'lr_user_profile',
  RECENT_ADDS_KEY: 'lr_recent_adds',
  TABS: ['my','update','lead','others','profile'],
  // Apps Script Web App URL
  // Direct URL - works best with HTTPS (Cloudflare Pages)
  // For localhost development, consider deploying to Cloudflare Pages first
  // or use Chrome with --disable-web-security flag (development only)
  API_URL: 'https://script.google.com/macros/s/AKfycbzSl4REI2WDdc4RvGiSNeoxNM6hbFMWx4qXwpHwDS2v60FolqlKdGetUhUefK1dX-DrcQ/exec'
};

var state = {
  allResorts: [],
  selectedResorts: new Set(),
  currentUser: null,
  map: null, mapMarkers: [],
  othersMap: null, othersMarkers: [],
};

/* ------------------------------- UTIL ----------------------------------- */
function qs(s){ return document.querySelector(s); }
function qsa(s){ return document.querySelectorAll(s); }
function el(tag, opts){
  opts = opts || {};
  var e = document.createElement(tag);
  if (opts.text) e.textContent = opts.text;
  if (opts.className) e.className = opts.className;
  if (opts.attrs) Object.keys(opts.attrs).forEach(function(k){ e.setAttribute(k, opts.attrs[k]); });
  if (opts.children) opts.children.forEach(function(c){ e.appendChild(c); });
  return e;
}
function lc(s){ return (s||'').toString().trim().toLowerCase(); }
function setHidden(node, h){ if(!node) return; node.classList.toggle('hidden', !!h); }
function setDisabled(nodeOrSel, d){
  var n = typeof nodeOrSel==='string' ? qs(nodeOrSel) : nodeOrSel;
  if (!n) return; n.disabled = !!d; n.classList.toggle('opacity-60', !!d);
}
function showToast(msg){
  var t = qs('#toast'); if(!t) return;
  t.textContent = msg; t.classList.remove('hidden');
  setTimeout(function(){ t.classList.add('hidden'); }, 2200);
}
function deaccent(s){ return (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }

/* ------------------------------- FLAGS ---------------------------------- */
var COUNTRY_TO_ISO = {
  'aland':'AX','albania':'AL','algeria':'DZ','andorra':'AD','antarctica':'AQ','argentina':'AR','armenia':'AM',
  'australia':'AU','austria':'AT','azerbaijan':'AZ','belarus':'BY','belgium':'BE','bolivia':'BO',
  'bosnia and herzegovina':'BA','brazil':'BR','bulgaria':'BG','canada':'CA','chile':'CL','china':'CN',
  'croatia':'HR','cyprus':'CY','czechia':'CZ','denmark':'DK','egypt':'EG','estonia':'EE','finland':'FI',
  'france':'FR','georgia':'GE','germany':'DE','greece':'GR','greenland':'GL','hungary':'HU','iceland':'IS',
  'india':'IN','indonesia':'ID','iran':'IR','iraq':'IQ','ireland':'IE','israel':'IL','italy':'IT','japan':'JP',
  'kazakhstan':'KZ','kosovo':'XK','kyrgyzstan':'KG','latvia':'LV','lebanon':'LB','liechtenstein':'LI',
  'lithuania':'LT','mexico':'MX','montenegro':'ME','morocco':'MA','netherlands':'NL','new zealand':'NZ',
  'north korea':'KP','north macedonia':'MK','norway':'NO','pakistan':'PK','poland':'PL','portugal':'PT',
  'republic of serbia':'RS','romania':'RO','russia':'RU','slovakia':'SK','slovenia':'SI','south africa':'ZA',
  'south korea':'KR','spain':'ES','sweden':'SE','switzerland':'CH','taiwan':'TW','tajikistan':'TJ',
  'thailand':'TH','turkey':'TR','ukraine':'UA','united arab emirates':'AE','united kingdom':'GB','united states':'US'
};
var COUNTRY_NAME_ALIASES = {
  'usa':'united states','u.s.a.':'united states','us':'united states',
  'uk':'united kingdom','u.k.':'united kingdom',
  'uae':'united arab emirates','u.a.e.':'united arab emirates',
  'czech republic':'czechia','serbia':'republic of serbia'
};
function normalizeCountryName(name){
  return deaccent(String(name || '')).toLowerCase().replace(/\s+/g,' ').trim();
}
function isoFromCountry(name){
  var key = normalizeCountryName(name||'');
  if (COUNTRY_NAME_ALIASES[key]) key = COUNTRY_NAME_ALIASES[key];
  return (COUNTRY_TO_ISO[key] || '').toUpperCase();
}
function flagUrlSvg(iso){ return 'https://flagcdn.com/' + iso.toLowerCase() + '.svg'; }
function flagUrlPng(iso, h){
  var allowed = [16,20,24,32,40,48,64];
  var hh = allowed.indexOf(Number(h)) > -1 ? Number(h) : 16;
  return 'https://flagcdn.com/h' + hh + '/' + iso.toLowerCase() + '.png';
}
function flagEmojiFromIso(iso){
  if (!iso) return '';
  var cps = iso.toUpperCase().split('').map(function(c){ return 127397 + c.charCodeAt(0); });
  return String.fromCodePoint.apply(String, cps);
}
function createFlagImg(name, opts){
  opts = opts || {};
  var height = 16;
  var className = opts.className || '';
  var iso = isoFromCountry(name || '');
  if (!iso) return null;
  var img = new Image();
  img.alt = (name || '') + ' flag';
  img.loading = 'lazy';
  img.height = height;
  img.style.height = height + 'px';
  img.style.width = 'auto';
  img.style.display = 'inline-block';
  img.style.verticalAlign = '-2px';
  if (className) img.className = className;
  img.src = flagUrlSvg(iso);
  img.onerror = function(){
    img.onerror = function(){
      var span = document.createElement('span');
      span.textContent = flagEmojiFromIso(iso) + ' ';
      span.style.fontSize = height + 'px';
      span.style.lineHeight = height + 'px';
      span.style.display = 'inline-block';
      span.style.verticalAlign = '-2px';
      if (className) span.className = className;
      img.replaceWith(span);
    };
    var p1 = flagUrlPng(iso, height);
    var p2 = flagUrlPng(iso, height * 2);
    img.src = p1;
    img.srcset = p1 + ' 1x, ' + p2 + ' 2x';
  };
  return img;
}

/* --------------------------- RECENT ADDS (UI) ---------------------------- */
function getRecentAdds(){ try { return JSON.parse(localStorage.getItem(CONSTANTS.RECENT_ADDS_KEY)||'[]'); } catch(e){ return []; } }
function pushRecentAdd(name){
  var max = 6;
  var arr = getRecentAdds().filter(function(n){ return n !== name; });
  arr.unshift(name);
  localStorage.setItem(CONSTANTS.RECENT_ADDS_KEY, JSON.stringify(arr.slice(0,max)));
  renderRecentAdds();
}
function renderRecentAdds(){
  var c = qs('#recentAddsContainer'); if (!c) return;
  c.innerHTML = '';
  getRecentAdds().forEach(function(name){
    var chip = el('button',{className:'px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs', text:name});
    chip.addEventListener('click', function(){
      var input = qs('#resortSearchInput'); if (input){ input.value = name; renderResortList(); }
    });
    c.appendChild(chip);
  });
}

/* ------------------------------- API ------------------------------------ */
function setLoading(on){ 
  var l = qs('#loader'); 
  if (l) l.classList.toggle('loader-show', !!on); 
}
function callApi(payload, retries = 2){
  setLoading(true);
  console.log('API Call:', payload.action, 'to', CONSTANTS.API_URL);
  return fetch(CONSTANTS.API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  })
  .then(function(response) {
    console.log('API Response status:', response.status, response.statusText);
    setLoading(false);
    if (!response.ok) {
      // Try to get error message from response
      return response.text().then(function(text) {
        console.error('API Error Response:', text);
        try {
          var json = JSON.parse(text);
          throw new Error(json.message || 'Network response was not ok: ' + response.status);
        } catch (e) {
          if (e.message) throw e;
          throw new Error('Network response was not ok: ' + response.status + ' - ' + text);
        }
      });
    }
    return response.text().then(function(text) {
      console.log('API Response body:', text);
      try {
        return JSON.parse(text);
      } catch (e) {
        console.error('Failed to parse JSON:', text);
        throw new Error('Invalid response from server');
      }
    });
  })
  .catch(function(error) {
    setLoading(false);
    console.error('API Error:', error);
    // Retry logic for network errors
    if (retries > 0 && (error.message.includes('Failed to fetch') || error.message.includes('NetworkError'))) {
      console.log('Retrying API call... ' + retries + ' attempts left');
      return callApi(payload, retries - 1);
    }
    // Re-throw with a user-friendly message
    throw new Error(error.message || 'Failed to connect to server. Please check your connection and try again.');
  });
}

/* -------------------------------- AUTH ---------------------------------- */
function openSignup(){
  var loginEmail = qs('#authEmailInput');
  var suEmail = qs('#signupEmailInput');
  if (loginEmail && suEmail && loginEmail.value) suEmail.value = loginEmail.value.trim();
  setHidden(qs('#authLoginForm'), true);
  setHidden(qs('#authSignupForm'), false);
  var e = qs('#signupFirstNameInput'); if (e) e.focus();
}
function backToLogin(){
  setHidden(qs('#authLoginForm'), false);
  setHidden(qs('#authSignupForm'), true);
  var e = qs('#authEmailInput'); if (e) e.focus();
}
async function authLogin(){
  var emailEl = qs('#authEmailInput');
  var passEl  = qs('#authPasswordInput');
  var email = lc(emailEl ? emailEl.value : '');
  var password = passEl ? passEl.value : '';
  if (!email || !password) { showToast('Email and password required'); return; }
  setDisabled('#loginNowBtn', true);
  var res;
  try { 
    console.log('Attempting login for:', email);
    res = await callApi({action:'loginUser', email: email, password: password});
    console.log('Login response:', res);
  }
  catch (e){ 
    setDisabled('#loginNowBtn', false); 
    console.error('Login error:', e);
    showToast(e.message || 'Login failed'); 
    return; 
  }
  setDisabled('#loginNowBtn', false);
  if (!res || !res.success){ 
    console.error('Login failed:', res);
    showToast((res && res.message) || 'Login failed'); 
    return; 
  }
  afterLogin(res.data, (qs('#rememberMeCheckbox') && qs('#rememberMeCheckbox').checked), false);
}
async function authSignup(){
  var firstName = (qs('#signupFirstNameInput') && qs('#signupFirstNameInput').value || '').trim();
  var lastName  = (qs('#signupLastNameInput')  && qs('#signupLastNameInput').value  || '').trim();
  var email     = lc(qs('#signupEmailInput') && qs('#signupEmailInput').value || '');
  var password  = (qs('#signupPasswordInput') && qs('#signupPasswordInput').value || '').trim();
  if (!firstName || !lastName || !email || !password){
    showToast('First name, last name, email, and password are required');
    return;
  }
  setDisabled('#createAccountBtn', true);
  var res;
  try {
    res = await callApi({action:'signUpUser', email: email, firstName: firstName, lastName: lastName, password: password});
  } catch (e){
    setDisabled('#createAccountBtn', false);
    showToast(e.message || 'Sign up failed');
    return;
  }
  setDisabled('#createAccountBtn', false);
  if (!res || !res.success){
    showToast((res && res.message) || 'Sign up failed');
    return;
  }
  afterLogin(res.data, true, true);
}
function afterLogin(profile, remember, goToProfile){
  state.currentUser = profile;
  state.selectedResorts = new Set(profile?.visited || []);
  if (remember) localStorage.setItem(CONSTANTS.USER_KEY, JSON.stringify(profile));
  else localStorage.removeItem(CONSTANTS.USER_KEY);
  updateHeaderUser();
  setHidden(qs('#authSection'), true);
  setHidden(qs('#appSection'), false);
  renderRecentAdds();
  bootApp();
  switchTab(goToProfile ? 'profile' : 'my');
}
function logout(){
  localStorage.removeItem(CONSTANTS.USER_KEY);
  state.currentUser = null;
  var pass = qs('#authPasswordInput'); if (pass) pass.value = '';
  setHidden(qs('#appSection'), true);
  setHidden(qs('#authSection'), false);
  backToLogin();
}
function updateHeaderUser(){
  var u = state.currentUser; if (!u) return;
  var name = [u.firstName||'', u.lastName||''].filter(Boolean).join(' ') || u.email;
  var nameEl = qs('#userName'); if (nameEl) nameEl.textContent = name;
  var ub = qs('#userBox'); if (ub) ub.classList.remove('hidden');
}

/* ------------------------------- RESORTS -------------------------------- */
async function loadResorts(){
  var res;
  try { res = await callApi({action:'getResorts'}); }
  catch (e){ showToast(e.message || 'Failed to load resorts'); return false; }
  if (!res || !res.success){ showToast((res && res.message) || 'Failed to load resorts'); return false; }
  state.allResorts = Array.isArray(res.data) ? res.data : [];
  populateFavouriteResortDropdown();
  renderResortList();
  initMap();
  renderMyMetrics();
  renderByCountryTable();
  return true;
}

/* ------------------------------- MAPS ----------------------------------- */
function initMap(){
  var mapEl = qs('#map'); if (!mapEl) return;
  if (state.map){ state.map.remove(); state.map = null; }
  state.map = L.map(mapEl, { zoomControl: true });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{ attribution: '&copy; OpenStreetMap' }).addTo(state.map);
  state.mapMarkers.forEach(function(m){ m.remove(); });
  state.mapMarkers = [];
  var visited = new Set((state.currentUser && state.currentUser.visited) || []);
  var pts = [];
  state.allResorts.forEach(function(r){
    if (visited.has(r.name) && isFinite(r.lat) && isFinite(r.lon)){
      var m = L.marker([r.lat, r.lon]).bindPopup('<strong>'+r.name+'</strong><br>'+r.country);
      m.addTo(state.map); state.mapMarkers.push(m); pts.push([r.lat, r.lon]);
    }
  });
  setTimeout(function(){ state.map.invalidateSize(); }, 0);
  if (pts.length === 1) state.map.setView(pts[0], 8);
  else if (pts.length > 1) state.map.fitBounds(L.featureGroup(state.mapMarkers).getBounds(), { padding: [20,20], maxZoom: 8 });
  else state.map.setView([46.8, 8.3], 3);
}
function initOthersMap(){
  var elMap = qs('#othersMap'); if (!elMap) return;
  if (state.othersMap){ state.othersMap.remove(); state.othersMap = null; }
  state.othersMap = L.map(elMap, { zoomControl: true });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{ attribution: '&copy; OpenStreetMap' }).addTo(state.othersMap);
  setTimeout(function(){ state.othersMap.invalidateSize(); }, 0);
  renderOthersMapMarkers([]);
}
function renderOthersMapMarkers(points){
  state.othersMarkers.forEach(function(m){ m.remove(); });
  state.othersMarkers = [];
  if (!state.othersMap) return;
  var pts = [];
  points.forEach(function(p){
    if (isFinite(p.lat) && isFinite(p.lon)){
      var m = L.marker([p.lat, p.lon]).bindPopup('<strong>'+p.name+'</strong><br>'+p.country);
      m.addTo(state.othersMap); state.othersMarkers.push(m); pts.push([p.lat,p.lon]);
    }
  });
  if (pts.length === 1) state.othersMap.setView(pts[0], 8);
  else if (pts.length > 1) state.othersMap.fitBounds(L.featureGroup(state.othersMarkers).getBounds(), { padding: [20,20], maxZoom: 8 });
  else state.othersMap.setView([46.8, 8.3], 2);
}

/* --------------------------- METRICS & TABLE ---------------------------- */
function renderMyMetrics(){
  var visited = new Set((state.currentUser && state.currentUser.visited) || []);
  var nameToMeta = new Map(state.allResorts.map(function(m){ return [m.name,m]; }));
  var countries = new Set(); var continents = new Set();
  visited.forEach(function(n){ var m = nameToMeta.get(n); if (m){ countries.add(m.country); continents.add(m.continent); }});
  var m1 = qs('#metricResorts');    if (m1) m1.textContent = visited.size;
  var m2 = qs('#metricCountries');  if (m2) m2.textContent = countries.size;
  var m3 = qs('#metricContinents'); if (m3) m3.textContent = continents.size;
}
function renderByCountryTable(){
  var tbody = qs('#byCountryTbody'); if (!tbody) return;
  tbody.innerHTML = '';
  var visited = new Set((state.currentUser && state.currentUser.visited) || []);
  var nameToMeta = new Map(state.allResorts.map(function(m){ return [m.name,m]; }));
  var counts = new Map();
  visited.forEach(function(n){
    var m = nameToMeta.get(n);
    if (m) counts.set(m.country, (counts.get(m.country)||0) + 1);
  });
  var rows = Array.from(counts.entries()).sort(function(a,b){ return (b[1]-a[1]) || a[0].localeCompare(b[0]); });
  rows.forEach(function(pair){
    var country = pair[0], count = pair[1];
    var tr = document.createElement('tr');
    var tdC = document.createElement('td');
    var tdN = document.createElement('td');
    tdC.className = 'py-1';
    tdN.className = 'py-1 text-right';
    var wrap = document.createElement('span');
    wrap.className = 'flagwrap mr-2';
    var flag = createFlagImg(country, { height: 16 });
    if (flag) wrap.appendChild(flag);
    else wrap.textContent = flagEmojiFromIso(isoFromCountry(country)) + ' ';
    tdC.appendChild(wrap);
    tdC.appendChild(document.createTextNode(country));
    tdN.textContent = String(count);
    tr.appendChild(tdC); tr.appendChild(tdN);
    tbody.appendChild(tr);
  });
}

/* ---------------------------- RESORT LIST UI ---------------------------- */
function renderResortList(){
  var container = qs('#resortListContainer'); if (!container) return;
  container.innerHTML = '';
  var input = qs('#resortSearchInput');
  var q = deaccent(((input && input.value) || '').toLowerCase());
  var filtered = state.allResorts.filter(function(r){
    var hay = deaccent((r.name + ' ' + r.country + ' ' + r.continent).toLowerCase());
    return !q || hay.indexOf(q) !== -1;
  });
  filtered.slice(0, 600).forEach(function(r){
    var card = el('label',{className:'card p-4 rounded-2xl flex items-center gap-3'});
    var id  = 'res-' + btoa(unescape(encodeURIComponent(r.name))).replace(/=/g,'');
    var chk = el('input',{attrs:{type:'checkbox', id:id, 'data-resort':r.name}});
    chk.checked = state.selectedResorts.has(r.name);
    var info = el('div',{className:'flex-1'});
    var title = el('div',{className:'font-medium cursor-pointer', text:r.name});
    if (chk.checked) title.classList.add('text-green-400');
    var meta = el('div',{className:'text-xs text-slate-400'});
    var wrap = el('span',{className:'flagwrap mr-1'});
    var flagImg = createFlagImg(r.country, {});
    if (flagImg) wrap.appendChild(flagImg);
    else wrap.textContent = flagEmojiFromIso(isoFromCountry(r.country)) + ' ';
    meta.appendChild(wrap);
    meta.appendChild(document.createTextNode(r.country+' · '+r.continent));
    info.appendChild(title); info.appendChild(meta);
    chk.addEventListener('change', function(){
      if (chk.checked) { state.selectedResorts.add(r.name); title.classList.add('text-green-400'); pushRecentAdd(r.name); }
      else { state.selectedResorts.delete(r.name); title.classList.remove('text-green-400'); }
    });
    card.appendChild(chk);
    card.appendChild(info);
    container.appendChild(card);
  });
}
async function saveVisited(){
  qsa('#resortListContainer input[type=checkbox]').forEach(function(c){
    var name = c.getAttribute('data-resort');
    if (c.checked) state.selectedResorts.add(name);
    else state.selectedResorts.delete(name);
  });
  var list = Array.from(state.selectedResorts);
  var res;
  try { res = await callApi({action:'updateVisitedResorts', email: state.currentUser.email, resorts: list}); }
  catch(e){ showToast(e.message || 'Save failed'); return; }
  if (!res || !res.success){ showToast((res && res.message) || 'Save failed'); return; }
  state.currentUser.visited = list;
  state.currentUser.lastUpdated = (res.data && res.data.lastUpdated) || state.currentUser.lastUpdated;
  localStorage.setItem(CONSTANTS.USER_KEY, JSON.stringify(state.currentUser));
  renderMyMetrics();
  renderByCountryTable();
  initMap();
  showToast('Visited resorts saved');
}

/* ---------------------- LEADERBOARD & USER DIRECTORY -------------------- */
async function loadLeaderboard(){
  var c = qs('#leaderboardContainer'); if (!c) return;
  c.innerHTML = '';
  var res; try { res = await callApi({action:'getLeaderboardData'}); }
  catch(e){ c.textContent = e.message || 'Failed to load'; return; }
  if (!res || !res.success){ c.textContent = (res && res.message) || 'Failed to load'; return; }
  var sections = [
    ['Most Resorts','mostResorts'],
    ['Most Countries','mostCountries'],
    ['Most Continents','mostContinents']
  ];
  sections.forEach(function(pair){
    var title = pair[0], key = pair[1];
    var col = el('div',{className:'card p-4 rounded-2xl'});
    col.appendChild(el('div',{className:'text-lg mb-2', text:title}));
    var list = el('div',{className:'space-y-2'});
    (res.data && res.data[key] || []).forEach(function(u,i){
      var row = el('div',{className:'flex items-center justify-between text-sm'});
      row.appendChild(el('span',{text:String(i+1)+'. '+(u.name||u.email)}));
      var value = key==='mostResorts' ? u.resortsCount : key==='mostCountries' ? u.countriesCount : u.continentsCount;
      row.appendChild(el('span',{className:'text-slate-400', text:String(value)}));
      list.appendChild(row);
    });
    col.appendChild(list); c.appendChild(col);
  });
}
async function loadUserDirectory(){
  var c = qs('#userDirectoryContainer'); if (!c) return;
  c.innerHTML = '';
  var res; try { res = await callApi({action:'getUsersDirectory'}); }
  catch(e){ c.textContent = e.message || 'Failed to load'; return; }
  if (!res || !res.success){ c.textContent = (res && res.message) || 'Failed to load'; return; }
  if (!state.othersMap) initOthersMap();
  (res.data || []).forEach(function(u){
    var card = el('button',{className:'card p-4 rounded-2xl w-full text-left hover:border-slate-600'});
    var icon = u.method === 'Snowboard' ? ' 🏂' : (u.method === 'Ski' ? ' 🎿' : '');
    var full = ([u.firstName,u.lastName].filter(Boolean).join(' ') || u.email) + icon;
    var line2 = [
      u.homeCity || '—',
      u.favouriteResort ? ('Fav: '+u.favouriteResort) : null,
      String(u.resortsCount||0)+' resorts'
    ].filter(Boolean).join(' · ');
    card.appendChild(el('div',{className:'font-medium', text:full}));
    card.appendChild(el('div',{className:'text-xs text-slate-400', text:line2}));
    card.addEventListener('click', function(){
      var nameToMeta = new Map(state.allResorts.map(function(m){ return [m.name,m]; }));
      var points = (u.visited||[]).map(function(n){ return nameToMeta.get(n); }).filter(Boolean);
      renderOthersMapMarkers(points);
    });
    c.appendChild(card);
  });
}

/* -------------------------------- PROFILE -------------------------------- */
function populateFavouriteResortDropdown(){
  var sel = qs('#profileFavouriteResort'); if (!sel) return;
  sel.innerHTML = '';
  sel.appendChild(el('option',{attrs:{value:''}, text:'— Select —'}));
  for (var i=0; i<state.allResorts.length; i++){
    var r = state.allResorts[i];
    var opt = document.createElement('option');
    opt.value = r.name; opt.textContent = r.name; sel.appendChild(opt);
  }
}
function fillProfileForm(){
  var u = state.currentUser; if (!u) return;
  var e1 = qs('#profileEmail');        if (e1) e1.value = u.email || '';
  var e2 = qs('#profileFirstName');    if (e2) e2.value = u.firstName || '';
  var e3 = qs('#profileLastName');     if (e3) e3.value = u.lastName  || '';
  var e4 = qs('#profileHomeCity');     if (e4) e4.value = u.homeCity  || '';
  var m  = qs('#profileMethod');       if (m)  m.value  = u.method || '';
  var fav= qs('#profileFavouriteResort'); if (fav && u.favouriteResort) fav.value = u.favouriteResort;
}
async function saveProfile(){
  if (!state.currentUser) return;
  var payload = {
    action:'updateProfile',
    email: state.currentUser.email,
    firstName: (qs('#profileFirstName') && qs('#profileFirstName').value || '').trim(),
    lastName:  (qs('#profileLastName')  && qs('#profileLastName').value  || '').trim(),
    homeCity:  (qs('#profileHomeCity')  && qs('#profileHomeCity').value  || '').trim(),
    method: (qs('#profileMethod') && qs('#profileMethod').value) || undefined,
    favouriteResort: (qs('#profileFavouriteResort') && qs('#profileFavouriteResort').value) || undefined
  };
  setDisabled('#saveProfileBtn', true);
  var res; try { res = await callApi(payload); }
  catch(e){ setDisabled('#saveProfileBtn', false); showToast(e.message || 'Save failed'); return; }
  setDisabled('#saveProfileBtn', false);
  if (!res || !res.success){ showToast((res && res.message) || 'Save failed'); return; }
  state.currentUser = res.data;
  localStorage.setItem(CONSTANTS.USER_KEY, JSON.stringify(state.currentUser));
  updateHeaderUser(); fillProfileForm();
  renderByCountryTable();
  showToast('Profile saved');
}

/* --------------------------------- TABS ---------------------------------- */
function switchTab(tab){
  qsa('.tab-btn').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-tab') === tab); });
  ['my','update','lead','others','profile'].forEach(function(name){
    setHidden(qs('#tab-'+name), name !== tab);
  });
  if (tab==='my') setTimeout(function(){ if (state.map) state.map.invalidateSize(); }, 0);
  if (tab==='lead')   loadLeaderboard();
  if (tab==='others') { initOthersMap(); loadUserDirectory(); }
  if (tab==='profile') fillProfileForm();
}

/* --------------------------------- BOOT ---------------------------------- */
function bootAuthOrApp(){
  var saved = localStorage.getItem(CONSTANTS.USER_KEY);
  if (saved){ try { state.currentUser = JSON.parse(saved); } catch(e){} }
  if (state.currentUser){
    state.selectedResorts = new Set((state.currentUser && state.currentUser.visited) || []);
    updateHeaderUser();
    setHidden(qs('#authSection'), true);
    setHidden(qs('#appSection'), false);
    renderRecentAdds();
    bootApp();
    switchTab('my');
  } else {
    setHidden(qs('#authSection'), false);
    setHidden(qs('#appSection'), true);
  }
}
async function bootApp(){
  var ok = await loadResorts();
  if (!ok) return;
  fillProfileForm();
}

/* ------------------------------- EVENTS --------------------------------- */
document.addEventListener('DOMContentLoaded', function(){
  // Auth
  var cont = qs('#loginNowBtn'); if (cont) cont.addEventListener('click', authLogin);
  var emailI = qs('#authEmailInput'); if (emailI) emailI.addEventListener('keydown', function(e){ if (e.key==='Enter'){ e.preventDefault(); authLogin(); }});
  var passI  = qs('#authPasswordInput'); if (passI) passI.addEventListener('keydown', function(e){ if (e.key==='Enter'){ e.preventDefault(); authLogin(); }});
  var openSU = qs('#openSignupBtn'); if (openSU) openSU.addEventListener('click', openSignup);
  var back   = qs('#backToLoginBtn'); if (back) back.addEventListener('click', backToLogin);
  var create = qs('#createAccountBtn'); if (create) create.addEventListener('click', authSignup);
  var lo1 = qs('#logoutBtn'); if (lo1) lo1.addEventListener('click', logout);
  var lo2 = qs('#logoutBtn2'); if (lo2) lo2.addEventListener('click', logout);
  // Tabs
  qsa('.tab-btn').forEach(function(b){ b.addEventListener('click', function(){ switchTab(b.getAttribute('data-tab')); }); });
  // Update
  var rs = qs('#resortSearchInput'); if (rs) rs.addEventListener('input', renderResortList);
  var sv = qs('#saveResortsBtn'); if (sv) sv.addEventListener('click', saveVisited);
  // Profile
  var sp = qs('#saveProfileBtn'); if (sp) sp.addEventListener('click', saveProfile);
  // Go
  bootAuthOrApp();
});

