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
const crops={
 customer:{x:126,y:99,w:187,h:324,label:"Customer"},
 action:{x:325,y:99,w:187,h:324,label:"Action"},
 event:{x:523,y:99,w:187,h:324,label:"Event"},
 ability:{x:721,y:99,w:187,h:324,label:"Ability"},
 "secret-goal":{x:919,y:99,w:187,h:324,label:"Secret Goal"},
 business:{x:1118,y:99,w:187,h:324,label:"Business"}
};
const sheetImages=[...document.querySelectorAll("[data-card-sheet-image]")];
const canvases=[...document.querySelectorAll("canvas[data-card-crop]")];
const notes=[...document.querySelectorAll("[data-image-load-note]")];
const legacyParts=Array.from({length:6},(_,i)=>"assets/card-sheet-parts/part-"+String(i+1).padStart(2,"0")+".txt?v=20261121");
const fullResCandidates=["assets/empirex-card-showcase-4k.avif?v=20261121","assets/empirex-card-showcase-4k.png?v=20261121"];
function note(message){notes.forEach(el=>{el.hidden=false;el.textContent=message;});}
function imageFromUrl(url){return new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(new Error("Image could not be decoded: "+url));image.src=url;});}
function render(source,sourceUrl){
 if(!source.naturalWidth||!source.naturalHeight)throw new Error("The image has no usable dimensions.");
 sheetImages.forEach(img=>{img.src=sourceUrl;img.width=source.naturalWidth;img.height=source.naturalHeight;img.classList.remove("image-load-error");});
 canvases.forEach(canvas=>{
  const crop=crops[canvas.dataset.cardCrop];if(!crop)return;
  const sx=source.naturalWidth/1627,sy=source.naturalHeight/915;
  const x=Math.round(crop.x*sx),y=Math.round(crop.y*sy);
  const w=Math.round(crop.w*sx),h=Math.round(crop.h*sy);
  canvas.width=w;canvas.height=h;
  const ctx=canvas.getContext("2d");
  if(!ctx){canvas.hidden=true;const fallback=document.createElement("p");fallback.className="canvas-fallback";fallback.textContent=crop.label+" preview is not supported by this browser.";canvas.parentNode.appendChild(fallback);return;}
  ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality="high";
  ctx.drawImage(source,x,y,w,h,0,0,w,h);
  canvas.setAttribute("aria-label",crop.label+" card preview from the original EMPIREx artwork.");
  canvas.classList.remove("image-load-error");
 });
 notes.forEach(el=>{el.hidden=true;});
}
async function loadLegacy(){
 const parts=await Promise.all(legacyParts.map(async path=>{
  const response=await fetch(path,{cache:"no-cache"});
  if(!response.ok)throw new Error("Image fragment request failed ("+response.status+"): "+path);
  return response.text();
 }));
 const base64=parts.join("").replace(/\s/g,"");
 if(!base64||base64.length%4!==0)throw new Error("The legacy image data is incomplete.");
 const binary=atob(base64),bytes=new Uint8Array(binary.length);
 for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
 const blobUrl=URL.createObjectURL(new Blob([bytes],{type:"image/avif"}));
 const source=await imageFromUrl(blobUrl);
 render(source,blobUrl);
}
async function loadImages(){
 let highResolutionError;
 for(const path of fullResCandidates){
  try{const source=await imageFromUrl(path);render(source,path);return;}
  catch(error){highResolutionError=error;}
 }
 try{await loadLegacy();}
 catch(error){
  console.error("EMPIREx image loading failed:",highResolutionError,error);
  sheetImages.forEach(img=>{img.classList.add("image-load-error");const fallback=document.createElement("div");fallback.className="image-sheet-fallback";fallback.textContent="The card artwork could not be loaded. Please refresh the page.";img.insertAdjacentElement("afterend",fallback);});
  canvases.forEach(canvas=>{canvas.hidden=true;const fallback=document.createElement("p");fallback.className="canvas-fallback";fallback.textContent="Card preview unavailable. Please refresh the page.";canvas.parentNode.appendChild(fallback);});
  note("Card previews are temporarily unavailable. Please refresh the page.");
 }
}
if(sheetImages.length||canvases.length)loadImages();
})();