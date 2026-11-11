'use strict';

const tile = (x,y,w,h=23,style='ledge') => ({x,y,w,h,style,oneWay:style !== 'ground'});
const lift = (id,x,y,w,axis,range,period,needs) =>
  ({...tile(x,y,w,17,'lift'),id,axis,range,period,needs,moving:true});
const mark = (id,x,y,kind,label,needs) => ({id,x,y,kind,label,needs});
const pickup = (id,x,y,icon,needs) => ({id,x,y,icon,needs});

const Items = {
  graphite:['Grafite dourado','Serve para desenhar a ponte apagada da vila.'],
  seed:['Semente de tinta','Pode criar raízes onde a floresta perdeu seu caminho.'],
  page:['Página esquecida','Nela está a primeira versão da história de Borrão.'],
  gear:['Engrenagem de papel','Encaixa na máquina que sustenta o primeiro elevador.'],
  stampV:['Selo da Andorinha','Encontrado no telhado mais alto da Vila de Papel.'],
  stampF:['Selo do Cogumelo','Escondido na copa, acima do caminho para Fagulha.'],
  stampT:['Selo da Lua','Guardado na varanda do relógio.']
};

const Intro = [
  ['Nina','Este livro estava atrás da estante. Na capa diz: “Cuidado. Toda história esquecida pode desaparecer.”'],
  ['Nina','As páginas estão girando! Parece que tem um mundo inteiro do outro lado.'],
  ['Dobri','Bem-vinda à Vila de Papel! Sou Dobri. Alguém está apagando nosso mundo e o seu lápis ainda consegue desenhá-lo.'],
  ['Dobri','Ande até a casa de Cora. Procure grafite dourado nas varandas e segure Desenhar junto aos riscos pontilhados.']
];

