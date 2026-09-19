const fs=require('fs'),vm=require('vm'),assert=require('assert');
const html=fs.readFileSync('outputs/preview-quiz-herzlinien.html','utf8');
const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
const elements=new Map();function el(id){if(!elements.has(id))elements.set(id,{innerHTML:'',textContent:'',value:'',querySelector(){return null},addEventListener(){},setAttribute(){}});return elements.get(id)}
const sandbox={document:{getElementById:el,querySelectorAll:()=>[],body:{classList:{toggle:()=>true}}},window:{scrollTo(){}},setTimeout:()=>1,clearTimeout(){},Intl,URL,Image:class{}};
vm.createContext(sandbox);vm.runInContext(script,sandbox);
assert(el('app').innerHTML.includes('Welche Liebe passt'));
for(const branch of ['connection','closure','new']){
 vm.runInContext(`answers={goal:'${branch}',context:D.questions[1].branches['${branch}'][0][0],tension:'chosen',wish:'mutual',pattern:'giving',name:'<Lena>',hand:'right'};`,sandbox);
 for(let s=0;s<=11;s++){vm.runInContext(`step=${s};render()`,sandbox);assert(el('app').innerHTML.length>100)}
 vm.runInContext('step=9;render()',sandbox);assert(el('app').innerHTML.includes('&lt;Lena&gt;'));assert(!el('app').innerHTML.includes('<Lena>'));
 vm.runInContext('step=10;express=false;render()',sandbox);assert(el('app').innerHTML.includes('34,90'));
 vm.runInContext('express=true;render()',sandbox);assert(el('app').innerHTML.includes('43,90'));
}
assert(!/fetch\(|XMLHttpRequest|localStorage/.test(script));
console.log('OK: três ramos e 12 telas; preços; proteção do nome; dados locais.');
