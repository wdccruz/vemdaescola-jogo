'use strict';

const MathGame=(()=>{
  const sum=values=>values.reduce((total,n)=>total+n,0);
  const equal=(a,b)=>a.length===b.length&&a.every((value,i)=>value===b[i]);
  const cents=(values,denominations)=>sum(values.map((n,i)=>n*denominations[i]));
  const brl=value=>'R$ '+(value/100).toFixed(2).replace('.',',');
  const division=(total,teams)=>({share:Math.floor(total/teams),left:total%teams});

  function evaluate(spec,values){
    if(values.length!==spec.order.length)return {done:false,tip:'Confira os espaços do mecanismo.'};
    if(spec.kind==='slots'&&values.includes(null))return {done:false,tip:''};
    if(spec.kind!=='slots'&&!values.every(n=>Number.isInteger(n)&&n>=0))return {done:false,tip:'Confira a quantidade.'};
    let done=false,tip='';
    switch(spec.rule){
      case 'exact':
        done=equal(values,spec.target);
        tip='Confira os encaixes na ordem indicada. Você pode retirar uma peça e experimentar outra.';
        break;
      case 'groups':
        done=sum(values)===spec.target&&values.every(n=>n===values[0]);
        tip='Os trechos precisam ter a mesma quantidade e totalizar '+spec.target+' rebites. Sua montagem soma '+sum(values)+'.';
        break;
      case 'equal':
        done=values.every(n=>n===spec.target);
        tip='Os canais ficaram com '+values.join(' e ')+'. Os dois cálculos precisam chegar a '+spec.target+'.';
        break;
      case 'sum':
        done=sum(values)===spec.target;
        tip='As duas tábuas medem '+sum(values)+' m juntas. Compare com os '+spec.target+' m da régua.';
        break;
      case 'division': {
        const groups=values.slice(0,-1);
        const {share,left}=division(spec.total,groups.length);
        done=groups.every(n=>n===share)&&values.at(-1)===left;
        if(sum(values)===spec.total)tip='Compare as equipes: todas recebem a mesma quantidade. Só vai para a sobra o que não dá para repartir.';
        break;
      }
      case 'cash': {
        const total=cents(values,spec.denominations);
        done=total===spec.target&&values.every((n,i)=>n<=spec.stock[i]);
        if(total>spec.target)tip='O pagamento passou de '+brl(spec.target)+'. Devolva uma peça no guichê.';
        break;
      }
      case 'frequencies':
        done=equal(values,spec.target);
        if(sum(values)===spec.total)tip='O total está certo. Compare cada coluna com os sinais da mesma cor.';
        break;
    }
    return {done,tip:done?spec.win:tip};
  }
  return {sum,equal,cents,brl,division,evaluate};
})();

