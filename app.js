'use strict';
const $ = s => document.querySelector(s);
const icons = {
 mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>',
 chat:'<path d="M20 15a8.5 8.5 0 1 0-15 2l-1 4 4.5-1.4A8.5 8.5 0 0 0 20 15Z"/><path d="M8 8c.5 4 3.4 7.2 7.5 7.6l1.2-2.1-2.6-1.2-1.1 1c-1.4-.7-2.4-1.7-3-3l.8-1.1L9.6 7.4Z"/>',
 bars:'<path d="M4 20h16M6 16V9m6 7V4m6 12v-6"/>',
 reconcile:'<rect x="2" y="4" width="19" height="14" rx="2"/><path d="M3 8h17m-10 5H6m7 4 3 3 6-7"/>',
 invoice:'<path d="M5 3h14v18l-3-2-4 2-4-2-3 2V3Zm3 5h8m-8 4h6"/>'};
document.querySelectorAll('[data-icon]').forEach(el=>{el.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+icons[el.dataset.icon]+'</svg>'});
const months=[
 [[3200,4150,4900,3650],[2100,3600,2700,2300]],
 [[3900,4370,4020,5140],[2600,3100,2850,3200]],
 [[3300,5040,4480,5600],[2400,3420,3060,3980]]
];
const questions=['What came in?','What went out?','What was left this month?'];
const money=new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP',maximumFractionDigits:0});
const chart=$('#chart');
chart.innerHTML='<div class="chartcols">'+('<div class="pair"><i></i><i></i></div>').repeat(4)+'</div><div class="weeks"><span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span></div>';
let running=!matchMedia('(prefers-reduced-motion: reduce)').matches;
let timer;
function refresh(){
 const idx=$('#month').selectedIndex;
 const [incoming,outgoing]=months[idx];
 const sum=values=>values.reduce((total,n)=>total+n,0);
 $('#income').textContent=money.format(sum(incoming));
 $('#spend').textContent=money.format(sum(outgoing));
 $('#net').textContent='+'+money.format(sum(incoming)-sum(outgoing));
 $('#question').textContent=questions[idx];
 $('#rotateline').textContent=questions[idx];
 const rows=[];
 document.querySelectorAll('.pair').forEach((pair,j)=>{
  pair.children[0].style.height=(incoming[j]/6000*100)+'%';
  pair.children[1].style.height=(outgoing[j]/6000*100)+'%';
  const row='Week '+(j+1)+': '+money.format(incoming[j])+' in, '+money.format(outgoing[j])+' out';
  pair.title=row;rows.push(row);
 });
 chart.setAttribute('aria-label',rows.join('. '));
}
function setMotion(value){
 running=value;clearInterval(timer);
 if(running)timer=setInterval(()=>{if(!document.hidden && !$('#enquiry').open && document.activeElement!==$('#month')){$('#month').selectedIndex=($('#month').selectedIndex+1)%months.length;refresh()}},6500);
}
$('#month').onchange=()=>{setMotion(false);refresh()};
refresh();setMotion(running);
const emailAddress='munawar.hayat@mhaccountant.co.uk',phone='447418352441';
function contactLinks(topic,body){
 return {email:'mailto:'+emailAddress+'?subject='+encodeURIComponent('Enquiry · '+topic)+'&body='+encodeURIComponent(body),wa:'https://wa.me/'+phone+'?text='+encodeURIComponent(body)};
}
const direct=contactLinks('Bookkeeping','Hi Munawar, I’d like to discuss bookkeeping for my business.');
document.querySelectorAll('[data-direct]').forEach(a=>{a.href=direct[a.dataset.direct];if(a.dataset.direct==='wa'){a.target='_blank';a.rel='noopener'}});
const dialog=$('#enquiry'), promptCard=$('#prompt'), service=$('#service'), detail=$('#detail');
function detailQuestion(){
 const options={'Custom software':'What would you like your app to help you do?','Catch-up bookkeeping':'When were your books last up to date?','Dashboards and Excel':'What would you like to track?','Hourly support':'Which tasks do you need help with?','Something else':'What do you have in mind?'};
 return options[service.value]||'Roughly how many transactions do you have each month?';
}
function updateDraft(){
 const question=detailQuestion();
 $('#detailLabel').textContent=question+' (optional)';
 const note=detail.value.trim();
 const links=contactLinks(service.value,'Hi Munawar, I’m interested in '+service.value.toLowerCase()+'.'+(note?'\n\n'+question+'\n'+note:''));
 $('#email').href=links.email;$('#wa').href=links.wa;
}
const planChoices = Array.from(document.querySelectorAll('.select-plan'));
function highlightPackage(topic) {
  if (!planChoices.some(choice => choice.dataset.plan === topic)) return;
  planChoices.forEach(choice => {
    const selected = choice.dataset.plan === topic;
    choice.closest('article').classList.toggle('featured', selected);
    choice.setAttribute('aria-pressed', String(selected));
  });
}
planChoices.forEach(choice => {
  choice.closest('article').addEventListener('click', event => {
    if (!event.target.closest('[data-inquire]')) highlightPackage(choice.dataset.plan);
  });
});
highlightPackage('Growth package');
$('#wa').target='_blank';$('#wa').rel='noopener';
function hidePrompt(){promptCard.hidden=true;try{sessionStorage.setItem('mh-invite','seen')}catch(e){}}
document.querySelectorAll('[data-inquire]').forEach(el=>el.onclick=()=>{
 hidePrompt();service.value=el.dataset.inquire||'Monthly bookkeeping';detail.value='';highlightPackage(service.value);updateDraft();dialog.showModal();
});
service.onchange=()=>{detail.value='';highlightPackage(service.value);updateDraft()};detail.oninput=updateDraft;
$('.cross').onclick=()=>dialog.close();dialog.onclick=e=>{if(e.target===dialog){const b=dialog.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)dialog.close()}};
$('form').onsubmit=e=>e.preventDefault();$('#dismiss').onclick=hidePrompt;
setTimeout(()=>{let seen=false;try{seen=!!sessionStorage.getItem('mh-invite')}catch(e){}if(!seen&&!dialog.open)promptCard.hidden=false},11000);
