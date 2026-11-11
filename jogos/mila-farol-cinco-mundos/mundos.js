'use strict';

const object=(label,value,icon='number')=>({label,value,icon});
const n=(value,icon)=>object(String(value),value,icon);
const money=(value)=>object(value>=100?'R$ '+value/100:value+' ¢',value,'coin');
const stations={
  numeros:[
    {id:'motor-decimal',title:'O motor das centenas',area:'Oficina do cais',kind:'slots',rule:'exact',target:[200,40,3],
      order:['Centenas','Dezenas','Unidades'],objects:[n(100,'base'),n(40,'base'),n(200,'base'),n(3,'base'),n(7,'base'),n(30,'base')],
      task:'Missão da oficina: monte 243 nos três encaixes do motor.',
      clue:'243 tem centenas, dezenas e unidades. O primeiro encaixe recebe o valor das centenas.',
      help:'Leve 200 às centenas, 40 às dezenas e 3 às unidades.',
      win:'200 + 40 + 3 = 243. O motor abriu o portão da oficina!'},
    {id:'ponte-grupos',title:'As quatro partes da ponte',area:'Pátio das engrenagens',kind:'slots',rule:'groups',target:24,
      order:['Trecho A','Trecho B','Trecho C','Trecho D'],objects:[n(4,'dots'),n(6,'dots'),n(6,'dots'),n(7,'dots'),n(6,'dots'),n(6,'dots')],
      task:'Monte quatro trechos iguais usando 24 rebites ao todo.',
      clue:'Cada bandeja é um grupo. Conte os pontos e procure quatro bandejas iguais.',
      help:'Quatro grupos de 6 rebites somam 24. Leve uma bandeja de 6 a cada trecho.',
      win:'6 + 6 + 6 + 6 = 24. As engrenagens montaram a ponte!'},
    {id:'carga-com-resto',title:'Carga do elevador',area:'Torre de içamento',kind:'bins',rule:'division',total:26,order:['Equipe A','Equipe B','Equipe C','Equipe D','Sobra'],
      task:'Reparta 26 peças entre quatro equipes. Deixe as sobras na caixa.',
      clue:'Ande entre as equipes e distribua uma peça a cada uma por rodada. Q ou Devolver retira uma peça.',
      help:'Quatro grupos de 6 usam 24 peças. Ponha 2 na caixa de sobras.',
      win:'26 peças: 6 para cada equipe e 2 na caixa. O elevador está ligado!'}
  ],
  padroes:[
    {id:'brotos',title:'Os brotos em sequência',area:'Bosque das sementes',kind:'slots',rule:'exact',target:[12,18],order:['3º broto','5º broto'],
      objects:[n(11),n(12),n(18),n(20),n(16)],sequence:[6,9,null,15,null,21],
      task:'Observe os brotos e encaixe as duas peças que faltam.',
      clue:'Compare 6 e 9. A cada broto, a sequência aumenta sempre pela mesma quantidade.',
      help:'Some 3 a cada passo. Entre 9 e 15 vem 12. Entre 15 e 21 vem 18.',
      win:'Os brotos crescem de 3 em 3. O tronco abriu a passagem!'},
    {id:'igualdade',title:'As duas seivas',area:'Caverna da cachoeira',kind:'slots',rule:'equal',target:12,order:['Canal A','Canal B'],
      objects:[object('7 + 5',12),object('15 − 3',12),object('9 + 3',12),object('8 + 3',11),object('18 − 5',13)],
      task:'Faça os dois canais receberem 12 com dois cálculos diferentes.',
      clue:'Some para juntar ou subtraia para retirar. Compare os resultados de duas peças.',
      help:'7 + 5, 15 − 3 e 9 + 3 chegam a 12. Use duas dessas peças.',
      win:'Dois cálculos diferentes deram a mesma quantidade. As raízes formaram uma ponte!'},
    {id:'decrescente',title:'A escada das folhas',area:'Copas da floresta',kind:'slots',rule:'exact',target:[28,20,16],order:['2ª folha','4ª folha','5ª folha'],
      objects:[n(16),n(22),n(20),n(24),n(28),n(18)],sequence:[32,null,24,null,null,12],
      task:'Preencha as três folhas apagadas para acordar a árvore.',
      clue:'A sequência diminui. De 32 a 24 há dois passos iguais.',
      help:'Retire 4 a cada passo. As folhas que faltam são 28, 20 e 16.',
      win:'A árvore contou de 4 em 4 para trás e fez subir o cesto!'}
  ],
  formas:[
    {id:'solidos',title:'As estátuas do templo',area:'Jardim de pedra',kind:'slots',rule:'exact',target:['cylinder','cone','cube'],order:['Tambor','Chapéu','Dado'],
      objects:[object('Cubo','cube','solid'),object('Cone','cone','solid'),object('Cilindro','cylinder','solid'),object('Esfera','sphere','solid')],
      task:'Leve a cada estátua o sólido com a forma do objeto entalhado.',
      clue:'O tambor tem duas bases circulares. O chapéu tem uma ponta. O dado tem faces quadradas.',
      help:'Tambor: cilindro. Chapéu: cone. Dado: cubo.',
      win:'Cada sólido encontrou seu objeto. As estátuas abriram o templo!'},
    {id:'planificacoes',title:'A oficina de dobraduras',area:'Corredor dos cristais',kind:'slots',rule:'exact',target:['cube','cylinder'],order:['Cubo','Cilindro'],
      objects:[object('Seis quadrados','cube','net'),object('Retângulo e círculos','cylinder','net'),object('Quadrado e triângulos','pyramid','net')],
      task:'Leve ao cubo e ao cilindro as peças abertas que poderiam formar suas superfícies.',
      clue:'Procure faces quadradas no cubo. O lado do cilindro aberto vira um retângulo.',
      help:'O cubo usa seis quadrados. O cilindro usa um retângulo e dois círculos.',
      win:'As dobraduras se fecharam e formaram o caminho de pedra!'},
    {id:'sobreposicao',title:'O selo das formas iguais',area:'Torre dos encaixes',kind:'slots',rule:'exact',target:['triA','rectA'],order:['Triângulo','Retângulo'],
      objects:[object('Triângulo estreito','triB','outline'),object('Triângulo girado','triA','outline'),object('Retângulo largo','rectB','outline'),object('Retângulo girado','rectA','outline')],
      task:'Compare as peças com as silhuetas dos dois selos. Elas podem estar giradas.',
      clue:'Ao encaixar uma peça, observe o contorno. Se ela cobrir o desenho exatamente, tem a mesma forma e tamanho.',
      help:'Procure o triângulo de base larga e o retângulo mais estreito. A rotação não muda o tamanho.',
      win:'As peças cobriram os selos exatamente. A torre girou e liberou o elevador!'}
  ],
  medidas:[
    {id:'carpintaria',title:'Madeira na medida',area:'Carpintaria do mercado',kind:'slots',rule:'sum',target:7,order:['Tábua A','Tábua B'],
      objects:[object('2 m',2,'plank'),object('3 m',3,'plank'),object('4 m',4,'plank'),object('5 m',5,'plank'),object('1 m',1,'plank')],
      task:'Use duas tábuas para cobrir os 7 metros da régua da oficina.',
      clue:'Veja quantos metros a primeira tábua cobre. A segunda precisa completar o espaço.',
      help:'2 m com 5 m funciona. 3 m com 4 m também.',
      win:'As tábuas cobriram a régua sem sobrar. A serraria abriu!'},
    {id:'relogio',title:'A hora do moinho',area:'Canais do moinho',kind:'slots',rule:'exact',target:[14,35,25],order:['Hora','Minuto','Duração'],
      objects:[n(14),n(15),n(35),n(25),n(60),n(10)],clock:{hour:14,minute:10,end:'14:35'},
      task:'Leia o relógio do início. Programe o fim às 14:35 e registre quantos minutos o moinho gira.',
      clue:'As duas horas estão na faixa das 14 horas. Compare os minutos nos dois relógios.',
      help:'Registre 14 horas e 35 minutos no fim. De 10 até 35 passam 25 minutos.',
      win:'14:10 até 14:35 são 25 minutos. A comporta abriu o caminho!'},
    {id:'pagamento',title:'O guincho do mercado',area:'Entreposto das medidas',kind:'cash',rule:'cash',target:750,order:['R$ 5','R$ 2','R$ 1','50 ¢'],
      denominations:[500,200,100,50],stock:[1,3,7,5],
      task:'Pague exatamente R$ 7,50 com as cédulas e moedas do mercado.',
      clue:'Cada guichê acrescenta uma cédula ou moeda. Confira o total e use Q ou Devolver para tirar uma.',
      help:'R$ 5 + R$ 2 + 50 centavos é uma forma. Três notas de R$ 2, uma moeda de R$ 1 e 50 centavos também.',
      win:'O pagamento ficou exato. O guincho levou a carga até o farol!'}
  ],
  possibilidades:[
    {id:'urna',title:'As esferas da cúpula',area:'Pátio dos telescópios',kind:'slots',rule:'exact',target:['azul','rosa','ouro'],order:['Mais comum','No meio','Mais rara'],
      objects:[object('Rosa','rosa','orb'),object('Ouro','ouro','orb'),object('Azul','azul','orb'),object('Verde','verde','orb')],urn:[['Azul',5],['Rosa',3],['Ouro',1]],
      task:'Na urna, todas as esferas têm o mesmo tamanho. Ordene as cores que podem sair pela chance.',
      clue:'Veja as cores que estão na urna e conte cada grupo. Uma cor ausente não pode sair.',
      help:'Há 5 azuis, 3 rosas e 1 dourada. A azul tem maior chance e a dourada, menor.',
      win:'As chances foram ordenadas. A cúpula girou e abriu a escadaria!'},
    {id:'grafico',title:'O mapa de energia',area:'Galeria dos instrumentos',kind:'slots',rule:'exact',target:[6,3,4],order:['Ilha','Bosque','Vale'],
      objects:[n(3),n(4),n(5),n(6),n(2),n(7)],chart:[['Ilha',6],['Bosque',3],['Vale',4]],
      task:'Leia a altura das barras e leve a cada canal a quantidade indicada.',
      clue:'As linhas do gráfico valem uma unidade cada. A barra mais alta é a da Ilha.',
      help:'Ilha: 6. Bosque: 3. Vale: 4. O Bosque tem a menor frequência de sinais.',
      win:'As leituras bateram com o gráfico. A passarela celeste se encaixou!'},
    {id:'registro',title:'Registro da noite',area:'Mirante do farol',kind:'bins',rule:'frequencies',total:10,target:[4,3,3],order:['Azul','Rosa','Ouro'],
      log:['Azul','Rosa','Azul','Ouro','Rosa','Ouro','Azul','Ouro','Rosa','Azul'],
      task:'Conte os dez sinais anotados e construa o gráfico de colunas para acender o telescópio.',
      clue:'Conte primeiro todos os sinais de uma cor. Cada peça acrescentada levanta a coluna um nível.',
      help:'Foram 4 azuis, 3 rosas e 3 dourados. Rosa e ouro têm a mesma frequência.',
      win:'O gráfico ficou igual ao registro. O telescópio encontrou a última lente!'}
  ]
};

