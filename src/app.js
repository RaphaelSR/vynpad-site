const $=s=>document.querySelector(s);
$('#language').addEventListener('change',e=>location.assign(e.target.value));
const pad=$('#touchpad'),screen=$('#demoScreen'),cursor=$('#demoCursor'),content=$('#scrollContent'),roller=$('#roller');
let x=.48,y=.48,last=null,moved=false,gain=1,holdTimer=0,frame=0,holdDirection=0,lastFrame=0,rollPhase=0,rollerStart=null;
function place(){cursor.style.left=`${x*100}%`;cursor.style.top=`${y*100}%`}
function clamp(v,min,max){return Math.max(min,Math.min(max,v))}
function move(dx,dy){x=clamp(x+dx*gain/screen.clientWidth,0,.94);y=clamp(y+dy*gain/screen.clientHeight,0,.92);place()}
function flash(){const r=$('#clickRipple');r.style.left=`${x*100}%`;r.style.top=`${y*100}%`;r.classList.remove('flash');void r.offsetWidth;r.classList.add('flash')}
pad.addEventListener('pointerdown',e=>{if(e.target.closest('#roller'))return;stopRoll();pad.setPointerCapture(e.pointerId);last={x:e.clientX,y:e.clientY};moved=false});
pad.addEventListener('pointermove',e=>{if(!last||!pad.hasPointerCapture(e.pointerId))return;const dx=e.clientX-last.x,dy=e.clientY-last.y;moved ||= Math.abs(dx)+Math.abs(dy)>1;move(dx,dy);last={x:e.clientX,y:e.clientY}});
pad.addEventListener('pointerup',()=>{if(!last)return;if(!moved)flash();last=null});
['pointercancel','lostpointercapture'].forEach(t=>pad.addEventListener(t,()=>last=null));
pad.addEventListener('keydown',e=>{if(e.target!==pad)return;const d={ArrowLeft:[-8,0],ArrowRight:[8,0],ArrowUp:[0,-8],ArrowDown:[0,8]}[e.key];if(d){e.preventDefault();move(...d)}if(e.key==='Enter'||e.key===' '){e.preventDefault();flash()}});
$('#sensitivity').addEventListener('input',e=>{const n=Number(e.target.value);gain=[.4,.65,1,1.5,2.2][n-1];$('#sensitivityValue').textContent=`${n} / 5`});
document.querySelectorAll('.swatch').forEach(b=>b.addEventListener('click',()=>{document.documentElement.style.setProperty('--accent',b.dataset.color);document.querySelectorAll('.swatch').forEach(v=>v.setAttribute('aria-pressed',String(v===b)))}));
$('#resetDemo').addEventListener('click',()=>{stopRoll();x=y=.48;place();content.scrollTop=0});
function scrollBy(d){content.scrollTop+=d;rollPhase=(rollPhase+d*.22)%16;roller.style.setProperty('--roll',`${rollPhase}px`)}
function stopRoll(){clearTimeout(holdTimer);cancelAnimationFrame(frame);holdTimer=frame=0;holdDirection=0;lastFrame=0;rollerStart=null}
function tick(now){if(!holdDirection)return;const dt=lastFrame?Math.min(now-lastFrame,32):16;lastFrame=now;scrollBy(holdDirection*dt*.28);frame=requestAnimationFrame(tick)}
roller.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();stopRoll();roller.setPointerCapture(e.pointerId);const b=roller.getBoundingClientRect(),n=(e.clientY-b.top)/b.height;rollerStart={y:e.clientY,lastY:e.clientY,moved:false};holdTimer=setTimeout(()=>{if(!rollerStart||rollerStart.moved)return;holdDirection=Math.abs(n-.5)<.12?0:(n<.5?-1:1);if(holdDirection)frame=requestAnimationFrame(tick)},350)});
roller.addEventListener('pointermove',e=>{if(!rollerStart||!roller.hasPointerCapture(e.pointerId))return;const dy=e.clientY-rollerStart.lastY;if(Math.abs(e.clientY-rollerStart.y)>2){rollerStart.moved=true;clearTimeout(holdTimer);holdDirection=0;cancelAnimationFrame(frame);scrollBy(-dy*1.7)}rollerStart.lastY=e.clientY});
['pointerup','pointercancel','lostpointercapture'].forEach(t=>roller.addEventListener(t,stopRoll));
roller.addEventListener('keydown',e=>{if(e.key==='ArrowUp'||e.key==='ArrowDown'){e.preventDefault();scrollBy(e.key==='ArrowUp'?-24:24)}});
window.addEventListener('blur',()=>{stopRoll();last=null});document.addEventListener('visibilitychange',()=>{if(document.hidden){stopRoll();last=null}});
