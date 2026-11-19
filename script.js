(()=>{
 'use strict';
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 document.documentElement.classList.add('animations-ready');
 const reveal=document.querySelectorAll('.reveal');
 if('IntersectionObserver' in window && !reduced){
  const observer=new IntersectionObserver((entries)=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}})},{threshold:.08,rootMargin:'0px 0px -20px 0px'});
  reveal.forEach(el=>observer.observe(el));
 }else{reveal.forEach(el=>el.classList.add('visible'))}
 // Short character-decoding animation based on the reference video.
 // Text starts readable so it remains accessible when JS is unavailable.
 const nameLines = [...document.querySelectorAll('[data-scramble]')];
 function decodeName(el,delay){
   const target=el.dataset.scramble;
   const chars='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&@?!';
   const originalPeriod=el.querySelector('.name-period');
   let frame=0;
   const totalFrames=31;
   const frameMs=36;
   function tick(){
     const progress=Math.min(target.length,Math.floor(frame/totalFrames*target.length));
     let text='';
     for(let i=0;i<target.length;i++) text+=i<progress?target[i]:chars[Math.floor(Math.random()*chars.length)];
     el.replaceChildren(document.createTextNode(text));
     if(originalPeriod) el.appendChild(originalPeriod);
     frame++;
     if(frame<=totalFrames) window.setTimeout(tick,frameMs);
     else {el.replaceChildren(document.createTextNode(target)); if(originalPeriod)el.appendChild(originalPeriod)}
   }
   window.setTimeout(tick,delay);
 }
 if(!reduced) nameLines.forEach((line,i)=>decodeName(line,i*180+260));
 const skillsWorld=document.querySelector('#skillsWorld');
 const toggle=document.querySelector('#skillsToggle');
 const details=document.querySelector('#skillsOrbit');
 const close=document.querySelector('#closeSkills');
 const action=document.querySelector('#skillsAction');
 const status=document.querySelector('#skillsStatus');
 function setOpen(open){
  skillsWorld.classList.toggle('is-open',open);
  details.classList.toggle('is-visible',open);
  details.setAttribute('aria-hidden',String(!open));
  details.inert=!open;
  toggle.setAttribute('aria-expanded',String(open));
  action.textContent=open?'CLICK TO CLOSE ×':'CLICK TO OPEN ↗';
  status.textContent=open?'Always learning, always building.':'A small note. A growing set of skills.';
 }
 details.inert=true;
 toggle.addEventListener('click',()=>setOpen(!skillsWorld.classList.contains('is-open')));
 close.addEventListener('click',()=>{setOpen(false);toggle.focus()});
 if(!reduced){
  let queued=false;
  const parallax=document.querySelector('[data-parallax]');
  const cards=[...document.querySelectorAll('.project-card')];
  function update(){
   queued=false;
   if(parallax){const rect=parallax.closest('.intro').getBoundingClientRect();const offset=Math.max(-130,Math.min(130,-rect.top*.11));parallax.style.transform=`translate3d(0,${offset}px,0)`}
   if(window.innerWidth>760){cards.forEach((card,index)=>{const next=cards[index+1];if(!next)return;const rect=next.getBoundingClientRect();const t=Math.max(0,Math.min(1,(window.innerHeight*.64-rect.top)/(window.innerHeight*.55)));card.style.transform=`scale(${1-t*.045})`;card.style.filter=`brightness(${1-t*.055})`})}
   else cards.forEach(card=>{card.style.transform='';card.style.filter=''})
  }
  window.addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(update)}},{passive:true});
  window.addEventListener('resize',()=>{if(!queued){queued=true;requestAnimationFrame(update)}},{passive:true});
  update();
 }
})();