const Worlds=[
  {id:'numeros',name:'A Ilha dos Números',short:'Números',color:'#e8aa63',ground:580,material:'brass',icon:'✦',theme:['#233d51','#467f86','#a36f53']},
  {id:'padroes',name:'A Floresta dos Padrões',short:'Padrões',color:'#acd492',ground:690,material:'wood',icon:'❧',theme:['#163d40','#50856d','#688461']},
  {id:'formas',name:'O Labirinto das Formas',short:'Formas',color:'#ebadcc',ground:615,material:'stone',icon:'◇',theme:['#3f3552','#916884','#b48483']},
  {id:'medidas',name:'O Vale das Medidas',short:'Medidas',color:'#f5d783',ground:585,material:'mill',icon:'⌛',theme:['#294657','#799384','#c19265']},
  {id:'possibilidades',name:'O Observatório das Possibilidades',short:'Possibilidades',color:'#b6c4ff',ground:680,material:'star',icon:'✧',theme:['#293251','#626b9a','#807ca2']}
];

const tile=(x,y,w,h=26,style='ledge',options={})=>({x,y,w,h,style,oneWay:style!=='ground'&&style!=='gate',...options});
const HUB={id:'farol',name:'Farol dos Cinco Mundos',ground:600,width:2000,height:820,material:'brass',
  color:'#ffdc91',theme:['#153445','#5a8992','#af8360'],portals:[360,635,910,1185,1460],beacon:1755};
