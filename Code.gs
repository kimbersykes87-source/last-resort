/**
 * Last Resort — Backend (Apps Script)
 * - Minimal email+password auth (SHA-256 + salt)
 * - Resorts read, visited updates
 * - Profile updates (method/favourite validation)
 * - Leaderboard + Directory
 * - CORS support for cross-origin requests
 */
const CONFIG = {
  SHEET_USERS:   'Users',
  SHEET_RESORTS: 'resorts',
  // Users sheet (1-based). Password is column 4.
  U_COL: {
    FirstName:        1,
    LastName:         2,
    Email:            3,
    Password:         4,
    VisitedResorts:   5,
    HomeCity:         6,
    AvatarUrl:         7, // kept in the sheet layout but unused
    LastUpdated:      8,
    Method:           9,
    FavouriteResort: 10,
  },
  U_COL_COUNT: 10,
  // Resorts sheet
  R_COL: { Continent: 1, Country: 2, Name: 3, Gmaps: 4, Lat: 5, Lon: 6 },
  R_COL_COUNT: 6,
  // Password hashing salt
  PASSWORD_SALT: '8bJw/xcZVQJvuQXPwzZqkd1ZG7WkmOahQKwIbwGBikA=-bcd97105-cbd7-4faf-ac46-b0bf9cba2e75'
};

/* ------------------------------ HELPERS ----------------------------------- */
const ss_     = () => SpreadsheetApp.getActiveSpreadsheet();
const sheetU_ = () => ss_().getSheetByName(CONFIG.SHEET_USERS);
const sheetR_ = () => ss_().getSheetByName(CONFIG.SHEET_RESORTS);
const nowIso_ = () => new Date().toISOString();
const lc_     = (s) => (s||'').toString().trim().toLowerCase();

function hashPassword_(plain){
  const raw = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, CONFIG.PASSWORD_SALT + String(plain));
  return Utilities.base64Encode(raw);
}

function checkPassword_(plain, stored){ return hashPassword_(plain) === stored; }

function parseVisited_(v){
  if (!v) return [];
  try { const t = String(v).trim(); return t ? JSON.parse(t) : []; } catch (e) { return []; }
}

/* ------------------------------ RESORTS ----------------------------------- */
function readAllResorts_(){
  const sh = sheetR_(); if (!sh) return [];
  const last = sh.getLastRow(); if (last < 2) return [];
  const values = sh.getRange(2,1,last-1,CONFIG.R_COL_COUNT).getValues();
  return values.map(r => ({
    continent: r[CONFIG.R_COL.Continent-1],
    country:   r[CONFIG.R_COL.Country-1],
    name:      r[CONFIG.R_COL.Name-1],
    gmaps:     r[CONFIG.R_COL.Gmaps-1],
    lat:       Number(r[CONFIG.R_COL.Lat-1]),
    lon:       Number(r[CONFIG.R_COL.Lon-1]),
  })).filter(x => x.name);
}

/* ------------------------------- USERS ------------------------------------ */
function getUsersTable_(){
  const sh = sheetU_(); if (!sh) return [];
  const last = sh.getLastRow(); if (last < 2) return [];
  const values = sh.getRange(2,1,last-1,CONFIG.U_COL_COUNT).getValues();
  return values.map(r => ({
    firstName:        r[CONFIG.U_COL.FirstName-1],
    lastName:         r[CONFIG.U_COL.LastName-1],
    email:            lc_(r[CONFIG.U_COL.Email-1]),
    passHash:         r[CONFIG.U_COL.Password-1],
    visited:          parseVisited_(r[CONFIG.U_COL.VisitedResorts-1]),
    homeCity:         r[CONFIG.U_COL.HomeCity-1],
    lastUpdated:      r[CONFIG.U_COL.LastUpdated-1],
    method:           r[CONFIG.U_COL.Method-1],
    favouriteResort:  r[CONFIG.U_COL.FavouriteResort-1],
  }));
}

