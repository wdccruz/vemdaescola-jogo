'use strict';

const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const source=['mundos.js','matematica.js'].map(name=>fs.readFileSync(path.join(root,name),'utf8')).join('\n');
const {stations,MathGame}=vm.runInNewContext(source+'\n({stations,MathGame})');
const plain=value=>JSON.parse(JSON.stringify(value));
const matrix=JSON.parse(fs.readFileSync(path.join(root,'matriz-bncc.json'),'utf8'));
const implemented=new Set(matrix.desafios.map(d=>d.id));
const all=Object.values(stations).flat();
assert.equal(matrix.habilidades.length,28);
assert.equal(new Set(matrix.habilidades.map(s=>s.codigo)).size,28);
assert.equal(implemented.size,all.length);
assert.ok(all.every(s=>implemented.has(s.id)));

const solutions={
  'motor-decimal':[[200,40,3]],
  'ponte-grupos':[[6,6,6,6]],
  'carga-com-resto':[[6,6,6,6,2]],
  'brotos':[[12,18]],'igualdade':[[12,12]],'decrescente':[[28,20,16]],
  'solidos':[['cylinder','cone','cube']],'planificacoes':[['cube','cylinder']],
  'sobreposicao':[['triA','rectA']],
  'carpintaria':[[2,5],[3,4],[5,2],[4,3]],
  'relogio':[[14,35,25]],'pagamento':[[1,1,0,1],[0,3,1,1],[0,0,7,1]],
  'urna':[['azul','rosa','ouro']],'grafico':[[6,3,4]],'registro':[[4,3,3]]
};
for(const spec of all){
  for(const values of solutions[spec.id]){
    assert.equal(MathGame.evaluate(spec,values).done,true,spec.id);
    if(spec.objects){
      const unused=[...spec.objects];
      for(const value of values){
        const index=unused.findIndex(o=>o.value===value);
        assert.ok(index>=0,spec.id+' precisa ter peças físicas suficientes');
        unused.splice(index,1);
      }
    }
    const incorrect=[...values];
    incorrect[0]=typeof values[0]==='number'?values[0]+1:'inexistente';
    assert.equal(MathGame.evaluate(spec,incorrect).done,false,spec.id+' não pode aceitar montagem errada');
  }
}
const [decimal,groups,sharing]=stations.numeros;
assert.equal(MathGame.sum(decimal.target),243);
assert.equal(MathGame.sum(solutions[groups.id][0]),24);
assert.deepEqual(plain(MathGame.division(26,4)),{share:6,left:2});
assert.deepEqual(plain(MathGame.division(24,4)),{share:6,left:0});
assert.equal(MathGame.evaluate(sharing,[7,6,6,6,1]).done,false);
assert.equal(MathGame.evaluate(sharing,[5,5,5,5,6]).done,false);

const [up,eq,down]=stations.padroes;
for(const [problem,step] of [[up,3],[down,-4]]){
  const filled=[...problem.target];
  const sequence=problem.sequence.map(n=>n??filled.shift());
  assert.ok(sequence.slice(1).every((n,i)=>n-sequence[i]===step));
}
for(const item of eq.objects){
  const [a,op,b]=item.label.split(' ');
  assert.equal(op==='+'?Number(a)+Number(b):Number(a)-Number(b),item.value);
}
const [length,clock,cash]=stations.medidas;
assert.ok(solutions[length.id].every(pair=>MathGame.sum(pair)===7));
const end=clock.clock.end.split(':').map(Number);
assert.deepEqual([...end,end[0]*60+end[1]-clock.clock.hour*60-clock.clock.minute],plain(clock.target));
assert.equal(MathGame.cents([1,1,0,1],cash.denominations),750);
assert.equal(MathGame.evaluate(cash,[0,0,0,15]).done,false,'o estoque faz parte da situação');
const [urn,chart,log]=stations.possibilidades;
assert.ok(urn.urn.slice(1).every(([,n],i)=>urn.urn[i][1]>n));
assert.deepEqual(plain(chart.chart.map(entry=>entry[1])),plain(chart.target));
assert.deepEqual(plain(log.order.map(color=>log.log.filter(n=>n===color).length)),plain(log.target));
console.log('OK matemática: 15 mecanismos, soluções físicas, erros, resto, dinheiro, comprimento, relógio, padrões e gráficos.');

