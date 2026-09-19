const fs=require('fs'),vm=require('vm'),assert=require('assert');
const html=fs.readFileSync('outputs/preview-quiz-herzlinien.html','utf8');
const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
const elements=new Map();function el(id){if(!elements.has(id))elements.set(id,{innerHTML:'',textContent:'',value:'',addEventListener(){},setAttribute(){}});return elements.get(id)}
const sandbox={document:{getElementById:el,querySelectorAll:()=>[],body:{classList:{toggle:()=>true}}},window:{scrollTo(){}},setTimeout:()=>1,clearTimeout(){},Intl,URL,Image:class{}};
vm.createContext(sandbox);vm.runInContext(script,sandbox);
assert(el('app').innerHTML.includes('Welche Geschichte'));
for(const branch of ['connection','closure','new']){
 vm.runInContext(`answers={goal:'${branch}',context:D.questions[1].branches['${branch}'][0][0],tension:'chosen',wish:'mutual',style:'simple',name:'<Lena>',hand:'right'};`,sandbox);
 for(let s=0;s<=12;s++){vm.runInContext(`step=${s};render()`,sandbox);assert(el('app').innerHTML.length>100)}
 vm.runInContext('step=9;render()',sandbox);assert(el('app').innerHTML.includes('&lt;Lena&gt;'));assert(!el('app').innerHTML.includes('<Lena>'));
 vm.runInContext('step=10;express=false;render()',sandbox);assert(el('app').innerHTML.includes('34,90'));
 vm.runInContext('express=true;render()',sandbox);assert(el('app').innerHTML.includes('43,90'));
}
assert(!/fetch\(|XMLHttpRequest|localStorage/.test(script));
console.log('OK: renderização dos três ramos em todas as telas; totais padrão/expresso; escape do nome; sem envio ou armazenamento persistente. Teste estrutural, não visual.');
