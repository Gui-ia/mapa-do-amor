'use strict';
// One fixed availability window; reloading never creates new places or extends it.
(function(root){
 function getOfferState(offer,basePrice,express,now=Date.now()){
  const deadline=Date.parse(offer.availability.expiresAt);
  const seconds=Math.max(0,Math.ceil((deadline-now)/1000));
  const expired=!Number.isFinite(deadline)||seconds===0||offer.availability.slots<=0;
  const totalCents=Math.round(basePrice*100)+(express?Math.round(offer.expressPrice*100):0);
  const pad=n=>String(n).padStart(2,'0');
  return {expired,seconds,total:totalCents/100,clock:Number.isFinite(seconds)?[Math.floor(seconds/3600),Math.floor(seconds/60)%60,seconds%60].map(pad).join(':'):'00:00:00'};
 }
 function getReferenceState(offer,basePrice,express){
  const prices=offer.referencePrices,keys=['packageMap','packagePdf','packageAudio'];
  if(!prices||!keys.every(k=>Number.isFinite(prices[k])&&prices[k]>=0))return null;
  const baseCents=Math.round(basePrice*100),referenceCents=keys.reduce((sum,k)=>sum+Math.round(prices[k]*100),0);
  if(referenceCents<=baseCents)return null;
  return {base:referenceCents/100,total:(referenceCents+(express?Math.round(offer.expressPrice*100):0))/100,savings:(referenceCents-baseCents)/100};
 }
 if(typeof module!=='undefined'&&module.exports)module.exports={getOfferState,getReferenceState};else root.MAPA_OFFER={getOfferState,getReferenceState};
})(typeof window!=='undefined'?window:globalThis);
