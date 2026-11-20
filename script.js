(() => {
"use strict";
const toggle=document.getElementById("menu-toggle");
const nav=document.getElementById("primary-nav");
if(toggle&&nav){
 const close=()=>{nav.classList.remove("open");toggle.setAttribute("aria-expanded","false");toggle.setAttribute("aria-label","Open navigation");};
 toggle.addEventListener("click",()=>{const open=nav.classList.toggle("open");toggle.setAttribute("aria-expanded",String(open));toggle.setAttribute("aria-label",open?"Close navigation":"Open navigation");});
 nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",close));
 document.addEventListener("keydown",e=>{if(e.key==="Escape")close();});
 document.addEventListener("click",e=>{if(!nav.contains(e.target)&&!toggle.contains(e.target))close();});
}
// All product artwork is loaded directly from /assets; no canvas or fragment assembly is needed.
document.querySelectorAll("img[data-site-image]").forEach(img=>{
 const showFallback=()=>{
  if(img.dataset.fallbackShown==="true")return;
  img.dataset.fallbackShown="true";
  const fallback=document.createElement("p");
  fallback.className="image-fallback";
  fallback.setAttribute("role","status");
  fallback.textContent="This image could not be loaded. Check that the assets folder was uploaded without changing its file names.";
  img.insertAdjacentElement("afterend",fallback);
 };
 img.addEventListener("error",showFallback,{once:true});
 if(img.complete&&img.naturalWidth===0)showFallback();
});
})();