const Levels = [
  {
    name:'A Vila de Papel', short:'Vila de Papel', art:'vila', width:2190,height:820, spawn:[91,580], base:580,
    palette:['#274d59','#678e85','#ca8e76','#e4bb86','#3c575e','#21363e'],
    tiles:[
      tile(0,580,665,145,'ground'),tile(953,580,1237,145,'ground'),
      tile(174,492,156,24,'roof'),tile(41,400,133,23,'roof'),tile(351,495,143,24,'roof'),tile(466,403,130,24,'roof'),
      tile(1020,497,139,22,'roof'),tile(1570,495,130,22,'roof'),tile(1740,431,123,23,'roof'),
      {...tile(662,580,296,32,'bridge'),id:'bridge',needs:'bridge'}
    ],
    solids:[{x:1511,y:332,w:44,h:248,id:'door',until:'gate',style:'gate'}],
    crate:{x:1153,y:526,w:57,h:54}, plate:{x:1350,y:580,w:82},
    items:[pickup('stampV',105,365,'stamp'),pickup('graphite',532,365,'graphite')],
    marks:[
      mark('cora',339,580,'talk','Conversar com Cora'),
      mark('bridge',625,580,'draw','Desenhar a ponte'),
      mark('mechanism',1475,580,'talk','Examinar o portão'),
      mark('exit',2025,580,'exit','Entrar na floresta','gate')
    ],
    checkpoint:{x:1020,y:580},
    scenery:[
      [113,580,'house',1.27],[421,580,'house',1.34],[550,580,'post',1],[998,580,'willow',1.35],
      [1175,580,'house',.98],[1651,580,'house',1.22],[1841,580,'willow',1.23],[2025,580,'arch',1.13]
    ],
    quest:[
      ['graphite','Encontre o grafite dourado nas varandas.','Suba no telhado mais baixo à direita de Cora. De lá, pule para a varanda alta.'],
      ['bridge','Reconstrua a ponte sobre o rio.','Chegue perto dos riscos pontilhados da margem e segure X ou Desenhar.'],
      ['gate','Empurre a caixa sobre a placa de cobre.','Ande contra a caixa pelo lado esquerdo. Pare quando ela cobrir o centro da placa.'],
      [null,'Siga até o arco da floresta e interaja.','O arco fica depois da oficina. Agir ou E abre a próxima página.']
    ]
  },
  {
    name:'A Floresta dos Sussurros', short:'Floresta dos Sussurros', art:'floresta', width:2030,height:1030, spawn:[80,780], base:780,
    palette:['#153741','#427b71','#9e6c76','#d9b48b','#31595c','#152e3a'],
    tiles:[
      tile(0,780,851,148,'ground'),tile(1106,780,924,148,'ground'),
      tile(446,613,152),tile(613,509,167),tile(804,411,134),tile(1016,407,116),
      tile(1184,704,108),lift('firelift',1278,725,111,'y',205,4.6,'firefly'),
      tile(1401,516,176),tile(1588,619,135),tile(1739,674,143),
      {...tile(848,780,265,28,'root'),id:'vine',needs:'vine'}
    ],
    solids:[],
    crate:{x:242,y:726,w:58,h:54},
    items:[pickup('seed',695,474,'seed'),pickup('stampF',873,376,'stamp'),pickup('page',1508,480,'page','firefly')],
    marks:[
      mark('fagulha',729,780,'talk','Conversar com Fagulha'),
      mark('vine',810,780,'draw','Desenhar a raiz'),
      mark('lift',1249,780,'talk','Examinar a plataforma'),
      mark('exit',1940,780,'exit','Entrar na torre','page')
    ],
    checkpoint:{x:1158,y:780},
    scenery:[
      [148,780,'willow',1.88],[351,780,'mushroom',1.12],[670,780,'willow',2.45],[1137,780,'mushroom',1.35],
      [1380,780,'willow',2.5],[1712,780,'cave',1.04],[1940,780,'arch',1.17]
    ],
    quest:[
      ['seed','Use a caixa para subir até a semente de tinta.','Empurre a caixa para baixo da ponta esquerda do galho. Pule da caixa para o primeiro galho.'],
      ['vine','Desenhe uma raiz para Fagulha atravessar.','Volte ao chão perto da margem. Segure Desenhar junto aos riscos.'],
      ['firefly','Acompanhe Fagulha até o outro lado.','Fagulha vai atravessar sozinha quando a raiz estiver pronta. Espere por ela no outro lado.'],
      ['page','Pegue a página no galho acima do elevador.','Suba no galho baixo, embarque quando a plataforma descer e pule para a direita quando subir.'],
      [null,'Leve a página até o arco da torre.','Desça pelos galhos do lado direito e interaja com o arco.']
    ]
  },
  {
    name:'A Torre das Páginas Perdidas', short:'Torre das Páginas Perdidas', art:'torre', width:1720,height:1360, spawn:[80,1110], base:1110,
    palette:['#302740','#766184','#ad7b8d','#f1c18c','#4e3f60','#2a283f'],
    tiles:[
      tile(0,1110,722,165,'ground'),tile(960,1110,760,165,'ground'),
      tile(162,1010,126,22,'books'),tile(438,998,124,23,'books'),tile(569,940,108,23,'books'),
      lift('gearLift',695,1088,125,'y',235,4.3,'engine'),
      tile(838,864,235,27,'books'),tile(1093,762,139,24,'books'),tile(930,649,152,24,'books'),
      lift('sealLift',761,637,126,'y',230,4.4,'seal'),
      tile(902,407,227,26,'books'),tile(1311,330,345,31,'books'),
      {...tile(1118,407,199,24,'bridge'),id:'stair',needs:'stair'}
    ],
    solids:[
      {x:337,y:885,w:39,h:225,id:'panel',until:'panel',style:'wall'},
      {x:677,y:798,w:40,h:312,id:'machineGate',until:'engine',style:'gate'}
    ],
    items:[pickup('gear',418,1073,'gear','panel'),pickup('stampT',1186,724,'stamp')],
    marks:[
      mark('panel',306,1110,'draw','Desenhar a passagem'),
      mark('engine',615,1110,'draw','Completar a engrenagem'),
      mark('moon',961,864,'switch','Acionar o símbolo da Lua','engine'),
      mark('leaf',991,649,'switch','Acionar o símbolo da Folha','engine'),
      mark('clue',1042,864,'talk','Ler a inscrição','engine'),
      mark('stair',1088,407,'draw','Desenhar a última ponte','seal'),
      mark('blot',1437,330,'talk','Conversar com Borrão','stair'),
      mark('end',1554,330,'draw','Desenhar o final de Borrão','metBlot')
    ],
    checkpoint:{x:944,y:864},
    scenery:[
      [211,1110,'books',1.5],[465,1110,'books',1.3],[602,1110,'clock',1.15],[1014,1110,'books',2.25],
      [1007,864,'clock',1.09],[1136,762,'books',1.03],[983,407,'clock',1.15],[1545,330,'arch',1.45]
    ],
    quest:[
      ['panel','Descubra a passagem escondida na parede riscada.','Siga pela base da torre. A parede parece rabiscada. Segure Desenhar bem perto dela.'],
      ['gear','Pegue a engrenagem atrás da parede.','Atravesse o vão que apareceu e recolha a engrenagem dourada.'],
      ['engine','Complete o mecanismo com seu lápis.','Leve a engrenagem até o relógio dourado e segure Desenhar.'],
      ['seal','Ative os dois símbolos na ordem indicada.','No patamar do elevador, leia a inscrição. Depois alcance o outro símbolo pelos livros da direita.'],
      ['stair','Pegue o segundo elevador e redesenhe a ponte.','A plataforma à esquerda da Folha leva ao alto. Pule para a direita no topo.'],
      ['metBlot','Encontre Borrão no topo da torre.','Atravesse a ponte desenhada e pule para a última pilha de livros.'],
      [null,'Desenhe um novo final na página em branco.','Vá até o arco de papel e segure Desenhar até o lápis terminar a página.']
    ]
  }
];
