const $ = (s, el=document) => el.querySelector(s);
    const logEl = $('#log');
    const cmdEl = $('#cmd');

    const SERVER = {
      name: 'constantium.net',
      primaryIp: 'constantium.net',
      titleLine: 'Pure Paper. Absolute Anarchy.',
      tagline: 'A neverending world with no rules. No admins. No resets. The history is written by the players.',
      info: {
        platform: 'Paper (vanilla survival gameplay)',
        rules: 'No rules. Griefing, stealing, and hacking are allowed. No land claims. No bans.',
        world: {
          reset: 'Never reset',
          size: '9+ GB',
          players: '27 unique players',
          age: 'January 14, 2026 at 5:50:03.461 AM UTC'
        },
        hardware: 'High-speed NVMe storage for fast chunk loading. 20 TPS is the goal.',
        funding: {
          monthly: '$24.00 / month approx',
          policy: 'If funding stops, the server will be put on worse hardware.',
          rewards: [
            { name: 'Server Icon', price: '$2.00 USD / 48 Hours', desc: 'Custom 64x64 .png displayed in the server list. No gore or illegal content.' },
            { name: 'Supporter Rank', price: '$10.00 USD / One-time', desc: 'Gives 32 render & simulation distance instead of the default 12.' }
          ]
        },
        contact: {
          email: 'contact@trace.rip',
          discord: 'https://discord.gg/CNZzwhUTCm',
          github: 'https://github.com/tracerip'
        }
      }
    };

    const THEMES = [
      { name: 'green', vars: { '--text':'#d7f8d7','--muted':'#88c088','--faint':'#2b5a2b','--accent':'#4cff4c','--warn':'#ffd34c','--err':'#ff5c5c' } },
      { name: 'amber', vars: { '--text':'#ffe7b5','--muted':'#e0b86b','--faint':'#6b4f1f','--accent':'#ffbf3f','--warn':'#7cf3ff','--err':'#ff6b6b' } },
      { name: 'ice', vars: { '--text':'#dbf3ff','--muted':'#7bc6d8','--faint':'#234a57','--accent':'#65f0ff','--warn':'#b2ff59','--err':'#ff7aa2' } }
    ];

    const STORAGE_KEY = 'constantium_session_v2';

    function nowTime(){
      const d = new Date();
      return d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', second:'2-digit'});
    }

    function stamp(){
      const d = new Date();
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth()+1).padStart(2,'0');
      const dd = String(d.getDate()).padStart(2,'0');
      const hh = String(d.getHours()).padStart(2,'0');
      const mi = String(d.getMinutes()).padStart(2,'0');
      const ss = String(d.getSeconds()).padStart(2,'0');
      return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
    }

    function escapeHtml(str){
      return String(str).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    }

    function writeLine(text, cls=''){
      const div = document.createElement('div');
      div.className = `logline ${cls}`.trim();
      div.innerHTML = `<span class="time">[${stamp()}]</span> ${escapeHtml(text)}`;
      logEl.appendChild(div);
      logEl.scrollTop = logEl.scrollHeight;
      return div;
    }

    function writeRaw(html, cls=''){
      const div = document.createElement('div');
      div.className = `logline ${cls}`.trim();
      div.innerHTML = html;
      logEl.appendChild(div);
      logEl.scrollTop = logEl.scrollHeight;
      return div;
    }

    function writePrompt(cmd){
      writeRaw(`<span class="time">[${stamp()}]</span> <span class="prompt">guest@constantium.net:~$</span> ${escapeHtml(cmd)}`);
    }

    function toast(msg){
      const t = $('#toast');
      t.textContent = msg;
      t.classList.add('active');
      clearTimeout(toast._t);
      toast._t = setTimeout(()=>t.classList.remove('active'), 2600);
    }

    const state = {
      themeIndex: 0,
      route: 'home'
    };

    function applyTheme(){
      const t = THEMES[state.themeIndex];
      for(const [k,v] of Object.entries(t.vars)) document.documentElement.style.setProperty(k,v);
    }

    function save(){
      try{
        const payload = {
          themeIndex: state.themeIndex,
          lines: [...logEl.querySelectorAll('.logline')].map(n=>n.innerHTML),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      }catch(e){
        $('#persist').textContent = 'off';
      }
    }

    function load(){
      try{
        const raw = localStorage.getItem(STORAGE_KEY);
        if(!raw) return false;
        const payload = JSON.parse(raw);
        if(Array.isArray(payload.lines)){
          logEl.innerHTML = '';
          for(const html of payload.lines){
            const div = document.createElement('div');
            div.className = 'logline';
            div.innerHTML = html;
            logEl.appendChild(div);
          }
          logEl.scrollTop = logEl.scrollHeight;
        }
        if(Number.isInteger(payload.themeIndex)) state.themeIndex = payload.themeIndex % THEMES.length;
        applyTheme();
        return true;
      }catch(e){
        return false;
      }
    }

    function sectionHeader(title){
      writeLine(title, 'tag');
      writeLine('────────────────────────────────────────────────────────────', 'time');
    }

    function render(route){
      state.route = route;
      const routes = {
        home(){
          sectionHeader('constantium.net');
          writeLine(SERVER.titleLine, 'glow');
          writeLine(SERVER.tagline);
          writeLine('');
          writeLine(`IP: ${SERVER.primaryIp} (type: copyip)`, 'ok');
          writeLine('Use: server • rules • funding • contact • help');
        },
        server(){
          sectionHeader('Server Information');
          writeLine(`Address: ${SERVER.primaryIp}`, 'ok');
          writeLine(`Gameplay: ${SERVER.info.platform}`);
          writeLine('');
          writeLine('The World:', 'tag');
          writeLine(`- Reset policy: ${SERVER.info.world.reset}`);
          writeLine(`- Current size: ${SERVER.info.world.size}`);
          writeLine(`- Population: ${SERVER.info.world.players}`);
          writeLine(`- Map age: ${SERVER.info.world.age}`);
          writeLine('');
          writeLine('Hardware:', 'tag');
          writeLine(SERVER.info.hardware);
          writeLine('');
          writeLine('Connection IPs:', 'tag');
          writeLine(`- ${SERVER.primaryIp}`);
        },
        rules(){
          sectionHeader('Rules');
          writeLine(SERVER.info.rules);
          writeLine('Note: play at your own risk. Keep client security best-practices.');
        },
        funding(){
          sectionHeader('Funding & Rewards');
          writeLine('constantium.net runs on community support. Funds go directly to server upkeep.');
          writeLine(`Estimated cost: ${SERVER.info.funding.monthly}`, 'ok');
          writeLine('');
          writeLine('Shutdown Policy:', 'tag');
          writeLine(SERVER.info.funding.policy);
          writeLine('');
          writeLine('Rewards:', 'tag');
          for(const r of SERVER.info.funding.rewards){
            writeLine(`- ${r.name} — ${r.price}`);
            writeLine(`  ${r.desc}`, 'time');
          }
          writeLine('');
          writeLine(`How to buy: email ${SERVER.info.contact.email} with what you want to purchase.`);
        },
        contact(){
          sectionHeader('Contact & Community');
          writeLine(`Email: ${SERVER.info.contact.email}`, 'ok');
          writeRaw(`<span class="time">[${stamp()}]</span> Discord: <a href="${SERVER.info.contact.discord}" target="_blank" rel="noreferrer">${escapeHtml(SERVER.info.contact.discord)}</a>`);
          writeRaw(`<span class="time">[${stamp()}]</span> GitHub: <a href="${SERVER.info.contact.github}" target="_blank" rel="noreferrer">${escapeHtml(SERVER.info.contact.github)}</a>`);
        }
      };

      writeLine(`routing to ${route}…`, 'time');
      (routes[route] || routes.home)();
      save();
    }

    function help(){
      sectionHeader('Commands');
      writeLine('help — show this message');
      writeLine('home | server | rules | funding | contact — open sections');
      writeLine('copyip — copy constantium.net to clipboard');
      writeLine('time — print current local time');
      writeLine('theme — cycle color theme');
      writeLine('clear — clear the terminal');
      writeLine('export — download session as .txt');
      writeLine('echo <text> — print text');
    }

    function clearLog(){
      logEl.innerHTML = '';
      save();
    }

    function exportLog(){
      const lines = [...logEl.querySelectorAll('.logline')].map(n => n.textContent);
      const blob = new Blob([lines.join('\n') + '\n'], {type:'text/plain'});
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `constantium-session-${new Date().toISOString().slice(0,10)}.txt`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(()=>URL.revokeObjectURL(a.href), 1000);
      writeLine('exported session.', 'ok');
      save();
    }

    function cycleTheme(){
      state.themeIndex = (state.themeIndex + 1) % THEMES.length;
      applyTheme();
      writeLine(`theme: ${THEMES[state.themeIndex].name}`, 'ok');
      save();
    }

    async function copyIp(){
      const ip = SERVER.primaryIp;
      try{
        await navigator.clipboard.writeText(ip);
        writeLine(`copied: ${ip}`, 'ok');
        toast(`IP Copied: ${ip}`);
      }catch(e){
        writeLine('clipboard blocked — copy manually:', 'error');
        writeLine(ip, 'ok');
      }
      save();
    }

    function runCommand(inputRaw){
      const input = inputRaw.trim();
      if(!input) return;

      writePrompt(input);

      const [cmd, ...rest] = input.split(/\s+/);
      const arg = rest.join(' ');

      switch(cmd.toLowerCase()){
        case 'help':
        case '?':
          help();
          break;
        case 'home':
        case 'server':
        case 'rules':
        case 'funding':
        case 'contact':
          render(cmd.toLowerCase());
          break;
        case 'time':
          writeLine(`local time: ${nowTime()}`);
          break;
        case 'clear':
          clearLog();
          break;
        case 'theme':
          cycleTheme();
          break;
        case 'export':
          exportLog();
          break;
        case 'copyip':
        case 'copy':
          copyIp();
          break;
        case 'echo':
          writeLine(arg || '');
          break;
        default:
          writeLine(`unknown command: ${cmd} (try: help)`, 'error');
      }

      save();
    }

    function randomId(){
      return Math.random().toString(16).slice(2,10).toUpperCase();
    }

    // Wire UI
    document.addEventListener('click', (e)=>{
      const a = e.target.closest('a.navlink');
      if(a){
        e.preventDefault();
        const r = a.getAttribute('data-route');
        runCommand(r);
        cmdEl.focus();
      }
    });

    $('#btnCopy').addEventListener('click', ()=>{ runCommand('copyip'); cmdEl.focus(); });
    $('#btnClear').addEventListener('click', ()=>{ runCommand('clear'); cmdEl.focus(); });
    $('#btnExport').addEventListener('click', ()=>{ runCommand('export'); cmdEl.focus(); });
    $('#btnTheme').addEventListener('click', ()=>{ runCommand('theme'); cmdEl.focus(); });

    cmdEl.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter'){
        const v = cmdEl.value;
        cmdEl.value = '';
        runCommand(v);
      } else if(e.key === 'ArrowUp'){
        const prompts = [...logEl.querySelectorAll('.logline')]
          .map(n => n.textContent)
          .filter(t => t.includes('guest@constantium.net:~$'));
        const last = prompts[prompts.length-1];
        if(last){
          const idx = last.indexOf('guest@constantium.net:~$');
          cmdEl.value = last.slice(idx).split('$').slice(1).join('$').trim();
          setTimeout(()=>cmdEl.setSelectionRange(cmdEl.value.length, cmdEl.value.length), 0);
        }
      }
    });

    // PageUp/PageDown scroll support
    document.addEventListener('keydown', (e)=>{
      if(document.activeElement === cmdEl) return;
      if(e.key === 'PageUp') logEl.scrollTop -= logEl.clientHeight * 0.9;
      if(e.key === 'PageDown') logEl.scrollTop += logEl.clientHeight * 0.9;
    });

    // Clock
    function tick(){
      $('#clock').textContent = nowTime();
    }

    // Init
    $('#year').textContent = new Date().getFullYear();
    $('#sessionId').textContent = randomId();

    applyTheme();
    const loaded = load();
    if(!loaded){
      writeLine('booting console…', 'time');
      writeLine('type help to get started.');
      render('home');
    } else {
      writeLine('restored previous session.', 'time');
    }

    tick();
    setInterval(tick, 1000);

    // focus on click anywhere inside panel
    document.addEventListener('mousedown', (e)=>{
      if(e.target.closest('main')) setTimeout(()=>cmdEl.focus(), 0);
    });
    cmdEl.focus();