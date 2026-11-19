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
  const imageParts = Array.from({length:6}, (_, i) => "assets/card-sheet-parts/part-" + String(i+1).padStart(2,"0") + ".txt");
  const images = document.querySelectorAll("img[data-card-sheet-image]");
  if (images.length) {
    Promise.all(imageParts.map(path => fetch(path).then(response => {
      if (!response.ok) throw new Error("Image part unavailable: " + path);
      return response.text();
    }))).then(parts => {
      const binary = atob(parts.join("").replace(/\s/g,""));
      const bytes = new Uint8Array(binary.length);
      for (let i=0; i<binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const imageUrl = URL.createObjectURL(new Blob([bytes], {type:"image/avif"}));
      images.forEach(image => { image.src = imageUrl; });
    }).catch(error => {
      console.error("EMPIREx card showcase could not be loaded.", error);
      images.forEach(image => image.classList.add("image-load-error"));
    });
  }
})();