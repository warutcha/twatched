
(function(){
  "use strict";

  /* ---------------- icons ---------------- */
  var ICON_PATHS = {
    share: '<path d="M12 15V4"/><path d="M8 8l4-4 4 4"/><path d="M6 12v7a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-7"/>',
    chart: '<path d="M4 20h16"/><path d="M7 16v-5"/><path d="M12 16V7"/><path d="M17 16v-8"/>',
    home: '<path d="M4 11.5 12 4l8 7.5"/><path d="M6 10v9a1 1 0 0 0 1 1h3v-5h4v5h3a1 1 0 0 0 1-1v-9"/>',
    grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
    settings: '<line x1="4" y1="7" x2="20" y2="7"/><circle cx="15" cy="7" r="2"/><line x1="4" y1="12" x2="20" y2="12"/><circle cx="9" cy="12" r="2"/><line x1="4" y1="17" x2="20" y2="17"/><circle cx="13" cy="17" r="2"/>',
    check: '<path d="M5 13l4 4L19 7"/>',
    plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
    back: '<path d="M15 6l-6 6 6 6"/>',
    pencil: '<path d="M4 20l3.3-.7L18 8.6a1.5 1.5 0 0 0 0-2.1l-.5-.5a1.5 1.5 0 0 0-2.1 0L4.7 16.7 4 20z"/>',
    trash: '<path d="M5 7h14"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/><path d="M7 7l1 12a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-12"/>',
    clock: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',
    lock: '<rect x="6" y="10" width="12" height="9" rx="1.5"/><path d="M9 10V7a3 3 0 0 1 6 0v3"/>',
    close: '<line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/>',
    ticket: '<path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a1.6 1.6 0 0 0 0 3v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a1.6 1.6 0 0 0 0-3z"/>',
    cloud: '<path d="M7 18a4 4 0 0 1-.6-7.96A5 5 0 0 1 16 9.2 3.8 3.8 0 0 1 15.4 18H7Z"/>',
    up: '<path d="M6 15l6-6 6 6"/>',
    down: '<path d="M6 9l6 6 6-6"/>',
    left: '<path d="M15 6l-6 6 6 6"/>',
    right: '<path d="M9 6l6 6-6 6"/>',
    film: '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 6v12M18 6v12"/>'
  };
  function icon(name, cls){
    return '<svg class="icon ' + (cls||'') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + (ICON_PATHS[name]||'') + '</svg>';
  }

  var GRADIENTS = [
    ['#6C4AB6','#B6467E'],
    ['#1F6F78','#39B7A0'],
    ['#8A3B12','#E8B14B'],
    ['#1B2A4A','#4A73B8'],
    ['#7A1E3A','#D9536A'],
    ['#264D3B','#5FAE73'],
    ['#3A2E5C','#8067C7'],
    ['#5C3A21','#C98A4B']
  ];
  var WEEKDAY_LABELS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var PLATFORM_OPTIONS = ['Netflix','Viu','WeTV','iQIYI','Disney+','Apple TV+','HBO Go','YouTube','Local TV','Other'];
  var GENRE_OPTIONS_DEFAULT = ['Action','Comedy','Crime','Drama','Fantasy','Historical','Horror','Legal','Medical','Mystery','Political','Romance','School','Sci-Fi','Slice of Life','Sports','Supernatural','Thriller','War'];
  var VARIETY_GENRES_DEFAULT = ['Talk Show','Game Show','Reality','Cooking','Travel','Music','Talent Show','Documentary','Survival','Dating','Comedy Sketch','Awards Show','Interview','Prank'];
  var MOVIE_GENRES_DEFAULT = ['Drama','Romance','Comedy','Thriller','Action','Horror','Sci-Fi','Fantasy','Animation','Documentary','Crime','Mystery'];
  var RELATIONSHIP_TYPES_DEFAULT = ['Season 1','Season 2','Season 3','Prequel','Sequel','Spin-off','Standalone movie','Same universe'];
  var NATIONALITY_OPTIONS_DEFAULT = ['Korean','Japanese','Thai','Chinese'];
  var FEELING_OPTIONS_DEFAULT = ['🥰 Flutter','😂 Funny','😭 Cried','😱 Shocked','😰 Tense','😡 Angry','🔥 Hype','😴 Boring'];
  var SEASON_LABELS_DEFAULT = ['Season 1','Season 2','Season 3','Prequel','Sequel','Spin-off','Standalone movie'];
  var TZ_OPTIONS = [
    { v:'TH', l:'Thailand (ICT)', offset:7 },
    { v:'KR', l:'Korea (KST)', offset:9 },
    { v:'JP', l:'Japan (JST)', offset:9 },
    { v:'CN', l:'China (CST)', offset:8 }
  ];
  function tzOffset(code){ var m = TZ_OPTIONS.filter(function(t){return t.v===code;})[0]; return m ? m.offset : 7; }
  function convertToThaiTime(timeStr, tzCode){
    var diff = tzOffset(tzCode) - 7; // hours ahead of Thailand
    var parts = (timeStr||'20:00').split(':');
    var h = parseInt(parts[0],10) || 0, m = parseInt(parts[1],10) || 0;
    var total = ((h*60 + m - diff*60) % 1440 + 1440) % 1440;
    return pad(Math.floor(total/60)) + ':' + pad(total%60);
  }
  var APP_VERSION = 'v2.15.2';

  /* ---------------- date helpers ---------------- */
  function pad(n){ return n < 10 ? '0'+n : ''+n; }
  function uid(prefix){ return prefix + Date.now() + Math.floor(Math.random()*1000); }
  function isoDateOffset(days){
    var d = new Date();
    d.setHours(0,0,0,0);
    d.setDate(d.getDate() + days);
    return d.getFullYear() + '-' + pad(d.getMonth()+1) + '-' + pad(d.getDate());
  }
  function computeEpisodeDate(show, episodeNumber){
    var t = (show.airTime||'20:00').split(':');
    var h = parseInt(t[0],10) || 0, m = parseInt(t[1],10) || 0;
    var perDrop = show.episodesPerAiring || 1;
    // Episodes 1..P all come out on the first day (P = "episodes on day 1"; when it isn't set it equals perDrop,
    // which gives exactly the old result). After that, groups of perDrop on each following air day.
    var firstDrop = premiereCount(show);
    var occurrenceIndex = episodeNumber <= firstDrop ? 1 : 1 + Math.ceil((episodeNumber - firstDrop) / perDrop);
    var base = new Date(show.firstAirDate + 'T00:00:00');
    if(occurrenceIndex <= 1){
      base.setHours(h,m,0,0);
      return base;
    }
    var days = (show.airDays && show.airDays.length) ? show.airDays : [base.getDay()];
    var count = 1;
    var cursor = new Date(base);
    var guard = 0;
    while(count < occurrenceIndex && guard < 3000){
      cursor.setDate(cursor.getDate()+1);
      guard++;
      if(days.indexOf(cursor.getDay()) !== -1){ count++; }
    }
    cursor.setHours(h,m,0,0);
    return cursor;
  }
  function premiereCount(show){
    var per = show.episodesPerAiring || 1, p = parseInt(show.premiereEpisodes, 10);
    return p > 0 ? p : per;
  }
  function getNextEpisodeInfo(show, nowMs){
    var nextNum = show.watched + 1;
    if(nextNum > show.totalEpisodes) return { completed:true };
    var d = computeEpisodeDate(show, nextNum);
    return { number: nextNum, airDate: d, aired: d.getTime() <= nowMs };
  }
  function nextUnairedEpisode(show, nowMs){
    for(var i = show.watched+1; i<=show.totalEpisodes; i++){
      var d = computeEpisodeDate(show,i);
      if(d.getTime() > nowMs) return { number:i, airDate:d };
    }
    return null;
  }
  var DFMT_DATE = { weekday:'short', month:'short', day:'numeric' };
  var DFMT_TIME = { hour:'numeric', minute:'2-digit' };
  function fmtDate(d){ return d.toLocaleDateString('en-US', DFMT_DATE); }
  function fmtTime(d){ return d.toLocaleTimeString('en-US', DFMT_TIME); }
  function fmtDateTime(d){ return fmtDate(d) + ' · ' + fmtTime(d); }
  function daysUntil(targetDate, nowMs){
    var now = new Date(nowMs);
    var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    var startOfTarget = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()).getTime();
    return Math.round((startOfTarget - startOfToday) / 86400000);
  }
  function ddayLabel(days){
    if(days === 0) return { text:'D-DAY', cls:'dday--today' };
    if(days > 0) return { text:'D-' + days, cls:'dday--soon' };
    return { text:'D+' + Math.abs(days), cls:'dday--over' };
  }
  function fmtRelative(ms){
    if(!ms) return 'never';
    var diff = Date.now() - ms;
    if(diff < 45000) return 'just now';
    var mins = Math.round(diff/60000);
    if(mins < 60) return mins + ' min ago';
    var hrs = Math.round(mins/60);
    if(hrs < 24) return hrs + (hrs===1?' hour ago':' hours ago');
    var days = Math.round(hrs/24);
    return days + (days===1?' day ago':' days ago');
  }
  function scheduleText(show){
    var days = (show.airDays||[]).slice().sort().map(function(i){ return WEEKDAY_LABELS[i]; });
    var joined = days.length <= 1 ? (days[0]||'—') : (days.slice(0,-1).join(', ') + ' & ' + days[days.length-1]);
    var perDrop = show.episodesPerAiring || 1;
    var freqPrefix = perDrop > 1 ? (perDrop + ' new episodes ') : 'New episodes ';
    var base = freqPrefix + joined + ' at ' + fmtTime(new Date('2000-01-01T'+(show.airTime||'20:00')+':00')) + ' Thai time';
    var firstDrop = premiereCount(show), total = show.totalEpisodes || 0;
    if(firstDrop !== perDrop && show.firstAirDate){
      var d1 = computeEpisodeDate(show, 1);
      if(total && firstDrop >= total) base = 'All ' + total + ' episodes on ' + fmtDate(d1) + ' at ' + fmtTime(d1) + ' Thai time';
      else base = firstDrop + ' episode' + (firstDrop === 1 ? '' : 's') + ' on premiere day (' + fmtDate(d1) + '), then ' + base.charAt(0).toLowerCase() + base.slice(1);
    }
    if(show.airTimeZone && show.airTimeZone !== 'TH' && show.airTimeOriginal){
      var tzInfo = TZ_OPTIONS.filter(function(t){return t.v===show.airTimeZone;})[0];
      base += ' (' + fmtTime(new Date('2000-01-01T'+show.airTimeOriginal+':00')) + ' ' + (tzInfo?tzInfo.l:show.airTimeZone) + ')';
    }
    return base + (show.episodeMinutes ? ' · ~' + show.episodeMinutes + ' min each' : '');
  }
  function posterStyle(show){
    var g = GRADIENTS[(show.posterIndex||0) % GRADIENTS.length];
    return 'background:linear-gradient(135deg,' + g[0] + ',' + g[1] + ');';
  }
  function initialOf(show){ return (show.title||'?').trim().charAt(0).toUpperCase(); }
  function clamp(n, lo, hi){ return Math.max(lo, Math.min(hi, n)); }
  function defaultCrops(){ return { thumbnail:{x:50,y:50,zoom:100}, grid:{x:50,y:50,zoom:100}, banner:{x:50,y:50,zoom:100} }; }
  function castEntry(c){
    if(typeof c === 'string') return { name:c, photo:null, crop:{x:50,y:50,zoom:100} };
    return { name:(c && c.name) || '', photo:(c && c.photo) || null, crop:(c && c.crop) || {x:50,y:50,zoom:100} };
  }
  function cropImgTag(photoUrl, crop, cls){
    if(!photoUrl) return '';
    var c = crop || {x:50,y:50,zoom:100};
    return '<img class="poster-img ' + (cls||'') + '" src="' + photoUrl + '" alt="" draggable="false" style="object-position:' + c.x + '% ' + c.y + '%; transform-origin:' + c.x + '% ' + c.y + '%; transform:scale(' + (c.zoom/100) + ');">';
  }
  function posterImgTag(showLike, slot, cls){
    if(!showLike || !showLike.posterImage) return '';
    var c = (showLike.posterCrops && showLike.posterCrops[slot]) || {x:50,y:50,zoom:100};
    return cropImgTag(showLike.posterImage, c, cls);
  }
  function castImgTag(castObj, cls){
    if(!castObj || !castObj.photo) return '';
    return cropImgTag(castObj.photo, castObj.crop, cls);
  }
  function isWideLayout(){
    return window.matchMedia && window.matchMedia('(min-width: 700px)').matches;
  }

  /* ---------------- state ---------------- */
  var STORAGE_KEY = 'twatched_state_v1';
  var GH_KEY = 'twatched_gh_v1';

  var state = {
    activeTab: 'home',
    overlay: null,          // null | 'detail' | 'form'
    justOpenedOverlay: false,
    detailShowId: null,
    editingShowId: null,
    formOrigin: null,        // 'browse' | 'detail'
    formDraft: null,
    confirmDeleteId: null,
    theme: 'system',         // 'system' | 'light' | 'dark'
    shows: [],
    updatedAt: 0,            // last local data change, for sync comparison
    metaUpdatedAt: 0,        // last change to the shared lists (genres, folders, nationalities, labels)
    deleted: {},             // id -> time deleted, so a deletion survives a merge with another device
    syncQueued: false,       // a sync was requested while one was running; re-run when it finishes
    gh: null,                // { owner, repo, token } | null
    ghSha: null,
    ghStatus: null,          // { type: 'info'|'success'|'error', msg }
    lastSyncedAt: null,
    syncing: false,
    categories: null,
    folders: [],
    nationalityOptions: NATIONALITY_OPTIONS_DEFAULT.slice(),
    relationshipTypes: RELATIONSHIP_TYPES_DEFAULT.slice(),
    seasonLabels: SEASON_LABELS_DEFAULT.slice(),
    feelingOptions: FEELING_OPTIONS_DEFAULT.slice(),
    rateSheet: null,         // { showId, ep, isNew, r, e[], animate } while the rate sheet is open
    scoreBoxOpen: false,
    statsMode: 'week',       // week | month | year | all  (opens on this week)
    statsAnchor: Date.now(),
    addingRelatedFor: null, // show id whose "add related" panel is open
    managingList: null,      // null | 'nationality' | 'season'
    managingCategories: false,
    genrePickerExpanded: false,
    browseEditMode: false,
    browseViewMode: 'all', // 'all' | 'folder' | 'movies'
    formKind: 'show', // 'show' | 'movie' — which form is currently open
    renamingFolderId: null,
    homeCategoryFilter: null,
    addingShowsFolderId: null,
    castCropTargetIndex: null
  };
  var dragState = null;
  var castPhotoTargetIndex = null;
  var resizeTimer = null;

  function buildCategories(source){
    if(source && source.categories && source.categories.length){
      return source.categories.map(function(c){ return { id:c.id, name:c.name, genres:(c.genres||[]).slice() }; });
    }
    if(source && source.genreOptionsByCategory && source.genreOptionsByCategory.drama && source.genreOptionsByCategory.drama.length){
      return [
        { id:'drama', name:'Drama', genres: source.genreOptionsByCategory.drama.slice() },
        { id:'variety', name:'Variety', genres: (source.genreOptionsByCategory.variety && source.genreOptionsByCategory.variety.length) ? source.genreOptionsByCategory.variety.slice() : VARIETY_GENRES_DEFAULT.slice() }
      ];
    }
    if(source && source.genreOptions && source.genreOptions.length){
      return [
        { id:'drama', name:'Drama', genres: source.genreOptions.slice() },
        { id:'variety', name:'Variety', genres: VARIETY_GENRES_DEFAULT.slice() }
      ];
    }
    return [
      { id:'drama', name:'Drama', genres: GENRE_OPTIONS_DEFAULT.slice() },
      { id:'variety', name:'Variety', genres: VARIETY_GENRES_DEFAULT.slice() }
    ];
  }
  function ensureMovieCategory(cats){
    if(!cats.some(function(c){ return c.id === 'movie'; })){
      cats.push({ id:'movie', name:'Movie', genres: MOVIE_GENRES_DEFAULT.slice() });
    }
    return cats;
  }
  function getCategory(id){ return state.categories.filter(function(c){return c.id===id;})[0] || null; }
  function genreCategoryId(id){ return id === 'movie' ? 'drama' : id; }
  function getFolder(id){ return state.folders.filter(function(f){return f.id===id;})[0] || null; }
  function isCompletedItem(item){
    return item.type === 'movie' ? true : (item.watched >= item.totalEpisodes);
  }
  function finishedTime(item){
    if(item.type === 'movie') return item.watchedDate ? new Date(item.watchedDate).getTime() : 0;
    // Prefer the real watch-completion timestamp; shows completed before this was tracked have
    // no completedAt, so fall back to the old proxy (their last episode's air date) for those.
    if(item.completedAt) return item.completedAt;
    return computeEpisodeDate(item, item.totalEpisodes).getTime();
  }
  function autoSortShows(items, nowMs){
    return items.slice().sort(function(a,b){
      var ca = isCompletedItem(a) ? 1 : 0;
      var cb = isCompletedItem(b) ? 1 : 0;
      if(ca !== cb) return ca - cb; // active/not-started shows first, completed (and movies) last
      if(ca === 1){
        // both completed (or movies): most recently finished/watched first
        return finishedTime(b) - finishedTime(a);
      }
      // both active/not-started: soonest next-episode air date first, same convention as Coming Up
      var infoA = getNextEpisodeInfo(a, nowMs), infoB = getNextEpisodeInfo(b, nowMs);
      var ta = infoA.completed ? Infinity : infoA.airDate.getTime();
      var tb = infoB.completed ? Infinity : infoB.airDate.getTime();
      return ta - tb;
    });
  }
  function orderedFolderItems(folder, items){
    return autoSortShows(items, Date.now());
  }

  function migrateShow(s){
    if(!s.folderIds) s.folderIds = [];
    if(!s.type) s.type = 'show';
    if(!s.related) s.related = [];
    if(s.seasonLabel === undefined) s.seasonLabel = '';
  }
  /* ---------------- local storage ----------------
     The app's data (with all poster/cast photos) has outgrown localStorage's ~5 MB cap on iPhone, which
     made saves fail silently — so each launch started from an old copy until sync re-downloaded the rest.
     It now lives in IndexedDB, which has no such limit. localStorage only keeps tiny settings. */
  var THEME_KEY = 'twatched_theme_v1';
  var IDB_NAME = 'twatched_db', IDB_STORE = 'kv';
  var booted = false;          // nothing may be saved or synced until the saved data has been loaded
  var dbPromise = null;
  function openDb(){
    if(dbPromise) return dbPromise;
    dbPromise = new Promise(function(resolve, reject){
      try{
        if(!window.indexedDB){ reject(new Error('no indexedDB')); return; }
        var req = indexedDB.open(IDB_NAME, 1);
        req.onupgradeneeded = function(){ req.result.createObjectStore(IDB_STORE); };
        req.onsuccess = function(){ resolve(req.result); };
        req.onerror = function(){ reject(req.error); };
        req.onblocked = function(){ reject(new Error('indexedDB blocked')); };
      }catch(e){ reject(e); }
    });
    return dbPromise;
  }
  function idbGet(key){
    return openDb().then(function(db){
      return new Promise(function(resolve, reject){
        var r = db.transaction(IDB_STORE).objectStore(IDB_STORE).get(key);
        r.onsuccess = function(){ resolve(r.result); };
        r.onerror = function(){ reject(r.error); };
      });
    });
  }
  function idbSet(key, val){
    return openDb().then(function(db){
      return new Promise(function(resolve, reject){
        var tx = db.transaction(IDB_STORE, 'readwrite');
        tx.objectStore(IDB_STORE).put(val, key);
        tx.oncomplete = function(){ resolve(); };
        tx.onerror = function(){ reject(tx.error); };
        tx.onabort = function(){ reject(tx.error); };
      });
    });
  }
  function applyLoaded(loaded){
    state.shows = loaded.shows || [];
    state.shows.forEach(migrateShow);
    state.theme = loaded.theme || 'system';
    state.updatedAt = loaded.updatedAt || 0;
    state.metaUpdatedAt = loaded.metaUpdatedAt || 0;
    state.deleted = loaded.deleted || {};
    state.categories = ensureMovieCategory(buildCategories(loaded));
    state.folders = (loaded.folders && loaded.folders.length) ? loaded.folders : [];
    state.nationalityOptions = (loaded.nationalityOptions && loaded.nationalityOptions.length) ? loaded.nationalityOptions : NATIONALITY_OPTIONS_DEFAULT.slice();
    state.relationshipTypes = (loaded.relationshipTypes && loaded.relationshipTypes.length) ? loaded.relationshipTypes : RELATIONSHIP_TYPES_DEFAULT.slice();
    state.seasonLabels = (loaded.seasonLabels && loaded.seasonLabels.length) ? loaded.seasonLabels : SEASON_LABELS_DEFAULT.slice();
    state.feelingOptions = (loaded.feelingOptions && loaded.feelingOptions.length) ? loaded.feelingOptions : FEELING_OPTIONS_DEFAULT.slice();
  }
  function loadState(done){
    function legacyLocalStorage(){
      try{
        var raw = localStorage.getItem(STORAGE_KEY);
        if(raw) return JSON.parse(raw);
      }catch(e){}
      return null;
    }
    function finish(loaded, fromLegacy){
      try{ if(loaded) applyLoaded(loaded); }catch(e){ /* start empty */ }
      if(!state.categories) state.categories = ensureMovieCategory(buildCategories(null));
      try{
        var rawGh = localStorage.getItem(GH_KEY);
        if(rawGh) state.gh = JSON.parse(rawGh);
      }catch(e){ state.gh = null; }
      done(fromLegacy && !!loaded);
    }
    idbGet(STORAGE_KEY).then(function(rec){
      var loaded = null;
      if(rec){ try{ loaded = JSON.parse(rec); }catch(e){ loaded = null; } }
      if(loaded) finish(loaded, false);
      else finish(legacyLocalStorage(), true);
    }).catch(function(){ finish(legacyLocalStorage(), false); });
  }
  var persistChain = Promise.resolve();
  function persistLocal(){
    if(!booted) return;   // never save before the stored data has been read, or we'd overwrite it with an empty state
    var json;
    try{
      json = JSON.stringify({
        shows: state.shows, theme: state.theme,
        updatedAt: state.updatedAt, metaUpdatedAt: state.metaUpdatedAt, deleted: state.deleted,
        categories: state.categories, folders: state.folders, nationalityOptions: state.nationalityOptions,
        relationshipTypes: state.relationshipTypes, seasonLabels: state.seasonLabels, feelingOptions: state.feelingOptions
      });
    }catch(e){ return; }
    try{ localStorage.setItem(THEME_KEY, state.theme); }catch(e){}
    persistChain = persistChain.then(function(){ return idbSet(STORAGE_KEY, json); }).then(function(){
      try{ localStorage.removeItem(STORAGE_KEY); }catch(e){}   // drop the old, size-limited copy
    }).catch(function(){
      try{ localStorage.setItem(STORAGE_KEY, json); }catch(e){ /* storage unavailable — works in memory this session */ }
    });
  }
  function saveGH(cfg){
    try{ localStorage.setItem(GH_KEY, cfg ? JSON.stringify(cfg) : ''); }catch(e){}
  }
  // Only re-render after a background sync if it actually pulled newer remote data — syncing
  // that confirms "already up to date" or just pushes the local copy changes nothing visible,
  // so rendering anyway was pure flicker (most noticeable right at app launch, when this sync
  // fires immediately after the first render).
  function syncAndMaybeRender(){
    if(!state.gh || !booted) return;
    syncNow().then(function(result){
      if(result && result.action === 'pulled') render();
    });
  }
  /* Change tracking for sync. Every show carries modifiedAt; deletions are remembered in state.deleted.
     Rather than touching every edit site, touch() compares each show with a snapshot taken at the last
     touch/sync and stamps only the ones that actually changed. */
  var snapShows = {}, snapMeta = '';
  function showJson(s){ return JSON.stringify(s, function(k, v){ return k === 'modifiedAt' ? undefined : v; }); }
  function metaObj(){
    return { categories: state.categories, folders: state.folders, nationalityOptions: state.nationalityOptions,
             relationshipTypes: state.relationshipTypes, seasonLabels: state.seasonLabels, feelingOptions: state.feelingOptions };
  }
  function resetSnapshot(){
    snapShows = {};
    state.shows.forEach(function(s){ snapShows[s.id] = showJson(s); });
    snapMeta = JSON.stringify(metaObj());
  }
  function stampChanges(){
    var now = Date.now(), cur = {};
    state.shows.forEach(function(s){
      var j = showJson(s); cur[s.id] = j;
      if(snapShows[s.id] !== j){ s.modifiedAt = now; delete state.deleted[s.id]; }
      else if(!s.modifiedAt){ s.modifiedAt = state.updatedAt || 0; }
    });
    Object.keys(snapShows).forEach(function(id){ if(!(id in cur)) state.deleted[id] = now; });
    snapShows = cur;
    var m = JSON.stringify(metaObj());
    if(m !== snapMeta){ state.metaUpdatedAt = now; snapMeta = m; }
  }
  function touch(){ stampChanges(); state.updatedAt = Date.now(); persistLocal(); syncAndMaybeRender(); }
  function currentGenreList(){
    var cat = getCategory(state.formDraft && state.formDraft.category);
    return cat ? cat.genres : [];
  }
  function listByKey(listKey){
    if(listKey === 'genre') return currentGenreList();
    if(listKey === 'season') return state.seasonLabels;
    if(listKey === 'feeling') return state.feelingOptions;
    return state.nationalityOptions;
  }

  function getShow(id){ return state.shows.filter(function(s){return s.id===id;})[0] || null; }

  /* ---------------- GitHub sync ---------------- */
  function b64EncodeUnicode(str){ return btoa(unescape(encodeURIComponent(str))); }
  function b64DecodeUnicode(str){ return decodeURIComponent(escape(atob(str.replace(/\n/g,'')))); }

  function ghGetFile(cfg){
    var base = 'https://api.github.com/repos/' + cfg.owner + '/' + cfg.repo;
    var headers = { 'Authorization':'Bearer ' + cfg.token, 'Accept':'application/vnd.github+json' };
    function parse(b64){ try{ return JSON.parse(b64DecodeUnicode(b64)); }catch(e){ return null; } }
    return fetch(base + '/contents/data.json', { headers: headers, cache:'no-store' })
      .then(function(res){
        if(res.status === 404) return { exists:false };
        if(!res.ok) return res.text().then(function(t){ throw new Error('GitHub GET ' + res.status + ': ' + t); });
        return res.json().then(function(json){
          if(json.size === 0) return { exists:true, sha: json.sha, data: {} };
          if(json.content && json.encoding !== 'none'){
            return { exists:true, sha: json.sha, data: parse(json.content) };
          }
          // Files over 1 MB come back from the contents API with no body — fetch the blob instead.
          return fetch(base + '/git/blobs/' + json.sha, { headers: headers, cache:'no-store' }).then(function(r){
            if(!r.ok) return r.text().then(function(t){ throw new Error('GitHub blob ' + r.status + ': ' + t); });
            return r.json().then(function(blob){ return { exists:true, sha: json.sha, data: parse(blob.content) }; });
          });
        });
      });
  }
  function ghPutFile(cfg, dataObj, sha){
    var url = 'https://api.github.com/repos/' + cfg.owner + '/' + cfg.repo + '/contents/data.json';
    var body = {
      message: 'TWatched sync ' + new Date().toISOString(),
      content: b64EncodeUnicode(JSON.stringify(dataObj))
    };
    if(sha) body.sha = sha;
    return fetch(url, {
      method: 'PUT',
      headers: { 'Authorization':'Bearer ' + cfg.token, 'Accept':'application/vnd.github+json' },
      body: JSON.stringify(body)
    }).then(function(res){
      if(!res.ok) return res.text().then(function(t){ throw new Error('GitHub PUT ' + res.status + ': ' + t); });
      return res.json();
    });
  }

  function syncPayload(){
    return { shows: state.shows, updatedAt: state.updatedAt, metaUpdatedAt: state.metaUpdatedAt, deleted: state.deleted,
             categories: state.categories, folders: state.folders, nationalityOptions: state.nationalityOptions,
             relationshipTypes: state.relationshipTypes, seasonLabels: state.seasonLabels, feelingOptions: state.feelingOptions };
  }

  function stable(v){
    if(Array.isArray(v)) return '[' + v.map(stable).join(',') + ']';
    if(v && typeof v === 'object'){
      return '{' + Object.keys(v).sort().filter(function(k){ return v[k] !== undefined; }).map(function(k){ return JSON.stringify(k) + ':' + stable(v[k]); }).join(',') + '}';
    }
    return JSON.stringify(v);
  }
  function fingerprint(shows, deleted, meta, metaAt){
    var sorted = shows.slice().sort(function(a,b){ return a.id < b.id ? -1 : (a.id > b.id ? 1 : 0); });
    return stable({ shows: sorted, deleted: deleted || {}, meta: meta, metaAt: metaAt || 0 });
  }

  // Merge the remote copy into local state, show by show. Newer modifiedAt wins per show, a show
  // only on one side is kept, and a deletion only removes a show that wasn't edited after it.
  // Nothing is ever dropped just because another device's copy is "newer" overall.
  function applyRemote(rd){
    var lUpd = state.updatedAt || 0, rUpd = rd.updatedAt || 0;
    var remoteShows = (rd.shows || []).slice();
    remoteShows.forEach(migrateShow);
    state.shows.forEach(migrateShow);
    state.shows.forEach(function(s){ if(!s.modifiedAt) s.modifiedAt = lUpd; });
    remoteShows.forEach(function(s){ if(!s.modifiedAt) s.modifiedAt = rUpd; });

    var rMetaAt = rd.metaUpdatedAt || rUpd, lMetaAt = state.metaUpdatedAt || lUpd;
    var remoteMeta = { categories: rd.categories, folders: rd.folders, nationalityOptions: rd.nationalityOptions,
                       relationshipTypes: rd.relationshipTypes, seasonLabels: rd.seasonLabels, feelingOptions: rd.feelingOptions };
    var remoteFp = fingerprint(remoteShows, rd.deleted || {}, remoteMeta, rd.metaUpdatedAt || 0);

    var beforeFp = fingerprint(state.shows, state.deleted, metaObj(), state.metaUpdatedAt);

    var del = {};
    [state.deleted, rd.deleted || {}].forEach(function(m){ Object.keys(m).forEach(function(id){ del[id] = Math.max(del[id] || 0, m[id]); }); });
    var cutoff = Date.now() - 90*24*3600*1000;
    Object.keys(del).forEach(function(id){ if(del[id] < cutoff) delete del[id]; });

    var remoteById = {}; remoteShows.forEach(function(s){ remoteById[s.id] = s; });
    var seen = {}, merged = [];
    state.shows.forEach(function(l){
      seen[l.id] = true;
      var r = remoteById[l.id];
      merged.push(r && r.modifiedAt > l.modifiedAt ? r : l);
    });
    remoteShows.forEach(function(r){ if(!seen[r.id]) merged.push(r); });
    merged = merged.filter(function(s){
      var d = del[s.id];
      if(d && d >= s.modifiedAt) return false;
      if(d) delete del[s.id];
      return true;
    });

    state.shows = merged;
    state.deleted = del;
    state.updatedAt = Math.max(lUpd, rUpd);

    if(rMetaAt > lMetaAt){
      if(rd.categories || rd.genreOptionsByCategory || rd.genreOptions) state.categories = ensureMovieCategory(buildCategories(rd));
      if(rd.folders) state.folders = rd.folders;
      if(rd.nationalityOptions && rd.nationalityOptions.length) state.nationalityOptions = rd.nationalityOptions;
      if(rd.relationshipTypes && rd.relationshipTypes.length) state.relationshipTypes = rd.relationshipTypes;
      if(rd.seasonLabels && rd.seasonLabels.length) state.seasonLabels = rd.seasonLabels;
      if(rd.feelingOptions && rd.feelingOptions.length) state.feelingOptions = rd.feelingOptions;
      state.metaUpdatedAt = rMetaAt;
    } else if(!state.metaUpdatedAt){
      state.metaUpdatedAt = lMetaAt;
    }
    resetSnapshot();

    var afterFp = fingerprint(state.shows, state.deleted, metaObj(), state.metaUpdatedAt);
    return { changedLocal: afterFp !== beforeFp, needsPush: afterFp !== remoteFp };
  }

  function syncNow(isRetry){
    if(!state.gh) return Promise.resolve({ ok:false, reason:'skip' });
    if(state.syncing){ state.syncQueued = true; return Promise.resolve({ ok:false, reason:'skip' }); }
    state.syncing = true;
    function finish(){
      state.syncing = false;
      if(state.syncQueued){ state.syncQueued = false; setTimeout(syncAndMaybeRender, 0); }
    }
    return ghGetFile(state.gh).then(function(remote){
      if(!remote.exists){
        return ghPutFile(state.gh, syncPayload()).then(function(put){
          state.ghSha = put.content.sha;
          return { ok:true, action:'created' };
        });
      }
      // Never overwrite a remote file we could not read — that is how data gets wiped.
      if(remote.data === null) throw new Error('Remote data.json could not be read');
      var res = applyRemote(remote.data);
      if(res.changedLocal) persistLocal();
      if(!res.needsPush){
        state.ghSha = remote.sha;
        return { ok:true, action: res.changedLocal ? 'pulled' : 'up-to-date' };
      }
      return ghPutFile(state.gh, syncPayload(), remote.sha).then(function(put){
        state.ghSha = put.content.sha;
        return { ok:true, action: res.changedLocal ? 'pulled' : 'pushed' };
      });
    }).then(function(result){
      state.lastSyncedAt = Date.now();
      finish();
      return result;
    }).catch(function(err){
      finish();
      var msg = String(err);
      // Someone else wrote between our read and write — read again and merge once more.
      if(!isRetry && /GitHub PUT (409|422)/.test(msg)) return syncNow(true);
      return { ok:false, reason:'error', error:msg };
    });
  }



  /* ================================================================
     STATS TAB + WRAP
     Read-only: nothing here writes to state.shows or saves anything.
     It only reads shows/movies and the per-episode watch log.
     ================================================================ */
  var ST_MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var ST_MONL = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var ST_DOW = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  var ST_DOWL = ['Mondays','Tuesdays','Wednesdays','Thursdays','Fridays','Saturdays','Sundays'];
  var ST_STATUS = [['Finished','--st-s4'],['Caught up','--st-s3'],['In progress','--st-s2'],['Not started','--st-s1']];
  function stEsc(s){ return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  // Chart values: exact under 100 h, then whole hours with a thousands comma, so the number column stays short.
  function stHmS(m){ m = Math.round(m); return m >= 6000 ? Math.round(m/60).toLocaleString('en-US') + 'h' : stHm(m); }
  function stHm(m){ m = Math.round(m); var h = Math.floor(m/60), mm = m % 60; return h ? h + 'h' + (mm ? ' ' + mm + 'm' : '') : mm + 'm'; }
  function stAddDays(d, n){ var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function stMonday(d){ var x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x; }
  function stValid(d){ return d instanceof Date && !isNaN(d.getTime()); }

  // Every watched episode / movie as one entry. Episodes ticked since v2.11 carry their real tick
  // time (show.watchLog); older ones fall back to the episode's air date and are marked estimated.
  function statsLog(){
    var out = [];
    state.shows.forEach(function(s){
      if(s.type === 'movie'){
        if(!s.watchedDate) return;
        var md = new Date(s.watchedDate + 'T20:00:00');
        if(stValid(md)) out.push({ s:s, ep:0, ts:md, mins:s.runtimeMinutes || 0, est:false, hasTime:false });
        return;
      }
      var upTo = Math.min(s.watched || 0, s.totalEpisodes || 0);
      for(var e = 1; e <= upTo; e++){
        var logged = s.watchLog && s.watchLog[String(e)];
        var ts = logged ? new Date(logged) : computeEpisodeDate(s, e);
        if(!stValid(ts)) continue;
        out.push({ s:s, ep:e, ts:ts, mins:s.episodeMinutes || 0, est:!logged, hasTime:!!logged });
      }
    });
    out.sort(function(a,b){ return a.ts - b.ts; });
    return out;
  }
  function statsCategories(){
    var names = state.categories.filter(function(c){ return c.id !== 'movie'; }).map(function(c){ return c.name; });
    var list = names.slice(0, 7); if(names.length > 7) list.push('Other');
    list.push('Movie');
    return list;
  }
  function statsCatOf(s){
    if(s.type === 'movie') return 'Movie';
    var cats = statsCategories(); var n = (getCategory(s.category) || {}).name;
    return (n && cats.indexOf(n) !== -1) ? n : 'Other';
  }
  function statsCatColor(name){
    var i = statsCategories().indexOf(name);
    return 'var(--st-c' + (Math.max(0,i) % 8 + 1) + ')';
  }
  function statsCatLabel(name){ return name === 'Movie' ? 'Movies' : name; }

  function statsRange(){
    var a = new Date(state.statsAnchor), mode = state.statsMode;
    if(mode === 'week'){ var s = stMonday(a); return { s:s, e:stAddDays(s,7) }; }
    if(mode === 'month') return { s:new Date(a.getFullYear(), a.getMonth(), 1), e:new Date(a.getFullYear(), a.getMonth()+1, 1) };
    if(mode === 'year') return { s:new Date(a.getFullYear(),0,1), e:new Date(a.getFullYear()+1,0,1) };
    var log = statsLog(); var first = log.length ? log[0].ts : new Date();
    return { s:new Date(first.getFullYear(), first.getMonth(), 1), e:stAddDays(new Date(), 1) };
  }
  function statsShortLabel(){
    var a = new Date(state.statsAnchor);
    if(state.statsMode === 'week'){ var s = stMonday(a); return 'week of ' + s.getDate() + ' ' + ST_MON[s.getMonth()]; }
    if(state.statsMode === 'month') return ST_MONL[a.getMonth()];
    if(state.statsMode === 'year') return String(a.getFullYear());
    return 'all time';
  }
  function statsPeriodLabel(){
    var r = statsRange(), a = new Date(state.statsAnchor);
    if(state.statsMode === 'week'){ var e = stAddDays(r.s,6); return 'Mon ' + r.s.getDate() + ' ' + ST_MON[r.s.getMonth()] + ' – Sun ' + e.getDate() + ' ' + ST_MON[e.getMonth()] + ' <small>' + e.getFullYear() + '</small>'; }
    if(state.statsMode === 'month') return ST_MONL[a.getMonth()] + ' <small>' + a.getFullYear() + '</small>';
    if(state.statsMode === 'year') return String(a.getFullYear());
    return 'Since ' + ST_MON[r.s.getMonth()] + ' ' + r.s.getFullYear();
  }
  function statsCanStep(dir, log){
    if(state.statsMode === 'all') return false;
    var r = statsRange();
    if(dir > 0) return r.e <= new Date();
    return log.length ? r.s > log[0].ts : false;
  }

  function statsCompute(){
    var log = statsLog(), r = statsRange(), now = new Date();
    var es = log.filter(function(x){ return x.ts >= r.s && x.ts < r.e; });
    var st = { log:log, entries:es, mins:0, estMins:0, eps:0, movies:0, noLen:0, titles:{}, byCat:{}, byGenre:{}, genreIds:{}, byNat:{}, byDow:[0,0,0,0,0,0,0], byHour:{}, finished:[] };
    es.forEach(function(x){
      var s = x.s, id = s.id;
      st.mins += x.mins; if(x.est) st.estMins += x.mins;
      if(x.ep) st.eps++; else st.movies++;
      if(!x.mins) st.noLen++;
      var t = st.titles[id] || (st.titles[id] = { s:s, mins:0, eps:0 }); t.mins += x.mins; if(x.ep) t.eps++;
      var c = statsCatOf(s); st.byCat[c] = (st.byCat[c] || 0) + x.mins;
      (s.genres || []).forEach(function(g){ st.byGenre[g] = (st.byGenre[g] || 0) + x.mins; var ids = st.genreIds[g] || (st.genreIds[g] = []); if(ids.indexOf(id) === -1) ids.push(id); });
      if(s.nationality) st.byNat[s.nationality] = (st.byNat[s.nationality] || 0) + x.mins;
      if(!x.est) st.byDow[(x.ts.getDay() + 6) % 7] += x.mins;
      if(x.hasTime){ var h = x.ts.getHours(); st.byHour[h] = (st.byHour[h] || 0) + x.mins; }
      var done = s.type === 'movie' || (x.ep === s.totalEpisodes && s.watched >= s.totalEpisodes);
      if(done && st.finished.indexOf(id) === -1) st.finished.push(id);
    });
    // where each title stood at the end of the period
    var end = r.e < now ? r.e : now; st.status = {};
    state.shows.forEach(function(s){
      var seen = 0; log.forEach(function(x){ if(x.s === s && x.ts < end) seen++; });
      var cat = statsCatOf(s); var o;
      if(s.type === 'movie'){ if(seen){ o = st.status[cat] || (st.status[cat] = {}); o['Finished'] = (o['Finished'] || 0) + 1; } return; }
      var added = parseInt(String(s.id).replace(/^\D+/, ''), 10);
      if(!seen && added && added > 1e12 && added >= end.getTime()) return;   // not in your list yet
      var aired = 0;
      for(var e = 1; e <= s.totalEpisodes; e++){ var d = computeEpisodeDate(s, e); if(stValid(d) && d < end) aired++; else break; }
      var k = seen === 0 ? 'Not started' : (seen >= s.totalEpisodes ? 'Finished' : (seen >= aired ? 'Caught up' : 'In progress'));
      o = st.status[cat] || (st.status[cat] = {}); o[k] = (o[k] || 0) + 1;
    });
    st.ranked = Object.keys(st.titles).map(function(k){ return st.titles[k]; }).sort(function(a,b){ return b.mins - a.mins || b.eps - a.eps; });
    st.genres = Object.keys(st.byGenre).map(function(g){
      return { name:g, m:st.byGenre[g], ids:st.genreIds[g].slice().sort(function(a,b){ return st.titles[b].mins - st.titles[a].mins; }) };
    }).sort(function(a,b){ return b.m - a.m; });
    return st;
  }

  function stPoster(s, extra, style){
    var img = s.posterImage ? '<img src="' + s.posterImage + '" alt="" draggable="false">' : '<span class="st-ini">' + initialOf(s) + '</span>';
    return '<div class="st-pst" style="' + (style || '') + (s.posterImage ? '' : posterStyle(s)) + '">' + img + (extra || '') + '</div>';
  }
  function stRoundTop(x,y,w,h,r){ r = Math.min(r,h); return 'M'+x+','+(y+h)+'V'+(y+r)+'Q'+x+','+y+' '+(x+r)+','+y+'H'+(x+w-r)+'Q'+(x+w)+','+y+' '+(x+w)+','+(y+r)+'V'+(y+h)+'Z'; }
  // Above 250 h a bigger step keeps it to about 5 grid lines, however large the numbers get (it was every 50 h before).
  function stTickStep(maxH){ var steps = [50,100,200,250,500], m = 1; for(;;){ for(var i = 0; i < steps.length; i++) if(maxH / (steps[i]*m) <= 5) return steps[i]*m; m *= 10; } }
  function stTicks(maxH){ var sH = maxH<=2?0.5: maxH<=5?1: maxH<=12?2: maxH<=30?5: maxH<=60?10: maxH<=150?25: stTickStep(maxH); var t=[0]; while(t[t.length-1] < maxH) t.push(+(t[t.length-1]+sH).toFixed(1)); return t; }

  function renderStats(){
    var st = statsCompute();
    var periodHtml = '<div class="st-seg">' + [['week','Week'],['month','Month'],['year','Year'],['all','All time']].map(function(m){
        return '<button type="button" class="' + (state.statsMode === m[0] ? 'on' : '') + '" data-action="stats-mode" data-value="' + m[0] + '">' + m[1] + '</button>'; }).join('') + '</div>' +
      '<div class="st-stepper">' + (state.statsMode === 'all' ? '<div class="st-label st-label--static">' + statsPeriodLabel() + '</div>' :
        '<button type="button" class="st-arrow" data-action="stats-step" data-value="-1" aria-label="Previous"' + (statsCanStep(-1, st.log) ? '' : ' disabled') + '>' + icon('left') + '</button>' +
        '<button type="button" class="st-label" data-action="stats-pick">' + statsPeriodLabel() + ' ▾</button>' +
        '<button type="button" class="st-arrow" data-action="stats-step" data-value="1" aria-label="Next"' + (statsCanStep(1, st.log) ? '' : ' disabled') + '>' + icon('right') + '</button>') + '</div>';
    var out = '<div class="screen-pad"><h1 class="screen-title">Stats</h1><p class="screen-kicker">What you watched, when, and what you like.</p>' + periodHtml;
    if(!st.log.length){
      return out + '<div class="st-card st-empty">Nothing watched yet. Tick an episode or log a movie and your stats start here.</div></div>';
    }
    if(!st.entries.length){
      return out + '<div class="st-card st-empty">Nothing watched in ' + stEsc(statsShortLabel()) + '.</div>' + stStatusCard(st) + '</div>';
    }
    var top3 = st.ranked.slice(0,3);
    out += '<button type="button" class="st-play" data-action="stats-play"><span class="st-play-ic">▶</span><span class="st-play-tx"><b>Play your ' + stEsc(state.statsMode === 'all' ? 'all-time' : statsShortLabel()) + ' wrap</b><span>6 cards · about 40 seconds</span></span>' +
      '<span class="st-peek">' + top3.map(function(t){ return stPoster(t.s); }).join('') + '</span></button>';
    out += '<div class="st-kpis"><div class="st-kpi st-kpi--hero"><div class="v">' + Math.floor(st.mins/60) + '<small> h </small>' + Math.round(st.mins % 60) + '<small> m</small></div><div class="l">Time watched · ' + stEsc(statsShortLabel()) + '</div>' +
        (st.estMins ? '<span class="st-est">≈ ' + stHm(st.estMins) + ' estimated from air dates</span>' : '') + '</div>' +
      '<div class="st-kpi"><div class="v">' + st.eps + '</div><div class="l">Episodes</div></div>' +
      '<div class="st-kpi"><div class="v">' + st.movies + '</div><div class="l">Movies</div></div>' +
      '<div class="st-kpi"><div class="v">' + st.ranked.length + '</div><div class="l">Titles watched</div></div>' +
      '<div class="st-kpi"><div class="v">' + st.finished.length + '</div><div class="l">Finished</div></div></div>';
    out += (state.statsMode === 'all' ? stHeatmapCard(st) : stActivityCard(st)) + stStatusCard(st) + stTypeCard(st) + stGenreCard(st) + stTopCard(st) + stHabitCard(st);
    if(st.noLen) out += '<p class="st-note">' + st.noLen + ' watched item' + (st.noLen > 1 ? 's have' : ' has') + ' no length set, so ' + (st.noLen > 1 ? 'they count' : 'it counts') + ' toward episodes and movies but adds no time.</p>';
    return out + '</div>';
  }
  var ST_LEGEND_EST = '<div class="st-legend"><span><i style="background:var(--st-bar)"></i>Logged when you ticked</span><span><i style="background:repeating-linear-gradient(45deg,var(--st-bar) 0 2px,transparent 2px 4px)"></i>Estimated (air date)</span></div>';
  function stActivityCard(st){
    var r = statsRange(), b = [], byDay = state.statsMode === 'week' || state.statsMode === 'month';
    if(byDay){ for(var d = new Date(r.s); d < r.e; d = stAddDays(d,1)) b.push({ s:new Date(d), e:stAddDays(d,1), lab: state.statsMode === 'week' ? ST_DOW[(d.getDay()+6)%7] : String(d.getDate()), long: ST_DOW[(d.getDay()+6)%7] + ' ' + d.getDate() + ' ' + ST_MON[d.getMonth()] }); }
    else { for(var m = new Date(r.s); m < r.e; m = new Date(m.getFullYear(), m.getMonth()+1, 1)) b.push({ s:new Date(m), e:new Date(m.getFullYear(), m.getMonth()+1, 1), lab: ST_MON[m.getMonth()].charAt(0), long: ST_MONL[m.getMonth()] + ' ' + m.getFullYear() }); }
    b.forEach(function(x){ x.mins = 0; x.est = 0; x.n = 0; st.entries.forEach(function(e){ if(e.ts >= x.s && e.ts < x.e){ x.mins += e.mins; x.n++; if(e.est) x.est += e.mins; } }); });
    var max = Math.max.apply(null, b.map(function(x){ return x.mins; })) || 1;
    var ticks = stTicks(max/60), tickLab = ticks.map(function(t){ return Number(t).toLocaleString('en-US') + 'h'; });
    var labLen = Math.max.apply(null, tickLab.map(function(l){ return l.length; }));   // wider labels (e.g. "1,000h") get more room
    var W = 340, H = 132, pl = Math.max(28, Math.ceil(8 + 5.5*labLen)), pb = 18, pt = 8, cw = (W-pl)/b.length, bw = Math.max(3, Math.min(24, cw-2)), plotH = H-pb-pt, base = H-pb;
    var top = ticks[ticks.length-1]*60 || 1, every = b.length > 16 ? 5 : 1;
    var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" role="img" aria-label="Hours watched per ' + (byDay ? 'day' : 'month') + '">' + stHatchDefs();
    ticks.forEach(function(t, ti){ var y = pt + plotH*(1 - t*60/top); svg += '<line x1="' + pl + '" x2="' + W + '" y1="' + y + '" y2="' + y + '" style="stroke:var(--st-grid)"/><text x="' + (pl-6) + '" y="' + (y+3.5) + '" font-size="9.5" text-anchor="end" style="fill:var(--text-muted)">' + tickLab[ti] + '</text>'; });
    b.forEach(function(x, i){
      var cx = pl + cw*i + cw/2, hh = plotH*(x.mins/top), y = base - hh, he = plotH*(x.est/top);
      if(x.mins){
        var dpath = stRoundTop(cx-bw/2, y, bw, hh, Math.min(4, bw/2));
        svg += '<path d="' + dpath + '" style="fill:var(--st-bar)"/>';
        if(x.est){ var ep = x.est >= x.mins ? dpath : 'M'+(cx-bw/2)+','+base+'V'+(base-he+1)+'H'+(cx+bw/2)+'V'+base+'Z'; svg += '<path d="' + ep + '" style="fill:var(--surface)"/><path d="' + ep + '" fill="url(#stHatch)"/>'; }
      }
      svg += '<rect x="' + (pl+cw*i) + '" y="' + pt + '" width="' + cw + '" height="' + plotH + '" fill="transparent" data-tip="' + stEsc(x.long + ' · ' + (x.mins ? stHm(x.mins) + ' · ' + x.n + ' watched' + (x.est ? ' · ' + stHm(x.est) + ' estimated' : '') : 'nothing watched')) + '"/>';
      if(i === 0 || (i+1) % every === 0 || state.statsMode !== 'month') svg += '<text x="' + cx + '" y="' + (H-4) + '" font-size="9.5" text-anchor="middle" style="fill:var(--text-muted)">' + x.lab + '</text>';
    });
    svg += '</svg>';
    var best = b.slice().sort(function(a,c){ return c.mins - a.mins; })[0];
    return '<div class="st-card"><h3>Watching activity</h3><p class="st-sub">Hours per ' + (byDay ? 'day' : 'month') + (best && best.mins ? ' · busiest: ' + best.long + ' (' + stHm(best.mins) + ')' : '') + '</p>' + (st.estMins ? ST_LEGEND_EST : '') + svg + '</div>';
  }
  function stHatchDefs(){
    return '<defs><pattern id="stHatch" patternUnits="userSpaceOnUse" width="5" height="5" patternTransform="rotate(45)"><rect width="5" height="5" style="fill:var(--st-bar);opacity:.28"/><line x1="0" y1="0" x2="0" y2="5" style="stroke:var(--st-bar);stroke-width:2.4"/></pattern></defs>';
  }
  // Hours printed inside a heatmap month: "8", "120", "3k". If a cell is too narrow for it, CSS hides it
  // (the tooltip still has the exact time), so it never spills out of the square.
  function stHeatLabel(m){ var h = Math.round(m/60), t = h < 1000 ? String(h) : Math.round(h/1000) + 'k'; return '<b class="l' + Math.min(3, t.length) + '">' + t + '</b>'; }
  function stHeatmapCard(st){
    var log = st.log, months = {}, maxM = 1, years = [], now = new Date();
    log.forEach(function(x){ var k = x.ts.getFullYear() + '-' + x.ts.getMonth(); var b = months[k] || (months[k] = { mins:0, est:0, n:0 }); b.mins += x.mins; b.n++; if(x.est) b.est += x.mins; if(b.mins > maxM) maxM = b.mins; });
    for(var y = log[0].ts.getFullYear(); y <= now.getFullYear(); y++) years.push(y);
    var steps = ['--st-q1','--st-q2','--st-q3','--st-q4','--st-q5'], busy = null;
    Object.keys(months).forEach(function(k){ if(!busy || months[k].mins > months[busy].mins) busy = k; });
    var h = '<div class="st-hm"><span></span>' + ST_MON.map(function(m){ return '<span class="ml">' + m.charAt(0) + '</span>'; }).join('') + '<span class="ml" style="text-align:right">Total</span>';
    years.slice().reverse().forEach(function(y){
      var tot = 0; h += '<span class="yl">' + y + '</span>';
      for(var k = 0; k < 12; k++){
        var start = new Date(y, k, 1), b = months[y + '-' + k];
        if(start > now){ h += '<span class="c future"></span>'; continue; }
        if(!b){ h += '<button type="button" class="c" data-action="stats-heat" data-value="' + y + '-' + k + '" data-tip="' + ST_MONL[k] + ' ' + y + ' · nothing watched"></button>'; continue; }
        tot += b.mins; var L = Math.min(4, Math.floor(b.mins/maxM*5));
        h += '<button type="button" class="c' + (b.est >= b.mins/2 && b.mins ? ' est' : '') + '" data-action="stats-heat" data-value="' + y + '-' + k + '" style="background:var(' + steps[L] + ');color:' + (L >= 2 ? '#fff' : 'var(--text)') + '" data-tip="' + stEsc(ST_MONL[k] + ' ' + y + ' · ' + stHm(b.mins) + (b.est ? ' · ' + stHm(b.est) + ' estimated' : '') + ' · tap to open') + '">' + (b.mins >= 300 ? stHeatLabel(b.mins) : '') + '</button>';
      }
      h += '<span class="yt">' + Math.round(tot/60).toLocaleString('en-US') + 'h</span>';
    });
    var bp = busy.split('-');
    h += '</div><div class="st-scale">0h <i style="background:var(--st-q0)"></i>' + steps.map(function(s){ return '<i style="background:var(' + s + ')"></i>'; }).join('') + ' ' + Math.round(maxM/60) + 'h · striped = mostly estimated</div>';
    return '<div class="st-card"><h3>Watching activity</h3><p class="st-sub">Hours per month · busiest: ' + ST_MONL[+bp[1]] + ' ' + bp[0] + ' (' + stHm(months[busy].mins) + '). Tap a month to open it.</p>' + h + '</div>';
  }
  function stStatusCard(st){
    var cats = statsCategories().filter(function(c){ return st.status[c]; }); if(!cats.length) return '';
    var max = Math.max.apply(null, cats.map(function(c){ return Object.keys(st.status[c]).reduce(function(a,k){ return a + st.status[c][k]; }, 0); }));
    var h = '<div class="st-card"><h3>Your list by status</h3><p class="st-sub">Where each title stood at the end of ' + stEsc(statsShortLabel()) + '</p><div class="st-legend">' +
      ST_STATUS.map(function(s){ return '<span><i style="background:var(' + s[1] + ')"></i>' + s[0] + '</span>'; }).join('') + '</div><div class="st-rows">';
    cats.forEach(function(c){
      var o = st.status[c], tot = 0; ST_STATUS.forEach(function(s){ tot += o[s[0]] || 0; });
      var parts = ST_STATUS.filter(function(s){ return o[s[0]]; });
      h += '<div class="st-row"><span class="nm" title="' + stEsc(statsCatLabel(c)) + '">' + stEsc(statsCatLabel(c)) + '</span><div class="st-lane"><div class="st-track" style="width:' + Math.min(100, tot/max*100) + '%">' +
        parts.map(function(s){ return '<span style="flex:' + o[s[0]] + ';background:var(' + s[1] + ')" data-tip="' + stEsc(statsCatLabel(c) + ' · ' + s[0] + ': ' + o[s[0]]) + '"></span>'; }).join('') +
        '</div></div><span class="val">' + tot.toLocaleString('en-US') + ' title' + (tot === 1 ? '' : 's') + '</span></div><p class="st-note st-note--row">' + parts.map(function(s){ return s[0] + ' ' + o[s[0]]; }).join(' · ') + '</p>';
    });
    return h + '</div><p class="st-note">“Caught up” means you have seen every episode that has aired so far.</p></div>';
  }
  function stTypeCard(st){
    var cats = statsCategories().filter(function(c){ return st.byCat[c]; }), tot = st.mins || 1;
    if(!cats.length || !st.mins) return '';
    return '<div class="st-card"><h3>Time by type</h3><p class="st-sub">Share of your ' + stHm(st.mins) + '</p><div class="st-track st-track--big">' +
      cats.map(function(c){ return '<span style="flex:' + st.byCat[c] + ';background:' + statsCatColor(c) + '" data-tip="' + stEsc(statsCatLabel(c) + ' · ' + stHm(st.byCat[c]) + ' (' + Math.round(st.byCat[c]/tot*100) + '%)') + '"></span>'; }).join('') + '</div>' +
      '<ul class="st-list">' + cats.map(function(c){ return '<li><span class="st-dot" style="background:' + statsCatColor(c) + '"></span><div class="st-li-main"><b>' + stEsc(statsCatLabel(c)) + '</b></div><span class="st-li-v">' + stHmS(st.byCat[c]) + ' · ' + Math.round(st.byCat[c]/tot*100) + '%</span></li>'; }).join('') + '</ul></div>';
  }
  function stGenreCard(st){
    if(!st.genres.length || !st.mins) return '';
    // Bars share one scale (the biggest genre), so none can run past its lane. Genres after the top 8 sit
    // behind a "+N more" row instead of a summed "Other" bar, which could be longer than the top genre.
    var rest = st.genres.slice(8), shown = stGenreOpen ? st.genres : st.genres.slice(0,8), max = st.genres[0].m || 1;
    return '<div class="st-card"><h3>Genres</h3><p class="st-sub">Hours on titles with each genre. A title with 3 genres counts toward all 3.</p><div class="st-rows">' +
      shown.map(function(g){ return '<div class="st-row"><span class="nm" title="' + stEsc(g.name) + '">' + stEsc(g.name) + '</span><div class="st-lane"><div class="st-gbar" style="width:' + Math.min(100, Math.max(2, g.m/max*100)) + '%" data-tip="' + stEsc(g.name + ' · ' + stHm(g.m)) + '"></div></div><span class="val">' + stHmS(g.m) + '</span></div>'; }).join('') +
      (rest.length ? '<button type="button" class="st-more" data-action="stats-genres">' + (stGenreOpen ? '<b>Show top 8 only</b>' : '<b>+' + rest.length + ' more genre' + (rest.length === 1 ? '' : 's') + '</b><span>' + stHmS(rest.reduce(function(a,g){ return a + g.m; }, 0)) + ' ›</span>') + '</button>' : '') +
      '</div></div>';
  }
  function stTopCard(st){
    return '<div class="st-card"><h3>Top titles</h3><p class="st-sub">By time watched</p><ul class="st-list">' + st.ranked.slice(0,5).map(function(t, i){
      var s = t.s;
      return '<li class="st-top" data-action="open-detail" data-show="' + s.id + '"><span class="st-rank">' + (i+1) + '</span>' + stPoster(s) + '<div class="st-li-main"><b>' + stEsc(s.title) + '</b><span><span class="st-dot" style="display:inline-block;background:' + statsCatColor(statsCatOf(s)) + ';margin-right:4px"></span>' +
        (s.type === 'movie' ? 'Movie' : t.eps + ' episode' + (t.eps === 1 ? '' : 's')) + (st.finished.indexOf(s.id) !== -1 ? ' · finished' : '') + '</span></div><span class="st-li-v">' + stHmS(t.mins) + '</span></li>';
    }).join('') + '</ul></div>';
  }
  function stHabitCard(st){
    var nat = Object.keys(st.byNat).map(function(k){ return [k, st.byNat[k]]; }).sort(function(a,b){ return b[1]-a[1]; });
    var natHtml = (nat.length && st.mins) ? '<p class="st-sub" style="margin:14px 0 6px;"><b style="color:var(--text)">Nationality</b></p><ul class="st-list">' + nat.map(function(x){ return '<li><div class="st-li-main"><b>' + stEsc(x[0]) + '</b></div><span class="st-li-v">' + stHmS(x[1]) + ' · ' + Math.round(x[1]/st.mins*100) + '%</span></li>'; }).join('') + '</ul>' : '';
    var logged = st.byDow.reduce(function(a,b){ return a+b; }, 0);
    if(!logged) return '<div class="st-card"><h3>Your habits</h3><p class="st-note" style="margin-top:4px">Day-of-week habits use episodes ticked from now on. Older ones only have an estimated air date.</p>' + natHtml + '</div>';
    var max = Math.max.apply(null, st.byDow), bi = st.byDow.indexOf(max);
    var hrs = Object.keys(st.byHour).map(function(k){ return [+k, st.byHour[k]]; }).sort(function(a,b){ return b[1]-a[1]; });
    var hourTxt = hrs.length ? ', usually around ' + (hrs[0][0] % 12 || 12) + (hrs[0][0] >= 12 ? ' PM' : ' AM') : '';
    var W = 300, H = 70, cw = W/7, svg = '<svg viewBox="0 0 ' + W + ' ' + (H+16) + '" width="100%">';
    st.byDow.forEach(function(v, i){
      var hh = H*(v/max), x = cw*i + cw/2 - 9;
      if(v) svg += '<path d="' + stRoundTop(x, H-hh, 18, hh, 4) + '" style="fill:var(--st-bar);opacity:' + (i === bi ? 1 : .45) + '"/>';
      svg += '<rect x="' + (cw*i) + '" y="0" width="' + cw + '" height="' + H + '" fill="transparent" data-tip="' + ST_DOW[i] + ' · ' + stHm(v) + '"/><text x="' + (cw*i + cw/2) + '" y="' + (H+13) + '" font-size="10" text-anchor="middle" style="fill:var(--text-muted)" font-weight="' + (i === bi ? 800 : 500) + '">' + ST_DOW[i] + '</text>';
    });
    svg += '</svg>';
    return '<div class="st-card"><h3>Your habits</h3><p class="st-sub">You watch most on <b>' + ST_DOWL[bi] + '</b>' + hourTxt + (st.estMins ? ' (ticked episodes only)' : '') + '</p>' + svg + natHtml + '</div>';
  }

  /* ---------- layer outside #appBody: picker sheet, wrap player, tooltip ----------
     Kept out of appBody on purpose: a background sync or any render() replaces appBody's HTML,
     and that must never close or reset an open wrap or picker. */
  var stLayer = null, stStory = { i:0, cards:[], timer:null }, stPickYear = null, stPickMonth = null, stGenreOpen = false;
  function stEnsureLayer(){
    if(stLayer) return stLayer;
    stLayer = document.createElement('div'); stLayer.id = 'statsLayer';
    stLayer.innerHTML = '<div class="st-scrim" id="stScrim" data-action="stats-close-sheet"></div><div class="st-sheet" id="stSheet"></div><div class="st-story" id="stStory"></div><div class="st-scrim st-share-scrim" id="stShareScrim" data-action="share-close"></div><div class="st-sheet st-share" id="stShare"></div><div class="st-tip" id="stTip"></div>';
    document.body.appendChild(stLayer);
    return stLayer;
  }
  function stOpenSheet(h){ stEnsureLayer(); document.getElementById('stSheet').innerHTML = '<div class="st-grab"></div>' + h; document.getElementById('stSheet').classList.add('on'); document.getElementById('stScrim').classList.add('on'); }
  function stCloseSheet(){ if(!stLayer) return; document.getElementById('stSheet').classList.remove('on'); document.getElementById('stScrim').classList.remove('on'); }
  function stMinsIn(log, s, e){ return log.filter(function(x){ return x.ts >= s && x.ts < e; }).reduce(function(a,x){ return a + x.mins; }, 0); }
  function stOpenPicker(){
    var log = statsLog(); if(!log.length) return;
    var now = new Date(), ys = []; for(var y = log[0].ts.getFullYear(); y <= now.getFullYear(); y++) ys.push(y);
    var anchor = new Date(state.statsAnchor), h;
    if(state.statsMode === 'year'){
      h = '<h4>Pick a year</h4><div class="st-pick-grid">' + ys.map(function(y){ return '<button type="button" class="st-pill' + (y === anchor.getFullYear() ? ' on' : '') + '" data-action="stats-pick-y" data-value="' + y + '">' + y + '<small>' + stHm(stMinsIn(log, new Date(y,0,1), new Date(y+1,0,1))) + '</small></button>'; }).join('') + '</div>';
    } else {
      h = '<h4>Pick a ' + (state.statsMode === 'week' ? 'week' : 'month') + '</h4><div class="st-pick-years">' + ys.map(function(y){ return '<button type="button" class="st-pill' + (y === stPickYear ? ' on' : '') + '" data-action="stats-pick-year" data-value="' + y + '">' + y + '</button>'; }).join('') + '</div>';
      if(state.statsMode === 'month'){
        h += '<div class="st-pick-grid">' + ST_MON.map(function(m, i){ var s = new Date(stPickYear, i, 1), mm = stMinsIn(log, s, new Date(stPickYear, i+1, 1));
          return '<button type="button" class="st-pill' + (stPickYear === anchor.getFullYear() && i === anchor.getMonth() ? ' on' : '') + '" data-action="stats-pick-month" data-value="' + i + '"' + (s > now ? ' disabled' : '') + '>' + m + '<small>' + (mm ? stHm(mm).replace(/ \d+m$/, '') : '—') + '</small></button>'; }).join('') + '</div>';
      } else {
        var pm = stPickMonth != null ? stPickMonth : (stPickYear === anchor.getFullYear() ? anchor.getMonth() : 0);
        h += '<div class="st-pick-grid" style="margin-bottom:12px">' + ST_MON.map(function(m, i){ return '<button type="button" class="st-pill' + (i === pm ? ' on' : '') + '" data-action="stats-pick-wmonth" data-value="' + i + '"' + (new Date(stPickYear, i, 1) > now ? ' disabled' : '') + '>' + m + '</button>'; }).join('') + '</div><div class="st-weeks">';
        var s = stMonday(new Date(stPickYear, pm, 1)), cur = stMonday(anchor), monthEnd = new Date(stPickYear, pm+1, 1);
        while(s < monthEnd){ var e = stAddDays(s,7), sun = stAddDays(s,6), mm = stMinsIn(log, s, e);
          if(s <= now) h += '<button type="button" class="st-pill' + (s.getTime() === cur.getTime() ? ' on' : '') + '" data-action="stats-pick-week" data-value="' + s.getTime() + '"><span>Mon ' + s.getDate() + ' ' + ST_MON[s.getMonth()] + ' – Sun ' + sun.getDate() + ' ' + ST_MON[sun.getMonth()] + '</span><span>' + (mm ? stHm(mm) : '—') + '</span></button>';
          s = e; }
        h += '</div>';
      }
    }
    stOpenSheet(h);
  }

  function stWrapLabel(){ return state.statsMode === 'all' ? 'All-time' : statsShortLabel().charAt(0).toUpperCase() + statsShortLabel().slice(1); }
  function stWrapCards(st){
    var T = st.ranked, lab = stWrapLabel(), c = [];
    var tiles = ''; for(var k = 0; k < 40; k++) tiles += stPoster(T[k % T.length].s);
    c.push({ edge:'#0B1E28', html:'<div class="st-bgfill"><div class="st-mosaic">' + tiles + '</div><div class="st-shade"></div></div><div style="margin-top:auto"><div class="st-k">Your ' + stEsc(lab) + ' wrap</div><div class="st-big">' + stHm(st.mins) + '</div><div class="st-p">of watching, across ' + T.length + ' title' + (T.length === 1 ? '' : 's') + '.' + (st.estMins ? ' (≈' + stHm(st.estMins) + ' estimated)' : '') + '</div></div>' });
    c.push({ edge:'#1B2036', bg:'linear-gradient(160deg,#3C2F6B,#1B2036)', html:'<div class="st-k">By the numbers</div><div class="st-h">' + st.eps + ' episode' + (st.eps === 1 ? '' : 's') + (st.movies ? ', ' + st.movies + ' movie' + (st.movies > 1 ? 's' : '') : '') + '</div><div class="st-p">All ' + T.length + ' title' + (T.length === 1 ? '' : 's') + ' you watched, most-watched first.</div><div class="st-strip st-fit">' + T.slice(0,15).map(function(t){ return stPoster(t.s); }).join('') + '</div>' + (T.length > 15 ? '<p class="st-p" style="margin-top:8px">+' + (T.length-15) + ' more</p>' : '') });
    var top = T[0], ts = top.s;
    c.push({ edge:'#141414', html:'<div class="st-bgfill">' + (ts.posterImage ? '<div class="st-blurbg" style="background-image:url(' + ts.posterImage + ')"></div>' : '<div class="st-blurbg" style="' + posterStyle(ts) + '"></div>') + '</div><div class="st-k">Your #1</div>' + stPoster(ts, '', 'width:56%;margin:12px auto 12px;border-radius:14px;').replace('class="st-pst"', 'class="st-pst st-fit"') +
      '<div class="st-h" style="text-align:center;font-size:24px;margin:0">' + stEsc(ts.title) + '</div><div class="st-p" style="text-align:center">' + stHm(top.mins) + (ts.type === 'movie' ? '' : ' · ' + top.eps + ' episode' + (top.eps === 1 ? '' : 's')) + '</div>' +
      (T.length > 1 ? '<div class="st-runners">' + T.slice(1,5).map(function(t, n){ return '<div>' + stPoster(t.s, '<span class="st-badge">#' + (n+2) + '</span>') + stHm(t.mins) + '</div>'; }).join('') + '</div>' : '') });
    if(st.genres.length) c.push({ edge:'#4A2F0A', bg:'linear-gradient(160deg,#A9762A,#4A2F0A)', html:'<div class="st-k">Your taste</div><div class="st-h">You\'re a ' + stEsc(st.genres[0].name) + (st.genres[1] ? ' &amp; ' + stEsc(st.genres[1].name) : '') + ' person</div>' +
      st.genres.slice(0,4).map(function(g){ return '<div class="st-gen"><div class="st-stack">' + g.ids.slice(0,3).map(function(id, n){ return stPoster(st.titles[id].s, '', 'left:' + (n*22) + 'px;transform:rotate(' + ((n-1)*6) + 'deg);z-index:' + (3-n) + ';'); }).join('') + '</div><div><b>' + stEsc(g.name) + '</b><span>' + stHm(g.m) + ' · ' + g.ids.length + ' title' + (g.ids.length === 1 ? '' : 's') + '</span></div></div>'; }).join('') });
    var F = st.finished, sh = F.slice(0,6), n = sh.length;
    c.push({ edge:'#0B3D38', bg:'linear-gradient(160deg,#16786F,#0B3D38)', html:'<div class="st-k">Finished</div><div class="st-h">' + (n ? 'You wrapped up ' + F.length + ' title' + (F.length === 1 ? '' : 's') : 'Nothing finished yet') + '</div>' +
      (n ? '<div class="st-fan st-fit st-fit-h">' + sh.map(function(id, k){ var a = (k - (n-1)/2) * (n > 4 ? 11 : 14); return stPoster(st.titles[id].s, '<span class="st-chk">✓</span>', 'transform:translateX(-50%) rotate(' + a + 'deg);z-index:' + k + ';'); }).join('') + '</div>' : '<p class="st-p">Keep going. Your next finale is coming.</p>') +
      (F.length > 6 ? '<p class="st-more">+' + (F.length-6) + ' more</p>' : '') + '<p class="st-p" style="text-align:center">' + sh.map(function(id){ return stEsc(st.titles[id].s.title); }).join(' · ') + '</p>' });
    var cnt = Math.min(9, T.length), use = cnt <= 6 ? cnt : (cnt >= 9 ? 9 : 6), cols = use <= 1 ? 1 : use <= 3 ? use : use === 4 ? 2 : 3;
    c.push({ edge:'#A9762A', bg:'linear-gradient(165deg,#1B2036,#3C2F6B 60%,#A9762A)', html:'<div class="st-k">' + stEsc(lab) + ' · TWatched</div><div class="st-h" style="margin-bottom:0">My ' + stEsc(lab) + ' in posters</div>' +
      '<div class="st-sgrid st-fit" style="grid-template-columns:repeat(' + cols + ',1fr);' + (use === 1 ? 'width:55%;margin-left:auto;margin-right:auto' : '') + '">' + T.slice(0, use).map(function(t, k){ return stPoster(t.s, k === 0 ? '<span class="st-badge">#1</span>' : ''); }).join('') + '</div>' +
      '<div class="st-stats4"><div><b>' + Math.round(st.mins/60) + 'h</b><span>watched</span></div><div><b>' + st.eps + '</b><span>episodes</span></div><div><b>' + st.finished.length + '</b><span>finished</span></div><div><b class="sm' + ((st.genres[0] ? st.genres[0].name : '').length > 8 ? ' st-wrap2' : '') + '">' + stEsc(st.genres[0] ? st.genres[0].name : '—') + '</b><span>top genre</span></div></div>' +
      '<div class="st-brand"><span>TWatched</span><span>' + stEsc(lab) + ' wrap</span></div>' });
    return c;
  }
  function stOpenStory(){
    var st = statsCompute(); if(!st.entries.length) return;
    stEnsureLayer(); stStory.cards = stWrapCards(st); stStory.i = 0; stStory.st = st; stStory.lab = stWrapLabel(); stShare.imgs = null;
    document.getElementById('stStory').classList.add('on'); document.documentElement.classList.add('st-story-open');
    stShowStory();
  }
  function stShowStory(){
    clearTimeout(stStory.timer);
    var c = stStory.cards[stStory.i];
    var host = document.getElementById('stStory');
    host.style.setProperty('--st-edge', c.edge || '#000');
    host.innerHTML = '<div class="st-scard" style="' + (c.bg ? 'background:' + c.bg : '') + '"><div class="st-sbars">' + stStory.cards.map(function(x, k){ return '<span class="' + (k < stStory.i ? 'done' : k === stStory.i ? 'cur' : '') + '"><i></i></span>'; }).join('') + '</div>' +
      '<button type="button" class="st-sx" data-action="story-close" aria-label="Close">' + icon('close') + '</button><div class="st-tapL" data-action="story-prev"></div><div class="st-tapR" data-action="story-next"></div>' + c.html +
      '<button type="button" class="st-sbtn" data-action="wrap-share">' + icon('share') + 'Share</button></div>';
    stFitCard();
    if(!stShare.open) stStory.timer = setTimeout(function(){ stStoryNav(1); }, 7000);
  }
  // Short screens: shrink the poster block of the current card (a little at a time) until
  // nothing reaches past the card's bottom padding, so no text is ever cut off.
  function stFitCard(){
    var card = document.querySelector('#stStory .st-scard'); if(!card) return;
    var fits = card.querySelectorAll('.st-fit'); if(!fits.length) return;
    function overflow(){
      var cr = card.getBoundingClientRect(), limit = cr.bottom - parseFloat(getComputedStyle(card).paddingBottom), worst = 0;
      Array.prototype.forEach.call(card.children, function(el){
        if(/st-bgfill|st-sbars|st-tapL|st-tapR|st-sx|st-sbtn/.test(el.className)) return;
        var b = el.getBoundingClientRect().bottom; if(b - limit > worst) worst = b - limit;
      });
      return worst;
    }
    for(var guard = 0; guard < 40 && overflow() > 0.5; guard++){
      Array.prototype.forEach.call(fits, function(el){
        if(el.classList.contains('st-fit-h')) el.style.height = Math.max(120, el.offsetHeight * 0.93) + 'px';
        else { el.style.width = Math.max(60, el.offsetWidth * 0.93) + 'px'; el.style.marginLeft = 'auto'; el.style.marginRight = 'auto'; }
      });
    }
  }
  window.addEventListener('resize', function(){ if(stLayer && document.getElementById('stStory').classList.contains('on')){ clearTimeout(stStory.timer); stShowStory(); } });
  function stStoryNav(d){ stStory.i += d; if(stStory.i < 0) stStory.i = 0; if(stStory.i >= stStory.cards.length){ stCloseStory(); return; } stShowStory(); }
  function stCloseStory(){ clearTimeout(stStory.timer); if(!stLayer) return; if(stShare.open){ stShare.open = false; stShare.busy++; document.getElementById('stShare').classList.remove('on'); document.getElementById('stShareScrim').classList.remove('on'); } var s = document.getElementById('stStory'); s.classList.remove('paused'); s.classList.remove('on'); s.innerHTML = ''; document.documentElement.classList.remove('st-story-open'); }

  /* ---------------- Share the wrap as a 1080×1920 story image ----------------
     Everything happens on the phone: the image is drawn on a canvas from the wrap's own numbers and
     posters, then handed to the iPhone share sheet (or saved). Nothing is uploaded, nothing is saved
     to the app's data. */
  var stShare = { open:false, mode:'wrap', style:'grid', hours:true, file:null, imgs:null, busy:0, opt:{ rating:true, feel:true, prog:true }, showId:null, ep:0, draft:null, img:null };
  function stShareOpen(){
    if(!stStory.st) return;
    stShare.mode = 'wrap';
    clearTimeout(stStory.timer);
    document.getElementById('stStory').classList.add('paused');
    stShare.open = true; stShare.file = null;
    var host = document.getElementById('stShare');
    host.innerHTML = '<div class="st-grab"></div><div class="st-share-head"><h4>Share to your story</h4><button type="button" class="st-share-x" data-action="share-close" aria-label="Close">' + icon('close') + '</button></div>' +
      '<p class="st-share-sub">' + stEsc(stStory.lab) + ' wrap · 1080 × 1920</p>' +
      '<div class="st-share-styles">' + [['grid','Poster grid'],['hero','#1 spotlight'],['sticker','Sticker']].map(function(s){
        return '<button type="button" class="' + (stShare.style === s[0] ? 'on' : '') + '" data-action="share-style" data-value="' + s[0] + '">' + s[1] + '</button>'; }).join('') + '</div>' +
      '<div class="st-share-pv"><canvas id="stShareCv" width="1080" height="1920"></canvas></div>' +
      '<button type="button" class="st-share-toggle' + (stShare.hours ? ' on' : '') + '" data-action="share-hours" aria-pressed="' + stShare.hours + '"><span class="sw"><i></i></span>Show hours</button>' +
      '<div class="st-share-actions"><button type="button" data-action="share-save">Save image</button><button type="button" class="primary" data-action="share-go">Share…</button></div>' +
      '<p class="st-share-msg" id="stShareMsg"></p>';
    host.classList.add('on'); document.getElementById('stShareScrim').classList.add('on');
    stShareDraw();
  }
  function stShareClose(){
    if(!stShare.open) return;
    stShare.open = false;
    document.getElementById('stShare').classList.remove('on'); document.getElementById('stShareScrim').classList.remove('on');
    document.documentElement.classList.remove('st-share-open');
    if(stShare.mode !== 'wrap') return;
    var s = document.getElementById('stStory'); s.classList.remove('paused');
    if(s.classList.contains('on')) stShowStory();   // carry on from the same card
  }
  function stShareMsg(t){ var m = document.getElementById('stShareMsg'); if(m) m.textContent = t; }
  function stShareImages(){
    if(stShare.imgs) return Promise.resolve(stShare.imgs);
    var T = stStory.st.ranked.slice(0, 9), out = {};
    return Promise.all(T.map(function(t){
      return new Promise(function(res){
        if(!t.s.posterImage){ res(); return; }
        var im = new Image(); im.onload = function(){ out[t.s.id] = im; res(); }; im.onerror = function(){ res(); }; im.src = t.s.posterImage;
      });
    })).then(function(){ stShare.imgs = out; return out; });
  }
  function stShareFonts(){
    if(!document.fonts || !document.fonts.load) return Promise.resolve();
    return Promise.all(['600 80px Fraunces','800 30px Manrope','700 30px Manrope','600 30px Manrope'].map(function(f){ return document.fonts.load(f).catch(function(){}); })).catch(function(){});
  }
  function stShareDraw(){
    var token = ++stShare.busy; stShare.file = null;
    var btn = document.querySelector('#stShare [data-action="share-go"]'); if(btn) btn.disabled = true;
    stShareMsg('Preparing image…');
    var wrap = stShare.mode === 'wrap';
    Promise.all([wrap ? stShareImages() : stShowImage(), stShareFonts()]).then(function(r){
      if(token !== stShare.busy || !stShare.open) return;
      var cv = document.getElementById('stShareCv'); if(!cv) return;
      if(wrap) stShareRender(cv.getContext('2d'), r[0]); else stShareRenderShow(cv.getContext('2d'), r[0]);
      // Made ahead of time so that tapping Share… opens the share sheet straight away
      // (iPhone only allows it right after a tap, with no waiting in between).
      cv.toBlob(function(b){
        if(token !== stShare.busy || !b) return;
        var sh = wrap ? null : getShow(stShare.showId), slug = function(t){ return String(t || '').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); };
        var name = wrap ? slug(stStory.lab) + '-wrap' : (slug(sh && sh.title) || 'show') + (stShare.mode === 'ep' ? '-ep' + stShare.ep : '');
        try { stShare.file = new File([b], 'twatched-' + name + '.png', { type:'image/png' }); } catch(e){ stShare.file = b; }
        var bt = document.querySelector('#stShare [data-action="share-go"]'); if(bt) bt.disabled = false;
        stShareMsg('');
      }, 'image/png');
    });
  }
  // Blurred poster filling the whole 1080×1920 image. The blur is done on the pixels themselves (a quarter-size
  // copy, blurred three times), so the result is smooth on every phone. The old way, blowing up a 27×48 thumbnail,
  // showed big square blocks on iPhone, whose browser doesn't smooth that much enlargement.
  function stBoxBlur(px, w, h, r){
    var tmp = new Uint8ClampedArray(px.length), n = r*2 + 1, x, y, c, i, sum, a, b;
    for(y = 0; y < h; y++){ var row = y*w*4;
      for(c = 0; c < 4; c++){ sum = 0;
        for(i = -r; i <= r; i++) sum += px[row + Math.min(w-1, Math.max(0, i))*4 + c];
        for(x = 0; x < w; x++){ tmp[row + x*4 + c] = sum / n; a = Math.min(w-1, x + r + 1); b = Math.max(0, x - r); sum += px[row + a*4 + c] - px[row + b*4 + c]; } } }
    for(x = 0; x < w; x++){
      for(c = 0; c < 4; c++){ sum = 0;
        for(i = -r; i <= r; i++) sum += tmp[Math.min(h-1, Math.max(0, i))*w*4 + x*4 + c];
        for(y = 0; y < h; y++){ px[y*w*4 + x*4 + c] = sum / n; a = Math.min(h-1, y + r + 1); b = Math.max(0, y - r); sum += tmp[a*w*4 + x*4 + c] - tmp[b*w*4 + x*4 + c]; } } }
  }
  function stBlurBackdrop(ctx, im){
    var W = 270, H = 480, t = document.createElement('canvas'); t.width = W; t.height = H;
    var tc = t.getContext('2d'), k = Math.max(W/im.width, H/im.height);
    tc.imageSmoothingEnabled = true; tc.imageSmoothingQuality = 'high';
    tc.drawImage(im, (W-im.width*k)/2, (H-im.height*k)/2, im.width*k, im.height*k);
    try { var d = tc.getImageData(0, 0, W, H); for(var p = 0; p < 3; p++) stBoxBlur(d.data, W, H, 9); tc.putImageData(d, 0, 0); } catch(e){}
    // enlarge in two gentle steps (2× each) instead of one big jump
    var m = document.createElement('canvas'); m.width = W*2; m.height = H*2; var mc = m.getContext('2d');
    mc.imageSmoothingEnabled = true; mc.imageSmoothingQuality = 'high'; mc.drawImage(t, 0, 0, W*2, H*2);
    ctx.save(); ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high'; ctx.drawImage(m, 0, 0, 1080, 1920); ctx.restore();
  }
  function stRR(ctx,x,y,w,h,r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }
  function stFitFont(ctx, text, maxW, size, weight, family){
    var min = Math.max(20, Math.round(size*0.6));
    do { ctx.font = weight + ' ' + size + 'px ' + family; size -= 2; } while(ctx.measureText(text).width > maxW && size >= min);
  }
  function stClip(ctx, text, maxW){ if(ctx.measureText(text).width <= maxW) return text; while(text.length > 1 && ctx.measureText(text + '…').width > maxW) text = text.slice(0,-1); return text.replace(/\s+$/,'') + '…'; }
  function stSharePoster(ctx, imgs, s, x, y, w, h, r, shadow){
    ctx.save();
    if(shadow){ ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 36; ctx.shadowOffsetY = 14; stRR(ctx,x,y,w,h,r); ctx.fillStyle = '#222'; ctx.fill(); ctx.shadowColor = 'transparent'; }
    stRR(ctx,x,y,w,h,r); ctx.clip();
    var im = imgs[s.id];
    if(im){ var k = Math.max(w/im.width, h/im.height); ctx.drawImage(im, x+(w-im.width*k)/2, y+(h-im.height*k)/2, im.width*k, im.height*k); }
    else {
      var g = GRADIENTS[(s.posterIndex||0) % GRADIENTS.length], gr = ctx.createLinearGradient(x,y,x+w,y+h); gr.addColorStop(0,g[0]); gr.addColorStop(1,g[1]);
      ctx.fillStyle = gr; ctx.fillRect(x,y,w,h); ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = 'italic 600 ' + Math.round(w*0.32) + 'px Fraunces, Georgia, serif'; ctx.fillText(initialOf(s), x+w/2, y+h/2); ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'left';
    }
    ctx.restore();
  }
  function stShareBadge(ctx, txt, x, y){ ctx.save(); ctx.font = '800 30px Manrope, sans-serif'; var w = ctx.measureText(txt).width + 28; stRR(ctx,x,y,w,46,23); ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fill(); ctx.fillStyle = '#fff'; ctx.textBaseline = 'middle'; ctx.textAlign = 'left'; ctx.fillText(txt, x+14, y+24); ctx.restore(); }
  function stShareRender(ctx, imgs){
    var st = stStory.st, T = st.ranked, lab = stStory.lab, hours = stShare.hours, LAB = lab.toUpperCase();
    var hrs = Math.round(st.mins/60) + 'h', genre = st.genres[0] ? st.genres[0].name : '—';
    ctx.clearRect(0,0,1080,1920); ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    // Instagram covers roughly the top 250px and bottom 340px, so everything sits between those.
    if(stShare.style === 'grid'){
      var g = ctx.createLinearGradient(0,0,540,1920); g.addColorStop(0,'#1B2036'); g.addColorStop(.6,'#3C2F6B'); g.addColorStop(1,'#A9762A'); ctx.fillStyle = g; ctx.fillRect(0,0,1080,1920);
      ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.font = '800 30px Manrope, sans-serif'; ctx.fillText('MY ' + LAB + ' · TWATCHED', 60, 290);
      ctx.fillStyle = '#fff'; var ttl = 'My ' + (lab === 'All-time' ? 'all-time' : lab) + ' in posters'; stFitFont(ctx, ttl, 960, 76, '600', 'Fraunces, Georgia, serif'); ctx.fillText(stClip(ctx, ttl, 960), 60, 376);
      var n = Math.min(9, T.length), use = n <= 6 ? n : (n >= 9 ? 9 : 6), cols = use <= 1 ? 1 : use <= 3 ? use : use === 4 ? 2 : 3, rows = Math.ceil(use/cols);
      var gap = 22, areaH = 3*266 + 2*gap, cellH = (areaH - gap*(rows-1)) / rows, cellW = (960 - gap*(cols-1))/cols;
      if(rows < 3){ cellW = Math.min(cellW, cellH/1.5); cellH = cellW*1.5; }   // fewer titles: keep real poster shape
      var gridW = cols*cellW + (cols-1)*gap, x0 = 540 - gridW/2;
      var gridH = rows*cellH + (rows-1)*gap, y0 = 420 + (areaH - gridH)/2;
      for(var i = 0; i < use; i++){ var x = x0 + (i%cols)*(cellW+gap), y = y0 + Math.floor(i/cols)*(cellH+gap); stSharePoster(ctx, imgs, T[i].s, x, y, cellW, cellH, 22, true); if(i === 0) stShareBadge(ctx, '#1', x+16, y+16); }
      var items = [[hrs,'watched'],[String(st.eps),'episodes'],[String(st.finished.length),'finished'],[genre,'top genre']]; if(!hours) items.shift();
      var cy = 420 + areaH + 8, cw = (960 - 18*(items.length-1))/items.length;
      items.forEach(function(it, k){ var cx = 60 + k*(cw+18); stRR(ctx,cx,cy,cw,150,30); ctx.fillStyle = 'rgba(255,255,255,.14)'; ctx.fill();
        ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; stFitFont(ctx, it[0], cw-24, it[0].length > 5 ? 44 : 56, '600', 'Fraunces, Georgia, serif'); ctx.fillText(stClip(ctx, it[0], cw-24), cx+cw/2, cy+78);
        ctx.font = '600 26px Manrope, sans-serif'; ctx.globalAlpha = .8; ctx.fillText(it[1], cx+cw/2, cy+120); ctx.globalAlpha = 1; ctx.textAlign = 'left'; });
      ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.font = '800 28px Manrope, sans-serif'; ctx.textAlign = 'center'; ctx.fillText('TWATCHED · MY ' + LAB + ' WRAP', 540, 1565); ctx.textAlign = 'left';
    } else if(stShare.style === 'hero'){
      var top = T[0], im = imgs[top.s.id];
      ctx.fillStyle = '#141414'; ctx.fillRect(0,0,1080,1920);
      if(im) stBlurBackdrop(ctx, im);
      ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillRect(0,0,1080,1920);
      ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.font = '800 30px Manrope, sans-serif'; ctx.fillText('MY #1 · ' + LAB, 540, 300);
      stSharePoster(ctx, imgs, top.s, 290, 340, 500, 750, 32, true);
      ctx.textAlign = 'center'; ctx.fillStyle = '#fff'; stFitFont(ctx, top.s.title, 960, 66, '600', 'Fraunces, Georgia, serif'); ctx.fillText(stClip(ctx, top.s.title, 960), 540, 1180);
      var line = (hours ? stHm(top.mins) : '') + (top.s.type === 'movie' ? (hours ? '' : 'Movie') : ((hours ? ' · ' : '') + top.eps + ' episode' + (top.eps === 1 ? '' : 's')));
      ctx.font = '600 34px Manrope, sans-serif'; ctx.globalAlpha = .85; ctx.fillText(line, 540, 1236); ctx.globalAlpha = 1;
      var R = T.slice(1,5), w = 170, h2 = 255, rx = 540 - (R.length*w + (R.length-1)*24)/2;
      R.forEach(function(t, i){ var x = rx + i*(w+24); stSharePoster(ctx, imgs, t.s, x, 1280, w, h2, 18, true); stShareBadge(ctx, '#' + (i+2), x+10, 1290); });
      ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.font = '800 26px Manrope, sans-serif';
      ctx.fillText('TWATCHED' + (hours ? ' · ' + hrs : '') + ' · ' + st.eps + ' EPISODES', 540, R.length ? 1578 : 1320); ctx.textAlign = 'left';
    } else {
      var g2 = ctx.createLinearGradient(0,0,0,1920); g2.addColorStop(0,'#E86A8E'); g2.addColorStop(1,'#3C2F6B'); ctx.fillStyle = g2; ctx.fillRect(0,0,1080,1920);
      var F = T.slice(0,4), sw = (680-24)/2, dy = (2 - Math.ceil(F.length/2)) * (sw+24), up = dy/2;
      ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 60; ctx.shadowOffsetY = 24; stRR(ctx,150,330+up,780,1140-dy,48); ctx.fillStyle = '#FBF8F2'; ctx.fill(); ctx.restore();
      ctx.fillStyle = '#6B6F87'; ctx.font = '800 26px Manrope, sans-serif'; ctx.fillText('MY ' + LAB + ' WRAP', 200, 410+up);
      var head = F.length === 1 ? 'My #1' : 'Top ' + F.length; ctx.fillStyle = '#1B2036'; stFitFont(ctx, head, 680, 60, '600', 'Fraunces, Georgia, serif'); ctx.fillText(stClip(ctx, head, 680), 200, 480+up);
      F.forEach(function(t, j){ var x = 200 + (j%2)*(sw+24) + (F.length === 1 ? (sw+24)/2 : 0), y = 520 + up + Math.floor(j/2)*(sw+24); stSharePoster(ctx, imgs, t.s, x, y, sw, sw, 24, false); stShareBadge(ctx, '#' + (j+1), x+12, y+12); });
      var it2 = [[hrs,'watched'],[String(st.eps),'episodes'],[genre,'top genre']]; if(!hours) it2.shift();
      var cw2 = (680 - 20*(it2.length-1))/it2.length;
      it2.forEach(function(it, i){ var x = 200 + i*(cw2+20); ctx.fillStyle = '#1B2036'; ctx.textAlign = 'center'; stFitFont(ctx, it[0], cw2-10, it[0].length > 5 ? 38 : 50, '600', 'Fraunces, Georgia, serif'); ctx.fillText(stClip(ctx, it[0], cw2-10), x+cw2/2, 1300-up); ctx.font = '600 24px Manrope, sans-serif'; ctx.fillStyle = '#6B6F87'; ctx.fillText(it[1], x+cw2/2, 1342-up); });
      ctx.textAlign = 'center'; ctx.fillStyle = '#A9762A'; ctx.font = '800 24px Manrope, sans-serif'; ctx.fillText('TWATCHED', 540, 1420-up); ctx.textAlign = 'left';
    }
  }

  /* ---------------- Share a series or one episode as a story image ----------------
     Same sheet and same "made ahead, handed to the share sheet on tap" flow as the wrap.
     The picture is look A: the poster on a soft blur of itself. Nothing is saved to the app's data. */
  var ST_DAY = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  function stShareOpenShow(showId, ep, draft){
    var show = getShow(showId); if(!show) return;
    stEnsureLayer();
    stShare.mode = ep ? 'ep' : 'show'; stShare.showId = showId; stShare.ep = ep || 0; stShare.draft = draft || null;
    stShare.open = true; stShare.file = null; stShare.img = null;
    document.documentElement.classList.add('st-share-open');
    var host = document.getElementById('stShare');
    host.innerHTML = '<div class="st-grab"></div><div class="st-share-head"><h4>Share to your story</h4><button type="button" class="st-share-x" data-action="share-close" aria-label="Close">' + icon('close') + '</button></div>' +
      '<p class="st-share-sub">' + (ep ? 'Episode ' + ep + ' · ' : '') + stEsc(show.title) + '</p>' +
      '<div class="st-share-pv"><canvas id="stShareCv" width="1080" height="1920"></canvas></div>' +
      '<div class="st-share-opts">' + [['rating','Rating'],['feel','Feelings'],['prog','Progress &amp; time']].map(function(o){
        return '<button type="button" class="st-share-toggle' + (stShare.opt[o[0]] ? ' on' : '') + '" data-action="share-opt" data-value="' + o[0] + '" aria-pressed="' + stShare.opt[o[0]] + '"><span class="sw"><i></i></span>' + o[1] + '</button>'; }).join('') + '</div>' +
      '<div class="st-share-actions"><button type="button" data-action="share-save">Save image</button><button type="button" class="primary" data-action="share-go">Share…</button></div>' +
      '<p class="st-share-msg" id="stShareMsg"></p>';
    host.classList.add('on'); document.getElementById('stShareScrim').classList.add('on');
    stShareDraw();
  }
  function stShowImage(){
    if(stShare.img) return Promise.resolve(stShare.img);
    var show = getShow(stShare.showId);
    return new Promise(function(res){
      if(!show || !show.posterImage){ res(null); return; }
      var im = new Image(); im.onload = function(){ stShare.img = im; res(im); }; im.onerror = function(){ res(null); }; im.src = show.posterImage;
    });
  }
  function stShortDate(d){ return ST_DAY[d.getDay()] + ' ' + d.getDate() + ' ' + ST_MON[d.getMonth()]; }
  function stEpDate(show, ep){
    var ts = show.watchLog && show.watchLog[String(ep)];
    var d = ts ? new Date(ts) : computeEpisodeDate(show, ep);
    return d && !isNaN(d.getTime()) ? stShortDate(d) : '';
  }
  // the poster as it is cropped in the app's grid tiles (object-fit:cover + object-position + zoom)
  function stCropPoster(ctx, show, im, x, y, w, h, r){
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 16; stRR(ctx,x,y,w,h,r); ctx.fillStyle = '#222'; ctx.fill(); ctx.shadowColor = 'transparent';
    stRR(ctx,x,y,w,h,r); ctx.clip();
    if(im){
      var c = (show.posterCrops && show.posterCrops.grid) || { x:50, y:50, zoom:100 }, px = c.x/100, py = c.y/100, z = (c.zoom || 100)/100;
      var k = Math.max(w/im.width, h/im.height), dw = im.width*k, dh = im.height*k, dx = x + (w-dw)*px, dy = y + (h-dh)*py, ox = x + w*px, oy = y + h*py;
      ctx.drawImage(im, ox + (dx-ox)*z, oy + (dy-oy)*z, dw*z, dh*z);
    } else {
      var g = GRADIENTS[(show.posterIndex||0) % GRADIENTS.length], gr = ctx.createLinearGradient(x,y,x+w,y+h); gr.addColorStop(0,g[0]); gr.addColorStop(1,g[1]);
      ctx.fillStyle = gr; ctx.fillRect(x,y,w,h); ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = '600 ' + Math.round(w*0.36) + 'px Fraunces, Georgia, serif'; ctx.fillText(initialOf(show), x+w/2, y+h/2); ctx.textBaseline = 'alphabetic';
    }
    ctx.restore();
  }
  function stSpaced(ctx, px){ if(ctx.letterSpacing !== undefined) ctx.letterSpacing = px + 'px'; }
  function stStars(ctx, v, cx, y, sz, align){
    var gap = sz*0.14, w = 5*sz + 4*gap, x = align === 'left' ? cx : cx - w/2;
    ctx.save(); ctx.font = sz + 'px Arial, sans-serif'; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
    for(var i = 0; i < 5; i++){ var sx = x + i*(sz+gap); ctx.fillStyle = 'rgba(255,255,255,.28)'; ctx.fillText('★', sx, y);
      var f = Math.max(0, Math.min(1, v - i)), part = f >= .75 ? 1 : f >= .25 ? .5 : 0;
      if(part){ ctx.save(); ctx.beginPath(); ctx.rect(sx, y - sz, sz*part, sz*2); ctx.clip(); ctx.fillStyle = '#F2B544'; ctx.fillText('★', sx, y); ctx.restore(); } }
    ctx.restore(); return w;
  }
  function stChips(ctx, items, y){
    var h = 66, pad = 28, gap = 14, F = '700 30px Manrope, "Apple Color Emoji", "Segoe UI Emoji", sans-serif';
    ctx.font = F; var ws = items.map(function(t){ return ctx.measureText(t).width + pad*2; }), keep = [], tot = 0;
    for(var i = 0; i < ws.length; i++){ var add = ws[i] + (keep.length ? gap : 0); if(tot + add > 940) break; tot += add; keep.push(i); }
    var x = 540 - tot/2;
    keep.forEach(function(i){ stRR(ctx, x, y, ws[i], h, h/2); ctx.fillStyle = 'rgba(255,255,255,.16)'; ctx.fill();
      ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.font = F; ctx.fillText(items[i], x + pad, y + h/2 + 1); x += ws[i] + gap; });
    ctx.textBaseline = 'alphabetic';
  }
  function stShareRenderShow(ctx, im){
    var show = getShow(stShare.showId); if(!show) return;
    var o = stShare.opt, movie = show.type === 'movie', ep = stShare.mode === 'ep' ? stShare.ep : 0, total = show.totalEpisodes || 0;
    ctx.clearRect(0,0,1080,1920); ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    // soft blurred backdrop of the poster
    ctx.fillStyle = '#141414'; ctx.fillRect(0,0,1080,1920);
    if(im) stBlurBackdrop(ctx, im);
    else { var g0 = GRADIENTS[(show.posterIndex||0) % GRADIENTS.length], bg = ctx.createLinearGradient(0,0,1080,1920); bg.addColorStop(0,g0[0]); bg.addColorStop(1,g0[1]); ctx.fillStyle = bg; ctx.fillRect(0,0,1080,1920); }
    ctx.fillStyle = 'rgba(0,0,0,.48)'; ctx.fillRect(0,0,1080,1920);
    var sh = ctx.createLinearGradient(0,1000,0,1920); sh.addColorStop(0,'rgba(0,0,0,0)'); sh.addColorStop(1,'rgba(0,0,0,.55)'); ctx.fillStyle = sh; ctx.fillRect(0,1000,1080,920);
    // Instagram covers about the top 250px and bottom 340px, so everything sits between y 250 and 1580.
    var kick = ep ? 'Just watched' : movie ? 'Movie night' : show.watched >= total ? 'Finished' : show.watched > 0 ? 'Now watching' : 'On my list';
    ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.font = '800 28px Manrope, sans-serif'; stSpaced(ctx, 4); ctx.fillText(kick.toUpperCase(), 540, 300); stSpaced(ctx, 0);
    stCropPoster(ctx, show, im, 305, 335, 470, 705, 30);
    if(ep){ // corner tag
      var tag = 'EPISODE ' + ep; ctx.font = '800 26px Manrope, sans-serif'; stSpaced(ctx, 3); var tw = ctx.measureText(tag).width + 44;
      stRR(ctx, 325, 355, tw, 56, 28); ctx.fillStyle = 'rgba(15,17,28,.72)'; ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.fillText(tag, 347, 393); stSpaced(ctx, 0); ctx.textAlign = 'center';
    }
    var y = 1130; ctx.fillStyle = '#fff'; stFitFont(ctx, show.title, 940, 64, '600', 'Fraunces, Georgia, serif'); ctx.fillText(stClip(ctx, show.title, 940), 540, y);
    var sub;
    if(ep){ sub = stEpDate(show, ep) + (o.prog && total ? ' · ' + ep + ' of ' + total : ''); }
    else sub = [show.seasonLabel, show.originalTitle || (movie && show.releaseYear ? String(show.releaseYear) : '')].filter(Boolean).join(' · ');
    if(sub){ y += 52; ctx.globalAlpha = .78; stFitFont(ctx, sub, 900, 32, '600', 'Manrope, sans-serif'); ctx.fillText(stClip(ctx, sub, 900), 540, y); ctx.globalAlpha = 1; }
    var er = ep ? (stShare.draft || epRating(show, ep) || {}) : null;
    var score = ep ? (er.r || 0) : movie ? (show.rating || 0) : (show.seriesRating || epAverage(show));
    if(o.rating && score){
      y += 78;
      if(ep) stStars(ctx, score, 540, y, 58);
      else { var txt = movie || show.seriesRating ? Math.round(score) + '.0' : score.toFixed(1), w = stStars(ctx, score, 490, y, 58);
        ctx.textAlign = 'left'; ctx.fillStyle = '#fff'; ctx.font = '600 50px Fraunces, Georgia, serif'; ctx.fillText(txt, 490 + w/2 + 22, y + 18); ctx.textAlign = 'center'; }
      y += 10;
    }
    var feels = ep ? (er.e || []) : (movie ? [] : feelingCounts(show).slice(0,3).map(function(c){ return c[0] + ' ×' + c[1]; }));
    if(o.feel && feels.length){ y += 42; stChips(ctx, feels, y); y += 66; }
    if(o.prog){
      ctx.textAlign = 'center';
      if(movie){ var ml = [show.runtimeMinutes ? stHm(+show.runtimeMinutes) : '', show.watchedDate ? 'watched ' + stShortDate(new Date(show.watchedDate + 'T12:00:00')) : ''].filter(Boolean).join(' · ');
        if(ml){ y += 70; ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.font = '700 32px Manrope, sans-serif'; ctx.fillText(ml, 540, y); } }
      else if(total){
        y += 56; var bw = 560, bx = 540 - bw/2, p = Math.min(1, (ep || show.watched) / total);
        stRR(ctx, bx, y, bw, 14, 7); ctx.fillStyle = 'rgba(255,255,255,.22)'; ctx.fill(); if(p > 0){ stRR(ctx, bx, y, Math.max(14, bw*p), 14, 7); ctx.fillStyle = '#F2B544'; ctx.fill(); } y += 14;
        if(!ep){ var mins = show.watched * (+show.episodeMinutes || 0);
          y += 44; ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.font = '700 30px Manrope, sans-serif'; ctx.fillText(show.watched + ' of ' + total + ' episodes' + (mins ? ' · ' + stHm(mins) : ''), 540, y); }
      }
    }
    // Always centred: the feelings chips leave the alignment on "left", and with Progress & time switched off
    // nothing after them set it back, so the name slid to the right.
    ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.font = '800 26px Manrope, sans-serif'; stSpaced(ctx, 6); ctx.fillText('TWATCHED', 540, Math.min(1572, Math.max(y + 80, 1500))); stSpaced(ctx, 0);
    ctx.textAlign = 'left';
  }
  function stShareGo(){
    var f = stShare.file; if(!f) return;
    var files = [f];
    if(navigator.canShare && navigator.share && navigator.canShare({ files:files })){
      // After a successful share (e.g. to Instagram and back) the sheet closes by itself, so you land on
      // exactly the screen you shared from. Cancelling the iPhone share sheet keeps it open.
      stShare.pending = true; stShare.left = false;
      navigator.share({ files:files }).then(function(){ stShare.pending = false; stShare.left = false; stShareMsg(''); stShareClose(); }).catch(function(err){
        stShare.pending = false;
        if(stShare.left){ stShare.left = false; stShareClose(); return; }   // went to another app and came back
        stShareMsg(err && err.name === 'AbortError' ? '' : 'Couldn\'t open the share sheet. Use Save image, then add it from Instagram.');
      });
    } else stShareMsg('Sharing images isn\'t supported here. Use Save image instead.');
  }
  // Backup for the auto-close: if the app was left while sharing (another app opened), close the sheet on return.
  document.addEventListener('visibilitychange', function(){
    if(document.visibilityState === 'hidden'){ if(stShare.pending) stShare.left = true; }
    else if(stShare.left && stShare.open){ stShare.left = false; stShareClose(); }
  });
  function stShareSave(){
    var f = stShare.file; if(!f) return;
    var a = document.createElement('a'); a.href = URL.createObjectURL(f); a.download = f.name || 'twatched-wrap.png';
    document.body.appendChild(a); a.click(); setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); }, 4000);
    stShareMsg('Saved.');
  }
  function stShowTip(el, x, y){ stEnsureLayer(); var tip = document.getElementById('stTip'); tip.textContent = el.getAttribute('data-tip'); tip.classList.add('on'); var w = tip.offsetWidth; tip.style.left = Math.max(8, Math.min(window.innerWidth - w - 8, x - w/2)) + 'px'; tip.style.top = Math.max(8, y - 48) + 'px'; }
  function stHideTip(){ if(stLayer) document.getElementById('stTip').classList.remove('on'); }
  document.addEventListener('pointermove', function(e){ if(e.pointerType !== 'mouse') return; var el = e.target.closest && e.target.closest('[data-tip]'); if(el) stShowTip(el, e.clientX, e.clientY); else stHideTip(); });
  var stTipTimer = null;
  document.addEventListener('pointerdown', function(e){ var el = e.target.closest && e.target.closest('[data-tip]'); if(el && e.pointerType !== 'mouse'){ stShowTip(el, e.clientX, e.clientY); clearTimeout(stTipTimer); stTipTimer = setTimeout(stHideTip, 1600); } });
  document.addEventListener('keydown', function(e){ if(!stLayer || !document.getElementById('stStory').classList.contains('on')) return; if(stShare.open){ if(e.key === 'Escape') stShareClose(); return; } if(e.key === 'ArrowRight') stStoryNav(1); if(e.key === 'ArrowLeft') stStoryNav(-1); if(e.key === 'Escape') stCloseStory(); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && stShare.open && stShare.mode !== 'wrap') stShareClose(); });
  function statsResetPeriod(){ state.statsMode = 'week'; state.statsAnchor = Date.now(); }

  function renderStatsSafe(){
    try { return renderStats(); }
    catch(err){ return '<div class="screen-pad"><h1 class="screen-title">Stats</h1><div class="st-card st-empty">Stats couldn\'t be shown right now. Your data is safe.</div></div>'; }
  }

  /* ---------------- render dispatch ---------------- */
  var appEl = document.getElementById('app');
  var appBody = document.getElementById('appBody');
  var pendingFocusId = null;
  // With #app no longer position:fixed, the page scrolls normally and there is only one
  // scroll position (window.scrollY) shared by whatever's currently in appBody — so each
  // tab's place in its own content has to be remembered explicitly across renders instead
  // of living on that tab's own (now nonexistent) independent scroll container.
  var tabScrollMemory = { home:0, browse:0, settings:0 };
  function saveTabScroll(){ tabScrollMemory[state.activeTab] = window.scrollY; }
  function restoreTabScroll(){ window.scrollTo(0, tabScrollMemory[state.activeTab] || 0); }

  function tabNavHtml(){
    var tabs = [['home','Home'],['browse','Browse'],['stats','Stats'],['settings','Settings']];
    return '<nav class="tab-nav">' + tabs.map(function(t){
      var key = t[0], label = t[1];
      var iconKey = key==='home'?'home':(key==='browse'?'grid':(key==='stats'?'chart':'settings'));
      return '<button type="button" class="tab-nav-btn' + (state.activeTab===key?' active':'') + '" data-action="set-tab" data-tab="' + key + '">' +
        icon(iconKey) + '<span>' + label + '</span></button>';
    }).join('') + '</nav>';
  }
  function render(){
    if(!booted) return;   // saved data not loaded yet — nothing meaningful to draw
    // Set on <html> (not #app) so the theme's --bg/--surface custom properties cascade to
    // <body> too — see the CSS comment on body's background for why that now matters.
    document.documentElement.setAttribute('data-theme', state.theme==='system' ? '' : state.theme);

    var html = '';
    // When an overlay is open, the 3 base-tab screens are not generated at all — not hidden via
    // CSS, not present in the DOM in any form. Every previous attempt kept them (hidden one way
    // or another) alongside the overlay, and each one failed differently: display:none caused a
    // total freeze, visibility:hidden kept them contributing nothing visible but the overlay was
    // then position:fixed to avoid re-triggering the old scroll bugs, which reintroduced the
    // original iOS platform quirk (a fixed-position box is capped short of the true screen height,
    // proven unfixable months ago for the base shell) for overlays instead. With nothing else in
    // the document at all, the overlay can go back to being normal, ordinary page content — no
    // special positioning needed — which reaches the true bottom exactly like Home/Browse/Settings
    // already correctly do, because it's now sharing their same proven mechanism instead of
    // fighting it from alongside.
    if(!state.overlay){
      html += '<div class="app-screen" style="display:' + (state.activeTab==='home' ? 'block':'none') + '">' + renderHome() + tabNavHtml() + '</div>';
      html += '<div class="app-screen" style="display:' + (state.activeTab==='browse' ? 'block':'none') + '">' + renderBrowse() + tabNavHtml() + '</div>';
      html += '<div class="app-screen" style="display:' + (state.activeTab==='stats' ? 'block':'none') + '">' + (state.activeTab==='stats' ? renderStatsSafe() : '') + tabNavHtml() + '</div>';
      html += '<div class="app-screen" style="display:' + (state.activeTab==='settings' ? 'block':'none') + '">' + renderSettings() + tabNavHtml() + '</div>';
    } else if(state.overlay === 'detail'){
      html += '<div class="app-screen app-screen--overlay detail-ov' + (state.justOpenedOverlay?' is-animating-in':'') + '">' + renderDetailScreen() + '</div>';
    } else if(state.overlay === 'form'){
      html += '<div class="app-screen app-screen--overlay form-ov' + (state.justOpenedOverlay?' is-animating-in':'') + '">' + renderFormScreen() + '</div>';
    } else if(state.overlay === 'addshows'){
      html += '<div class="app-screen app-screen--overlay form-ov' + (state.justOpenedOverlay?' is-animating-in':'') + '">' + renderAddShowsPanel() + '</div>';
    }

    html += rateSheetHtml();
    appBody.innerHTML = html;
    if(state.rateSheet) state.rateSheet.animate = false;

    // window.scrollY (unlike an individual element's scrollTop) naturally survives this innerHTML
    // replacement on its own, as long as the new content is tall enough — no capture/restore
    // needed for ordinary in-place re-renders (toggling a panel, editing a field, etc.). Only a
    // freshly-opened overlay needs an explicit reset to the top.
    if(state.justOpenedOverlay){
      window.scrollTo(0, 0);
      state.justOpenedOverlay = false;
      requestAnimationFrame(function(){
        requestAnimationFrame(function(){
          var ov = appBody.querySelector('.app-screen--overlay');
          if(ov) ov.classList.remove('is-animating-in');
        });
      });
    }
    if(pendingFocusId){
      var el = document.getElementById(pendingFocusId);
      if(el){ el.focus(); if(el.value) { var v=el.value; el.value=''; el.value=v; } }
      pendingFocusId = null;
    }

    var fabEl = document.getElementById('browseFab');
    if(fabEl){
      var showFab = (state.activeTab === 'browse' && !state.overlay && !isWideLayout());
      fabEl.style.display = showFab ? 'flex' : 'none';
    }
  }

  /* ---------------- HOME ---------------- */
  function renderHome(){
    var now = Date.now();
    var active = [];
    var comingUp = [];
    state.shows.forEach(function(s){
      if(s.type === 'movie') return; // movies don't have an episode schedule — they live in Browse's Movies tab
      var info = getNextEpisodeInfo(s, now);
      if(info.completed) return;
      if(info.aired) active.push({show:s, info:info});
      comingUp.push({show:s, info:info});
    });
    active.sort(function(a,b){ return a.info.airDate - b.info.airDate; });
    comingUp.sort(function(a,b){ return a.info.airDate - b.info.airDate; });
    var comingUpAll = comingUp;
    if(state.homeCategoryFilter){
      comingUp = comingUp.filter(function(c){ return c.show.category === state.homeCategoryFilter; });
    }

    var out = '<div class="screen-pad">';
    out += '<h1 class="screen-title">Up next</h1>';
    out += '<p class="screen-kicker">' + (active.length ? 'Tap the check to mark an episode watched.' : 'Nothing waiting on you right now.') + '</p>';

    if(state.shows.length === 0){
      out += '<div class="empty-block"><span>' + icon('ticket') + '</span><strong>No shows yet</strong><p>Add the first thing you\'re watching from Browse.</p>' +
        '<button class="btn btn-primary" data-action="goto-add">' + icon('plus') + ' Add a show</button></div>';
    } else if(active.length === 0){
      out += '<div class="empty-block"><span>' + icon('check') + '</span><strong>You\'re all caught up</strong><p>New episode cards will show up here the moment they air.</p></div>';
    } else {
      active.forEach(function(a){
        out += '<article class="ep-card" data-show="' + a.show.id + '" data-action="open-detail">' +
          '<div class="ep-card__stub" style="' + (a.show.posterImage ? '' : posterStyle(a.show)) + '">' +
            posterImgTag(a.show,'thumbnail') +
            (a.show.posterImage ? '' : '<span class="ep-card__initial">' + initialOf(a.show) + '</span>') +
          '</div>' +
          '<div class="ep-card__perf"></div>' +
          '<div class="ep-card__body">' +
            '<p class="ep-card__show">' + a.show.title + '</p>' +
            '<h3 class="ep-card__ep">Episode ' + a.info.number + '</h3>' +
            '<p class="ep-card__meta">Released ' + fmtDateTime(a.info.airDate) + (a.show.episodeMinutes ? ' · ' + a.show.episodeMinutes + ' min' : '') + '</p>' +
          '</div>' +
          '<button class="check-btn" data-action="check-episode" data-show="' + a.show.id + '" aria-label="Mark episode ' + a.info.number + ' of ' + a.show.title + ' watched">' + icon('check') + '</button>' +
        '</article>';
      });
    }

    if(comingUpAll.length){
      out += '<p class="section-label">Coming up</p>';
      out += '<div class="day-chips" style="margin-bottom:10px;">' +
        '<button type="button" class="opt-chip' + (!state.homeCategoryFilter?' active':'') + '" data-action="set-homecat-filter" data-value="">All</button>' +
        state.categories.map(function(c){
          return '<button type="button" class="opt-chip' + (state.homeCategoryFilter===c.id?' active':'') + '" data-action="set-homecat-filter" data-value="' + c.id + '">' + c.name + '</button>';
        }).join('') +
      '</div>';
      if(comingUp.length){
        out += '<div class="settings-card">';
        comingUp.forEach(function(u){
          var dd = ddayLabel(daysUntil(u.info.airDate, now));
          out += '<div class="upcoming-row" data-action="open-detail" data-show="' + u.show.id + '">' +
            '<div class="upcoming-thumb" style="' + (u.show.posterImage ? '' : posterStyle(u.show)) + '">' +
              posterImgTag(u.show,'thumbnail') +
              (u.show.posterImage ? '' : '<span>' + initialOf(u.show) + '</span>') +
            '</div>' +
            '<div class="upcoming-info"><p class="t1">' + u.show.title + '</p><p class="t2">Episode ' + u.info.number + '</p></div>' +
            '<div class="upcoming-right"><p class="upcoming-when">' + fmtDate(u.info.airDate) + '</p><span class="dday ' + dd.cls + '">' + dd.text + '</span></div>' +
          '</div>';
        });
        out += '</div>';
      } else {
        out += '<p class="screen-kicker">No shows in this category.</p>';
      }
    }
    out += '</div>';
    return out;
  }

  /* ---------------- BROWSE ---------------- */
  function statusBadge(show){
    if(show.type === 'movie') return 'Watched';
    var info = getNextEpisodeInfo(show, Date.now());
    if(info.completed) return 'Completed';
    if(info.aired) return show.watched > 0 ? 'New episode' : 'Ready to start';
    return show.watched > 0 ? 'Caught up' : 'Coming soon';
  }
  function movieBadgeIcon(){
    return '<div class="movie-badge">' + icon('film') + '</div>';
  }
  function tileMarkup(show, opts){
    opts = opts || {};
    var rmBtn = opts.removeFolderId ? '<button class="tile-rm" data-action="remove-from-folder" data-folder="' + opts.removeFolderId + '" data-show="' + show.id + '" aria-label="Remove from this folder">' + icon('close') + '</button>' : '';
    if(show.type === 'movie'){
      return '<div class="tile" data-action="open-detail" data-show="' + show.id + '">' +
        '<div class="tile-poster" style="' + (show.posterImage ? '' : posterStyle(show)) + '">' +
          posterImgTag(show,'grid') +
          movieBadgeIcon() +
          rmBtn +
        '</div>' +
        '<p class="tile-cap">' + show.title + '</p>' +
        '<p class="tile-sub">' + (show.releaseYear||'—') + ' · watched ' + (show.watchedDate ? new Date(show.watchedDate).getFullYear() : '—') + '</p>' +
      '</div>';
    }
    var pct = Math.round((show.watched/show.totalEpisodes)*100);
    return '<div class="tile" data-action="open-detail" data-show="' + show.id + '">' +
      '<div class="tile-poster" style="' + (show.posterImage ? '' : posterStyle(show)) + '">' +
        posterImgTag(show,'grid') +
        '<span class="badge">' + statusBadge(show) + '</span>' +
        rmBtn +
      '</div>' +
      '<p class="tile-cap">' + show.title + '</p>' +
      '<p class="tile-sub">' + (show.platform||'—') + ' · ' + show.watched + '/' + show.totalEpisodes + '</p>' +
      '<div class="tile-progress"><i style="width:' + pct + '%"></i></div>' +
    '</div>';
  }
  function renderBrowse(){
    if(isWideLayout()){
      var selected = getShow(state.detailShowId) || state.shows[0] || null;
      var out = '<div class="browse-split">';
      out += '<div class="browse-list-pane"><h1 class="screen-title" style="font-size:22px;margin-top:6px;">Browse</h1>';
      state.shows.forEach(function(s){
        out += '<button class="list-row' + (selected && selected.id===s.id?' active':'') + '" data-action="select-browse" data-show="' + s.id + '">' +
          '<div class="list-row-thumb" style="' + (s.posterImage ? '' : posterStyle(s)) + '">' + posterImgTag(s,'thumbnail') + (s.posterImage ? '' : '<span>' + initialOf(s) + '</span>') + '</div>' +
          '<div><p class="list-row-title">' + s.title + '</p><p class="list-row-sub">' + statusBadge(s) + '</p></div>' +
        '</button>';
      });
      out += '<button class="fab fab--inline" data-action="open-add">' + icon('plus') + ' Add show</button>';
      out += '</div>';
      out += '<div class="browse-detail-pane">' + (selected ? renderShowDetailContent(selected, {showBack:false}) : '<p class="screen-kicker">Add a show to get started.</p>') + '</div>';
      out += '</div>';
      return out;
    }
    var out2 = '<div class="screen-pad" style="position:relative;min-height:100%;">';
    var editable = state.browseViewMode === 'folder';
    out2 += '<div class="row-between"><div><h1 class="screen-title" style="margin-bottom:2px;">Browse</h1><p class="screen-kicker">' + (editable && state.browseEditMode ? 'Rename, reorder, or remove shows from folders.' : (state.browseViewMode==='movies' ? 'Sorted by most recently watched.' : 'Tap a poster to open it.')) + '</p></div>' +
      (editable ? '<button class="edit-toggle' + (state.browseEditMode?' active':'') + '" data-action="toggle-browse-edit">' + (state.browseEditMode?'Done':'Edit') + '</button>' : '') +
    '</div>';
    out2 += '<div class="seg-switch">' +
      '<button type="button" class="' + (state.browseViewMode==='all'?'active':'') + '" data-action="set-browse-view" data-value="all">All</button>' +
      '<button type="button" class="' + (state.browseViewMode==='folder'?'active':'') + '" data-action="set-browse-view" data-value="folder">Folder</button>' +
      '<button type="button" class="' + (state.browseViewMode==='movies'?'active':'') + '" data-action="set-browse-view" data-value="movies">Movies</button>' +
    '</div>';
    if(state.browseViewMode === 'movies'){
      var movies = autoSortShows(state.shows.filter(function(s){ return s.type==='movie'; }), Date.now());
      if(movies.length === 0){
        out2 += '<div class="empty-block"><span>' + icon('film') + '</span><strong>No movies logged yet</strong><p>Tap the + button to log the first one.</p></div>';
      } else {
        out2 += '<div class="browse-grid">' + movies.map(function(s){ return tileMarkup(s, null); }).join('') + '</div>';
      }
    } else if(state.shows.length===0){
      out2 += '<div class="empty-block"><span>' + icon('ticket') + '</span><strong>Nothing added yet</strong><p>Tap the + button to add your first show.</p></div>';
    } else if(state.browseViewMode === 'all'){
      var allSorted = autoSortShows(state.shows.filter(function(s){ return s.type !== 'movie'; }), Date.now());
      out2 += '<div class="browse-grid">' + allSorted.map(function(s){ return tileMarkup(s, null); }).join('') + '</div>';
    } else {
      state.folders.forEach(function(f, fi){
        var items = orderedFolderItems(f, state.shows.filter(function(s){ return s.type !== 'movie' && (s.folderIds||[]).indexOf(f.id) !== -1; }));
        out2 += '<div class="shelf">';
        out2 += '<div class="shelf-head">';
        if(state.renamingFolderId === f.id){
          out2 += '<input type="text" id="renameFolderInput_' + f.id + '" class="shelf-rename-input" value="' + f.name.replace(/"/g,'&quot;') + '" data-action-input="rename-folder" data-folder="' + f.id + '">' +
            '<button class="icon-btn-sm" data-action="confirm-rename-folder" data-folder="' + f.id + '" aria-label="Save name">' + icon('check') + '</button>';
        } else {
          out2 += '<h3 class="shelf-title">' + f.name + '</h3>';
          if(state.browseEditMode){
            out2 += '<div class="shelf-ctl">' +
              '<button class="icon-btn-sm" data-action="move-folder" data-folder="' + f.id + '" data-dir="-1"' + (fi===0?' disabled style="opacity:.35;"':'') + ' aria-label="Move up">' + icon('up') + '</button>' +
              '<button class="icon-btn-sm" data-action="move-folder" data-folder="' + f.id + '" data-dir="1"' + (fi===state.folders.length-1?' disabled style="opacity:.35;"':'') + ' aria-label="Move down">' + icon('down') + '</button>' +
              '<button class="icon-btn-sm" data-action="rename-folder" data-folder="' + f.id + '" aria-label="Rename">' + icon('pencil') + '</button>' +
              '<button class="icon-btn-sm icon-btn-sm--danger" data-action="delete-folder" data-folder="' + f.id + '" aria-label="Delete folder">' + icon('trash') + '</button>' +
            '</div>';
          }
        }
        out2 += '</div>';
        if(items.length === 0){
          out2 += '<div class="shelf-empty">No shows here yet.</div>';
        } else {
          out2 += '<div class="shelf-row">' + items.map(function(s){
            return tileMarkup(s, state.browseEditMode ? { removeFolderId:f.id } : null);
          }).join('') + '</div>';
        }
        if(state.browseEditMode){
          out2 += '<button class="shelf-addshows-btn" data-action="open-addshows" data-folder="' + f.id + '">' + icon('plus') + ' Add shows</button>';
        }
        out2 += '</div>';
      });
      var unsorted = orderedFolderItems(null, state.shows.filter(function(s){ return s.type !== 'movie' && !(s.folderIds && s.folderIds.length); }));
      if(unsorted.length){
        out2 += '<div class="shelf shelf-unsorted"><div class="shelf-head"><h3 class="shelf-title shelf-title--muted">Unsorted</h3></div>' +
          '<div class="shelf-row">' + unsorted.map(function(s){ return tileMarkup(s, null); }).join('') + '</div></div>';
      }
      out2 += '<div class="new-folder-row"><input type="text" id="newFolderInput" data-action-input="new-folder" placeholder="New folder name…">' +
        '<button type="button" data-action="add-folder">Create</button></div>';
    }
    out2 += '</div>';
    return out2;
  }

  /* ---------------- DETAIL ---------------- */
  function relatedSectionHtml(item){
    var rel = item.related || [];
    var chips = rel.map(function(r){
      var target = getShow(r.id);
      if(!target) return '';
      return '<div class="related-chip">' +
        '<div class="related-chip-poster" data-action="open-detail" data-show="' + target.id + '" style="' + (target.posterImage?'':posterStyle(target)) + '">' + posterImgTag(target,'thumbnail') + (target.posterImage?'':'<span>'+initialOf(target)+'</span>') +
          '<button type="button" class="related-chip-rm" data-action="remove-related" data-show="' + item.id + '" data-target="' + target.id + '" aria-label="Remove link">' + icon('close') + '</button>' +
        '</div>' +
        '<p>' + target.title + '</p>' + (target.seasonLabel ? '<span>' + target.seasonLabel + '</span>' : '') +
      '</div>';
    }).join('');
    var adding = state.addingRelatedFor === item.id;
    chips += '<button type="button" class="add-related" data-action="' + (adding ? 'close-add-related' : 'open-add-related') + '" data-show="' + item.id + '" aria-label="Add related title">' + icon(adding ? 'close' : 'plus') + '</button>';
    var panel = '';
    if(adding){
      var linkedIds = rel.map(function(r){ return r.id; });
      var others = state.shows.filter(function(s){ return s.id !== item.id && linkedIds.indexOf(s.id) === -1; });
      panel = others.length ? (
        '<div class="add-related-panel">' +
          '<label class="field-label">Title to link</label>' +
          '<select id="relPickTitle">' + others.map(function(s){ return '<option value="' + s.id + '">' + s.title + (s.seasonLabel ? ' (' + s.seasonLabel + ')' : '') + '</option>'; }).join('') + '</select>' +
          '<p class="detail-meta detail-meta--muted" style="margin:6px 0 10px;">Its "Season / part label" (set on the Edit page) is what shows here — edit that if it\'s wrong.</p>' +
          '<button type="button" class="btn btn-primary" style="width:100%;" data-action="confirm-add-related" data-show="' + item.id + '">Add</button>' +
        '</div>'
      ) : '<p class="detail-meta detail-meta--muted">Nothing left to link.</p>';
    }
    return '<p class="section-label" style="margin-top:22px;">Related</p><div class="related-row">' + chips + '</div>' + panel;
  }
  function renderMovieDetailContent(movie, opts){
    opts = opts || {};
    var deleteConfirming = state.confirmDeleteId === movie.id;
    var stars = [1,2,3,4,5].map(function(n){ return '<span class="' + ((movie.rating||0)>=n?'on':'') + '">★</span>'; }).join('');
    return (opts.showBack ? '<button class="icon-btn back-btn" data-action="close-detail">' + icon('back') + ' Back</button>' : '') +
      '<div class="detail-hero" style="' + (movie.posterImage ? '' : posterStyle(movie)) + '">' +
        posterImgTag(movie,'banner') +
        (movie.posterImage ? '' : '<span class="detail-hero__initial">' + initialOf(movie) + '</span>') +
        '<div class="detail-hero__actions">' +
          '<button class="icon-btn" data-action="share-show" data-show="' + movie.id + '" aria-label="Share ' + movie.title + '">' + icon('share') + '</button>' +
          '<button class="icon-btn" data-action="edit-show" data-show="' + movie.id + '" aria-label="Edit ' + movie.title + '">' + icon('pencil') + '</button>' +
          '<button class="icon-btn icon-btn--danger' + (deleteConfirming?' danger-confirm':'') + '" data-action="delete-show" data-show="' + movie.id + '" aria-label="Delete ' + movie.title + '">' + icon('trash') + '</button>' +
        '</div>' +
      '</div>' +
      (deleteConfirming ? '<p class="screen-kicker" style="color:var(--danger);font-weight:700;">Tap delete again to remove ' + movie.title + '.</p>' : '') +
      '<h2 class="detail-title">' + movie.title + '</h2>' +
      (movie.seasonLabel ? '<p class="chip" style="display:inline-block;margin:2px 0 4px;">' + movie.seasonLabel + '</p>' : '') +
      (movie.originalTitle ? '<p class="detail-meta detail-meta--muted" style="margin-top:-2px;">' + movie.originalTitle + '</p>' : '') +
      '<p class="detail-meta">' + [movie.nationality].concat(movie.genres||[]).filter(Boolean).join(' · ') + '</p>' +
      '<p class="detail-meta detail-meta--muted">' + [movie.releaseYear, movie.runtimeMinutes ? (movie.runtimeMinutes+' min') : null, movie.platform].filter(Boolean).join(' · ') + '</p>' +
      '<p class="detail-meta detail-meta--muted">Watched ' + (movie.watchedDate ? fmtDate(new Date(movie.watchedDate + 'T00:00:00')) : '—') + '</p>' +
      ((movie.cast||[]).length ? '<div class="chip-row">' + movie.cast.map(function(c){
        var ce = castEntry(c);
        return '<span class="chip cast-chip">' + (ce.photo ? '<span class="cast-chip-photo">' + castImgTag(ce) + '</span>' : '<span class="cast-chip-init">'+(ce.name.trim().charAt(0).toUpperCase()||'?')+'</span>') + ce.name + '</span>';
      }).join('') + '</div>' : '') +
      '<div class="star-pick" style="margin:6px 0 0;">' + stars + '</div>' +
      relatedSectionHtml(movie);
  }

  /* ---------------- episode ratings & feelings ---------------- */
  function feelingParts(opt){
    var i = opt.indexOf(' ');
    var first = i > 0 ? opt.slice(0, i) : opt;
    var isEmoji = /[^\u0000-ɏ]/.test(first) && first.length <= 8;
    if(!isEmoji) return { emoji:'', label:opt };
    return { emoji:first, label: i > 0 ? opt.slice(i+1).trim() : '' };
  }
  function feelingShort(opt){ var p = feelingParts(opt); return p.emoji || p.label; }
  function epRating(show, ep){ return (show.epRatings && show.epRatings[String(ep)]) || null; }
  function epAverage(show){
    var vals = []; var m = show.epRatings || {};
    Object.keys(m).forEach(function(k){ if(+k <= show.totalEpisodes && m[k] && m[k].r) vals.push(m[k].r); });
    return vals.length ? vals.reduce(function(a,b){ return a+b; }, 0) / vals.length : 0;
  }
  function feelingCounts(show){
    var c = {}; var m = show.epRatings || {};
    Object.keys(m).forEach(function(k){ if(+k > show.totalEpisodes) return; ((m[k] && m[k].e) || []).forEach(function(f){ c[f] = (c[f]||0) + 1; }); });
    return Object.keys(c).map(function(f){ return [f, c[f]]; }).sort(function(a,b){ return b[1]-a[1]; });
  }
  function miniRatingHtml(show, ep){
    var r = epRating(show, ep);
    if(!r) return '';
    var s = (r.r ? '<span class="ep-mini-stars">' + '★'.repeat(r.r) + '</span>' : '') +
            ((r.e||[]).length ? '<span class="ep-mini-feel">' + r.e.map(feelingShort).join(' ') + '</span>' : '');
    return s ? '<span class="ep-row__rating">' + s + '</span>' : '';
  }
  function seriesScoreBoxHtml(show){
    var avg = epAverage(show);
    var own = show.seriesRating || 0;
    var shown = own || Math.round(avg);
    var counts = feelingCounts(show);
    var summary = (own ? '<span class="g">★</span> ' + own + '.0' : (avg ? '<span class="g">★</span> ' + avg.toFixed(1) : 'Not rated yet')) +
      (counts.length ? ' · ' + feelingShort(counts[0][0]) + ' ×' + counts[0][1] : '');
    var stars = ''; for(var i=1;i<=5;i++) stars += '<span class="' + (i<=shown?'on':'') + '" data-action="set-series-rating" data-show="' + show.id + '" data-value="' + i + '">★</span>';
    var bars = ''; var every = show.totalEpisodes > 16 ? 5 : 1;
    for(var e=1;e<=show.totalEpisodes;e++){
      var rr = epRating(show, e); var v = rr && rr.r ? rr.r : 0;
      bars += '<div class="' + (v?'has':'') + '" style="height:' + (v ? v*20 : 7) + '%">' + ((e===1 || e%every===0) ? '<small>' + e + '</small>' : '') + '</div>';
    }
    var mx = counts.length ? counts[0][1] : 1;
    var feel = counts.length ? counts.map(function(c){
      return '<div class="feel-bar"><span class="t">' + feelingShort(c[0]) + '</span><div class="track"><i style="width:' + (c[1]/mx*100) + '%"></i></div><span class="n">' + c[1] + '</span></div>';
    }).join('') : '<p class="score-note">No feelings logged yet.</p>';
    return '<div class="score-box' + (state.scoreBoxOpen ? ' open' : '') + '">' +
      '<button type="button" class="score-head" data-action="toggle-score-box"><span class="lbl">Your series score</span><span class="sum">' + summary + '</span><span class="chev">' + icon('down') + '</span></button>' +
      (state.scoreBoxOpen ? '<div class="score-inner">' +
        '<p class="score-sub">Overall</p><div class="star-pick">' + stars + '</div>' +
        '<p class="score-note">' + (avg ? 'Episode average ' + avg.toFixed(1) + ' ★ · ' : '') + (own ? 'your own score. Tap the same star again to go back to the average.' : 'tap a star to set your own score') + '</p>' +
        '<p class="score-sub">Each episode</p><div class="score-graph">' + bars + '</div>' +
        '<p class="score-sub">Feelings so far</p><div class="feel-bars">' + feel + '</div>' +
      '</div>' : '') +
    '</div>';
  }
  function openRateSheet(showId, ep, isNew){
    var show = getShow(showId); if(!show) return;
    var existing = epRating(show, ep) || {};
    state.rateSheet = { showId:showId, ep:ep, isNew:isNew, r: existing.r || 0, e: (existing.e || []).slice(), animate:true };
    if(state.managingList === 'feeling') state.managingList = null;
    render();
  }
  function rateSheetInner(){
    var rs = state.rateSheet; var show = rs && getShow(rs.showId); if(!show) return '';
    var stars = ''; for(var i=1;i<=5;i++) stars += '<span class="' + (i<=rs.r?'on':'') + '" data-action="rate-star" data-value="' + i + '">★</span>';
    var feels = state.feelingOptions.map(function(opt){
      var p = feelingParts(opt); var on = rs.e.indexOf(opt) !== -1;
      return '<button type="button" class="feel' + (on?' on':'') + '" data-action="rate-feel" data-value="' + opt.replace(/"/g,'&quot;') + '">' + (p.emoji ? '<b>' + p.emoji + '</b>' : '') + '<span>' + (p.label || '&nbsp;') + '</span></button>';
    }).join('');
    var managing = state.managingList === 'feeling';
    return '<div class="rate-grab"></div>' +
      '<div class="rate-top"><div class="rate-thumb" style="' + (show.posterImage ? '' : posterStyle(show)) + '">' + posterImgTag(show,'thumbnail') + '</div>' +
        '<div class="rate-top__text"><h3>Episode ' + rs.ep + (rs.isNew ? ' watched ✓' : '') + '</h3><p>' + show.title + (rs.isNew ? ' · both optional' : ' · edit your rating') + '</p></div>' +
        '<button type="button" class="rate-share" data-action="share-rate">' + icon('share') + 'Share</button></div>' +
      '<div class="star-pick rate-stars">' + stars + '</div>' +
      '<p class="score-sub" style="margin-top:14px;">How did it make you feel?</p>' +
      '<div class="feel-grid">' + feels + '</div>' +
      '<button type="button" class="link-btn" data-action="toggle-manage-list" data-list="feeling">' + (managing ? 'Done' : 'Edit feelings list') + '</button>' +
      (managing ? manageListPanel('feeling', state.feelingOptions) : '') +
      '<div class="rate-actions"><button type="button" class="btn btn-ghost" data-action="rate-close">' + (rs.isNew ? 'Skip' : 'Cancel') + '</button>' +
        '<button type="button" class="btn btn-primary" data-action="rate-save">Save</button></div>' +
      ((!rs.isNew && rs.ep === show.watched) ? '<button type="button" class="rate-unwatch" data-action="rate-unwatch">Mark as unwatched</button>' : '');
  }
  function rateSheetHtml(){
    if(!state.rateSheet) return '';
    return '<div class="rate-scrim" data-action="rate-close"></div>' +
      '<div class="rate-sheet' + (state.rateSheet.animate ? ' is-opening' : '') + '" id="rateSheet">' + rateSheetInner() + '</div>';
  }
  function redrawRateSheet(){
    var el = document.getElementById('rateSheet');
    if(el) el.innerHTML = rateSheetInner(); else render();
  }
  function closeRateSheet(){ state.rateSheet = null; if(state.managingList === 'feeling') state.managingList = null; render(); }
  var toastTimer = null;
  function showToast(msg){
    var t = document.getElementById('appToast');
    if(!t){ t = document.createElement('div'); t.id = 'appToast'; t.className = 'app-toast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('on');
    clearTimeout(toastTimer); toastTimer = setTimeout(function(){ t.classList.remove('on'); }, 1800);
  }

  function epShareBtn(show, ep){ return '<button type="button" class="ep-share" data-action="share-ep" data-show="' + show.id + '" data-ep="' + ep + '" aria-label="Share episode ' + ep + '">' + icon('share') + '</button>'; }
  function renderShowDetailContent(show, opts){
    if(show.type === 'movie') return renderMovieDetailContent(show, opts);
    opts = opts || {};
    var info = getNextEpisodeInfo(show, Date.now());
    var pct = Math.round((show.watched/show.totalEpisodes)*100);
    var rows = '';
    var durSuffix = show.episodeMinutes ? ' · ' + show.episodeMinutes + ' min' : '';
    for(var i=1;i<=show.totalEpisodes;i++){
      var d = computeEpisodeDate(show, i);
      if(i <= show.watched){
        if(i === show.watched){
          rows += '<li class="ep-row ep-row--watched ep-row--rateable" data-action="open-rate" data-show="' + show.id + '" data-ep="' + i + '"><button class="ep-row__check ep-row__check--done" data-action="uncheck-episode" data-show="' + show.id + '" aria-label="Mark episode ' + i + ' as not watched">' + icon('check') + '</button><span class="ep-row__title">Episode ' + i + durSuffix + miniRatingHtml(show, i) + '</span><span class="ep-row__date">' + fmtDate(d) + '</span>' + epShareBtn(show, i) + '</li>';
        } else {
          rows += '<li class="ep-row ep-row--watched ep-row--rateable" data-action="open-rate" data-show="' + show.id + '" data-ep="' + i + '"><span class="ep-row__num">' + icon('check') + '</span><span class="ep-row__title">Episode ' + i + durSuffix + miniRatingHtml(show, i) + '</span><span class="ep-row__date">' + fmtDate(d) + '</span>' + epShareBtn(show, i) + '</li>';
        }
      } else if(i === show.watched+1 && info.aired){
        rows += '<li class="ep-row ep-row--ready"><button class="ep-row__check" data-action="check-episode" data-show="' + show.id + '" aria-label="Mark episode ' + i + ' watched">' + icon('check') + '</button><span class="ep-row__title">Episode ' + i + durSuffix + '</span><span class="ep-row__date">' + fmtDateTime(d) + '</span></li>';
      } else if(i === show.watched+1){
        rows += '<li class="ep-row ep-row--waiting"><span class="ep-row__num">' + icon('clock') + '</span><span class="ep-row__title">Episode ' + i + durSuffix + '</span><span class="ep-row__date">Airs ' + fmtDateTime(d) + '</span></li>';
      } else {
        rows += '<li class="ep-row ep-row--locked"><span class="ep-row__num">' + icon('lock') + '</span><span class="ep-row__title">Episode ' + i + durSuffix + '</span><span class="ep-row__date">' + fmtDate(d) + '</span></li>';
      }
    }
    var deleteConfirming = state.confirmDeleteId === show.id;
    return (opts.showBack ? '<button class="icon-btn back-btn" data-action="close-detail">' + icon('back') + ' Back</button>' : '') +
      '<div class="detail-hero" style="' + (show.posterImage ? '' : posterStyle(show)) + '">' +
        posterImgTag(show,'banner') +
        (show.posterImage ? '' : '<span class="detail-hero__initial">' + initialOf(show) + '</span>') +
        '<div class="detail-hero__actions">' +
          '<button class="icon-btn" data-action="share-show" data-show="' + show.id + '" aria-label="Share ' + show.title + '">' + icon('share') + '</button>' +
          '<button class="icon-btn" data-action="edit-show" data-show="' + show.id + '" aria-label="Edit ' + show.title + '">' + icon('pencil') + '</button>' +
          '<button class="icon-btn icon-btn--danger' + (deleteConfirming?' danger-confirm':'') + '" data-action="delete-show" data-show="' + show.id + '" aria-label="Delete ' + show.title + '">' + icon('trash') + '</button>' +
        '</div>' +
      '</div>' +
      (deleteConfirming ? '<p class="screen-kicker" style="color:var(--danger);font-weight:700;">Tap delete again to remove ' + show.title + '.</p>' : '') +
      '<h2 class="detail-title">' + show.title + '</h2>' +
      (show.seasonLabel ? '<p class="chip" style="display:inline-block;margin:2px 0 4px;">' + show.seasonLabel + '</p>' : '') +
      (show.originalTitle ? '<p class="detail-meta detail-meta--muted" style="margin-top:-2px;">' + show.originalTitle + '</p>' : '') +
      '<p class="detail-meta">' + [(getCategory(show.category)||{}).name, show.nationality].concat(show.genres||[]).filter(Boolean).join(' · ') + '</p>' +
      '<p class="detail-meta detail-meta--muted">' + (show.channel||'—') + ' · ' + (show.platform||'—') + '</p>' +
      '<p class="detail-meta detail-meta--muted">' + scheduleText(show) + '</p>' +
      ((show.cast||[]).length ? '<div class="chip-row">' + show.cast.map(function(c){
        var ce = castEntry(c);
        return '<span class="chip cast-chip">' + (ce.photo ? '<span class="cast-chip-photo">' + castImgTag(ce) + '</span>' : '<span class="cast-chip-init">'+(ce.name.trim().charAt(0).toUpperCase()||'?')+'</span>') + ce.name + '</span>';
      }).join('') + '</div>' : '') +
      '<div class="progress"><div class="progress__bar" style="width:' + pct + '%"></div></div>' +
      '<p class="progress__label">' + show.watched + ' of ' + show.totalEpisodes + ' watched</p>' +
      seriesScoreBoxHtml(show) +
      '<ul class="ep-list">' + rows + '</ul>' +
      relatedSectionHtml(show);
  }
  function renderDetailScreen(){
    var show = getShow(state.detailShowId);
    if(!show) return '<div class="screen-pad"><p class="screen-kicker">Show not found.</p></div>';
    return '<div class="screen-pad">' + renderShowDetailContent(show, {showBack:true}) + '</div>';
  }

  /* ---------------- FORM ---------------- */
  // Live preview of the dates in the Add / Edit form, from the same calculation the app uses everywhere.
  function releasePlanHtml(d){
    var total = Math.max(1, parseInt(d.totalEpisodes,10) || 1);
    if(!d.firstAirDate || isNaN(new Date(d.firstAirDate + 'T00:00:00').getTime())) return '<p class="crop-hint" style="margin:0">Set the date episode 1 airs to see the plan.</p>';
    var per = Math.max(1, parseInt(d.episodesPerAiring,10) || 1), prem = parseInt(d.premiereEpisodes,10);
    var sh = { firstAirDate:d.firstAirDate, airDays:(d.airDays && d.airDays.length) ? d.airDays : [0], airTime:d.airTime || '20:00', episodesPerAiring:per, premiereEpisodes: prem > 0 ? prem : '' };
    var groups = [], i, dt, k;
    for(i = 1; i <= Math.min(total, 400); i++){ dt = computeEpisodeDate(sh, i); k = dt.toDateString();
      if(!groups.length || groups[groups.length-1].k !== k) groups.push({ k:k, d:dt, a:i, b:i }); else groups[groups.length-1].b = i; }
    var row = function(g){ return '<li><span>' + fmtDate(g.d) + '</span><b>' + (g.a === g.b ? 'Ep ' + g.a : 'Ep ' + g.a + '–' + g.b) + '</b></li>'; };
    var shown = groups.length > 7 ? groups.slice(0,5) : groups;
    return '<ul>' + shown.map(row).join('') + (groups.length > 7 ? '<li class="more"><span>…</span><b>' + (groups.length - 6) + ' more</b></li>' + row(groups[groups.length-1]) : '') + '</ul>';
  }
  function emptyDraft(){
    return { id:null, type:'show', title:'', originalTitle:'', seasonLabel:'', genres:[], cast:[], nationality:'', category:(state.categories[0]?state.categories[0].id:''), folderIds:[], totalEpisodes:8, airDays:[0],
      airTime:'20:00', airTimeZone:'TH', airTimeOriginal:'20:00',
      firstAirDate: isoDateOffset(0), channel:'', platform:'', posterIndex: Math.floor(Math.random()*GRADIENTS.length),
      posterImage:null, posterCrops: defaultCrops(), episodeMinutes:'', episodesPerAiring:1, premiereEpisodes:'', related:[] };
  }
  function emptyMovieDraft(){
    return { id:null, type:'movie', title:'', originalTitle:'', seasonLabel:'', genres:[], cast:[], nationality:'', category:'movie',
      releaseYear:'', runtimeMinutes:'', watchedDate: isoDateOffset(0), rating:0, platform:'',
      posterIndex: Math.floor(Math.random()*GRADIENTS.length), posterImage:null, posterCrops: defaultCrops(), related:[] };
  }
  function tagField(label, field, values, placeholderText){
    return '<div class="field"><label>' + label + '</label>' +
      (values.length ? '<div class="chip-row" style="margin-top:0;margin-bottom:8px;">' + values.map(function(v,i){
        return '<span class="chip chip-x">' + v + '<button type="button" data-action="remove-chip" data-field="' + field + '" data-index="' + i + '">' + icon('close') + '</button></span>';
      }).join('') + '</div>' : '') +
      '<input type="text" id="tagInput_' + field + '" data-tag-input data-field="' + field + '" placeholder="' + placeholderText + '">' +
      '</div>';
  }
  function manageListPanel(listKey, options){
    var chips = options.map(function(o){
      return '<span class="chip chip-x">' + o + '<button type="button" data-action="remove-list-item" data-list="' + listKey + '" data-value="' + o.replace(/"/g,'&quot;') + '">' + icon('close') + '</button></span>';
    }).join('');
    return '<div class="manage-list-panel">' +
      (chips ? '<div class="chip-row" style="margin-top:0;">' + chips + '</div>' : '<p class="crop-hint" style="margin-top:0;">No options yet.</p>') +
      '<input type="text" id="listAddInput_' + listKey + '" data-list-add-input="' + listKey + '" placeholder="Add a new option, press Enter">' +
    '</div>';
  }
  function categoryField(d){
    var chips = state.categories.filter(function(c){ return c.id !== 'movie'; }).map(function(c){
      return '<button type="button" class="opt-chip' + (d.category===c.id?' active':'') + '" data-action="set-category" data-value="' + c.id + '">' + c.name + '</button>';
    }).join('');
    return '<div class="field"><label>Category</label><div class="day-chips">' + chips + '</div>' +
      '<button type="button" class="link-btn" data-action="toggle-manage-categories">' + (state.managingCategories ? 'Done' : 'Manage categories & genres') + '</button>' +
      (state.managingCategories ? renderManageCategoriesPanel() : '') +
    '</div>';
  }
  function renderManageCategoriesPanel(){
    var out = '';
    state.categories.filter(function(c){ return c.id !== 'movie'; }).forEach(function(c){
      out += '<div class="category-card">' +
        '<div class="category-card-head">' +
          '<input type="text" value="' + c.name.replace(/"/g,'&quot;') + '" data-action-input="rename-category" data-cat="' + c.id + '">' +
          '<button type="button" class="mini-danger-btn" data-action="delete-category" data-cat="' + c.id + '" aria-label="Delete ' + c.name.replace(/"/g,'&quot;') + '">' + icon('trash') + '</button>' +
        '</div>' +
        (c.genres.length ? '<div class="chip-row" style="margin-top:0;">' + c.genres.map(function(g){
          return '<span class="chip chip-x">' + g + '<button type="button" data-action="remove-genre-from-cat" data-cat="' + c.id + '" data-genre="' + g.replace(/"/g,'&quot;') + '">' + icon('close') + '</button></span>';
        }).join('') + '</div>' : '<p class="crop-hint" style="margin:0 0 8px;">No genres yet.</p>') +
        '<input type="text" class="category-add-input" data-action-input="add-genre-to-cat" data-cat="' + c.id + '" placeholder="Add a genre, press Enter">' +
      '</div>';
    });
    out += '<div class="category-card"><label style="display:block;font-size:11px;font-weight:700;color:var(--text-muted);margin-bottom:6px;">NEW CATEGORY</label>' +
      '<input type="text" id="newCategoryInput" class="category-add-input" placeholder="Category name, press Enter"></div>';
    return out;
  }
  function genrePickerField(d){
    var effectiveCatId = genreCategoryId(d.category);
    var cat = getCategory(effectiveCatId);
    var list = cat ? cat.genres : [];
    var display = list.concat(d.genres.filter(function(g){ return list.indexOf(g) === -1; }));
    var expanded = state.genrePickerExpanded;
    var selectedChips = d.genres.map(function(g){
      return '<span class="sel-chip">' + g + '<button type="button" data-action="remove-genre" data-value="' + g.replace(/"/g,'&quot;') + '" aria-label="Remove ' + g.replace(/"/g,'&quot;') + '">' + icon('close') + '</button></span>';
    }).join('');
    var allChips = display.map(function(g){
      var active = d.genres.indexOf(g) !== -1;
      return '<button type="button" class="opt-chip' + (active?' active':'') + '" data-action="toggle-genre" data-value="' + g.replace(/"/g,'&quot;') + '">' + g + '</button>';
    }).join('');
    return '<div class="field"><label>Genre <span style="font-weight:400;color:var(--text-muted);">(' + (cat?cat.name:'—') + ' set)</span></label>' +
      (d.genres.length ? '<div class="selected-row">' + selectedChips + '</div>' : '<p class="crop-hint" style="margin:0 0 8px;">No genres selected yet.</p>') +
      '<button type="button" class="link-btn" data-action="toggle-genre-picker">' + (expanded ? 'Done' : 'Edit genres') + '</button>' +
      (expanded ? '<div class="day-chips" style="margin-top:10px;">' + (allChips || '<span class="crop-hint" style="margin:0;">No genres in this set yet — add some via Manage categories.</span>') + '</div>' : '') +
    '</div>';
  }
  function folderField(d){
    var chips = state.folders.map(function(f){
      var active = d.folderIds.indexOf(f.id) !== -1;
      return '<button type="button" class="opt-chip' + (active?' active':'') + '" data-action="toggle-show-folder" data-folder="' + f.id + '">' + f.name + '</button>';
    }).join('');
    return '<div class="field"><label>Folders</label><div class="day-chips">' + (chips || '<span class="crop-hint" style="margin:0;">No folders yet.</span>') + '</div>' +
      '<input type="text" id="newFolderFromForm" class="category-add-input" style="margin-top:10px;" data-action-input="new-folder-from-form" placeholder="Create a new folder, press Enter">' +
    '</div>';
  }
  function nationalityField(d){
    var opts = state.nationalityOptions.map(function(n){
      return '<option value="' + n.replace(/"/g,'&quot;') + '"' + (d.nationality===n?' selected':'') + '>' + n + '</option>';
    }).join('');
    return '<div class="field"><label>Nationality</label>' +
      '<select id="f_nationality" data-field="nationality"><option value=""' + (!d.nationality?' selected':'') + '>—</option>' + opts + '</select>' +
      '<button type="button" class="link-btn" data-action="toggle-manage-list" data-list="nationality">' + (state.managingList==='nationality' ? 'Done' : 'Manage list') + '</button>' +
      (state.managingList === 'nationality' ? manageListPanel('nationality', state.nationalityOptions) : '') +
    '</div>';
  }
  function seasonLabelField(d){
    var opts = state.seasonLabels.map(function(n){
      return '<option value="' + n.replace(/"/g,'&quot;') + '"' + (d.seasonLabel===n?' selected':'') + '>' + n + '</option>';
    }).join('');
    return '<div class="field"><label>Season / part label (optional)</label>' +
      '<select id="f_seasonlabel" data-field="seasonLabel"><option value=""' + (!d.seasonLabel?' selected':'') + '>—</option>' + opts + '</select>' +
      '<button type="button" class="link-btn" data-action="toggle-manage-list" data-list="season">' + (state.managingList==='season' ? 'Done' : 'Manage list') + '</button>' +
      (state.managingList === 'season' ? manageListPanel('season', state.seasonLabels) : '') +
    '</div>';
  }
  function castField(d){
    var rows = d.cast.map(function(c, i){
      var cropOpen = state.castCropTargetIndex === i;
      var row = '<div class="cast-row">' +
        '<button type="button" class="cast-photo" data-action="trigger-cast-photo" data-index="' + i + '" aria-label="Add photo for ' + c.name.replace(/"/g,'&quot;') + '">' +
          (c.photo ? castImgTag(c) : '<span>' + (c.name.trim().charAt(0).toUpperCase()||'?') + '</span>') +
        '</button>' +
        '<span class="cast-name">' + c.name + '</span>' +
        (c.photo ? '<button type="button" class="link-btn" style="margin:0 6px 0 0;" data-action="toggle-cast-crop" data-index="' + i + '">' + (cropOpen ? 'Done' : 'Adjust') + '</button>' : '') +
        '<button type="button" class="cast-remove" data-action="remove-cast" data-index="' + i + '" aria-label="Remove ' + c.name.replace(/"/g,'&quot;') + '">' + icon('close') + '</button>' +
      '</div>';
      if(cropOpen && c.photo){
        row += '<div class="crop-field" style="margin-top:0 0 14px;">' +
          '<div class="crop-box crop-box--avatar" data-crop-box data-crop-target="cast" data-cast-index="' + i + '">' + castImgTag(c) + '</div>' +
          '<input type="range" class="crop-zoom" min="100" max="250" value="' + ((c.crop && c.crop.zoom) || 100) + '" data-crop-zoom data-crop-target="cast" data-cast-index="' + i + '">' +
          '<p class="crop-hint">Drag the photo to reposition · slide to zoom</p>' +
        '</div>';
      }
      return row;
    }).join('');
    return '<div class="field"><label>Cast</label>' +
      (rows ? '<div class="cast-list">' + rows + '</div>' : '') +
      '<input type="text" id="tagInput_castName" data-cast-name-input placeholder="Type a name, press Enter">' +
      '<p class="crop-hint">Add a name, then tap their circle to add a photo — use Adjust to crop it.</p>' +
    '</div>';
  }
  function renderFormScreen(){
    var d = state.formDraft;
    var isEdit = !!d.id;
    var swatches = GRADIENTS.map(function(g,i){
      return '<button type="button" class="swatch' + (d.posterIndex===i?' active':'') + '" style="background:linear-gradient(135deg,' + g[0] + ',' + g[1] + ')" data-action="set-poster" data-index="' + i + '" aria-label="Poster style ' + (i+1) + '"></button>';
    }).join('');
    var posterSection;
    if(d.posterImage){
      var cropSlots = [
        { key:'thumbnail', label:'Thumbnail (home cards & lists)' },
        { key:'grid', label:'Poster (Browse grid)' },
        { key:'banner', label:'Banner (show page)' }
      ];
      posterSection = '<div class="field"><label>Poster image</label>' +
        '<div class="poster-upload-row">' +
          '<div class="poster-upload-preview">' + posterImgTag(d,'thumbnail') + '</div>' +
          '<button type="button" class="btn btn-ghost btn-sm" data-action="trigger-poster-upload">Change image</button>' +
          '<button type="button" class="btn btn-ghost btn-sm" data-action="remove-poster-image">Remove</button>' +
        '</div></div>' +
        cropSlots.map(function(slot){
          var c = (d.posterCrops && d.posterCrops[slot.key]) || {x:50,y:50,zoom:100};
          return '<div class="crop-field"><label>' + slot.label + '</label>' +
            '<div class="crop-box crop-box--' + slot.key + '" data-crop-box data-slot="' + slot.key + '">' + posterImgTag(d, slot.key) + '</div>' +
            '<input type="range" class="crop-zoom" min="100" max="250" value="' + c.zoom + '" data-crop-zoom data-slot="' + slot.key + '">' +
            '<p class="crop-hint">Drag the image to reposition · slide to zoom</p>' +
          '</div>';
        }).join('');
    } else {
      posterSection = '<div class="field"><label>Poster style</label><div class="swatches">' + swatches + '</div>' +
        '<div class="poster-upload-row"><button type="button" class="btn btn-ghost btn-sm" data-action="trigger-poster-upload">Upload a poster image instead</button></div>' +
      '</div>';
    }

    if(state.formKind === 'movie'){
      var stars = '<div class="star-pick">' + [1,2,3,4,5].map(function(n){
        return '<span class="' + (d.rating>=n?'on':'') + '" data-action="set-movie-rating" data-value="' + n + '">★</span>';
      }).join('') + '</div>';
      return '<div class="screen-pad">' +
        '<div class="form-head"><h2>' + (isEdit ? 'Edit movie' : 'Add movie') + '</h2><button type="button" data-action="cancel-form">Cancel</button></div>' +
        '<form id="showForm">' +
          '<div class="field"><label>Title</label><input type="text" id="f_title" data-field="title" value="' + (d.title||'').replace(/"/g,'&quot;') + '" placeholder="e.g. Past Lives" required></div>' +
          '<div class="field"><label>Original title (optional)</label><input type="text" id="f_origtitle" data-field="originalTitle" value="' + (d.originalTitle||'').replace(/"/g,'&quot;') + '" placeholder="e.g. 헤어질 결심"></div>' +
          seasonLabelField(d) +
          posterSection +
          genrePickerField(d) +
          nationalityField(d) +
          castField(d) +
          '<div class="two-col">' +
            '<div class="field"><label>Release year</label><input type="number" id="f_relyear" data-field="releaseYear" min="1900" max="2100" value="' + (d.releaseYear||'') + '" placeholder="e.g. 2024"></div>' +
            '<div class="field"><label>Runtime (minutes)</label><input type="number" id="f_runtime" data-field="runtimeMinutes" min="1" value="' + (d.runtimeMinutes||'') + '" placeholder="e.g. 118"></div>' +
          '</div>' +
          '<div class="two-col">' +
            '<div class="field"><label>Watched on</label><input type="date" id="f_watcheddate" data-field="watchedDate" value="' + (d.watchedDate||'') + '"></div>' +
            '<div class="field"><label>Platform</label><input type="text" id="f_platform" data-field="platform" list="platformList" value="' + (d.platform||'').replace(/"/g,'&quot;') + '" placeholder="e.g. Netflix, Theater"><datalist id="platformList">' + PLATFORM_OPTIONS.map(function(p){return '<option value="'+p+'">';}).join('') + '</datalist></div>' +
          '</div>' +
          '<div class="field"><label>Your rating</label>' + stars + '</div>' +
          ((d.id && state.confirmDeleteId === d.id) ? '<p class="screen-kicker" style="color:var(--danger);font-weight:700;margin:-6px 0 12px;">Tap delete again to remove this movie.</p>' : '') +
          '<div class="form-actions">' +
            (isEdit ? '<button type="button" class="btn btn-danger' + (state.confirmDeleteId===d.id?' danger-confirm':'') + '" data-action="delete-show-form">Delete</button>' : '') +
            '<button type="submit" class="btn btn-primary">' + (isEdit ? 'Save changes' : 'Add movie') + '</button>' +
          '</div>' +
        '</form>' +
      '</div>';
    }

    var dayChips = WEEKDAY_LABELS.map(function(lbl,i){
      return '<button type="button" class="day-chip' + (d.airDays.indexOf(i)!==-1?' active':'') + '" data-action="toggle-day" data-day="' + i + '">' + lbl + '</button>';
    }).join('');
    return '<div class="screen-pad">' +
      '<div class="form-head"><h2>' + (isEdit ? 'Edit show' : 'Add a show') + '</h2><button type="button" data-action="cancel-form">Cancel</button></div>' +
      '<form id="showForm">' +
        '<div class="field"><label>Title</label><input type="text" id="f_title" data-field="title" value="' + (d.title||'').replace(/"/g,'&quot;') + '" placeholder="e.g. Nightbound" required></div>' +
        '<div class="field"><label>Original title (optional)</label><input type="text" id="f_origtitle" data-field="originalTitle" value="' + (d.originalTitle||'').replace(/"/g,'&quot;') + '" placeholder="e.g. 로또 1등도 출근합니다"></div>' +
        seasonLabelField(d) +
        posterSection +
        categoryField(d) +
        genrePickerField(d) +
        nationalityField(d) +
        folderField(d) +
        castField(d) +
        '<div class="two-col">' +
          '<div class="field"><label>Total episodes</label><input type="number" id="f_total" data-field="totalEpisodes" min="1" value="' + d.totalEpisodes + '"></div>' +
          '<div class="field"><label>Episode 1 airs</label><input type="date" id="f_date" data-field="firstAirDate" value="' + d.firstAirDate + '"></div>' +
        '</div>' +
        '<div class="field"><label>Episode length (minutes)</label><input type="number" id="f_epmin" data-field="episodeMinutes" min="1" value="' + (d.episodeMinutes||'') + '" placeholder="e.g. 45"></div>' +
        '<div class="field"><label>Air days</label><div class="day-chips">' + dayChips + '</div></div>' +
        '<div class="sched-drop"><div class="two-col">' +
          '<div class="field"><label>Episodes on day 1</label><input type="number" id="f_premiere" data-field="premiereEpisodes" min="1" value="' + (d.premiereEpisodes||'') + '" placeholder="' + (d.episodesPerAiring||1) + '"></div>' +
          '<div class="field"><label>Episodes released together</label><input type="number" id="f_perdrop" data-field="episodesPerAiring" min="1" value="' + (d.episodesPerAiring||1) + '"></div>' +
        '</div><p class="crop-hint" style="margin:-4px 0 10px">“Released together”: e.g. 2 episodes every Monday. “Episodes on day 1”: only if the premiere drops a different number (e.g. 4 on day 1, then 2 a week). Leave it empty otherwise.</p>' +
        '<div class="field"><label>Release plan</label><div class="release-plan" id="f_plan">' + releasePlanHtml(d) + '</div></div></div><!--/sched-drop-->' +
        '<div class="field"><label>Air time (as broadcast)</label><div class="two-col">' +
          '<select id="f_origtz" data-tz-input>' + TZ_OPTIONS.map(function(tz){ return '<option value="' + tz.v + '"' + ((d.airTimeZone||'TH')===tz.v?' selected':'') + '>' + tz.l + '</option>'; }).join('') + '</select>' +
          '<input type="time" id="f_origtime" data-origtime-input value="' + (d.airTimeOriginal||d.airTime) + '">' +
        '</div></div>' +
        '<div class="field"><label>Thai time (auto-converted — used for scheduling)</label><input type="time" id="f_thaitime" value="' + d.airTime + '" disabled></div>' +
        '<div class="two-col">' +
          '<div class="field"><label>Channel</label><input type="text" id="f_channel" data-field="channel" value="' + (d.channel||'').replace(/"/g,'&quot;') + '" placeholder="e.g. ONE31"></div>' +
          '<div class="field"><label>Platform (where you watch)</label><input type="text" id="f_platform" data-field="platform" list="platformList" value="' + (d.platform||'').replace(/"/g,'&quot;') + '" placeholder="e.g. WeTV"><datalist id="platformList">' + PLATFORM_OPTIONS.map(function(p){return '<option value="'+p+'">';}).join('') + '</datalist></div>' +
        '</div>' +
        ((d.id && state.confirmDeleteId === d.id) ? '<p class="screen-kicker" style="color:var(--danger);font-weight:700;margin:-6px 0 12px;">Tap delete again to remove this show.</p>' : '') +
        '<div class="form-actions">' +
          (isEdit ? '<button type="button" class="btn btn-danger' + (state.confirmDeleteId===d.id?' danger-confirm':'') + '" data-action="delete-show-form">Delete</button>' : '') +
          '<button type="submit" class="btn btn-primary">' + (isEdit ? 'Save changes' : 'Add show') + '</button>' +
        '</div>' +
      '</form>' +
    '</div>';
  }

  /* ---------------- ADD SHOWS TO FOLDER ---------------- */
  function renderAddShowsPanel(){
    var f = getFolder(state.addingShowsFolderId);
    if(!f) return '<div class="screen-pad"><p class="screen-kicker">Folder not found.</p></div>';
    var rows = state.shows.filter(function(s){ return s.type !== 'movie'; }).map(function(s){
      var checked = (s.folderIds||[]).indexOf(f.id) !== -1;
      return '<button type="button" class="checklist-row' + (checked?' checked':'') + '" data-action="toggle-in-folder-panel" data-show="' + s.id + '">' +
        '<span class="checklist-cb">' + (checked?icon('check'):'') + '</span>' +
        '<span class="checklist-poster" style="' + (s.posterImage ? '' : posterStyle(s)) + '">' + posterImgTag(s,'thumbnail') + '</span>' +
        '<span class="checklist-title">' + s.title + '</span>' +
      '</button>';
    }).join('');
    return '<div class="screen-pad">' +
      '<div class="form-head"><h2>Add to "' + f.name + '"</h2><button type="button" data-action="close-addshows">Done</button></div>' +
      (rows || '<p class="screen-kicker">No shows yet — add one from Browse first.</p>') +
    '</div>';
  }

  /* ---------------- SETTINGS ---------------- */
  function statusNoteHtml(){
    if(!state.ghStatus) return '';
    var color = state.ghStatus.type === 'error' ? 'var(--danger)' : state.ghStatus.type === 'success' ? 'var(--teal-strong)' : 'var(--text-muted)';
    return '<p class="sync-note" style="color:' + color + ';font-weight:600;">' + state.ghStatus.msg + '</p>';
  }
  function renderSettings(){
    var trackedShows = state.shows.filter(function(s){ return s.type !== 'movie'; });
    var totalShows = trackedShows.length;
    var totalWatched = trackedShows.reduce(function(a,s){return a+s.watched;},0);
    var completed = trackedShows.filter(function(s){return s.watched>=s.totalEpisodes;}).length;
    var totalMinutes = trackedShows.reduce(function(a,s){return a + s.watched*(s.episodeMinutes||0);},0);
    var hoursWatched = Math.round((totalMinutes/60)*10)/10;

    var syncCard;
    if(state.gh){
      syncCard = '<div class="settings-card"><h3>Sync across devices</h3>' +
        '<div class="sync-row"><span class="sync-dot"></span><div><p class="sync-row-title">Connected — ' + state.gh.owner + '/' + state.gh.repo + '</p><p class="sync-row-sub">Last synced ' + fmtRelative(state.lastSyncedAt) + '</p></div></div>' +
        statusNoteHtml() +
        '<button class="btn btn-ghost btn-block btn-sm" data-action="sync-now" style="margin-top:8px;">' + (state.syncing ? 'Syncing…' : 'Sync now') + '</button>' +
        '<button class="btn btn-danger btn-block btn-sm" data-action="disconnect-github" style="margin-top:8px;">Disconnect</button>' +
      '</div>';
    } else {
      syncCard = '<div class="settings-card"><h3>Sync across devices</h3>' +
        '<p class="sync-note">Connect a private GitHub repo to keep your shows in sync between your iPhone and iPad. Create an empty private repo, then a fine-grained token scoped to just that repo with Contents: Read and write — see the README for exact steps.</p>' +
        '<div class="field"><label>GitHub username</label><input type="text" id="gh_owner" placeholder="e.g. warutcha"></div>' +
        '<div class="field"><label>Repo name</label><input type="text" id="gh_repo" placeholder="e.g. twatched-data"></div>' +
        '<div class="field"><label>Personal access token</label><input type="password" id="gh_token" placeholder="fine-grained token"></div>' +
        statusNoteHtml() +
        '<button class="btn btn-primary btn-block" data-action="connect-github">Connect</button>' +
      '</div>';
    }

    return '<div class="screen-pad">' +
      '<h1 class="screen-title">Settings</h1><p class="screen-kicker">Appearance, sync, and your stats.</p>' +

      '<div class="settings-card"><h3>Appearance</h3><div class="segmented">' +
        ['system','light','dark'].map(function(t){
          return '<button data-action="set-theme" data-theme="' + t + '" class="' + (state.theme===t?'active':'') + '">' + (t==='system'?'System':t==='light'?'Light':'Dark') + '</button>';
        }).join('') + '</div></div>' +

      syncCard +

      '<div class="settings-card"><h3>Your stats</h3><div class="stat-grid">' +
        '<div class="stat-tile"><span class="n">' + totalShows + '</span><span class="l">Shows tracked</span></div>' +
        '<div class="stat-tile"><span class="n">' + totalWatched + '</span><span class="l">Episodes watched</span></div>' +
        '<div class="stat-tile"><span class="n">' + completed + '</span><span class="l">Completed</span></div>' +
        '<div class="stat-tile"><span class="n">' + hoursWatched + 'h</span><span class="l">Hours watched</span></div>' +
      '</div></div>' +
      '<p style="text-align:center;color:var(--text-muted);font-size:11px;margin:6px 0 0;">TWatched ' + APP_VERSION + '</p>' +
    '</div>';
  }

  /* ---------------- interactions ---------------- */
  function openOverlay(name){ saveTabScroll(); state.overlay = name; state.justOpenedOverlay = true; }

  function checkEpisode(showId){
    var btns = appBody.querySelectorAll('[data-action="check-episode"][data-show="' + showId + '"]');
    btns.forEach(function(b){ b.classList.add('is-punching'); });
    setTimeout(function(){
      var show = getShow(showId);
      if(show && show.watched < show.totalEpisodes){
        show.watched += 1;
        if(show.watched >= show.totalEpisodes) show.completedAt = Date.now();
        if(!show.watchLog) show.watchLog = {};
        show.watchLog[String(show.watched)] = Date.now();   // for Stats: when this episode was watched
        touch();
        // The episode is already saved as watched here — the sheet only adds an optional rating.
        openRateSheet(show.id, show.watched, true);
      }
    }, 260);
  }

  /* ---------------- poster upload ---------------- */
  // Shrink an uploaded photo for storage. Big shrinks are done in halving steps with high-quality
  // smoothing: one giant jump (e.g. 4000px -> 900px) makes the browser skip pixels instead of
  // blending them, which is what produced the jagged, pixelated look.
  function resizeToCanvas(img, tw, th){
    var src = img, sw = img.naturalWidth, sh = img.naturalHeight;
    while(sw / 2 >= tw && sh / 2 >= th){
      var nw = Math.round(sw / 2), nh = Math.round(sh / 2);
      var step = document.createElement('canvas');
      step.width = nw; step.height = nh;
      var sctx = step.getContext('2d');
      sctx.imageSmoothingEnabled = true; sctx.imageSmoothingQuality = 'high';
      sctx.drawImage(src, 0, 0, nw, nh);
      src = step; sw = nw; sh = nh;
    }
    var canvas = document.createElement('canvas');
    canvas.width = tw; canvas.height = th;
    var ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(src, 0, 0, tw, th);
    return canvas;
  }
  function readAndDownscaleImage(file, maxDim, quality, callback){
    try{
      var reader = new FileReader();
      reader.onload = function(ev){
        var img = new Image();
        img.onload = function(){
          try{
            var w = img.naturalWidth, h = img.naturalHeight;
            var scale = Math.min(1, maxDim / Math.max(w,h));
            var cw = Math.max(1, Math.round(w*scale)), ch = Math.max(1, Math.round(h*scale));
            callback(resizeToCanvas(img, cw, ch).toDataURL('image/jpeg', quality));
          }catch(err){ callback(null); }
        };
        img.onerror = function(){ callback(null); };
        img.src = ev.target.result;
      };
      reader.onerror = function(){ callback(null); };
      reader.readAsDataURL(file);
    }catch(err){ callback(null); }
  }

  function openAddForm(originTab){
    state.editingShowId = null;
    state.formDraft = emptyDraft();
    state.formKind = 'show';
    state.formOrigin = originTab || 'browse';
    state.confirmDeleteId = null;
    state.castCropTargetIndex = null;
    state.genrePickerExpanded = false;
    openOverlay('form');
  }
  function openAddMovieForm(originTab){
    state.editingShowId = null;
    state.formDraft = emptyMovieDraft();
    state.formKind = 'movie';
    state.formOrigin = originTab || 'browse';
    state.confirmDeleteId = null;
    state.castCropTargetIndex = null;
    state.genrePickerExpanded = false;
    openOverlay('form');
  }
  function openEditForm(showId, origin){
    var s = getShow(showId);
    if(!s) return;
    state.editingShowId = showId;
    if(s.type === 'movie'){
      state.formKind = 'movie';
      state.formDraft = { id:s.id, type:'movie', title:s.title, originalTitle: s.originalTitle || '', seasonLabel: s.seasonLabel || '', genres:(s.genres||[]).slice(), cast:(s.cast||[]).map(castEntry), nationality: s.nationality || '', category:'movie',
        releaseYear: s.releaseYear || '', runtimeMinutes: s.runtimeMinutes || '', watchedDate: s.watchedDate || isoDateOffset(0), rating: s.rating || 0, platform: s.platform || '',
        posterIndex: s.posterIndex||0, posterImage: s.posterImage || null,
        posterCrops: s.posterCrops ? JSON.parse(JSON.stringify(s.posterCrops)) : defaultCrops(),
        related: (s.related||[]).slice() };
    } else {
      state.formKind = 'show';
      state.formDraft = { id:s.id, type:'show', title:s.title, originalTitle: s.originalTitle || '', seasonLabel: s.seasonLabel || '', genres:(s.genres||[]).slice(), cast:(s.cast||[]).map(castEntry), nationality: s.nationality || '', category: s.category || (state.categories[0]?state.categories[0].id:''), folderIds:(s.folderIds||[]).slice(),
        totalEpisodes:s.totalEpisodes, airDays:(s.airDays||[]).slice(),
        airTime:s.airTime, airTimeZone: s.airTimeZone || 'TH', airTimeOriginal: s.airTimeOriginal || s.airTime,
        firstAirDate:s.firstAirDate,
        channel:s.channel||'', platform:s.platform||'', posterIndex:s.posterIndex||0,
        posterImage: s.posterImage || null,
        posterCrops: s.posterCrops ? JSON.parse(JSON.stringify(s.posterCrops)) : defaultCrops(),
        episodeMinutes: s.episodeMinutes || '', episodesPerAiring: s.episodesPerAiring || 1, premiereEpisodes: s.premiereEpisodes || '', related: (s.related||[]).slice() };
    }
    state.formOrigin = origin || 'browse';
    state.confirmDeleteId = null;
    state.castCropTargetIndex = null;
    state.genrePickerExpanded = false;
    openOverlay('form');
  }
  function closeForm(){
    state.overlay = (state.formOrigin === 'detail') ? 'detail' : null;
    if(state.overlay === 'detail') state.justOpenedOverlay = false;
    state.formDraft = null; state.editingShowId = null;
    render();
    if(state.overlay === null){
      restoreTabScroll();
    } else {
      window.scrollTo(0, 0);
    }
  }
  function submitForm(){
    if(state.formKind === 'movie'){ submitMovieForm(); return; }
    var d = state.formDraft;
    if(!d.title || !d.title.trim()) return;
    var total = Math.max(1, parseInt(d.totalEpisodes,10) || 1);
    var mins = parseInt(d.episodeMinutes,10);
    if(!mins || mins <= 0) mins = null;
    var perDrop = Math.max(1, parseInt(d.episodesPerAiring,10) || 1);
    var prem = parseInt(d.premiereEpisodes,10); prem = (prem > 0 && prem !== perDrop) ? Math.min(prem, total) : 0;   // 0 = same as "released together": not stored
    if(d.id){
      var s = getShow(d.id);
      if(s){
        s.title = d.title.trim(); s.originalTitle = (d.originalTitle||'').trim(); s.seasonLabel = (d.seasonLabel||'').trim(); s.genres = d.genres; s.cast = d.cast; s.nationality = d.nationality || ''; s.category = d.category || ''; s.folderIds = d.folderIds.slice(); s.totalEpisodes = total;
        s.airDays = d.airDays.length ? d.airDays : [0]; s.airTime = d.airTime; s.airTimeZone = d.airTimeZone || 'TH'; s.airTimeOriginal = d.airTimeOriginal || d.airTime; s.firstAirDate = d.firstAirDate;
        s.channel = d.channel; s.platform = d.platform; s.posterIndex = d.posterIndex;
        s.posterImage = d.posterImage || null; s.posterCrops = d.posterCrops || defaultCrops();
        s.episodeMinutes = mins; s.episodesPerAiring = perDrop;
        if(prem) s.premiereEpisodes = prem; else delete s.premiereEpisodes;
        if(s.watched > s.totalEpisodes) s.watched = s.totalEpisodes;
      }
    } else {
      state.shows.push({ id:'s'+Date.now(), type:'show', title:d.title.trim(), originalTitle:(d.originalTitle||'').trim(), seasonLabel:(d.seasonLabel||'').trim(), genres:d.genres, cast:d.cast, nationality: d.nationality || '', category: d.category || '', folderIds: d.folderIds.slice(), totalEpisodes:total,
        airDays: d.airDays.length ? d.airDays : [0], airTime:d.airTime, airTimeZone: d.airTimeZone || 'TH', airTimeOriginal: d.airTimeOriginal || d.airTime, firstAirDate:d.firstAirDate,
        channel:d.channel, platform:d.platform, posterIndex:d.posterIndex,
        posterImage: d.posterImage || null, posterCrops: d.posterCrops || defaultCrops(),
        episodeMinutes: mins, episodesPerAiring: perDrop, watched:0, related: d.related ? d.related.slice() : [] });
      if(prem) state.shows[state.shows.length-1].premiereEpisodes = prem;
    }
    touch();
    state.overlay = null; state.formDraft = null; state.editingShowId = null;
    render();
  }
  function submitMovieForm(){
    var d = state.formDraft;
    if(!d.title || !d.title.trim()) return;
    var year = parseInt(d.releaseYear,10) || null;
    var runtime = parseInt(d.runtimeMinutes,10) || null;
    var rating = Math.max(0, Math.min(5, parseInt(d.rating,10) || 0));
    if(d.id){
      var s = getShow(d.id);
      if(s){
        s.title = d.title.trim(); s.originalTitle = (d.originalTitle||'').trim(); s.seasonLabel = (d.seasonLabel||'').trim(); s.genres = d.genres; s.cast = d.cast; s.nationality = d.nationality || '';
        s.releaseYear = year; s.runtimeMinutes = runtime; s.watchedDate = d.watchedDate || isoDateOffset(0); s.rating = rating; s.platform = d.platform;
        s.posterIndex = d.posterIndex; s.posterImage = d.posterImage || null; s.posterCrops = d.posterCrops || defaultCrops();
      }
    } else {
      state.shows.push({ id:'s'+Date.now(), type:'movie', title:d.title.trim(), originalTitle:(d.originalTitle||'').trim(), seasonLabel:(d.seasonLabel||'').trim(), genres:d.genres, cast:d.cast, nationality: d.nationality || '', category:'movie',
        releaseYear: year, runtimeMinutes: runtime, watchedDate: d.watchedDate || isoDateOffset(0), rating: rating, platform: d.platform,
        posterIndex: d.posterIndex, posterImage: d.posterImage || null, posterCrops: d.posterCrops || defaultCrops(),
        related: d.related ? d.related.slice() : [] });
    }
    touch();
    state.overlay = null; state.formDraft = null; state.editingShowId = null;
    render();
  }
  function deleteShow(showId){
    if(state.confirmDeleteId !== showId){ state.confirmDeleteId = showId; render(); return; }
    state.shows = state.shows.filter(function(s){return s.id!==showId;});
    state.confirmDeleteId = null;
    if(state.detailShowId === showId) state.detailShowId = null;
    state.overlay = null;
    touch(); render(); restoreTabScroll();
  }

  function fieldVal(id){ var el = document.getElementById(id); return el ? el.value.trim() : ''; }

  function connectGithub(){
    var owner = fieldVal('gh_owner'), repo = fieldVal('gh_repo'), token = fieldVal('gh_token');
    if(!owner || !repo || !token){
      state.ghStatus = { type:'error', msg:'Please fill in all three fields.' };
      render(); return;
    }
    var candidate = { owner:owner, repo:repo, token:token };
    state.ghStatus = { type:'info', msg:'Connecting…' };
    render();
    ghGetFile(candidate).then(function(remote){
      if(!remote.exists){
        return ghPutFile(candidate, syncPayload()).then(function(put){
          state.ghSha = put.content.sha;
        });
      }
      if(remote.data === null) throw new Error('Remote data.json could not be read');
      var res = applyRemote(remote.data);
      if(res.changedLocal) persistLocal();
      state.ghSha = remote.sha;
      if(res.needsPush){
        return ghPutFile(candidate, syncPayload(), remote.sha).then(function(put){ state.ghSha = put.content.sha; });
      }
    }).then(function(){
      state.gh = candidate;
      saveGH(candidate);
      state.lastSyncedAt = Date.now();
      state.ghStatus = { type:'success', msg:'Connected.' };
      persistLocal();
      render();
    }).catch(function(err){
      state.ghStatus = { type:'error', msg:'Could not connect — check the username, repo name, and token permissions.' };
      render();
    });
  }

  document.addEventListener('click', function(e){
    var btn = e.target.closest('[data-action]');
    if(!btn) return;
    var action = btn.getAttribute('data-action');
    switch(action){
      case 'set-tab':
        (function(){
          state.activeTab = btn.getAttribute('data-tab');
          state.overlay = null;
          if(state.activeTab === 'browse'){ state.browseViewMode = 'all'; state.browseEditMode = false; }
          if(state.activeTab === 'stats') statsResetPeriod();
          render();
          window.scrollTo(0, 0);
          tabScrollMemory[state.activeTab] = 0;
        })(); break;
      case 'open-rate':
        openRateSheet(btn.getAttribute('data-show'), parseInt(btn.getAttribute('data-ep'),10), false); break;
      case 'rate-star':
        (function(){ if(!state.rateSheet) return; var v = parseInt(btn.getAttribute('data-value'),10); state.rateSheet.r = (state.rateSheet.r === v) ? 0 : v; redrawRateSheet(); })(); break;
      case 'rate-feel':
        (function(){ if(!state.rateSheet) return; var v = btn.getAttribute('data-value'); var a = state.rateSheet.e; var i = a.indexOf(v); if(i === -1) a.push(v); else a.splice(i,1); redrawRateSheet(); })(); break;
      case 'rate-save':
        (function(){
          var rs = state.rateSheet; var s = rs && getShow(rs.showId); if(!s) return;
          if(!s.epRatings) s.epRatings = {};
          if(rs.r || rs.e.length) s.epRatings[String(rs.ep)] = { r: rs.r, e: rs.e.slice() };
          else delete s.epRatings[String(rs.ep)];
          var msg = rs.isNew ? 'Episode ' + rs.ep + ' marked watched' + (rs.r || rs.e.length ? ' · ' + (rs.r ? '★'.repeat(rs.r) + ' ' : '') + rs.e.map(feelingShort).join(' ') : '') : 'Rating saved';
          state.rateSheet = null; if(state.managingList === 'feeling') state.managingList = null;
          touch(); render(); showToast(msg);
        })(); break;
      case 'rate-close':
        (function(){ var rs = state.rateSheet; closeRateSheet(); if(rs && rs.isNew) showToast('Episode ' + rs.ep + ' marked watched'); })(); break;
      case 'rate-unwatch':
        (function(){
          var rs = state.rateSheet; var s = rs && getShow(rs.showId);
          if(s && s.watched > 0 && rs.ep === s.watched){
            if(s.watchLog) delete s.watchLog[String(s.watched)];
            s.watched -= 1;
            if(s.watched < s.totalEpisodes) s.completedAt = null;
            state.rateSheet = null; touch(); render(); showToast('Episode ' + rs.ep + ' unmarked');
          }
        })(); break;
      case 'toggle-score-box':
        state.scoreBoxOpen = !state.scoreBoxOpen; render(); break;
      case 'set-series-rating':
        (function(){
          var s = getShow(btn.getAttribute('data-show')); if(!s) return;
          var v = parseInt(btn.getAttribute('data-value'),10);
          s.seriesRating = (s.seriesRating === v) ? 0 : v;
          touch(); render();
        })(); break;
      case 'stats-mode':
        state.statsMode = btn.getAttribute('data-value'); state.statsAnchor = Date.now(); render(); break;
      case 'stats-step':
        (function(){
          var d = parseInt(btn.getAttribute('data-value'),10), a = new Date(state.statsAnchor);
          if(state.statsMode === 'week') a.setDate(a.getDate() + 7*d);
          else if(state.statsMode === 'month') a = new Date(a.getFullYear(), a.getMonth() + d, 1);
          else if(state.statsMode === 'year') a = new Date(a.getFullYear() + d, 0, 1);
          state.statsAnchor = a.getTime(); render();
        })(); break;
      case 'stats-pick':
        stPickYear = new Date(state.statsAnchor).getFullYear(); stPickMonth = null; stOpenPicker(); break;
      case 'stats-pick-year':
        stPickYear = parseInt(btn.getAttribute('data-value'),10); stPickMonth = null; stOpenPicker(); break;
      case 'stats-pick-wmonth':
        stPickMonth = parseInt(btn.getAttribute('data-value'),10); stOpenPicker(); break;
      case 'stats-pick-month':
        state.statsAnchor = new Date(stPickYear, parseInt(btn.getAttribute('data-value'),10), 1).getTime(); stCloseSheet(); render(); break;
      case 'stats-pick-week':
        state.statsAnchor = parseInt(btn.getAttribute('data-value'),10); stCloseSheet(); render(); break;
      case 'stats-pick-y':
        state.statsAnchor = new Date(parseInt(btn.getAttribute('data-value'),10), 0, 1).getTime(); stCloseSheet(); render(); break;
      case 'stats-close-sheet':
        stCloseSheet(); break;
      case 'stats-heat':
        (function(){ var p = btn.getAttribute('data-value').split('-'); state.statsMode = 'month'; state.statsAnchor = new Date(+p[0], +p[1], 1).getTime(); render(); window.scrollTo(0,0); })(); break;
      case 'stats-genres':
        stGenreOpen = !stGenreOpen; render(); break;
      case 'stats-play':
        stOpenStory(); break;
      case 'story-next':
        stStoryNav(1); break;
      case 'story-prev':
        stStoryNav(-1); break;
      case 'story-close':
        stCloseStory(); break;
      case 'wrap-share':
        stShareOpen(); break;
      case 'share-close':
        stShareClose(); break;
      case 'share-show':
        stShareOpenShow(btn.getAttribute('data-show'), 0); break;
      case 'share-ep':
        stShareOpenShow(btn.getAttribute('data-show'), parseInt(btn.getAttribute('data-ep'), 10)); break;
      case 'share-rate':
        // shares what's on the sheet right now, even before Save
        if(state.rateSheet) stShareOpenShow(state.rateSheet.showId, state.rateSheet.ep, { r: state.rateSheet.r, e: state.rateSheet.e.slice() }); break;
      case 'share-opt':
        (function(){ var k = btn.getAttribute('data-value'); stShare.opt[k] = !stShare.opt[k]; btn.classList.toggle('on', stShare.opt[k]); btn.setAttribute('aria-pressed', String(stShare.opt[k])); stShareDraw(); })(); break;
      case 'share-style':
        stShare.style = btn.getAttribute('data-value');
        Array.prototype.forEach.call(document.querySelectorAll('#stShare .st-share-styles button'), function(b){ b.classList.toggle('on', b === btn); });
        stShareDraw(); break;
      case 'share-hours':
        stShare.hours = !stShare.hours; btn.classList.toggle('on', stShare.hours); btn.setAttribute('aria-pressed', String(stShare.hours));
        stShareDraw(); break;
      case 'share-save':
        stShareSave(); break;
      case 'share-go':
        stShareGo(); break;
      case 'check-episode':
        checkEpisode(btn.getAttribute('data-show')); break;
      case 'uncheck-episode':
        (function(){
          var s = getShow(btn.getAttribute('data-show'));
          if(s && s.watched > 0){
            if(s.watchLog) delete s.watchLog[String(s.watched)];
            s.watched -= 1;
            if(s.watched < s.totalEpisodes) s.completedAt = null;
            touch(); render();
          }
        })(); break;
      case 'open-detail':
        state.detailShowId = btn.getAttribute('data-show');
        state.confirmDeleteId = null;
        state.scoreBoxOpen = false;
        if(isWideLayout()){ saveTabScroll(); state.activeTab = 'browse'; render(); restoreTabScroll(); }
        else { openOverlay('detail'); render(); }
        break;
      case 'select-browse':
        state.detailShowId = btn.getAttribute('data-show');
        state.confirmDeleteId = null;
        render(); break;
      case 'close-detail':
        state.overlay = null; state.confirmDeleteId = null; render(); restoreTabScroll(); break;
      case 'open-add':
        if(state.browseViewMode === 'movies'){ openAddMovieForm(state.activeTab); } else { openAddForm(state.activeTab); }
        render(); break;
      case 'goto-add':
        state.activeTab = 'browse';
        openAddForm('browse'); render(); break;
      case 'edit-show':
        openEditForm(btn.getAttribute('data-show'), state.overlay==='detail' ? 'detail' : 'browse'); render(); break;
      case 'delete-show':
        deleteShow(btn.getAttribute('data-show')); break;
      case 'delete-show-form':
        if(state.formDraft && state.formDraft.id) deleteShow(state.formDraft.id);
        break;
      case 'cancel-form':
        closeForm(); break;
      case 'remove-chip':
        (function(){
          var field = btn.getAttribute('data-field');
          var idx = parseInt(btn.getAttribute('data-index'),10);
          state.formDraft[field].splice(idx,1);
          render();
        })(); break;
      case 'toggle-day':
        (function(){
          var day = parseInt(btn.getAttribute('data-day'),10);
          var arr = state.formDraft.airDays;
          var pos = arr.indexOf(day);
          if(pos === -1) arr.push(day); else arr.splice(pos,1);
          render();
        })(); break;
      case 'set-poster':
        state.formDraft.posterIndex = parseInt(btn.getAttribute('data-index'),10);
        render(); break;
      case 'set-movie-rating':
        state.formDraft.rating = parseInt(btn.getAttribute('data-value'),10);
        render(); break;
      case 'toggle-genre':
        (function(){
          var val = btn.getAttribute('data-value');
          var arr = state.formDraft.genres;
          var pos = arr.indexOf(val);
          if(pos === -1) arr.push(val); else arr.splice(pos,1);
          render();
        })(); break;
      case 'remove-genre':
        (function(){
          var val = btn.getAttribute('data-value');
          var arr = state.formDraft.genres;
          var pos = arr.indexOf(val);
          if(pos !== -1) arr.splice(pos,1);
          render();
        })(); break;
      case 'toggle-genre-picker':
        state.genrePickerExpanded = !state.genrePickerExpanded;
        render(); break;
      case 'set-category':
        (function(){
          var newCat = btn.getAttribute('data-value');
          if((state.formDraft.category||'drama') !== newCat){
            state.formDraft.category = newCat;
            state.formDraft.genres = []; // drama and variety use different genre vocabularies
          }
          render();
        })(); break;
      case 'open-add-related':
        state.addingRelatedFor = btn.getAttribute('data-show');
        render(); break;
      case 'close-add-related':
        state.addingRelatedFor = null;
        render(); break;
      case 'confirm-add-related':
        (function(){
          var itemId = btn.getAttribute('data-show');
          var item = getShow(itemId);
          var targetSel = document.getElementById('relPickTitle');
          if(!item || !targetSel || !targetSel.value) return;
          var target = getShow(targetSel.value);
          if(!target) return;
          if(!item.related) item.related = [];
          if(!target.related) target.related = [];
          // remove any existing link between these two first, so re-linking replaces
          // rather than duplicates (in either direction)
          item.related = item.related.filter(function(r){ return r.id !== target.id; });
          target.related = target.related.filter(function(r){ return r.id !== item.id; });
          item.related.push({ id: target.id });
          target.related.push({ id: item.id });
          state.addingRelatedFor = null;
          touch(); render();
        })(); break;
      case 'remove-related':
        (function(){
          var itemId = btn.getAttribute('data-show'), targetId = btn.getAttribute('data-target');
          var item = getShow(itemId);
          var target = getShow(targetId);
          if(item && item.related) item.related = item.related.filter(function(r){ return r.id !== targetId; });
          if(target && target.related) target.related = target.related.filter(function(r){ return r.id !== itemId; });
          touch(); render();
        })(); break;
      case 'toggle-manage-categories':
        state.managingCategories = !state.managingCategories; render(); break;
      case 'add-category':
        (function(){
          var inp = document.getElementById('newCategoryInput');
          var name = inp ? inp.value.trim() : '';
          if(!name) return;
          state.categories.push({ id: uid('cat'), name: name, genres: [] });
          pendingFocusId = 'newCategoryInput';
          touch(); render();
        })(); break;
      case 'delete-category':
        (function(){
          var cid = btn.getAttribute('data-cat');
          if(state.categories.length <= 1) return;
          state.categories = state.categories.filter(function(c){ return c.id !== cid; });
          state.shows.forEach(function(s){ if(s.category === cid){ s.category=''; s.genres=[]; } });
          if(state.formDraft && state.formDraft.category === cid){ state.formDraft.category=''; state.formDraft.genres=[]; }
          touch(); render();
        })(); break;
      case 'remove-genre-from-cat':
        (function(){
          var cid = btn.getAttribute('data-cat'), g = btn.getAttribute('data-genre');
          var c = getCategory(cid); if(!c) return;
          c.genres = c.genres.filter(function(x){ return x !== g; });
          touch(); render();
        })(); break;
      case 'toggle-show-folder':
        (function(){
          var fid = btn.getAttribute('data-folder');
          var arr = state.formDraft.folderIds;
          var i = arr.indexOf(fid);
          if(i === -1) arr.push(fid); else arr.splice(i,1);
          render();
        })(); break;
      case 'set-homecat-filter':
        state.homeCategoryFilter = btn.getAttribute('data-value') || null;
        render(); break;
      case 'set-browse-view':
        state.browseViewMode = btn.getAttribute('data-value');
        state.browseEditMode = false;
        render(); break;
      case 'toggle-browse-edit':
        state.browseEditMode = !state.browseEditMode; state.renamingFolderId = null; render(); break;
      case 'add-folder':
        (function(){
          var inp = document.getElementById('newFolderInput');
          var name = inp ? inp.value.trim() : '';
          if(!name) return;
          state.folders.push({ id: uid('f'), name: name });
          pendingFocusId = 'newFolderInput';
          touch(); render();
        })(); break;
      case 'add-folder-from-form':
        (function(){
          var inp = document.getElementById('newFolderFromForm');
          var name = inp ? inp.value.trim() : '';
          if(!name) return;
          var f = { id: uid('f'), name: name };
          state.folders.push(f);
          state.formDraft.folderIds.push(f.id);
          pendingFocusId = 'newFolderFromForm';
          touch(); render();
        })(); break;
      case 'rename-folder':
        state.renamingFolderId = btn.getAttribute('data-folder');
        pendingFocusId = 'renameFolderInput_' + state.renamingFolderId;
        render(); break;
      case 'confirm-rename-folder':
        (function(){
          var fid = btn.getAttribute('data-folder');
          var inp = document.getElementById('renameFolderInput_' + fid);
          var f = getFolder(fid);
          if(f && inp && inp.value.trim()) f.name = inp.value.trim();
          state.renamingFolderId = null;
          touch(); render();
        })(); break;
      case 'delete-folder':
        (function(){
          var fid = btn.getAttribute('data-folder');
          state.folders = state.folders.filter(function(f){ return f.id !== fid; });
          state.shows.forEach(function(s){ if(s.folderIds) s.folderIds = s.folderIds.filter(function(x){ return x !== fid; }); });
          touch(); render();
        })(); break;
      case 'move-folder':
        (function(){
          var fid = btn.getAttribute('data-folder'), dir = parseInt(btn.getAttribute('data-dir'),10);
          var idx = -1;
          state.folders.forEach(function(f,i){ if(f.id===fid) idx=i; });
          var swap = idx + dir;
          if(idx === -1 || swap < 0 || swap >= state.folders.length) return;
          var tmp = state.folders[idx]; state.folders[idx] = state.folders[swap]; state.folders[swap] = tmp;
          touch(); render();
        })(); break;
      case 'remove-from-folder':
        (function(){
          var fid = btn.getAttribute('data-folder'), sid = btn.getAttribute('data-show');
          var s = getShow(sid); if(!s || !s.folderIds) return;
          s.folderIds = s.folderIds.filter(function(x){ return x !== fid; });
          touch(); render();
        })(); break;
      case 'open-addshows':
        state.addingShowsFolderId = btn.getAttribute('data-folder');
        openOverlay('addshows'); render(); break;
      case 'close-addshows':
        state.overlay = null; state.addingShowsFolderId = null; render(); restoreTabScroll(); break;
      case 'toggle-in-folder-panel':
        (function(){
          var sid = btn.getAttribute('data-show');
          var s = getShow(sid); if(!s) return;
          if(!s.folderIds) s.folderIds = [];
          var fid = state.addingShowsFolderId;
          var i = s.folderIds.indexOf(fid);
          if(i === -1){ s.folderIds.push(fid); } else {
            s.folderIds.splice(i,1);
          }
          touch(); render();
        })(); break;
      case 'toggle-manage-list':
        state.managingList = (state.managingList === btn.getAttribute('data-list')) ? null : btn.getAttribute('data-list');
        render(); break;
      case 'remove-list-item':
        (function(){
          var listKey = btn.getAttribute('data-list');
          var val = btn.getAttribute('data-value');
          var arr = listByKey(listKey);
          var pos = arr.indexOf(val);
          if(pos !== -1){ arr.splice(pos,1); touch(); }
          render();
        })(); break;
      case 'trigger-poster-upload':
        (function(){
          var input = document.getElementById('posterFileInput');
          if(input) input.click();
        })(); break;
      case 'trigger-cast-photo':
        (function(){
          castPhotoTargetIndex = parseInt(btn.getAttribute('data-index'),10);
          var input = document.getElementById('castFileInput');
          if(input) input.click();
        })(); break;
      case 'remove-cast':
        (function(){
          var idx = parseInt(btn.getAttribute('data-index'),10);
          state.formDraft.cast.splice(idx,1);
          if(state.castCropTargetIndex === idx) state.castCropTargetIndex = null;
          render();
        })(); break;
      case 'toggle-cast-crop':
        (function(){
          var idx = parseInt(btn.getAttribute('data-index'),10);
          state.castCropTargetIndex = (state.castCropTargetIndex === idx) ? null : idx;
          render();
        })(); break;
      case 'remove-poster-image':
        state.formDraft.posterImage = null;
        render(); break;
      case 'set-theme':
        state.theme = btn.getAttribute('data-theme');
        persistLocal(); render(); break;
      case 'connect-github':
        connectGithub(); break;
      case 'disconnect-github':
        state.gh = null; state.ghSha = null; state.ghStatus = null; state.lastSyncedAt = null;
        saveGH(null); render(); break;
      case 'sync-now':
        (function(){
          if(!state.gh) return;
          state.ghStatus = { type:'info', msg:'Syncing…' };
          render();
          syncNow().then(function(result){
            if(!result.ok && result.reason === 'skip'){
              state.ghStatus = { type:'info', msg:'A sync is already running — it will finish shortly.' };
            } else if(result.ok){
              var msg = result.action === 'pulled' ? 'Updated from your other device.' :
                        result.action === 'pushed' ? 'Synced.' :
                        result.action === 'created' ? 'Connected and synced.' : 'Already up to date.';
              state.ghStatus = { type:'success', msg: msg };
            } else {
              state.ghStatus = { type:'error', msg:'Sync failed — check your connection and try again.' };
            }
            render();
          });
        })(); break;
      default: break;
    }
  });

  function resolveCropRef(el){
    if(!el || !state.formDraft) return null;
    var target = el.getAttribute('data-crop-target') || 'poster';
    if(target === 'cast'){
      var idx = parseInt(el.getAttribute('data-cast-index'),10);
      var c = state.formDraft.cast[idx];
      if(!c) return null;
      if(!c.crop) c.crop = {x:50,y:50,zoom:100};
      return c.crop;
    }
    var slot = el.getAttribute('data-slot');
    if(!slot) return null;
    if(!state.formDraft.posterCrops) state.formDraft.posterCrops = defaultCrops();
    if(!state.formDraft.posterCrops[slot]) state.formDraft.posterCrops[slot] = {x:50,y:50,zoom:100};
    return state.formDraft.posterCrops[slot];
  }
  document.addEventListener('input', function(e){
    var t = e.target;
    if(t.matches('[data-action-input="rename-category"]')){
      var cat = getCategory(t.getAttribute('data-cat'));
      if(cat){ cat.name = t.value; persistLocal(); }
      return;
    }
    if((t.matches('[data-tz-input]') || t.matches('[data-origtime-input]')) && state.formDraft){
      var tzSel = document.getElementById('f_origtz');
      var timeInput = document.getElementById('f_origtime');
      var tz = tzSel ? tzSel.value : 'TH';
      var origTime = timeInput ? timeInput.value : '20:00';
      state.formDraft.airTimeZone = tz;
      state.formDraft.airTimeOriginal = origTime;
      var thai = convertToThaiTime(origTime, tz);
      state.formDraft.airTime = thai;
      var thaiEl = document.getElementById('f_thaitime');
      if(thaiEl) thaiEl.value = thai;
      return;
    }
    if(t.matches('[data-crop-zoom]') && state.formDraft){
      var c = resolveCropRef(t);
      if(!c) return;
      c.zoom = parseInt(t.value,10) || 100;
      var box = t.closest('.crop-field');
      var img = box && box.querySelector('.poster-img');
      if(img){
        img.style.objectPosition = c.x + '% ' + c.y + '%';
        img.style.transform = 'scale(' + (c.zoom/100) + ')';
      }
      return;
    }
    if(t.matches('[data-field]') && state.formDraft && !t.matches('[data-tag-input]')){
      state.formDraft[t.getAttribute('data-field')] = t.value;
      if(/^(totalEpisodes|firstAirDate|episodesPerAiring|premiereEpisodes)$/.test(t.getAttribute('data-field'))){
        var planEl = document.getElementById('f_plan'); if(planEl) planEl.innerHTML = releasePlanHtml(state.formDraft);
        var premEl = document.getElementById('f_premiere'); if(premEl) premEl.placeholder = String(Math.max(1, parseInt(state.formDraft.episodesPerAiring,10) || 1));
      }
    }
  });
  document.addEventListener('change', function(e){
    if((e.target.matches && (e.target.matches('[data-tz-input]') || e.target.matches('[data-origtime-input]'))) && state.formDraft){
      var tzSel = document.getElementById('f_origtz');
      var timeInput = document.getElementById('f_origtime');
      var tz = tzSel ? tzSel.value : 'TH';
      var origTime = timeInput ? timeInput.value : '20:00';
      state.formDraft.airTimeZone = tz;
      state.formDraft.airTimeOriginal = origTime;
      var thai = convertToThaiTime(origTime, tz);
      state.formDraft.airTime = thai;
      var thaiEl = document.getElementById('f_thaitime');
      if(thaiEl) thaiEl.value = thai;
      return;
    }
    if(e.target && e.target.id === 'posterFileInput' && state.formDraft){
      var file = e.target.files && e.target.files[0];
      if(!file) return;
      readAndDownscaleImage(file, 1200, 0.82, function(dataUri){
        if(dataUri && state.formDraft){
          state.formDraft.posterImage = dataUri;
          if(!state.formDraft.posterCrops) state.formDraft.posterCrops = defaultCrops();
          render();
        }
      });
    }
    if(e.target && e.target.id === 'castFileInput' && state.formDraft){
      var castFile = e.target.files && e.target.files[0];
      var idx = castPhotoTargetIndex;
      if(!castFile || idx === null || !state.formDraft.cast[idx]) return;
      readAndDownscaleImage(castFile, 480, 0.8, function(dataUri){
        if(dataUri && state.formDraft && state.formDraft.cast[idx]){
          state.formDraft.cast[idx].photo = dataUri;
          state.castCropTargetIndex = idx;
          render();
        }
      });
    }
  });
  document.addEventListener('pointerdown', function(e){
    var box = e.target.closest('[data-crop-box]');
    if(!box || !state.formDraft) return;
    var crop = resolveCropRef(box);
    if(!crop) return;
    var rect = box.getBoundingClientRect();
    var imgEl = box.querySelector('.poster-img');
    var nw = (imgEl && imgEl.naturalWidth) || rect.width || 1;
    var nh = (imgEl && imgEl.naturalHeight) || rect.height || 1;
    var coverScale = Math.max((rect.width||1) / nw, (rect.height||1) / nh);
    var zoomFactor = (crop.zoom || 100) / 100;
    // Overflow is computed at the CURRENT zoom (not just the bare "cover" fit), since
    // transform:scale + a matching transform-origin lets zooming in unlock real pan
    // room even on the axis where object-fit:cover alone has none (e.g. a portrait
    // photo in a square avatar box has zero natural horizontal slack at zoom 100).
    var overflowX = Math.max(0, nw * coverScale * zoomFactor - (rect.width||0));
    var overflowY = Math.max(0, nh * coverScale * zoomFactor - (rect.height||0));
    dragState = {
      box:box, startClientX:e.clientX, startClientY:e.clientY,
      startX:crop.x, startY:crop.y,
      overflowX: overflowX, overflowY: overflowY, pointerId:e.pointerId
    };
    try{ box.setPointerCapture(e.pointerId); }catch(err){}
    e.preventDefault();
  });
  document.addEventListener('pointermove', function(e){
    if(!dragState || !state.formDraft) return;
    var crop = resolveCropRef(dragState.box);
    if(!crop) return;
    var dx = e.clientX - dragState.startClientX;
    var dy = e.clientY - dragState.startClientY;
    if(dragState.overflowX > 0){
      crop.x = clamp(dragState.startX - (100 * dx / dragState.overflowX), 0, 100);
    }
    if(dragState.overflowY > 0){
      crop.y = clamp(dragState.startY - (100 * dy / dragState.overflowY), 0, 100);
    }
    var img = dragState.box.querySelector('.poster-img');
    if(img){
      img.style.objectPosition = crop.x + '% ' + crop.y + '%';
      img.style.transformOrigin = crop.x + '% ' + crop.y + '%';
      img.style.transform = 'scale(' + ((crop.zoom||100)/100) + ')';
    }
  });
  function endDrag(){ dragState = null; }
  document.addEventListener('pointerup', endDrag);
  document.addEventListener('pointercancel', endDrag);
  document.addEventListener('keydown', function(e){
    if(e.key === 'Enter' && e.target.matches('[data-tag-input]')){
      e.preventDefault();
      var field = e.target.getAttribute('data-field');
      var val = e.target.value.trim();
      if(val && state.formDraft){
        state.formDraft[field].push(val);
        pendingFocusId = e.target.id;
        render();
        var el = document.getElementById(e.target.id);
        if(el) el.value = '';
      }
    }
    if(e.key === 'Enter' && e.target.matches('[data-cast-name-input]')){
      e.preventDefault();
      var castName = e.target.value.trim();
      if(castName && state.formDraft){
        state.formDraft.cast.push({ name: castName, photo: null, crop: {x:50,y:50,zoom:100} });
        pendingFocusId = e.target.id;
        render();
        var castEl = document.getElementById(e.target.id);
        if(castEl) castEl.value = '';
      }
    }
    if(e.key === 'Enter' && e.target.matches('[data-list-add-input]')){
      e.preventDefault();
      var listKey = e.target.getAttribute('data-list-add-input');
      var newVal = e.target.value.trim();
      if(newVal){
        var arr = listByKey(listKey);
        if(arr.indexOf(newVal) === -1){ arr.push(newVal); touch(); }
        pendingFocusId = e.target.id;
        render();
      }
    }
    if(e.key === 'Enter' && e.target.matches('[data-action-input="add-genre-to-cat"]')){
      e.preventDefault();
      var cid = e.target.getAttribute('data-cat');
      var gval = e.target.value.trim();
      if(gval){
        var cat = getCategory(cid);
        if(cat && cat.genres.indexOf(gval) === -1) cat.genres.push(gval);
        pendingFocusId = e.target.id;
        touch(); render();
      }
    }
    if(e.key === 'Enter' && e.target.id === 'newCategoryInput'){
      e.preventDefault();
      var cname = e.target.value.trim();
      if(cname){
        state.categories.push({ id: uid('cat'), name: cname, genres: [] });
        pendingFocusId = 'newCategoryInput';
        touch(); render();
      }
    }
    if(e.key === 'Enter' && e.target.id === 'newFolderInput'){
      e.preventDefault();
      var fname = e.target.value.trim();
      if(fname){
        state.folders.push({ id: uid('f'), name: fname });
        pendingFocusId = 'newFolderInput';
        touch(); render();
      }
    }
    if(e.key === 'Enter' && e.target.id === 'newFolderFromForm'){
      e.preventDefault();
      var fname2 = e.target.value.trim();
      if(fname2 && state.formDraft){
        var newF = { id: uid('f'), name: fname2 };
        state.folders.push(newF);
        state.formDraft.folderIds.push(newF.id);
        pendingFocusId = 'newFolderFromForm';
        touch(); render();
      }
    }
    if(e.key === 'Enter' && e.target.matches('[data-action-input="rename-folder"]')){
      e.preventDefault();
      var rfid = e.target.getAttribute('data-folder');
      var rf = getFolder(rfid);
      if(rf && e.target.value.trim()) rf.name = e.target.value.trim();
      state.renamingFolderId = null;
      touch(); render();
    }
  });
  document.addEventListener('submit', function(e){
    if(e.target && e.target.id === 'showForm'){
      e.preventDefault();
      submitForm();
    }
  });
  // Only re-render on a genuine width change (the one thing that actually affects layout here,
  // via isWideLayout()'s breakpoint). iOS fires plain resize events for height-only changes too
  // — e.g. the address bar/toolbar collapsing as the page scrolls, which happens constantly now
  // that the page scrolls normally — and re-rendering for those was tearing down and rebuilding
  // every card (posters included) for no layout-relevant reason, which is what looked like a
  // flicker on Home.
  var lastKnownWidth = window.innerWidth;
  window.addEventListener('resize', function(){
    if(window.innerWidth === lastKnownWidth) return;
    lastKnownWidth = window.innerWidth;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(render, 150);
  });
  document.addEventListener('visibilitychange', function(){
    if(document.visibilityState === 'visible'){
      syncAndMaybeRender();
    }
  });

  /* ---------------- disable pinch-zoom so it behaves like a native app ---------------- */
  document.addEventListener('gesturestart', function(e){ e.preventDefault(); });
  document.addEventListener('gesturechange', function(e){ e.preventDefault(); });

  /* ---------------- init ---------------- */
  try{
    var earlyTheme = localStorage.getItem(THEME_KEY);
    if(earlyTheme && earlyTheme !== 'system') document.documentElement.setAttribute('data-theme', earlyTheme);
  }catch(e){}
  loadState(function(migrateFromLegacy){
    booted = true;
    resetSnapshot();
    if(migrateFromLegacy) persistLocal();
    render();
    syncAndMaybeRender();
    setInterval(syncAndMaybeRender, 5*60*1000);
  });

  if('serviceWorker' in navigator){
    window.addEventListener('load', function(){
      navigator.serviceWorker.register('sw.js', { updateViaCache:'none' }).then(function(reg){
        // pick up a newly-deployed version as soon as it's ready, without waiting for a manual reopen
        if(reg.update) reg.update();
      }).catch(function(){});
    });
    var reloadedOnce = false;
    navigator.serviceWorker.addEventListener('controllerchange', function(){
      if(reloadedOnce) return;
      reloadedOnce = true;
      window.location.reload();
    });
  }
})();
