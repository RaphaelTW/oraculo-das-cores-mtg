/* Theme switch with local preference and OS fallback. No tracking. */
(()=>{'use strict';
  const key='mtg-oraculo-theme';
  const system=window.matchMedia('(prefers-color-scheme: dark)');
  const stored=()=>{try { return localStorage.getItem(key); } catch { return null; }};
  const set=(theme)=>{document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme;};
  const apply=()=>set(['dark','light'].includes(stored())?stored():'dark');
  apply();
  system.addEventListener?.('change',()=>{if(!stored())apply()});
  window.addEventListener('DOMContentLoaded',()=>{
    const toggle=document.getElementById('themeToggle');
    if (!toggle)return;
    const paint=()=>{
      const light=document.documentElement.dataset.theme==='light';
      toggle.setAttribute('aria-label',light?'Ativar tema escuro':'Ativar tema claro');
      toggle.setAttribute('title',light?'Ativar tema escuro':'Ativar tema claro');
      toggle.setAttribute('aria-pressed',String(light));
      toggle.querySelector('[data-icon]').textContent=light?'☾':'☼';
    };
    paint();
    toggle.addEventListener('click',()=>{const next=document.documentElement.dataset.theme==='dark'?'light':'dark';set(next);try{localStorage.setItem(key,next)}catch{};paint();});
    system.addEventListener?.('change',paint);
  });
})();