function findUserByEmail_(emailLC){
  const sh = sheetU_(); if (!sh) return null;
  const last = sh.getLastRow(); if (last < 2) return null;
  const emails = sh.getRange(2, CONFIG.U_COL.Email, last-1, 1).getValues().map(r=>lc_(r[0]));
  const idx = emails.indexOf(emailLC);
  if (idx === -1) return null;
  const rowNum = 2 + idx;
  const row = sh.getRange(rowNum, 1, 1, CONFIG.U_COL_COUNT).getValues()[0];
  return { rowNum, values: row };
}

function writeUserRowByEmail_(emailLC, mutatorFn){
  const hit = findUserByEmail_(emailLC);
  if (!hit) throw new Error('User not found.');
  const out = mutatorFn(hit.values);
  sheetU_().getRange(hit.rowNum, 1, 1, CONFIG.U_COL_COUNT).setValues([out]);
  return hit.rowNum;
}

/* ------------------------------ CORS HELPERS ------------------------------ */
function setCorsHeaders_(output){
  output.setMimeType(ContentService.MimeType.JSON);
  // Try to set headers - if not available, deployment settings should handle it
  try {
    if (typeof output.setHeaders === 'function') {
      output.setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '3600'
      });
    }
  } catch (e) {
    // setHeaders not available
  }
  return output;
}

/* ------------------------------ ROUTER ------------------------------------ */
function doGet(e){
  const t = HtmlService.createTemplateFromFile('index');
  return t.evaluate()
          .setTitle('Last Resort')
          .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doPost(e){
  try {
    const body = e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : {};
    return respond_(route_(body));
  } catch (err) {
    return respond_({ success:false, message:String(err) });
  }
}

// Handle CORS preflight requests
function doOptions(e){
  var output = ContentService.createTextOutput('');
  output.setMimeType(ContentService.MimeType.TEXT);
  // Set CORS headers for preflight
  try {
    if (typeof output.setHeaders === 'function') {
      output.setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '3600'
      });
    }
  } catch (e) {
    // If setHeaders doesn't work, try HtmlService approach
    return HtmlService.createHtmlOutput('')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
  return output;
}

function api(payload){ return route_(payload || {}); }

function route_(payload){
  const action = (payload.action || '').trim();
  if (!action) return { success:false, message:'Missing action' };

  const map = {
    // Auth
    doesUserExist:        doesUserExist_,
    signUpUser:           signUpUser_,
    loginUser:            loginUser_,
    // App
    getResorts:           getResorts_,
    updateVisitedResorts: updateVisitedResorts_,
    updateProfile:        updateProfile_,
    getLeaderboardData:   getLeaderboardData_,
    getUsersDirectory:    getUsersDirectory_,
  };

  const fn = map[action];
  if (!fn) return { success:false, message:'Unknown action: '+action };
  return fn(payload);
}

function respond_(obj){
  return setCorsHeaders_(
    ContentService.createTextOutput(JSON.stringify(obj))
  );
}

/* ---------------------------- AUTH ACTIONS -------------------------------- */
function doesUserExist_(payload){
  const email = lc_(payload.email);
  if (!email) return { success:false, message:'Email is required' };
  const hit = findUserByEmail_(email);
  if (!hit) return { success:true, data:{ exists:false } };
  const firstName = hit.values[CONFIG.U_COL.FirstName-1];
  const lastName  = hit.values[CONFIG.U_COL.LastName-1];
  return { success:true, data:{ exists:true, firstName, lastName } };
}

