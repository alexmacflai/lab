import { PROFILES } from '../../print-material/profiles.js';
import { PrintRenderer } from '../../print-material/renderer.js';

export class PrintProof {
  constructor(player) {
    this.player = player; this.index = player.index; this.generation = 0; this.cycling = false;
    this.root = document.querySelector('#print-proof');
    this.root.innerHTML = `<h2>Eight print conditions</h2>
      <p>Dev only. Random each frame varies the condition and ink details in the main preview. Choose a named condition to isolate it. Cards hold still for comparison.</p>
      <div class="proof-controls"><label>Main print <select id="proof-profile"><option value="-2">Random each frame</option><option value="-1">Current print</option>${PROFILES.map((p,i)=>`<option value="${i}">${p.name}</option>`).join('')}</select></label>
      <label>Print view <select id="proof-view"><option value="0">Paper and ink</option><option value="1">Ink coverage</option><option value="2">Bleed radius</option><option value="3">Print-time contact</option><option value="4">Transfer mask</option></select></label>
      <label><input id="proof-detail" type="checkbox" checked> Detail crops</label><button id="proof-cycle">Randomise prints</button><button id="proof-heavy">Hold heavy bleed</button></div>
      <p>Stops the camera and holds a heavy-bleed print in close-up. Press again for another impression.</p>
      <p id="proof-live"></p><p id="proof-source"></p><div id="proof-cards"></div>`;
    const canvas = document.createElement('canvas'); canvas.width = 672; canvas.height = 832;
    this.renderer = new PrintRenderer(canvas,player.papers,2); this.cardImpressions = new Map();
    this.resizeCards();
    const resize = () => { if (this.resizeCards()) this.rebuild(); };
    this.resizeObserver = new ResizeObserver(resize); this.resizeObserver.observe(document.querySelector('#proof-cards'));
    this.resizeHandler = resize; window.addEventListener('resize', resize);
    this.bind(); this.rebuild();
  }

  resizeCards() {
    const grid = document.querySelector('#proof-cards'), style = getComputedStyle(grid);
    const columns = style.gridTemplateColumns.split(' ').length;
    const cell = (grid.clientWidth - parseFloat(style.columnGap) * (columns - 1)) / columns;
    const width = Math.max(672, Math.ceil(cell * Math.min(devicePixelRatio || 1, 3)));
    if (this.renderer.canvas.width === width) return false;
    this.renderer.canvas.width = width; this.renderer.canvas.height = Math.round(width * 832 / 672);
    return true;
  }

  inspectHeavy() {
    this.stop();
    if (this.player.active || this.player.camera?.pending) this.player.camera.stop();
    this.player.zoom = true; document.querySelector('#zoom').checked = true;
    this.player.renderer.profile = 4; this.player.renderer.reroll();
    this.player.select(this.player.index); this.highlight();
    document.querySelector('#portrait').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'center'});
  }

  bind() {
    document.querySelector('#proof-heavy').addEventListener('click',()=>this.inspectHeavy());
    document.querySelector('#proof-profile').addEventListener('change',event=>{ this.stop(); this.choose(Number(event.target.value)); });
    document.querySelector('#proof-view').addEventListener('change',event=>{
      this.player.renderer.proofView = Number(event.target.value); this.player.inspect = 0;
      document.querySelector('#surface').value = '0'; this.player.draw(true); this.rebuild();
    });
    document.querySelector('#proof-detail').addEventListener('change',()=>this.rebuild());
    document.querySelector('#proof-cycle').addEventListener('click',()=>{
      if (this.cycling) { this.stop(); return; }
      this.cycling = true; document.querySelector('#proof-cycle').textContent = 'Pause prints';
      let last = 0;
      const tick = time => {
        if (!this.cycling) return;
        if (time-last >= 1000/this.player.settings.fps) {
          last = time; this.player.renderer.reroll();
          this.player.select(this.index); this.highlight();
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }

  stop() { this.cycling = false; document.querySelector('#proof-cycle').textContent = 'Randomise prints'; }

  dispose() {
    this.stop(); this.generation++; this.resizeObserver.disconnect();
    window.removeEventListener('resize', this.resizeHandler); this.renderer.dispose(true);
  }

  choose(index) { this.player.renderer.profile = index; this.player.draw(true); this.highlight(); }

  highlight() {
    document.querySelector('#proof-profile').value = this.player.renderer.profile;
    const impression = this.player.renderer.impression;
    document.querySelector('#proof-live').textContent = `This frame: ${PROFILES[impression?.profile]?.name || 'Current print'}${impression?.seed === undefined ? '' : ` · seed ${impression.seed.toFixed(3)}`}`;
    this.root.querySelectorAll('[data-profile]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.profile)===this.player.renderer.profile)));
  }

  sync(p) {
    document.querySelector('#proof-cycle').disabled = p.active;
    if ((p.active || p.loop) && this.cycling) this.stop();
    if (!p.loop && p.index !== this.index) { this.index = p.index; this.rebuild(); }
    this.highlight();
  }

  async rebuild() {
    const generation = ++this.generation, index = this.index, cards = document.querySelector('#proof-cards');
    document.querySelector('#proof-source').textContent = `Comparison paper: ${this.player.papers[index].name} · ${this.player.papers[index].condition}. Cards keep the photograph when the camera is on.`;
    for (const key of ['imageSize','imageGamma','imageBrightness','printSize']) this.renderer[key] = this.player.renderer[key];
    this.renderer.proofView = this.player.renderer.proofView;
    for (let i=0;i<PROFILES.length;i++) {
      if (generation !== this.generation) return;
      const profile = PROFILES[i]; this.renderer.profile = i;
      const key = `${index}/${i}`;
      this.renderer.impression = this.cardImpressions.get(key) || null;
      this.renderer.appliedProfile = i; this.renderer.lastIndex = index;
      this.renderer.draw(index,this.player.sample,{zoom:document.querySelector('#proof-detail').checked});
      this.cardImpressions.set(key,this.renderer.impression);
      const button = cards.children[i] || document.createElement('button'); button.dataset.profile = i;
      const image = document.createElement('img'); image.src = this.renderer.canvas.toDataURL(); image.alt = `${profile.name} on ${this.player.papers[index].name}`;
      const title = document.createElement('strong'); title.textContent = `${i+1}. ${profile.name}`;
      const description = document.createElement('span'); description.textContent = profile.description;
      button.replaceChildren(image,title,description);
      if (!button.isConnected) button.addEventListener('click',()=>{ this.stop(); this.choose(i); document.querySelector('#portrait').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'center'}); });
      if (!button.isConnected) cards.append(button);
      this.highlight(); await new Promise(resolve=>requestAnimationFrame(resolve));
    }
  }
}