const racks=[
  [[185,0],[249,0],[313,0],[230,-104],[294,-104],[358,-104]],
  [[933,0],[995,0],[1057,0],[944,-104],[1006,-104],[1068,-104]],
  [[1760,0],[1822,0],[1884,0],[1782,-104],[1844,-104],[1906,-104]]
];
const sockets=[465,1135,1936];

function buildWorld(index){
  const world=Worlds[index];
  const y=world.ground;
  const stage=stations[world.id].map((definition,i)=>({
    ...definition,x:sockets[i],y,step:i,
    objects:definition.objects?.map((value,j)=>{
      const [x,offset]=definition.id==='motor-decimal'&&j===3?[377,0]:racks[i][j];
      return {...value,id:j,x,y:y+offset};
    }),
    fixtures:definition.order.map((label,j)=>({label,x:sockets[i]+j*(definition.kind==='slots'?71:76),y,index:j}))
  }));
  const upper=index%2?294:270;
  const right=1722;
  const liftHeight=upper-20;
  const upperRoutes=[
    [tile(415,y-176,130),tile(566,y-226,105,20,'lift',{id:'trilho',moving:true,axis:'x',range:92,period:3.8})],
    [tile(431,y-178,132),tile(590,y-248,110),tile(1148,y-180,160)],
    [tile(425,y-182,114),tile(566,y-264,126),tile(1220,y-188,130)],
    [tile(418,y-173,145),tile(597,y-242,124),tile(2000,y-179,143)],
    [tile(436,y-180,119),tile(587,y-269,125),tile(1166,y-177,158)]
  ][index];
  const tiles=[
    tile(0,y,1410,178,'ground'),tile(right,y,768,178,'ground'),
    tile(200,y-104,190,24),tile(938,y-104,170,24),tile(1775,y-104,160,24),
    tile(60,y-204,123,22),tile(151,y-290,101,21),
    tile(2520,y-upper,290,31),
    tile(804,y-490,36,490,'gate',{until:0}),
    tile(1408,y-490,32,490,'gate',{until:1}),
    tile(2345,y-490,35,490,'gate',{until:2}),
    tile(1408,y,right-1405,29,'bridge',{need:1}),
    tile(2390,y-8,106,21,'lift',{need:2,id:'lens-lift',moving:true,range:liftHeight,period:5.4}),
    ...upperRoutes
  ];
  const secrets=[{x:205,y:y-328},{x:640,y:y-286},{x:613,y:y-302},{x:649,y:y-280},{x:638,y:y-307}];
  return {...world,width:2810,height:y+320,stage,tiles,upper,
    ladder:{x:[150,114,164,141,132][index],y:y-204,h:204},secret:secrets[index],checkpoints:[{x:866,y,need:0},{x:1750,y,need:1}],
    crate:{x:45,y:y-48,w:52,h:48},lens:{x:2660,y:y-upper},
    sections:[{x:0,style:'exterior'},{x:833,style:index===1?'caverna':index===2?'templo':'oficina'},{x:1722,style:'torre'}]};
}