function signUpUser_(payload){
  const email = lc_(payload.email);
  const first = (payload.firstName||'').trim();
  const last  = (payload.lastName||'').trim();
  const pwd   = String(payload.password||'').trim();
  // Last name compulsory (UI + server)
  if (!email || !first || !last || !pwd) return { success:false, message:'First name, last name, email and password required' };
  if (!/@/.test(email))                   return { success:false, message:'Enter a valid email' };
  if (findUserByEmail_(email))            return { success:false, message:'Email is already registered' };

  const row = [
    first,                // A FirstName
    last,                 // B LastName
    email,                // C Email
    hashPassword_(pwd),   // D Password (hashed)
    JSON.stringify([]),   // E VisitedResorts
    '',                   // F HomeCity
    '',                   // G AvatarUrl (unused)
    nowIso_(),            // H LastUpdated
    '',                   // I Method
    ''                    // J FavouriteResort
  ];

  const sh = sheetU_();
  const next = sh.getLastRow() + 1;
  sh.getRange(next, 1, 1, CONFIG.U_COL_COUNT).setValues([row]);

  const profile = {
    firstName: row[0], lastName: row[1], email: row[2],
    homeCity: row[5], method: row[8], favouriteResort: row[9],
    lastUpdated: row[7], resortsCount: 0, visited: [],
  };

  return { success:true, data: profile };
}

function loginUser_(payload){
  const email = lc_(payload.email);
  const password = String(payload.password||'');
  if (!email || !password) return { success:false, message:'Email and password required' };
  const hit = findUserByEmail_(email);
  if (!hit) return { success:false, message:'Invalid email or password' };
  const passHash = hit.values[CONFIG.U_COL.Password-1]; // col 4
  if (!checkPassword_(password, passHash)) return { success:false, message:'Invalid email or password' };

  const visited = parseVisited_(hit.values[CONFIG.U_COL.VisitedResorts-1]);
  const profile = {
    firstName: hit.values[CONFIG.U_COL.FirstName-1],
    lastName:  hit.values[CONFIG.U_COL.LastName-1],
    email,
    homeCity:  hit.values[CONFIG.U_COL.HomeCity-1],
    lastUpdated: hit.values[CONFIG.U_COL.LastUpdated-1],
    method: hit.values[CONFIG.U_COL.Method-1] || '',
    favouriteResort: hit.values[CONFIG.U_COL.FavouriteResort-1] || '',
    resortsCount: (visited||[]).length,
    visited,
  };

  return { success:true, data: profile };
}

/* ----------------------------- APP ACTIONS -------------------------------- */
function getResorts_(){
  return { success:true, data: readAllResorts_() };
}

function updateVisitedResorts_(payload){
  const email = lc_(payload.email||'');
  if (!email) return { success:false, message:'Missing email' };
  let resorts = Array.isArray(payload.resorts) ? payload.resorts : [];
  resorts = [...new Set(resorts.map(x => String(x||'').trim()).filter(Boolean))];

  const master = readAllResorts_();
  const valid = new Set(master.map(m => m.name));
  const invalid = resorts.filter(n => !valid.has(n));
  if (invalid.length) return { success:false, message:'Unknown resorts: '+invalid.join(', ') };

  const hit = findUserByEmail_(email);
  if (!hit) return { success:false, message:'User not found' };

  const ts = nowIso_();
  writeUserRowByEmail_(email, row => {
    row[CONFIG.U_COL.VisitedResorts-1] = JSON.stringify(resorts);
    row[CONFIG.U_COL.LastUpdated-1] = ts;
    return row;
  });

  const nameToMeta = new Map(master.map(m=>[m.name,m]));
  const countries = new Set(); const continents = new Set();
  resorts.forEach(n => { const m = nameToMeta.get(n); if (m){ countries.add(m.country); continents.add(m.continent); }});

  return { success:true, data:{
    count: resorts.length,
    countriesCount: countries.size,
    continentsCount: continents.size,
    lastUpdated: ts,
  }};
}

