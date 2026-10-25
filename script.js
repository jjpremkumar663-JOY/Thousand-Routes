const defaultLoads = [
  {id:1,from:"Bengaluru",to:"Chennai",capacity:6,vehicle:"10-ton truck",date:"2026-10-26",price:12500,owner:"Kumar Logistics",goods:"Packaged goods",type:"truck"},
  {id:2,from:"Coimbatore",to:"Chennai",capacity:4,vehicle:"Mini truck",date:"2026-10-27",price:7800,owner:"Westline Transport",goods:"Textile boxes",type:"truck"},
  {id:3,from:"Hyderabad",to:"Bengaluru",capacity:8,vehicle:"12-ton truck",date:"2026-10-26",price:14500,owner:"Deccan Cargo",goods:"General cargo",type:"truck"},
  {id:4,from:"Pune",to:"Chennai",capacity:12,vehicle:"Container truck",date:"2026-10-28",price:22000,owner:"Routeway Movers",goods:"Industrial supplies",type:"truck"},
  {id:5,from:"Bengaluru",to:"Chennai",capacity:3,vehicle:"Light commercial vehicle",date:"2026-10-26",price:6900,owner:"Sri Sai Transports",goods:"Retail cartons",type:"truck"},
  {id:6,from:"Coimbatore",to:"Bengaluru",capacity:5,vehicle:"Medium truck",date:"2026-10-29",price:9900,owner:"Kongu Freight",goods:"Machine parts",type:"truck"}
];
let loads = [...defaultLoads];
let nextId = 7;
const $ = id => document.getElementById(id);
const grid = $("loadsGrid");
const money = n => "₹" + Number(n).toLocaleString("en-IN");
function formatDate(date){ if(!date) return "Date flexible"; return new Date(date+"T00:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"short"}); }
function renderLoads(items=loads){
  grid.innerHTML = "";
  if(!items.length){grid.innerHTML='<div class="empty-state">No exact matches yet. Try changing your filters or post a shipment.</div>';return;}
  items.forEach(load=>{
    const card=document.createElement("article"); card.className="load-card";
    card.innerHTML=`<div class="load-top"><div class="vehicle-icon">▰</div><span class="available-pill">Return trip</span></div>
      <div class="route-pair"><div class="city-block"><small>PICKUP</small><strong>${escapeHtml(load.from)}</strong></div><span class="route-arrow">→</span><div class="city-block"><small>DELIVERY</small><strong>${escapeHtml(load.to)}</strong></div></div>
      <div class="load-meta"><span>Capacity: ${load.capacity} tonnes</span><span>${escapeHtml(load.vehicle||"Goods truck")}</span><span>${formatDate(load.date)}</span></div>
      <div class="load-bottom"><div><strong>${money(load.price||0)}</strong><small>Indicative trip price</small></div><button class="book-btn" data-book="${load.id}">Request booking</button></div>`;
    grid.appendChild(card);
  });
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function showToast(message){const t=$("toast");t.textContent=message;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2800);}
function openModal(type="shipment"){
  $("listingType").value=type;
  const truck=type==="truck";
  $("modalTitle").textContent=truck?"List a return trip":"Post a shipment";
  $("modalIntro").textContent=truck?"Tell customers about your available truck and return route.":"Tell us where your goods need to go.";
  $("goodsType").previousElementSibling.textContent=truck?"Truck type / goods accepted":"Goods type";
  $("cargoWeight").previousElementSibling.textContent=truck?"Available capacity (tonnes)":"Cargo weight (tonnes)";
  $("listingForm").reset(); $("listingType").value=type; $("formMessage").textContent="";
  const today=new Date(); const localDate=new Date(today.getTime()-today.getTimezoneOffset()*60000).toISOString().slice(0,10); $("tripDate").value=localDate;
  $("modalBackdrop").classList.add("open"); $("modalBackdrop").setAttribute("aria-hidden","false");
}
function closeModal(){$("modalBackdrop").classList.remove("open");$("modalBackdrop").setAttribute("aria-hidden","true");}
$("postLoadTop").addEventListener("click",()=>openModal("shipment"));
$("postLoadHero").addEventListener("click",()=>openModal("truck"));
$("ownerFormBtn").addEventListener("click",()=>openModal("truck"));
$("customerFormBtn").addEventListener("click",()=>openModal("shipment"));
$("ctaPost").addEventListener("click",()=>openModal("shipment"));
$("closeModal").addEventListener("click",closeModal);
$("modalBackdrop").addEventListener("click",e=>{if(e.target===$("modalBackdrop"))closeModal();});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal();});
$("findLoadsBtn").addEventListener("click",()=>{document.getElementById("loads").scrollIntoView({behavior:"smooth"});});
$("applyFilters").addEventListener("click",()=>{
  const from=$("filterFrom").value,to=$("filterTo").value,capacity=Number($("filterCapacity").value);
  renderLoads(loads.filter(l=>(!from||l.from===from)&&(!to||l.to===to)&&l.capacity>=capacity));
});
$("refreshBtn").addEventListener("click",()=>{$("filterFrom").value="";$("filterTo").value="";$("filterCapacity").value="0";loads=[...defaultLoads];nextId=7;renderLoads();showToast("Demo listings have been reset.");});
grid.addEventListener("click",e=>{
  const btn=e.target.closest("[data-book]"); if(!btn)return;
  const load=loads.find(l=>l.id===Number(btn.dataset.book)); if(!load)return;
  showToast(`Booking request saved for ${load.from} → ${load.to}. Demo only.`);
  btn.textContent="Request sent";btn.disabled=true;btn.style.opacity=".65";
});
$("listingForm").addEventListener("submit",e=>{
  e.preventDefault();
  const type=$("listingType").value,from=$("pickupCity").value,to=$("destinationCity").value,weight=Number($("cargoWeight").value);
  if(from===to){$("formMessage").textContent="Pickup and destination must be different cities.";return;}
  const item={id:nextId++,from,to,capacity:weight,vehicle:$("goodsType").value,date:$("tripDate").value,price:Math.round(weight*1900),owner:$("contactName").value,goods:$("details").value,type};
  loads.unshift(item);renderLoads();closeModal();
  $("filterFrom").value="";$("filterTo").value="";$("filterCapacity").value="0";
  document.getElementById("loads").scrollIntoView({behavior:"smooth"});
  showToast(type==="truck"?"Your return trip was added to the demo listings.":"Your shipment was added to the demo listings.");
});
renderLoads();
