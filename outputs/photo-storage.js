'use strict';
// Per-tab progress; photos remain local in IndexedDB instead of overloading sessionStorage.
(function(root){
 const KEY='mapa-do-amor:session:v1',MAX_AGE=24*60*60*1000;
 let database;
 function save(state){try{root.sessionStorage.setItem(KEY,JSON.stringify({version:1,savedAt:Date.now(),...state}));return true;}catch{return false;}}
 function clear(){try{root.sessionStorage.removeItem(KEY);}catch{}}
 function load(){try{const s=JSON.parse(root.sessionStorage.getItem(KEY));if(!s||s.version!==1||!Number.isFinite(s.savedAt)||Date.now()-s.savedAt>MAX_AGE||s.savedAt>Date.now()+60000){clear();return null;}return s;}catch{clear();return null;}}
 function db(){if(!database)database=new Promise((resolve,reject)=>{const req=root.indexedDB.open('mapa-do-amor-local',1);req.onupgradeneeded=()=>req.result.createObjectStore('photos',{keyPath:'id'});req.onsuccess=()=>{const connection=req.result;connection.onversionchange=()=>{connection.close();database=null;};resolve(connection);};req.onerror=()=>reject(req.error);req.onblocked=()=>reject(new Error('Photo storage blocked'));}).catch(error=>{database=null;throw error;});return database;}
 async function putPhoto(id,blob){try{const bytes=await blob.arrayBuffer();const connection=await db();await new Promise((resolve,reject)=>{const tx=connection.transaction('photos','readwrite');tx.objectStore('photos').put({id,bytes,type:blob.type,savedAt:Date.now()});tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});return true;}catch{return false;}}
 async function getPhoto(id){if(!id)return null;try{const connection=await db();return await new Promise((resolve,reject)=>{const req=connection.transaction('photos').objectStore('photos').get(id);req.onsuccess=()=>resolve(req.result&&Date.now()-req.result.savedAt<=MAX_AGE?(req.result.blob||new Blob([req.result.bytes],{type:req.result.type})):null);req.onerror=()=>reject(req.error);});}catch{return null;}}
 async function removePhoto(id){if(!id)return;try{const connection=await db();await new Promise((resolve,reject)=>{const tx=connection.transaction('photos','readwrite');tx.objectStore('photos').delete(id);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});}catch{}}
 async function cleanup(){try{const connection=await db();const tx=connection.transaction('photos','readwrite'),req=tx.objectStore('photos').openCursor();req.onsuccess=()=>{const cursor=req.result;if(!cursor)return;if(Date.now()-cursor.value.savedAt>MAX_AGE)cursor.delete();cursor.continue();};}catch{}}
 // A stalled IndexedDB request must never freeze navigation or a submit button.
 function bounded(operation, fallback){return (...args)=>new Promise(resolve=>{let settled=false;const timer=setTimeout(()=>{settled=true;resolve(fallback);},8000);Promise.resolve().then(()=>operation(...args)).then(value=>{if(settled)return;clearTimeout(timer);settled=true;resolve(value);},()=>{if(settled)return;clearTimeout(timer);settled=true;resolve(fallback);});});}
 const api={save,load,clear,putPhoto:bounded(putPhoto,false),getPhoto:bounded(getPhoto,null),removePhoto:bounded(removePhoto,undefined),cleanup:bounded(cleanup,undefined)};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MAPA_SESSION=api;
})(typeof window!=='undefined'?window:globalThis);