function updateProfile_(payload){
  const email = lc_(payload.email||'');
  if (!email) return { success:false, message:'Missing email' };
  const hit = findUserByEmail_(email);
  if (!hit) return { success:false, message:'User not found' };

  let favouriteResort = (payload.favouriteResort||'').trim();
  if (payload.favouriteResort !== undefined && favouriteResort){
    const master = readAllResorts_();
    if (!master.some(m => m.name === favouriteResort)){
      return { success:false, message:'Favourite Resort not found in master list' };
    }
  }

  let method = (payload.method||'').trim();
  if (payload.method !== undefined && method){
    const norm = { snowboard:'Snowboard', ski:'Ski', '🏂':'Snowboard', '🎿':'Ski' };
    method = norm[lc_(method)] || method;
    if (!['Snowboard','Ski'].includes(method)) return { success:false, message:'Method must be Snowboard or Ski' };
  }

  let updatedRow;
  const ts = nowIso_();
  writeUserRowByEmail_(email, row => {
    if (payload.firstName !== undefined)        row[CONFIG.U_COL.FirstName-1] = (payload.firstName||'').trim();
    if (payload.lastName !== undefined)         row[CONFIG.U_COL.LastName-1]  = (payload.lastName||'').trim();
    if (payload.homeCity !== undefined)         row[CONFIG.U_COL.HomeCity-1]  = (payload.homeCity||'').trim();
    if (payload.method !== undefined)           row[CONFIG.U_COL.Method-1]    = method || '';
    if (payload.favouriteResort !== undefined)  row[CONFIG.U_COL.FavouriteResort-1] = favouriteResort || '';
    row[CONFIG.U_COL.LastUpdated-1] = ts;
    updatedRow = row; return row;
  });

  const visited = parseVisited_(updatedRow[CONFIG.U_COL.VisitedResorts-1]);
  const profile = {
    firstName:       updatedRow[CONFIG.U_COL.FirstName-1],
    lastName:        updatedRow[CONFIG.U_COL.LastName-1],
    email:           updatedRow[CONFIG.U_COL.Email-1],
    homeCity:        updatedRow[CONFIG.U_COL.HomeCity-1],
    method:          updatedRow[CONFIG.U_COL.Method-1],
    favouriteResort: updatedRow[CONFIG.U_COL.FavouriteResort-1],
    lastUpdated:     updatedRow[CONFIG.U_COL.LastUpdated-1],
    resortsCount:    (visited||[]).length,
    visited,
  };

  return { success:true, data: profile };
}

function getLeaderboardData_(){
  const master = readAllResorts_();
  const nameToMeta = new Map(master.map(m=>[m.name,m]));
  const users = getUsersTable_();
  const metrics = users.map(u=>{
    const visited = new Set(u.visited||[]);
    const countries = new Set(); const continents = new Set();
    visited.forEach(n => { const m = nameToMeta.get(n); if (m){ countries.add(m.country); continents.add(m.continent);} });
    return {
      email: u.email,
      name: `${u.firstName||''} ${u.lastName||''}`.trim(),
      resortsCount: visited.size,
      countriesCount: countries.size,
      continentsCount: continents.size,
      lastUpdated: u.lastUpdated || '',
    };
  });

  const sortBy = (primary, secondary) =>
    [...metrics].sort((a,b)=>{
      if (b[primary] !== a[primary]) return b[primary]-a[primary];
      if (b[secondary] !== a[secondary]) return b[secondary]-a[secondary];
      if ((b.lastUpdated||'') !== (a.lastUpdated||'')) return (b.lastUpdated||'').localeCompare(a.lastUpdated||'');
      return (a.name||'').localeCompare(b.name||'');
    }).slice(0,25);

  return { success:true, data:{
    mostResorts:    sortBy('resortsCount','countriesCount'),
    mostCountries:  sortBy('countriesCount','resortsCount'),
    mostContinents: sortBy('continentsCount','countriesCount'),
  }}; 
}

function getUsersDirectory_(){
  const users = getUsersTable_();
  const directory = users.map(u=>({
      firstName:       u.firstName,
      lastName:        u.lastName,
      email:           u.email,
      homeCity:        u.homeCity,
      resortsCount:    (u.visited||[]).length,
      lastUpdated:     u.lastUpdated || '',
      method:          u.method || '',
      favouriteResort: u.favouriteResort || '',
      visited:         u.visited || [],
  })).sort((a,b)=>(b.lastUpdated||'').localeCompare(a.lastUpdated||''));

  return { success:true, data: directory };
}

/* ------------------------------- INCLUDE ---------------------------------- */
function include(name){
  return HtmlService.createHtmlOutputFromFile(name).getContent();
}

