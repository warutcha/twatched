
(function(){
  "use strict";

  /* ---------------- icons ---------------- */
  var ICON_PATHS = {
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
  var APP_VERSION = 'v2.5.2';

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
    var occurrenceIndex = Math.ceil(episodeNumber / perDrop);
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
    gh: null,                // { owner, repo, token } | null
    ghSha: null,
    ghStatus: null,          // { type: 'info'|'success'|'error', msg }
    lastSyncedAt: null,
    syncing: false,
    categories: null,
    folders: [],
    nationalityOptions: NATIONALITY_OPTIONS_DEFAULT.slice(),
    relationshipTypes: RELATIONSHIP_TYPES_DEFAULT.slice(),
    managingRelTypes: false,
    addingRelatedFor: null, // show id whose "add related" panel is open
    managingList: null,      // null | 'nationality'
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
    var autoSorted = autoSortShows(items, Date.now());
    var order = (folder && folder.order) || [];
    if(!order.length) return autoSorted;
    var byId = {};
    items.forEach(function(s){ byId[s.id] = s; });
    var sorted = [];
    order.forEach(function(id){ if(byId[id]){ sorted.push(byId[id]); delete byId[id]; } });
    // any show not yet part of a saved manual order (newly added since the last manual
    // reorder) is inserted via the same auto-sort rules rather than raw insertion order
    var stragglers = autoSorted.filter(function(s){ return byId[s.id]; });
    return sorted.concat(stragglers);
  }

  function migrateShow(s){
    if(!s.folderIds) s.folderIds = [];
    if(!s.type) s.type = 'show';
    if(!s.related) s.related = [];
  }
  function loadState(){
    try{
      var raw = localStorage.getItem(STORAGE_KEY);
      if(raw){
        var loaded = JSON.parse(raw);
        state.shows = loaded.shows || [];
        state.shows.forEach(migrateShow);
        state.theme = loaded.theme || 'system';
        state.updatedAt = loaded.updatedAt || 0;
        state.categories = ensureMovieCategory(buildCategories(loaded));
        state.folders = (loaded.folders && loaded.folders.length) ? loaded.folders : [];
        state.nationalityOptions = (loaded.nationalityOptions && loaded.nationalityOptions.length) ? loaded.nationalityOptions : NATIONALITY_OPTIONS_DEFAULT.slice();
        state.relationshipTypes = (loaded.relationshipTypes && loaded.relationshipTypes.length) ? loaded.relationshipTypes : RELATIONSHIP_TYPES_DEFAULT.slice();
      }
    }catch(e){ /* start empty */ }
    if(!state.categories) state.categories = ensureMovieCategory(buildCategories(null));
    try{
      var rawGh = localStorage.getItem(GH_KEY);
      if(rawGh) state.gh = JSON.parse(rawGh);
    }catch(e){ state.gh = null; }
  }
  function persistLocal(){
    try{
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        shows: state.shows, theme: state.theme,
        updatedAt: state.updatedAt,
        categories: state.categories, folders: state.folders, nationalityOptions: state.nationalityOptions,
        relationshipTypes: state.relationshipTypes
      }));
    }catch(e){ /* storage unavailable — app still works in-memory this session */ }
  }
  function saveGH(cfg){
    try{ localStorage.setItem(GH_KEY, cfg ? JSON.stringify(cfg) : ''); }catch(e){}
  }
  // Only re-render after a background sync if it actually pulled newer remote data — syncing
  // that confirms "already up to date" or just pushes the local copy changes nothing visible,
  // so rendering anyway was pure flicker (most noticeable right at app launch, when this sync
  // fires immediately after the first render).
  function syncAndMaybeRender(){
    if(!state.gh) return;
    syncNow().then(function(result){
      if(result && result.action === 'pulled') render();
    });
  }
  function touch(){ state.updatedAt = Date.now(); persistLocal(); syncAndMaybeRender(); }
  function currentGenreList(){
    var cat = getCategory(state.formDraft && state.formDraft.category);
    return cat ? cat.genres : [];
  }

  function getShow(id){ return state.shows.filter(function(s){return s.id===id;})[0] || null; }

  /* ---------------- GitHub sync ---------------- */
  function b64EncodeUnicode(str){ return btoa(unescape(encodeURIComponent(str))); }
  function b64DecodeUnicode(str){ return decodeURIComponent(escape(atob(str.replace(/\n/g,'')))); }

  function ghGetFile(cfg){
    var url = 'https://api.github.com/repos/' + cfg.owner + '/' + cfg.repo + '/contents/data.json';
    return fetch(url, { headers: { 'Authorization':'Bearer ' + cfg.token, 'Accept':'application/vnd.github+json' } })
      .then(function(res){
        if(res.status === 404) return { exists:false };
        if(!res.ok) return res.text().then(function(t){ throw new Error('GitHub GET ' + res.status + ': ' + t); });
        return res.json().then(function(json){
          var data = null;
          try{ data = JSON.parse(b64DecodeUnicode(json.content)); }catch(e){ data = null; }
          return { exists:true, sha: json.sha, data: data };
        });
      });
  }
  function ghPutFile(cfg, dataObj, sha){
    var url = 'https://api.github.com/repos/' + cfg.owner + '/' + cfg.repo + '/contents/data.json';
    var body = {
      message: 'TWatched sync ' + new Date().toISOString(),
      content: b64EncodeUnicode(JSON.stringify(dataObj, null, 2))
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
    return { shows: state.shows, updatedAt: state.updatedAt, categories: state.categories, folders: state.folders, nationalityOptions: state.nationalityOptions, relationshipTypes: state.relationshipTypes };
  }

  function syncNow(){
    if(!state.gh || state.syncing) return Promise.resolve({ ok:false, reason:'skip' });
    state.syncing = true;
    return ghGetFile(state.gh).then(function(remote){
      if(!remote.exists){
        return ghPutFile(state.gh, syncPayload()).then(function(put){
          state.ghSha = put.content.sha;
          return { ok:true, action:'created' };
        });
      }
      var remoteData = remote.data || {};
      var remoteShows = remoteData.shows || [];
      var remoteUpdatedAt = remoteData.updatedAt || 0;
      var neverSyncedLocally = !state.updatedAt; // fresh device with no editing history yet — not just an empty list
      var remoteHasData = remoteShows.length > 0;

      if(remoteUpdatedAt > state.updatedAt || (neverSyncedLocally && remoteHasData)){
        state.shows = remoteShows;
        state.shows.forEach(migrateShow);
        state.updatedAt = remoteUpdatedAt;
        if(remoteData.categories || remoteData.genreOptionsByCategory || remoteData.genreOptions) state.categories = ensureMovieCategory(buildCategories(remoteData));
        if(remoteData.folders) state.folders = remoteData.folders;
        if(remoteData.nationalityOptions && remoteData.nationalityOptions.length) state.nationalityOptions = remoteData.nationalityOptions;
        if(remoteData.relationshipTypes && remoteData.relationshipTypes.length) state.relationshipTypes = remoteData.relationshipTypes;
        state.ghSha = remote.sha;
        persistLocal();
        return { ok:true, action:'pulled' };
      }
      if(remoteUpdatedAt === state.updatedAt){
        state.ghSha = remote.sha;
        return { ok:true, action:'up-to-date' };
      }
      return ghPutFile(state.gh, syncPayload(), remote.sha).then(function(put){
        state.ghSha = put.content.sha;
        return { ok:true, action:'pushed' };
      });
    }).then(function(result){
      state.syncing = false;
      state.lastSyncedAt = Date.now();
      return result;
    }).catch(function(err){
      state.syncing = false;
      return { ok:false, reason:'error', error:String(err) };
    });
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
    var tabs = [['home','Home'],['browse','Browse'],['settings','Settings']];
    return '<nav class="tab-nav">' + tabs.map(function(t){
      var key = t[0], label = t[1];
      var iconKey = key==='home'?'home':(key==='browse'?'grid':'settings');
      return '<button type="button" class="tab-nav-btn' + (state.activeTab===key?' active':'') + '" data-action="set-tab" data-tab="' + key + '">' +
        icon(iconKey) + '<span>' + label + '</span></button>';
    }).join('') + '</nav>';
  }
  function render(){
    // Set on <html> (not #app) so the theme's --bg/--surface custom properties cascade to
    // <body> too — see the CSS comment on body's background for why that now matters.
    document.documentElement.setAttribute('data-theme', state.theme==='system' ? '' : state.theme);

    var html = '';
    html += '<div class="app-screen" style="display:' + (state.activeTab==='home' ? 'block':'none') + '">' + renderHome() + tabNavHtml() + '</div>';
    html += '<div class="app-screen" style="display:' + (state.activeTab==='browse' ? 'block':'none') + '">' + renderBrowse() + tabNavHtml() + '</div>';
    html += '<div class="app-screen" style="display:' + (state.activeTab==='settings' ? 'block':'none') + '">' + renderSettings() + tabNavHtml() + '</div>';

    if(state.overlay === 'detail'){
      html += '<div class="app-screen app-screen--overlay detail-ov' + (state.justOpenedOverlay?' is-animating-in':'') + '">' + renderDetailScreen() + '</div>';
    }
    if(state.overlay === 'form'){
      html += '<div class="app-screen app-screen--overlay form-ov' + (state.justOpenedOverlay?' is-animating-in':'') + '">' + renderFormScreen() + '</div>';
    }
    if(state.overlay === 'addshows'){
      html += '<div class="app-screen app-screen--overlay form-ov' + (state.justOpenedOverlay?' is-animating-in':'') + '">' + renderAddShowsPanel() + '</div>';
    }

    var prevOverlay = appBody.querySelector('.app-screen--overlay');
    var prevOverlayScroll = prevOverlay ? prevOverlay.scrollTop : 0;

    appBody.innerHTML = html;

    // Overlays are position:fixed with their own scroll now, so replacing innerHTML always
    // creates a brand-new element whose scrollTop starts at 0 — unlike the page's own scroll
    // (window.scrollY), which naturally survives a content swap. Without this, any in-place
    // re-render while an overlay is open (toggling a panel, adding a cast member, editing a
    // field) would silently yank the view back to the top of the form every time.
    var newOverlay = appBody.querySelector('.app-screen--overlay');
    if(newOverlay){
      newOverlay.scrollTop = state.justOpenedOverlay ? 0 : prevOverlayScroll;
    }
    if(state.justOpenedOverlay){
      state.justOpenedOverlay = false;
      requestAnimationFrame(function(){
        requestAnimationFrame(function(){
          if(newOverlay) newOverlay.classList.remove('is-animating-in');
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
    var reorderRow = opts.reorderFolderId ? (
      '<div class="tile-reorder">' +
        '<button class="icon-btn-sm" data-action="move-show-in-folder" data-folder="' + opts.reorderFolderId + '" data-show="' + show.id + '" data-dir="-1"' + (opts.isFirst?' disabled style="opacity:.35;"':'') + ' aria-label="Move earlier">' + icon('left') + '</button>' +
        '<button class="icon-btn-sm" data-action="move-show-in-folder" data-folder="' + opts.reorderFolderId + '" data-show="' + show.id + '" data-dir="1"' + (opts.isLast?' disabled style="opacity:.35;"':'') + ' aria-label="Move later">' + icon('right') + '</button>' +
      '</div>'
    ) : '';
    if(show.type === 'movie'){
      return '<div class="tile" data-action="open-detail" data-show="' + show.id + '">' +
        '<div class="tile-poster" style="' + (show.posterImage ? '' : posterStyle(show)) + '">' +
          posterImgTag(show,'grid') +
          movieBadgeIcon() +
          rmBtn +
        '</div>' +
        '<p class="tile-cap">' + show.title + '</p>' +
        '<p class="tile-sub">' + (show.releaseYear||'—') + ' · watched ' + (show.watchedDate ? new Date(show.watchedDate).getFullYear() : '—') + '</p>' +
        reorderRow +
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
      reorderRow +
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
          out2 += '<div class="shelf-row">' + items.map(function(s, si){
            return tileMarkup(s, state.browseEditMode ? { removeFolderId:f.id, reorderFolderId:f.id, isFirst: si===0, isLast: si===items.length-1 } : null);
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
        '<p>' + target.title + '</p><span>' + r.label + '</span>' +
      '</div>';
    }).join('');
    var adding = state.addingRelatedFor === item.id;
    chips += '<button type="button" class="add-related" data-action="' + (adding ? 'close-add-related' : 'open-add-related') + '" data-show="' + item.id + '" aria-label="Add related title">' + icon(adding ? 'close' : 'plus') + '</button>';
    var panel = '';
    if(adding){
      var others = state.shows.filter(function(s){ return s.id !== item.id; });
      var relTypeChips = state.managingRelTypes ? (
        '<div class="manage-panel">' +
          '<div class="chip-row">' + state.relationshipTypes.map(function(t){
            return '<span class="chip-x">' + t + '<button type="button" data-action="remove-reltype" data-value="' + t.replace(/"/g,'&quot;') + '">' + icon('close') + '</button></span>';
          }).join('') + '</div>' +
          '<input type="text" id="newRelTypeInput" class="category-add-input" placeholder="Add a new type, press Enter">' +
        '</div>'
      ) : '';
      panel = '<div class="add-related-panel">' +
        '<label class="field-label">Title</label>' +
        '<select id="relPickTitle">' + others.map(function(s){ return '<option value="' + s.id + '">' + s.title + '</option>'; }).join('') + '</select>' +
        '<label class="field-label">Relationship (how this relates to them)</label>' +
        '<select id="relPickType">' + state.relationshipTypes.map(function(t){ return '<option value="' + t.replace(/"/g,'&quot;') + '">' + t + '</option>'; }).join('') + '</select>' +
        '<label class="field-label">Reverse (how they relate to this)</label>' +
        '<select id="relPickTypeReverse">' + state.relationshipTypes.map(function(t){ return '<option value="' + t.replace(/"/g,'&quot;') + '">' + t + '</option>'; }).join('') + '</select>' +
        '<button type="button" class="link-btn" data-action="toggle-manage-reltypes">' + (state.managingRelTypes ? 'Done' : 'Manage relationship types') + '</button>' +
        relTypeChips +
        '<button type="button" class="btn btn-primary" style="width:100%;" data-action="confirm-add-related" data-show="' + item.id + '">Add</button>' +
      '</div>';
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
          '<button class="icon-btn" data-action="edit-show" data-show="' + movie.id + '" aria-label="Edit ' + movie.title + '">' + icon('pencil') + '</button>' +
          '<button class="icon-btn icon-btn--danger' + (deleteConfirming?' danger-confirm':'') + '" data-action="delete-show" data-show="' + movie.id + '" aria-label="Delete ' + movie.title + '">' + icon('trash') + '</button>' +
        '</div>' +
      '</div>' +
      (deleteConfirming ? '<p class="screen-kicker" style="color:var(--danger);font-weight:700;">Tap delete again to remove ' + movie.title + '.</p>' : '') +
      '<h2 class="detail-title">' + movie.title + '</h2>' +
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
          rows += '<li class="ep-row ep-row--watched"><button class="ep-row__check ep-row__check--done" data-action="uncheck-episode" data-show="' + show.id + '" aria-label="Mark episode ' + i + ' as not watched">' + icon('check') + '</button><span class="ep-row__title">Episode ' + i + durSuffix + '</span><span class="ep-row__date">' + fmtDate(d) + '</span></li>';
        } else {
          rows += '<li class="ep-row ep-row--watched"><span class="ep-row__num">' + icon('check') + '</span><span class="ep-row__title">Episode ' + i + durSuffix + '</span><span class="ep-row__date">' + fmtDate(d) + '</span></li>';
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
          '<button class="icon-btn" data-action="edit-show" data-show="' + show.id + '" aria-label="Edit ' + show.title + '">' + icon('pencil') + '</button>' +
          '<button class="icon-btn icon-btn--danger' + (deleteConfirming?' danger-confirm':'') + '" data-action="delete-show" data-show="' + show.id + '" aria-label="Delete ' + show.title + '">' + icon('trash') + '</button>' +
        '</div>' +
      '</div>' +
      (deleteConfirming ? '<p class="screen-kicker" style="color:var(--danger);font-weight:700;">Tap delete again to remove ' + show.title + '.</p>' : '') +
      '<h2 class="detail-title">' + show.title + '</h2>' +
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
      '<ul class="ep-list">' + rows + '</ul>' +
      relatedSectionHtml(show);
  }
  function renderDetailScreen(){
    var show = getShow(state.detailShowId);
    if(!show) return '<div class="screen-pad"><p class="screen-kicker">Show not found.</p></div>';
    return '<div class="screen-pad">' + renderShowDetailContent(show, {showBack:true}) + '</div>';
  }

  /* ---------------- FORM ---------------- */
  function emptyDraft(){
    return { id:null, type:'show', title:'', originalTitle:'', genres:[], cast:[], nationality:'', category:(state.categories[0]?state.categories[0].id:''), folderIds:[], totalEpisodes:8, airDays:[0],
      airTime:'20:00', airTimeZone:'TH', airTimeOriginal:'20:00',
      firstAirDate: isoDateOffset(0), channel:'', platform:'', posterIndex: Math.floor(Math.random()*GRADIENTS.length),
      posterImage:null, posterCrops: defaultCrops(), episodeMinutes:'', episodesPerAiring:1, related:[] };
  }
  function emptyMovieDraft(){
    return { id:null, type:'movie', title:'', originalTitle:'', genres:[], cast:[], nationality:'', category:'movie',
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
        '<div class="field"><label>Episodes released together</label><input type="number" id="f_perdrop" data-field="episodesPerAiring" min="1" value="' + (d.episodesPerAiring||1) + '"><p class="crop-hint">For shows that drop more than one episode at the same time (e.g. 2 episodes every Monday), set this above 1.</p></div>' +
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
      if(show && show.watched < show.totalEpisodes){ show.watched += 1; touch(); render(); }
    }, 260);
  }

  /* ---------------- poster upload ---------------- */
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
            var canvas = document.createElement('canvas');
            canvas.width = cw; canvas.height = ch;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, cw, ch);
            callback(canvas.toDataURL('image/jpeg', quality));
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
      state.formDraft = { id:s.id, type:'movie', title:s.title, originalTitle: s.originalTitle || '', genres:(s.genres||[]).slice(), cast:(s.cast||[]).map(castEntry), nationality: s.nationality || '', category:'movie',
        releaseYear: s.releaseYear || '', runtimeMinutes: s.runtimeMinutes || '', watchedDate: s.watchedDate || isoDateOffset(0), rating: s.rating || 0, platform: s.platform || '',
        posterIndex: s.posterIndex||0, posterImage: s.posterImage || null,
        posterCrops: s.posterCrops ? JSON.parse(JSON.stringify(s.posterCrops)) : defaultCrops(),
        related: (s.related||[]).slice() };
    } else {
      state.formKind = 'show';
      state.formDraft = { id:s.id, type:'show', title:s.title, originalTitle: s.originalTitle || '', genres:(s.genres||[]).slice(), cast:(s.cast||[]).map(castEntry), nationality: s.nationality || '', category: s.category || (state.categories[0]?state.categories[0].id:''), folderIds:(s.folderIds||[]).slice(),
        totalEpisodes:s.totalEpisodes, airDays:(s.airDays||[]).slice(),
        airTime:s.airTime, airTimeZone: s.airTimeZone || 'TH', airTimeOriginal: s.airTimeOriginal || s.airTime,
        firstAirDate:s.firstAirDate,
        channel:s.channel||'', platform:s.platform||'', posterIndex:s.posterIndex||0,
        posterImage: s.posterImage || null,
        posterCrops: s.posterCrops ? JSON.parse(JSON.stringify(s.posterCrops)) : defaultCrops(),
        episodeMinutes: s.episodeMinutes || '', episodesPerAiring: s.episodesPerAiring || 1, related: (s.related||[]).slice() };
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
      var ov = appBody.querySelector('.app-screen--overlay');
      if(ov) ov.scrollTop = 0;
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
    if(d.id){
      var s = getShow(d.id);
      if(s){
        s.title = d.title.trim(); s.originalTitle = (d.originalTitle||'').trim(); s.genres = d.genres; s.cast = d.cast; s.nationality = d.nationality || ''; s.category = d.category || ''; s.folderIds = d.folderIds.slice(); s.totalEpisodes = total;
        s.airDays = d.airDays.length ? d.airDays : [0]; s.airTime = d.airTime; s.airTimeZone = d.airTimeZone || 'TH'; s.airTimeOriginal = d.airTimeOriginal || d.airTime; s.firstAirDate = d.firstAirDate;
        s.channel = d.channel; s.platform = d.platform; s.posterIndex = d.posterIndex;
        s.posterImage = d.posterImage || null; s.posterCrops = d.posterCrops || defaultCrops();
        s.episodeMinutes = mins; s.episodesPerAiring = perDrop;
        if(s.watched > s.totalEpisodes) s.watched = s.totalEpisodes;
      }
    } else {
      state.shows.push({ id:'s'+Date.now(), type:'show', title:d.title.trim(), originalTitle:(d.originalTitle||'').trim(), genres:d.genres, cast:d.cast, nationality: d.nationality || '', category: d.category || '', folderIds: d.folderIds.slice(), totalEpisodes:total,
        airDays: d.airDays.length ? d.airDays : [0], airTime:d.airTime, airTimeZone: d.airTimeZone || 'TH', airTimeOriginal: d.airTimeOriginal || d.airTime, firstAirDate:d.firstAirDate,
        channel:d.channel, platform:d.platform, posterIndex:d.posterIndex,
        posterImage: d.posterImage || null, posterCrops: d.posterCrops || defaultCrops(),
        episodeMinutes: mins, episodesPerAiring: perDrop, watched:0, related: d.related ? d.related.slice() : [] });
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
        s.title = d.title.trim(); s.originalTitle = (d.originalTitle||'').trim(); s.genres = d.genres; s.cast = d.cast; s.nationality = d.nationality || '';
        s.releaseYear = year; s.runtimeMinutes = runtime; s.watchedDate = d.watchedDate || isoDateOffset(0); s.rating = rating; s.platform = d.platform;
        s.posterIndex = d.posterIndex; s.posterImage = d.posterImage || null; s.posterCrops = d.posterCrops || defaultCrops();
      }
    } else {
      state.shows.push({ id:'s'+Date.now(), type:'movie', title:d.title.trim(), originalTitle:(d.originalTitle||'').trim(), genres:d.genres, cast:d.cast, nationality: d.nationality || '', category:'movie',
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
      var remoteShows = (remote.data && remote.data.shows) || [];
      var remoteUpdatedAt = (remote.data && remote.data.updatedAt) || 0;
      if(remoteShows.length && (!state.updatedAt || remoteUpdatedAt > state.updatedAt)){
        state.shows = remoteShows;
        state.shows.forEach(migrateShow);
        state.updatedAt = remoteUpdatedAt;
        if(remote.data.categories || remote.data.genreOptionsByCategory || remote.data.genreOptions) state.categories = ensureMovieCategory(buildCategories(remote.data));
        if(remote.data.folders) state.folders = remote.data.folders;
        if(remote.data.nationalityOptions && remote.data.nationalityOptions.length) state.nationalityOptions = remote.data.nationalityOptions;
        if(remote.data.relationshipTypes && remote.data.relationshipTypes.length) state.relationshipTypes = remote.data.relationshipTypes;
      }
      state.ghSha = remote.sha;
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
          render();
          window.scrollTo(0, 0);
          tabScrollMemory[state.activeTab] = 0;
        })(); break;
      case 'check-episode':
        checkEpisode(btn.getAttribute('data-show')); break;
      case 'uncheck-episode':
        (function(){
          var s = getShow(btn.getAttribute('data-show'));
          if(s && s.watched > 0){ s.watched -= 1; touch(); render(); }
        })(); break;
      case 'open-detail':
        state.detailShowId = btn.getAttribute('data-show');
        state.confirmDeleteId = null;
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
        state.managingRelTypes = false;
        render(); break;
      case 'close-add-related':
        state.addingRelatedFor = null;
        state.managingRelTypes = false;
        render(); break;
      case 'confirm-add-related':
        (function(){
          var itemId = btn.getAttribute('data-show');
          var item = getShow(itemId);
          var targetSel = document.getElementById('relPickTitle');
          var typeSel = document.getElementById('relPickType');
          var reverseSel = document.getElementById('relPickTypeReverse');
          if(!item || !targetSel || !typeSel || !targetSel.value) return;
          var target = getShow(targetSel.value);
          if(!target) return;
          if(!item.related) item.related = [];
          if(!target.related) target.related = [];
          // remove any existing link between these two first, so re-linking replaces
          // rather than duplicates (in either direction)
          item.related = item.related.filter(function(r){ return r.id !== target.id; });
          target.related = target.related.filter(function(r){ return r.id !== item.id; });
          item.related.push({ id: target.id, label: typeSel.value });
          target.related.push({ id: item.id, label: (reverseSel && reverseSel.value) || typeSel.value });
          state.addingRelatedFor = null;
          state.managingRelTypes = false;
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
      case 'toggle-manage-reltypes':
        state.managingRelTypes = !state.managingRelTypes;
        render(); break;
      case 'remove-reltype':
        (function(){
          var val = btn.getAttribute('data-value');
          if(state.relationshipTypes.length <= 1) return;
          state.relationshipTypes = state.relationshipTypes.filter(function(t){ return t !== val; });
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
          var f0 = getFolder(fid);
          if(f0 && f0.order) f0.order = f0.order.filter(function(x){ return x !== sid; });
          touch(); render();
        })(); break;
      case 'move-show-in-folder':
        (function(){
          var fid = btn.getAttribute('data-folder'), sid = btn.getAttribute('data-show'), dir = parseInt(btn.getAttribute('data-dir'),10);
          var f = getFolder(fid); if(!f) return;
          var items = orderedFolderItems(f, state.shows.filter(function(s){ return (s.folderIds||[]).indexOf(fid) !== -1; }));
          var idx = -1;
          items.forEach(function(s,i){ if(s.id===sid) idx=i; });
          var swap = idx + dir;
          if(idx === -1 || swap < 0 || swap >= items.length) return;
          var tmp = items[idx]; items[idx] = items[swap]; items[swap] = tmp;
          f.order = items.map(function(s){ return s.id; });
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
            var f1 = getFolder(fid);
            if(f1 && f1.order) f1.order = f1.order.filter(function(x){ return x !== sid; });
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
          var arr = listKey === 'genre' ? currentGenreList() : state.nationalityOptions;
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
            if(result.ok){
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
      readAndDownscaleImage(file, 480, 0.75, function(dataUri){
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
      readAndDownscaleImage(castFile, 160, 0.75, function(dataUri){
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
        var arr = listKey === 'genre' ? currentGenreList() : state.nationalityOptions;
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
    if(e.key === 'Enter' && e.target.id === 'newRelTypeInput'){
      e.preventDefault();
      var rtname = e.target.value.trim();
      if(rtname && state.relationshipTypes.indexOf(rtname) === -1){
        state.relationshipTypes.push(rtname);
        pendingFocusId = 'newRelTypeInput';
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
  loadState();
  render();
  syncAndMaybeRender();
  setInterval(syncAndMaybeRender, 5*60*1000);

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
