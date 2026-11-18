/* Oráculo das Cores — progressive enhancements.
 * Motion is decorative, paused by user preference or prefers-reduced-motion.
 * The scoring engine in quiz.js remains the single source of truth. */
(()=>{'use strict';
  const $=id=>document.getElementById(id);
  const root=document.documentElement;
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
  const stage=$('portalStage');
  const tuner=document.querySelectorAll('.tuner-color');
  const motionButton=$('motionToggle');
  const motionIcon=motionButton?.querySelector('.motion-icon');
  const motionLabel=motionButton?.querySelector('.motion-label');
  const manaInfo={
    W:{color:'#f3dca2',head:'BRANCO · COMUNIDADE',phrase:'A união transforma a vontade em proteção.'},
    U:{color:'#7cbde8',head:'AZUL · CONHECIMENTO',phrase:'Cada resposta revela uma nova possibilidade.'},
    B:{color:'#be9ad1',head:'PRETO · AMBIÇÃO',phrase:'Você escreve as próprias regras do destino.'},
    R:{color:'#f18b78',head:'VERMELHO · LIBERDADE',phrase:'O impulso é uma forma de descobrir caminhos.'},
    G:{color:'#b7da70',head:'VERDE · CRESCIMENTO',phrase:'O instinto reconhece seu próprio caminho.'}
  };
  function tune(id){
    const d=manaInfo[id];if(!d||!stage)return;
    stage.dataset.mana=id;
    stage.style.setProperty('--portal-active',d.color);
    tuner.forEach(btn=>{let on=btn.dataset.mana===id;btn.classList.toggle('active',on);btn.setAttribute('aria-pressed',String(on))});
    const msg=$('manaPreview');
    if(msg){msg.replaceChildren();let strong=document.createElement('strong');strong.textContent=d.head;let small=document.createElement('span');small.textContent=d.phrase;msg.append(strong,small)}
    const sign=$('manaSigil');if(sign){sign.textContent=id;sign.style.color=d.color}
    const row=msg?.closest('.tuner-message');row?.classList.remove('is-changing');void row?.offsetWidth;row?.classList.add('is-changing');
  }
  tuner.forEach(btn=>btn.addEventListener('click',()=>tune(btn.dataset.mana)));
  tune('G');

  let paused=false;
  function paintMotion(){
    root.classList.toggle('motion-paused',paused);
    if(motionButton){
      motionButton.setAttribute('aria-pressed',String(paused));
      motionButton.setAttribute('aria-label',paused?'Reativar animações do portal':'Pausar animações do portal');
      motionIcon.textContent=paused?'▶':'Ⅱ';
      motionLabel.textContent=paused?'ATIVAR ÓRBITAS':'PAUSAR ÓRBITAS';
    }
  }
  motionButton?.addEventListener('click',()=>{paused=!paused;paintMotion()});
  paintMotion();

  // Cursor parallax, applied to the artwork only—not text or controls.
  if(stage&&window.matchMedia('(hover:hover) and (pointer:fine)').matches){
    let pending=false,x=0,y=0;
    stage.addEventListener('pointermove',e=>{
      if(reduce.matches||paused)return;
      let r=stage.getBoundingClientRect();
      x=((e.clientX-r.left)/r.width-.5)*12;
      y=((e.clientY-r.top)/r.height-.5)*12;
      if(!pending){pending=true;requestAnimationFrame(()=>{stage.style.setProperty('--portal-shift-x',x.toFixed(2)+'px');stage.style.setProperty('--portal-shift-y',y.toFixed(2)+'px');pending=false})}
    },{passive:true});
    stage.addEventListener('pointerleave',()=>{stage.style.setProperty('--portal-shift-x','0px');stage.style.setProperty('--portal-shift-y','0px')});
  }

  // Guild archive: keyboard-accessible buttons, not inert rows.
  const guilds={
    WU:['Azorius','Estratégia de controle, regras, prevenção e vantagem de cartas.'],
    UB:['Dimir','Segredos, informações, cemitério, evasão e respostas no momento certo.'],
    BR:['Rakdos','Pressão, dano direto, sacrifícios e decisões de alto risco.'],
    RG:['Gruul','Aceleração de mana, combate e criaturas grandes; excelente ponto de partida para lobisomens.'],
    GW:['Selesnya','Criaturas em grupo, fichas, comunidade e fortalecimento coletivo.'],
    WB:['Orzhov','Ganho e perda de vida, sacrifícios, recursos e valor a longo prazo.'],
    UR:['Izzet','Criatividade com instantâneas, feitiços, cópias e combinações inesperadas.'],
    BG:['Golgari','Cemitério como recurso, reciclagem, sacrifícios e crescimento persistente.'],
    RW:['Boros','Ataques coordenados, combate ágil, equipamentos e fortalecimento da equipe.'],
    GU:['Simic','Adaptação, marcadores +1/+1, aceleração e compra de cartas.']
  };
  const guildButtons=[...document.querySelectorAll('button[data-guild]')];
  function activateGuild(id){
    let data=guilds[id];if(!data)return;
    guildButtons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.guild===id)));
    $('guildInspectorTitle').textContent=data[0].toUpperCase();
    $('guildInspectorDesc').textContent=data[1];
    const icons=$('guildInspectorIcons');icons.replaceChildren();
    [...id].forEach(c=>{let icon=document.createElement('span');icon.className='mana sm '+c;icon.textContent=c;icon.setAttribute('aria-hidden','true');icons.appendChild(icon)});
    const box=$('guildInspector');box.classList.remove('is-changing');void box.offsetWidth;box.classList.add('is-changing');
  }
  guildButtons.forEach(btn=>btn.addEventListener('click',()=>activateGuild(btn.dataset.guild)));
  activateGuild('UR');

  // Scroll reveals only after JS initialized; content stays visible without JS.
  if('IntersectionObserver' in window&&!reduce.matches){
    const selector='.editorial-head,.step-card,.lore-card,.guild-item,.guild-inspector,.faq-grid > *,#resultScreen .card';
    const observer=new IntersectionObserver((entries,obs)=>{
      entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');obs.unobserve(entry.target)}})
    },{rootMargin:'0px 0px -25px 0px',threshold:.06});
    document.querySelectorAll(selector).forEach((node,i)=>{
      node.style.setProperty('--reveal-delay',((i%3)*70)+'ms');
      node.classList.add('reveal-pending');observer.observe(node);
    });
  }

  // Reading indicator is non-interactive and never affects the document's SEO text.
  const bar=$('readingFill');
  let scrollScheduled=false;
  function updateReading(){
    scrollScheduled=false;
    if(!bar)return;
    const height=document.documentElement.scrollHeight-window.innerHeight;
    const progress=height>0?Math.max(0,Math.min(1,window.scrollY/height)):0;
    bar.style.transform=`scaleX(${progress.toFixed(4)})`;
  }
  window.addEventListener('scroll',()=>{if(!scrollScheduled){scrollScheduled=true;requestAnimationFrame(updateReading)}},{passive:true});
  window.addEventListener('resize',updateReading,{passive:true});updateReading();

  // Stagger answers when entering another question, not when checking an answer.
  const title=$('questionText');const content=document.querySelector('.quiz-content');
  if(title&&content){
    let last=title.textContent;
    new MutationObserver(()=>{
      const now=title.textContent;
      if(now===last)return;last=now;
      if(reduce.matches)return;
      content.classList.remove('question-swap');
      void content.offsetWidth;
      [...$('optionContainer').children].forEach((option,i)=>option.style.setProperty('--option-order',i));
      content.classList.add('question-swap');
    }).observe(title,{childList:true,characterData:true,subtree:true});
  }

  const result=$('resultScreen');
  if(result){
    const obs=new MutationObserver(()=>{
      if(document.body.dataset.screen==='result'){
        result.classList.remove('result-entered');
        requestAnimationFrame(()=>requestAnimationFrame(()=>result.classList.add('result-entered')));
      }else result.classList.remove('result-entered');
      updateReading();
    });
    obs.observe(document.body,{attributes:true,attributeFilter:['data-screen']});
  }

  // Navigation links work even after entering the quiz or results.
  document.querySelectorAll('.topnav a[href^="#"]').forEach(link=>link.addEventListener('click',e=>{
    if(document.body.dataset.screen==='intro')return;
    const id=link.hash.substring(1),target=document.getElementById(id);
    if(!target||!window.oraculoNavigate?.openIntro)return;
    e.preventDefault();window.oraculoNavigate.openIntro();
    requestAnimationFrame(()=>target.scrollIntoView({behavior:reduce.matches?'auto':'smooth',block:'start'}));
  }));
})();
