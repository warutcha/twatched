
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
    cloud: '<path d="M7 18a4 4 0 0 1-.6-7.96A5 5 0 0 1 16 9.2 3.8 3.8 0 0 1 15.4 18H7Z"/>'
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
  var GENRE_OPTIONS_DEFAULT = ['Action','Comedy','Crime','Drama','Fantasy','Historical','Horror','Legal','Medical','Mystery','Political','Romance','School','Sci-Fi','Slice of Life','Sports','Supernatural','Thriller','Variety','War'];
  var NATIONALITY_OPTIONS_DEFAULT = ['Korean','Japanese','Thai','Chinese'];
  var APP_VERSION = 'v1.5.0';

  /* ---------------- date helpers ---------------- */
  function pad(n){ return n < 10 ? '0'+n : ''+n; }
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
    var base = freqPrefix + joined + ' at ' + fmtTime(new Date('2000-01-01T'+(show.airTime||'20:00')+':00'));
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
    if(typeof c === 'string') return { name:c, photo:null };
    return { name:(c && c.name) || '', photo:(c && c.photo) || null };
  }
  function posterImgTag(showLike, slot, cls){
    if(!showLike || !showLike.posterImage) return '';
    var c = (showLike.posterCrops && showLike.posterCrops[slot]) || {x:50,y:50,zoom:100};
    return '<img class="poster-img ' + (cls||'') + '" src="' + showLike.posterImage + '" alt="" draggable="false" style="object-position:' + c.x + '% ' + c.y + '%; transform:scale(' + (c.zoom/100) + ');">';
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
    notifyEnabled: true,
    notificationQueue: [],
    activeToast: null,       // { showId, epNumber } | null
    shows: [],
    updatedAt: 0,            // last local data change, for sync comparison
    lastNotifyCheck: 0,
    gh: null,                // { owner, repo, token } | null
    ghSha: null,
    ghStatus: null,          // { type: 'info'|'success'|'error', msg }
    lastSyncedAt: null,
    syncing: false,
    genreOptions: GENRE_OPTIONS_DEFAULT.slice(),
    nationalityOptions: NATIONALITY_OPTIONS_DEFAULT.slice(),
    managingList: null       // null | 'genre' | 'nationality'
  };
  var toastTimer = null;
  var dragState = null;
  var castPhotoTargetIndex = null;
  var resizeTimer = null;

  function loadState(){
    try{
      var raw = localStorage.getItem(STORAGE_KEY);
      if(raw){
        var loaded = JSON.parse(raw);
        state.shows = loaded.shows || [];
        state.theme = loaded.theme || 'system';
        state.notifyEnabled = (loaded.notifyEnabled !== undefined) ? loaded.notifyEnabled : true;
        state.updatedAt = loaded.updatedAt || 0;
        state.lastNotifyCheck = loaded.lastNotifyCheck || 0;
        state.genreOptions = (loaded.genreOptions && loaded.genreOptions.length) ? loaded.genreOptions : GENRE_OPTIONS_DEFAULT.slice();
        state.nationalityOptions = (loaded.nationalityOptions && loaded.nationalityOptions.length) ? loaded.nationalityOptions : NATIONALITY_OPTIONS_DEFAULT.slice();
      }
    }catch(e){ /* start empty */ }
    try{
      var rawGh = localStorage.getItem(GH_KEY);
      if(rawGh) state.gh = JSON.parse(rawGh);
    }catch(e){ state.gh = null; }
  }
  function persistLocal(){
    try{
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        shows: state.shows, theme: state.theme, notifyEnabled: state.notifyEnabled,
        updatedAt: state.updatedAt, lastNotifyCheck: state.lastNotifyCheck,
        genreOptions: state.genreOptions, nationalityOptions: state.nationalityOptions
      }));
    }catch(e){ /* storage unavailable — app still works in-memory this session */ }
  }
  function saveGH(cfg){
    try{ localStorage.setItem(GH_KEY, cfg ? JSON.stringify(cfg) : ''); }catch(e){}
  }
  function touch(){ state.updatedAt = Date.now(); persistLocal(); if(state.gh) syncNow().then(render); }

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
    return { shows: state.shows, updatedAt: state.updatedAt, genreOptions: state.genreOptions, nationalityOptions: state.nationalityOptions };
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
        state.updatedAt = remoteUpdatedAt;
        if(remoteData.genreOptions && remoteData.genreOptions.length) state.genreOptions = remoteData.genreOptions;
        if(remoteData.nationalityOptions && remoteData.nationalityOptions.length) state.nationalityOptions = remoteData.nationalityOptions;
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

  /* ---------------- notifications ---------------- */
  function requestNotifyPermissionIfNeeded(){
    if(!('Notification' in window)) return;
    if(Notification.permission === 'default') Notification.requestPermission();
  }
  function queueToasts(list){
    state.notificationQueue = state.notificationQueue.concat(list);
    showNextToastIfPossible();
  }
  function showNextToastIfPossible(){
    if(state.activeToast) return;
    if(!state.notifyEnabled){ state.notificationQueue = []; return; }
    var next = state.notificationQueue.shift();
    if(!next) return;
    state.activeToast = next;
    render();
    clearTimeout(toastTimer);
    toastTimer = setTimeout(dismissActiveToast, 4200);
  }
  function dismissActiveToast(){
    clearTimeout(toastTimer);
    if(!state.activeToast) return;
    state.activeToast = null;
    render();
    setTimeout(showNextToastIfPossible, 300);
  }
  function checkForNewEpisodes(){
    var last = state.lastNotifyCheck || (Date.now() - 24*3600000);
    var now = Date.now();
    var newly = [];
    state.shows.forEach(function(s){
      var info = getNextEpisodeInfo(s, now);
      if(info.completed) return;
      var airMs = info.airDate ? info.airDate.getTime() : null;
      if(airMs !== null && airMs > last && airMs <= now){
        newly.push({ showId: s.id, epNumber: info.number });
      }
    });
    state.lastNotifyCheck = now;
    persistLocal();
    if(newly.length && state.notifyEnabled){
      queueToasts(newly);
      if('Notification' in window && Notification.permission === 'granted'){
        newly.forEach(function(n){
          var show = getShow(n.showId);
          if(show){
            try{ new Notification('TWatched', { body: show.title + ' — Episode ' + n.epNumber + ' is out', icon:'icon-192.png', tag:'twatched-'+show.id+'-'+n.epNumber }); }catch(e){}
          }
        });
      }
    }
  }

  /* ---------------- render dispatch ---------------- */
  var appEl = document.getElementById('app');
  var appBody = document.getElementById('appBody');
  var pendingFocusId = null;

  function render(){
    appEl.setAttribute('data-theme', state.theme==='system' ? '' : state.theme);

    document.querySelectorAll('.tab-btn').forEach(function(btn){
      var tab = btn.getAttribute('data-tab');
      btn.classList.toggle('active', tab === state.activeTab);
      btn.innerHTML = icon(tab==='home'?'home':(tab==='browse'?'grid':'settings')) +
        '<span>' + (tab==='home'?'Home':(tab==='browse'?'Browse':'Settings')) + '</span>';
    });

    // preserve each screen's scroll position across the innerHTML rebuild below —
    // otherwise every render() (a chip tap, a background sync, etc.) snaps scroll to top.
    var savedScroll = [];
    appBody.querySelectorAll('.app-screen').forEach(function(el){ savedScroll.push(el.scrollTop); });

    var html = '';
    html += '<div class="app-screen" style="display:' + (state.activeTab==='home' ? 'block':'none') + '">' + renderHome() + '</div>';
    html += '<div class="app-screen" style="display:' + (state.activeTab==='browse' ? 'block':'none') + '">' + renderBrowse() + '</div>';
    html += '<div class="app-screen" style="display:' + (state.activeTab==='settings' ? 'block':'none') + '">' + renderSettings() + '</div>';

    if(state.overlay === 'detail'){
      html += '<div class="app-screen app-screen--overlay detail-ov' + (state.justOpenedOverlay?' is-animating-in':'') + '">' + renderDetailScreen() + '</div>';
    }
    if(state.overlay === 'form'){
      html += '<div class="app-screen app-screen--overlay form-ov' + (state.justOpenedOverlay?' is-animating-in':'') + '">' + renderFormScreen() + '</div>';
    }

    appBody.innerHTML = html;

    appBody.querySelectorAll('.app-screen').forEach(function(el, i){
      if(savedScroll[i]) el.scrollTop = savedScroll[i];
    });

    if(state.justOpenedOverlay){
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

    var toastSlot = document.getElementById('toastSlot');
    if(state.activeToast){
      var tShow = getShow(state.activeToast.showId);
      if(tShow){
        toastSlot.innerHTML = '<div class="ios-toast" data-action="open-toast" data-show="' + tShow.id + '">' +
          '<div class="ios-toast__icon" style="' + (tShow.posterImage ? '' : posterStyle(tShow)) + '">' +
            (tShow.posterImage ? posterImgTag(tShow,'thumbnail') : '<span>' + initialOf(tShow) + '</span>') +
          '</div>' +
          '<div class="ios-toast__body"><p class="ios-toast__title">TWatched · now</p><p class="ios-toast__text"><strong>' + tShow.title + '</strong> — Episode ' + state.activeToast.epNumber + ' is out</p></div>' +
          '<button class="ios-toast__close" data-action="dismiss-toast" aria-label="Dismiss notification">' + icon('close') + '</button>' +
        '</div>';
      }
      toastSlot.classList.add('is-visible');
    } else {
      toastSlot.classList.remove('is-visible');
    }

    var diagEl = document.getElementById('diagLine');
    if(diagEl){
      requestAnimationFrame(function(){
        try{
          var tb = document.querySelector('.tab-bar');
          var tbRect = tb ? tb.getBoundingClientRect() : null;
          var appRect = appEl ? appEl.getBoundingClientRect() : null;
          var standalone = (window.navigator.standalone === true) || (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
          var vvH = window.visualViewport ? Math.round(window.visualViewport.height) : null;
          var parts = [
            'standalone=' + standalone,
            'innerH=' + window.innerHeight,
            'vvH=' + (vvH===null?'n/a':vvH),
            'screenH=' + (window.screen ? window.screen.height : 'n/a'),
            'appHeight=' + (appRect ? Math.round(appRect.height) : 'n/a'),
            'tabBarBottom=' + (tbRect ? Math.round(tbRect.bottom) : 'n/a')
          ];
          diagEl.textContent = 'Diag — ' + parts.join(' · ');
        }catch(err){ diagEl.textContent = 'Diag — error: ' + err; }
      });
    }
  }

  /* ---------------- HOME ---------------- */
  function renderHome(){
    var now = Date.now();
    var active = [];
    var upcoming = [];
    state.shows.forEach(function(s){
      var info = getNextEpisodeInfo(s, now);
      if(!info.completed && info.aired){ active.push({show:s, info:info}); }
      var nx = nextUnairedEpisode(s, now);
      if(nx){ upcoming.push({show:s, ep:nx}); }
    });
    active.sort(function(a,b){ return a.info.airDate - b.info.airDate; });
    upcoming.sort(function(a,b){ return a.ep.airDate - b.ep.airDate; });
    upcoming = upcoming.slice(0,3);

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

    if(upcoming.length){
      out += '<p class="section-label">Coming up</p><div class="settings-card">';
      upcoming.forEach(function(u){
        out += '<div class="upcoming-row">' +
          '<div class="upcoming-thumb" style="' + (u.show.posterImage ? '' : posterStyle(u.show)) + '">' +
            posterImgTag(u.show,'thumbnail') +
            (u.show.posterImage ? '' : '<span>' + initialOf(u.show) + '</span>') +
          '</div>' +
          '<div class="upcoming-info"><p class="t1">' + u.show.title + '</p><p class="t2">Episode ' + u.ep.number + '</p></div>' +
          '<div class="upcoming-when">' + fmtDate(u.ep.airDate) + '</div>' +
        '</div>';
      });
      out += '</div>';
    }
    out += '</div>';
    return out;
  }

  /* ---------------- BROWSE ---------------- */
  function statusBadge(show){
    var info = getNextEpisodeInfo(show, Date.now());
    if(info.completed) return 'Completed';
    if(info.aired) return 'Ep ' + info.number + ' up next';
    return 'Caught up';
  }
  function tileMarkup(show){
    var pct = Math.round((show.watched/show.totalEpisodes)*100);
    return '<button class="tile" data-action="open-detail" data-show="' + show.id + '">' +
      '<div class="tile-poster" style="' + (show.posterImage ? '' : posterStyle(show)) + '">' +
        posterImgTag(show,'grid') +
        '<span class="badge">' + statusBadge(show) + '</span>' +
        (show.posterImage ? '' : '<span class="title-on-poster">' + show.title + '</span>') +
      '</div>' +
      '<p class="tile-sub">' + (show.platform||'—') + ' · ' + show.watched + '/' + show.totalEpisodes + '</p>' +
      '<div class="tile-progress"><i style="width:' + pct + '%"></i></div>' +
    '</button>';
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
    out2 += '<h1 class="screen-title">Browse</h1><p class="screen-kicker">Everything you\'re tracking. Tap a title to edit its details.</p>';
    if(state.shows.length===0){
      out2 += '<div class="empty-block"><span>' + icon('ticket') + '</span><strong>Nothing added yet</strong><p>Tap the + button to add your first show.</p></div>';
    } else {
      out2 += '<div class="browse-grid">' + state.shows.map(tileMarkup).join('') + '</div>';
    }
    out2 += '<button class="fab" data-action="open-add" aria-label="Add a show">' + icon('plus') + '</button>';
    out2 += '</div>';
    return out2;
  }

  /* ---------------- DETAIL ---------------- */
  function renderShowDetailContent(show, opts){
    opts = opts || {};
    var info = getNextEpisodeInfo(show, Date.now());
    var pct = Math.round((show.watched/show.totalEpisodes)*100);
    var rows = '';
    var durSuffix = show.episodeMinutes ? ' · ' + show.episodeMinutes + ' min' : '';
    for(var i=1;i<=show.totalEpisodes;i++){
      var d = computeEpisodeDate(show, i);
      if(i <= show.watched){
        rows += '<li class="ep-row ep-row--watched"><span class="ep-row__num">' + icon('check') + '</span><span class="ep-row__title">Episode ' + i + durSuffix + '</span><span class="ep-row__date">' + fmtDate(d) + '</span></li>';
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
      '<p class="detail-meta">' + [show.nationality].concat(show.genres||[]).filter(Boolean).join(' · ') + '</p>' +
      '<p class="detail-meta detail-meta--muted">' + (show.channel||'—') + ' · ' + (show.platform||'—') + '</p>' +
      '<p class="detail-meta detail-meta--muted">' + scheduleText(show) + '</p>' +
      ((show.cast||[]).length ? '<div class="chip-row">' + show.cast.map(function(c){
        var ce = castEntry(c);
        return '<span class="chip cast-chip">' + (ce.photo ? '<img class="cast-chip-img" src="'+ce.photo+'" alt="">' : '<span class="cast-chip-init">'+(ce.name.trim().charAt(0).toUpperCase()||'?')+'</span>') + ce.name + '</span>';
      }).join('') + '</div>' : '') +
      '<div class="progress"><div class="progress__bar" style="width:' + pct + '%"></div></div>' +
      '<p class="progress__label">' + show.watched + ' of ' + show.totalEpisodes + ' watched</p>' +
      '<ul class="ep-list">' + rows + '</ul>';
  }
  function renderDetailScreen(){
    var show = getShow(state.detailShowId);
    if(!show) return '<div class="screen-pad"><p class="screen-kicker">Show not found.</p></div>';
    return '<div class="screen-pad">' + renderShowDetailContent(show, {showBack:true}) + '</div>';
  }

  /* ---------------- FORM ---------------- */
  function emptyDraft(){
    return { id:null, title:'', originalTitle:'', genres:[], cast:[], nationality:'', totalEpisodes:8, airDays:[0], airTime:'20:00',
      firstAirDate: isoDateOffset(0), channel:'', platform:'', posterIndex: Math.floor(Math.random()*GRADIENTS.length),
      posterImage:null, posterCrops: defaultCrops(), episodeMinutes:'', episodesPerAiring:1 };
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
  function genrePickerField(d){
    var display = state.genreOptions.concat(d.genres.filter(function(g){ return state.genreOptions.indexOf(g) === -1; }));
    var chips = display.map(function(g){
      var active = d.genres.indexOf(g) !== -1;
      return '<button type="button" class="opt-chip' + (active?' active':'') + '" data-action="toggle-genre" data-value="' + g.replace(/"/g,'&quot;') + '">' + g + '</button>';
    }).join('');
    return '<div class="field"><label>Genre</label><div class="day-chips">' + chips + '</div>' +
      '<button type="button" class="link-btn" data-action="toggle-manage-list" data-list="genre">' + (state.managingList==='genre' ? 'Done' : 'Manage list') + '</button>' +
      (state.managingList === 'genre' ? manageListPanel('genre', state.genreOptions) : '') +
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
      return '<div class="cast-row">' +
        '<button type="button" class="cast-photo" data-action="trigger-cast-photo" data-index="' + i + '" aria-label="Add photo for ' + c.name.replace(/"/g,'&quot;') + '">' +
          (c.photo ? '<img src="' + c.photo + '" alt="">' : '<span>' + (c.name.trim().charAt(0).toUpperCase()||'?') + '</span>') +
        '</button>' +
        '<span class="cast-name">' + c.name + '</span>' +
        '<button type="button" class="cast-remove" data-action="remove-cast" data-index="' + i + '" aria-label="Remove ' + c.name.replace(/"/g,'&quot;') + '">' + icon('close') + '</button>' +
      '</div>';
    }).join('');
    return '<div class="field"><label>Cast</label>' +
      (rows ? '<div class="cast-list">' + rows + '</div>' : '') +
      '<input type="text" id="tagInput_castName" data-cast-name-input placeholder="Type a name, press Enter">' +
      '<p class="crop-hint">Add a name, then tap their circle to add a photo.</p>' +
    '</div>';
  }
  function renderFormScreen(){
    var d = state.formDraft;
    var isEdit = !!d.id;
    var dayChips = WEEKDAY_LABELS.map(function(lbl,i){
      return '<button type="button" class="day-chip' + (d.airDays.indexOf(i)!==-1?' active':'') + '" data-action="toggle-day" data-day="' + i + '">' + lbl + '</button>';
    }).join('');
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
    return '<div class="screen-pad">' +
      '<div class="form-head"><h2>' + (isEdit ? 'Edit show' : 'Add a show') + '</h2><button type="button" data-action="cancel-form">Cancel</button></div>' +
      '<input type="file" accept="image/*" id="posterFileInput" style="display:none">' +
      '<input type="file" accept="image/*" id="castFileInput" style="display:none">' +
      '<form id="showForm">' +
        '<div class="field"><label>Title</label><input type="text" id="f_title" data-field="title" value="' + (d.title||'').replace(/"/g,'&quot;') + '" placeholder="e.g. Nightbound" required></div>' +
        '<div class="field"><label>Original title (optional)</label><input type="text" id="f_origtitle" data-field="originalTitle" value="' + (d.originalTitle||'').replace(/"/g,'&quot;') + '" placeholder="e.g. 로또 1등도 출근합니다"></div>' +
        posterSection +
        genrePickerField(d) +
        nationalityField(d) +
        castField(d) +
        '<div class="two-col">' +
          '<div class="field"><label>Total episodes</label><input type="number" id="f_total" data-field="totalEpisodes" min="1" value="' + d.totalEpisodes + '"></div>' +
          '<div class="field"><label>Episode 1 airs</label><input type="date" id="f_date" data-field="firstAirDate" value="' + d.firstAirDate + '"></div>' +
        '</div>' +
        '<div class="field"><label>Episode length (minutes)</label><input type="number" id="f_epmin" data-field="episodeMinutes" min="1" value="' + (d.episodeMinutes||'') + '" placeholder="e.g. 45"></div>' +
        '<div class="field"><label>Air days</label><div class="day-chips">' + dayChips + '</div></div>' +
        '<div class="field"><label>Episodes released together</label><input type="number" id="f_perdrop" data-field="episodesPerAiring" min="1" value="' + (d.episodesPerAiring||1) + '"><p class="crop-hint">For shows that drop more than one episode at the same time (e.g. 2 episodes every Monday), set this above 1.</p></div>' +
        '<div class="two-col">' +
          '<div class="field"><label>Air time</label><input type="time" id="f_time" data-field="airTime" value="' + d.airTime + '"></div>' +
          '<div class="field"><label>Channel</label><input type="text" id="f_channel" data-field="channel" value="' + (d.channel||'').replace(/"/g,'&quot;') + '" placeholder="e.g. ONE31"></div>' +
        '</div>' +
        '<div class="field"><label>Platform (where you watch)</label><input type="text" id="f_platform" data-field="platform" list="platformList" value="' + (d.platform||'').replace(/"/g,'&quot;') + '" placeholder="e.g. WeTV"><datalist id="platformList">' + PLATFORM_OPTIONS.map(function(p){return '<option value="'+p+'">';}).join('') + '</datalist></div>' +
        (state.confirmDeleteId === d.id ? '<p class="screen-kicker" style="color:var(--danger);font-weight:700;margin:-6px 0 12px;">Tap delete again to remove this show.</p>' : '') +
        '<div class="form-actions">' +
          (isEdit ? '<button type="button" class="btn btn-danger' + (state.confirmDeleteId===d.id?' danger-confirm':'') + '" data-action="delete-show-form">Delete</button>' : '') +
          '<button type="submit" class="btn btn-primary">' + (isEdit ? 'Save changes' : 'Add show') + '</button>' +
        '</div>' +
      '</form>' +
    '</div>';
  }

  /* ---------------- SETTINGS ---------------- */
  function statusNoteHtml(){
    if(!state.ghStatus) return '';
    var color = state.ghStatus.type === 'error' ? 'var(--danger)' : state.ghStatus.type === 'success' ? 'var(--teal-strong)' : 'var(--text-muted)';
    return '<p class="sync-note" style="color:' + color + ';font-weight:600;">' + state.ghStatus.msg + '</p>';
  }
  function renderSettings(){
    var totalShows = state.shows.length;
    var totalWatched = state.shows.reduce(function(a,s){return a+s.watched;},0);
    var completed = state.shows.filter(function(s){return s.watched>=s.totalEpisodes;}).length;
    var totalMinutes = state.shows.reduce(function(a,s){return a + s.watched*(s.episodeMinutes||0);},0);
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
      '<h1 class="screen-title">Settings</h1><p class="screen-kicker">Appearance, sync, notifications, and your stats.</p>' +

      '<div class="settings-card"><h3>Appearance</h3><div class="segmented">' +
        ['system','light','dark'].map(function(t){
          return '<button data-action="set-theme" data-theme="' + t + '" class="' + (state.theme===t?'active':'') + '">' + (t==='system'?'System':t==='light'?'Light':'Dark') + '</button>';
        }).join('') + '</div></div>' +

      '<div class="settings-card"><h3>Notifications</h3><div class="segmented">' +
        [{v:'off',l:'Off'},{v:'on',l:'On'}].map(function(o){
          return '<button data-action="set-notify" data-value="' + o.v + '" class="' + ((state.notifyEnabled?'on':'off')===o.v?'active':'') + '">' + o.l + '</button>';
        }).join('') + '</div>' +
        '<p class="sync-note">TWatched checks for newly-aired episodes whenever you open the app (and every few minutes while it stays open), and lets you know here and as a notification. It can\'t notify you while fully closed for days — see the README for how to extend that.</p>' +
      '</div>' +

      syncCard +

      '<div class="settings-card"><h3>Your stats</h3><div class="stat-grid">' +
        '<div class="stat-tile"><span class="n">' + totalShows + '</span><span class="l">Shows tracked</span></div>' +
        '<div class="stat-tile"><span class="n">' + totalWatched + '</span><span class="l">Episodes watched</span></div>' +
        '<div class="stat-tile"><span class="n">' + completed + '</span><span class="l">Completed</span></div>' +
        '<div class="stat-tile"><span class="n">' + hoursWatched + 'h</span><span class="l">Hours watched</span></div>' +
      '</div></div>' +
      '<p style="text-align:center;color:var(--text-muted);font-size:11px;margin:6px 0 0;">TWatched ' + APP_VERSION + '</p>' +
      '<p style="text-align:center;color:var(--text-muted);font-size:10px;margin:4px 0 0;" id="diagLine">Diagnostics: measuring…</p>' +
    '</div>';
  }

  /* ---------------- interactions ---------------- */
  function openOverlay(name){ state.overlay = name; state.justOpenedOverlay = true; }

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
    state.formOrigin = originTab || 'browse';
    state.confirmDeleteId = null;
    openOverlay('form');
  }
  function openEditForm(showId, origin){
    var s = getShow(showId);
    if(!s) return;
    state.editingShowId = showId;
    state.formDraft = { id:s.id, title:s.title, originalTitle: s.originalTitle || '', genres:(s.genres||[]).slice(), cast:(s.cast||[]).map(castEntry), nationality: s.nationality || '',
      totalEpisodes:s.totalEpisodes, airDays:(s.airDays||[]).slice(), airTime:s.airTime, firstAirDate:s.firstAirDate,
      channel:s.channel||'', platform:s.platform||'', posterIndex:s.posterIndex||0,
      posterImage: s.posterImage || null,
      posterCrops: s.posterCrops ? JSON.parse(JSON.stringify(s.posterCrops)) : defaultCrops(),
      episodeMinutes: s.episodeMinutes || '', episodesPerAiring: s.episodesPerAiring || 1 };
    state.formOrigin = origin || 'browse';
    state.confirmDeleteId = null;
    openOverlay('form');
  }
  function closeForm(){
    state.overlay = (state.formOrigin === 'detail') ? 'detail' : null;
    if(state.overlay === 'detail') state.justOpenedOverlay = false;
    state.formDraft = null; state.editingShowId = null;
    render();
  }
  function submitForm(){
    var d = state.formDraft;
    if(!d.title || !d.title.trim()) return;
    var total = Math.max(1, parseInt(d.totalEpisodes,10) || 1);
    var mins = parseInt(d.episodeMinutes,10);
    if(!mins || mins <= 0) mins = null;
    var perDrop = Math.max(1, parseInt(d.episodesPerAiring,10) || 1);
    if(d.id){
      var s = getShow(d.id);
      if(s){
        s.title = d.title.trim(); s.originalTitle = (d.originalTitle||'').trim(); s.genres = d.genres; s.cast = d.cast; s.nationality = d.nationality || ''; s.totalEpisodes = total;
        s.airDays = d.airDays.length ? d.airDays : [0]; s.airTime = d.airTime; s.firstAirDate = d.firstAirDate;
        s.channel = d.channel; s.platform = d.platform; s.posterIndex = d.posterIndex;
        s.posterImage = d.posterImage || null; s.posterCrops = d.posterCrops || defaultCrops();
        s.episodeMinutes = mins; s.episodesPerAiring = perDrop;
        if(s.watched > s.totalEpisodes) s.watched = s.totalEpisodes;
      }
    } else {
      state.shows.push({ id:'s'+Date.now(), title:d.title.trim(), originalTitle:(d.originalTitle||'').trim(), genres:d.genres, cast:d.cast, nationality: d.nationality || '', totalEpisodes:total,
        airDays: d.airDays.length ? d.airDays : [0], airTime:d.airTime, firstAirDate:d.firstAirDate,
        channel:d.channel, platform:d.platform, posterIndex:d.posterIndex,
        posterImage: d.posterImage || null, posterCrops: d.posterCrops || defaultCrops(),
        episodeMinutes: mins, episodesPerAiring: perDrop, watched:0 });
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
    touch(); render();
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
        state.updatedAt = remoteUpdatedAt;
        if(remote.data.genreOptions && remote.data.genreOptions.length) state.genreOptions = remote.data.genreOptions;
        if(remote.data.nationalityOptions && remote.data.nationalityOptions.length) state.nationalityOptions = remote.data.nationalityOptions;
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
        state.activeTab = btn.getAttribute('data-tab');
        state.overlay = null;
        render(); break;
      case 'check-episode':
        checkEpisode(btn.getAttribute('data-show')); break;
      case 'open-detail':
        state.detailShowId = btn.getAttribute('data-show');
        state.confirmDeleteId = null;
        if(isWideLayout()){ state.activeTab = 'browse'; render(); }
        else { openOverlay('detail'); render(); }
        break;
      case 'select-browse':
        state.detailShowId = btn.getAttribute('data-show');
        state.confirmDeleteId = null;
        render(); break;
      case 'close-detail':
        state.overlay = null; state.confirmDeleteId = null; render(); break;
      case 'open-add':
        openAddForm(state.activeTab); render(); break;
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
      case 'toggle-genre':
        (function(){
          var val = btn.getAttribute('data-value');
          var arr = state.formDraft.genres;
          var pos = arr.indexOf(val);
          if(pos === -1) arr.push(val); else arr.splice(pos,1);
          render();
        })(); break;
      case 'toggle-manage-list':
        state.managingList = (state.managingList === btn.getAttribute('data-list')) ? null : btn.getAttribute('data-list');
        render(); break;
      case 'remove-list-item':
        (function(){
          var listKey = btn.getAttribute('data-list');
          var val = btn.getAttribute('data-value');
          var arr = listKey === 'genre' ? state.genreOptions : state.nationalityOptions;
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
          render();
        })(); break;
      case 'remove-poster-image':
        state.formDraft.posterImage = null;
        render(); break;
      case 'set-theme':
        state.theme = btn.getAttribute('data-theme');
        persistLocal(); render(); break;
      case 'set-notify':
        state.notifyEnabled = btn.getAttribute('data-value') === 'on';
        if(state.notifyEnabled) requestNotifyPermissionIfNeeded();
        if(!state.notifyEnabled) state.notificationQueue = [];
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
      case 'open-toast':
        (function(){
          var showId = btn.getAttribute('data-show');
          dismissActiveToast();
          state.detailShowId = showId;
          state.confirmDeleteId = null;
          if(isWideLayout()){ state.activeTab = 'browse'; render(); }
          else { openOverlay('detail'); render(); }
        })(); break;
      case 'dismiss-toast':
        dismissActiveToast(); break;
      default: break;
    }
  });

  document.addEventListener('input', function(e){
    var t = e.target;
    if(t.matches('[data-crop-zoom]') && state.formDraft){
      var slot = t.getAttribute('data-slot');
      var c = state.formDraft.posterCrops[slot] || (state.formDraft.posterCrops[slot] = {x:50,y:50,zoom:100});
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
          render();
        }
      });
    }
  });
  document.addEventListener('pointerdown', function(e){
    var box = e.target.closest('[data-crop-box]');
    if(!box || !state.formDraft) return;
    var slot = box.getAttribute('data-slot');
    var crop = (state.formDraft.posterCrops && state.formDraft.posterCrops[slot]) || {x:50,y:50,zoom:100};
    var rect = box.getBoundingClientRect();
    var imgEl = box.querySelector('.poster-img');
    var nw = (imgEl && imgEl.naturalWidth) || rect.width || 1;
    var nh = (imgEl && imgEl.naturalHeight) || rect.height || 1;
    var coverScale = Math.max((rect.width||1) / nw, (rect.height||1) / nh);
    var overflowX = Math.max(0, nw * coverScale - (rect.width||0));
    var overflowY = Math.max(0, nh * coverScale - (rect.height||0));
    dragState = {
      slot:slot, box:box, startClientX:e.clientX, startClientY:e.clientY,
      startX:crop.x, startY:crop.y, zoom: crop.zoom || 100,
      overflowX: overflowX, overflowY: overflowY, pointerId:e.pointerId
    };
    try{ box.setPointerCapture(e.pointerId); }catch(err){}
    e.preventDefault();
  });
  document.addEventListener('pointermove', function(e){
    if(!dragState || !state.formDraft) return;
    var crop = state.formDraft.posterCrops[dragState.slot];
    if(!crop) return;
    var zoomFactor = (dragState.zoom || 100) / 100;
    var baseDx = (e.clientX - dragState.startClientX) / zoomFactor;
    var baseDy = (e.clientY - dragState.startClientY) / zoomFactor;
    if(dragState.overflowX > 0){
      crop.x = clamp(dragState.startX - (100 * baseDx / dragState.overflowX), 0, 100);
    }
    if(dragState.overflowY > 0){
      crop.y = clamp(dragState.startY - (100 * baseDy / dragState.overflowY), 0, 100);
    }
    var img = dragState.box.querySelector('.poster-img');
    if(img){
      img.style.objectPosition = crop.x + '% ' + crop.y + '%';
      img.style.transform = 'scale(' + zoomFactor + ')';
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
        state.formDraft.cast.push({ name: castName, photo: null });
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
        var arr = listKey === 'genre' ? state.genreOptions : state.nationalityOptions;
        if(arr.indexOf(newVal) === -1){ arr.push(newVal); touch(); }
        pendingFocusId = e.target.id;
        render();
      }
    }
  });
  document.addEventListener('submit', function(e){
    if(e.target && e.target.id === 'showForm'){
      e.preventDefault();
      submitForm();
    }
  });
  window.addEventListener('resize', function(){
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(render, 150);
  });
  document.addEventListener('visibilitychange', function(){
    if(document.visibilityState === 'visible'){
      checkForNewEpisodes();
      if(state.gh) syncNow().then(render);
    }
  });

  /* ---------------- disable pinch-zoom so it behaves like a native app ---------------- */
  document.addEventListener('gesturestart', function(e){ e.preventDefault(); });
  document.addEventListener('gesturechange', function(e){ e.preventDefault(); });

  /* ---------------- lock the outer page so only the app's own screens can scroll ----------------
     Belt-and-suspenders alongside the position:fixed html/body in the CSS: this stops any
     drag that starts on non-scrollable chrome (tab bar, background) from ever reaching the
     page and triggering iOS's rubber-band bounce, which is what exposes the gap underneath. */
  document.addEventListener('touchmove', function(e){
    if(e.touches && e.touches.length > 1){ e.preventDefault(); return; }
    if(!e.target.closest('.app-screen, .crop-box')) e.preventDefault();
  }, { passive:false });

  /* ---------------- init ---------------- */
  loadState();
  render();
  checkForNewEpisodes();
  if(state.gh){ syncNow().then(render); }
  setInterval(checkForNewEpisodes, 10*60*1000);
  setInterval(function(){ if(state.gh) syncNow().then(render); }, 5*60*1000);

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
