'use strict';

const chapters = [
  {
    title: 'A Floresta das Histórias', icon: 'leaf', accent: '#356249', soft: '#e8edcb', companion: 'lume',
    progress: ['A trilha ainda está adormecida', 'As flores acordaram', 'A teia brilha entre as árvores', 'A trilha está iluminada!'],
    challenges: [
      {
        kind:'story', title:'O jardim de Pingo',
        instructions:'Pingo quer contar como nasceu seu jardim. Coloque as cenas na ordem em que aconteceram.',
        scenes:[['flower','Uma flor se abre'],['seed','Pingo planta'],['rain','A chuva cai']], answer:[1,2,0],
        hint:'Lume viu Pingo mexer na terra antes de cair a primeira gota.',
        win:'Pingo plantou, a chuva regou e uma flor se abriu. O jardim voltou!'
      },
      {
        kind:'story', title:'A teia de Dona Íris',
        instructions:'Uma aranha ganhou um presente da manhã. Encaixe as cenas do começo ao fim.',
        scenes:[['web','Ela tece a teia'],['dew','A teia ganha orvalho'],['spider','A aranha chega']], answer:[2,0,1],
        hint:'Dona Íris precisou chegar ao galho para poder começar a tecer.',
        win:'A aranha chegou, teceu sua teia e as gotas da manhã pousaram nela.'
      },
      {
        kind:'story', title:'Lume mostra o caminho',
        instructions:'Caiu a noite. Ajude Lume a lembrar como encontrou Brasa.',
        scenes:[['lume','Lume procura luz'],['lantern','A luz se acende'],['moon','A noite cai']], answer:[2,0,1],
        hint:'Lume só precisou procurar luz quando escureceu.',
        win:'A noite chegou, Lume procurou luz e acendeu o lampião. Podemos seguir!'
      }
    ]
  },
  {
    title: 'A Cidade da Imaginação', icon: 'city', accent: '#774363', soft: '#f1e3df', companion: 'pingo',
    progress: ['As torres de livros esperam', 'Bandeiras no alto!', 'A oficina acendeu', 'A cidade ganhou vida!'],
    challenges: [
      {
        kind:'pattern', title:'A festa das bandeiras',
        instructions:'As janelas da cidade repetem o mesmo desenho. Encaixe as duas peças que faltam.',
        pattern:['flag','book','leaf','flag',null,'leaf','flag','book',null],
        pieces:[['leaf','Folha'],['flag','Bandeira'],['book','Livro']], answer:[2,0],
        hint:'O trecho Bandeira, Livro, Folha se repete. Depois de Bandeira sempre vem Livro.',
        win:'Bandeira, livro, folha! As torres estão prontas para a festa.'
      },
      {
        kind:'combine', title:'A oficina das duas luzes',
        instructions:'Monte um lampião com as duas peças da receita: uma chama e um vidro para protegê-la.',
        pieces:[['lens','Vidro'],['gear','Engrenagem'],['lume','Chama'],['leaf','Folha']], answer:[0,2],
        hint:'Pingo já achou a chama. Procure o vidro redondo e transparente.',
        win:'O vidro protegeu a chama. Agora o lampião ilumina a oficina!'
      },
      {
        kind:'dial', title:'O cofre do último vagão',
        instructions:'Gire as duas rodas até copiar o selo do cofre. Depois, tente abrir.',
        pieces:[['book','Livro'],['flag','Bandeira'],['leaf','Folha']],
        answer:[2,1], hint:'A folha vai na roda da esquerda. A bandeira fica na roda da direita.',
        win:'O cofre guardava a engrenagem! Brasa já pode puxar o último vagão.'
      }
    ]
  }
];

