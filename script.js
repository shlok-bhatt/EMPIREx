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
const cropMap={
 customer:{x:126,y:99,w:187,h:324,label:"Customer"},
 action:{x:325,y:99,w:187,h:324,label:"Action"},
 event:{x:523,y:99,w:187,h:324,label:"Event"},
 ability:{x:721,y:99,w:187,h:324,label:"Ability"},
 "secret-goal":{x:919,y:99,w:187,h:324,label:"Secret Goal"},
 business:{x:1118,y:99,w:187,h:324,label:"Business"}
};
const imgs=[...document.querySelectorAll("[data-card-sheet-image]")];
const canvases=[...document.querySelectorAll("canvas[data-card-crop]")];
const noteNodes=[...document.querySelectorAll("[data-image-load-note]")];
function displayError(error){
 console.error("EMPIREx card image could not be displayed:",error);
 imgs.forEach(img=>img.classList.add("image-load-error"));
 canvases.forEach(canvas=>{canvas.classList.add("image-load-error");const fallback=document.createElement("span");fallback.className="canvas-fallback";fallback.textContent="Card preview unavailable in this browser.";canvas.parentNode.appendChild(fallback);});
 noteNodes.forEach(note=>{note.hidden=false;note.textContent="The card image could not be loaded. Refresh the page or try a browser that supports AVIF images.";});
}
async function loadCardSheet(){
 const paths=Array.from({length:6},(_,i)=>"assets/card-sheet-parts/part-"+String(i+1).padStart(2,"0")+".txt?v=20261120");
 const parts=await Promise.all(paths.map(async path=>{
   const response=await fetch(path,{cache:"force-cache"});
   if(!response.ok)throw new Error("Image data request failed: "+path+" ("+response.status+")");
   return response.text();
 }));
 const base64=parts.join("").replace(/\s/g,"");
 if(!base64||base64.length%4!==0)throw new Error("The product image data is incomplete.");
 const binary=atob(base64);
 const bytes=new Uint8Array(binary.length);
 for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
 if(!(bytes[4]===0x66&&bytes[5]===0x74&&bytes[6]===0x79&&bytes[7]===0x70))throw new Error("The product image format is unexpected.");
 const url=URL.createObjectURL(new Blob([bytes],{type:"image/avif"}));
 const source=new Image();
 await new Promise((resolve,reject)=>{source.onload=resolve;source.onerror=()=>reject(new Error("This browser could not decode the AVIF image."));source.src=url;});
 if(!source.naturalWidth||!source.naturalHeight)throw new Error("The product image has no usable dimensions.");
 imgs.forEach(img=>{img.src=url;img.width=source.naturalWidth;img.height=source.naturalHeight;img.classList.remove("image-load-error");});
 noteNodes.forEach(note=>{note.hidden=true;});
 canvases.forEach(canvas=>{
   const crop=cropMap[canvas.dataset.cardCrop];
   if(!crop)return;
   const ctx=canvas.getContext("2d");
   if(!ctx)return;
   const sx=source.naturalWidth/1627,sy=source.naturalHeight/915;
   ctx.clearRect(0,0,canvas.width,canvas.height);
   ctx.drawImage(source,crop.x*sx,crop.y*sy,crop.w*sx,crop.h*sy,0,0,canvas.width,canvas.height);
   canvas.setAttribute("aria-label",crop.label+" card preview cropped from the original EMPIREx card sheet.");
 });
}
if(imgs.length||canvases.length)loadCardSheet().catch(displayError);
})();