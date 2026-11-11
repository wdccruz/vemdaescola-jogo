# Mila e o Farol dos Cinco Mundos

Aventura de plataforma para praticar Matemática do 3º ano do Ensino Fundamental. Mila e Tuca exploram cinco ilhas e trazem as lentes de volta ao Farol.

## Jogar

Abra `index.html` diretamente no navegador ou execute `node testes/servidor.cjs` nesta pasta e abra a URL exibida.

| Ação | Teclado | Toque ou mouse |
| --- | --- | --- |
| Andar e empurrar | ← / → ou A / D | Setas na tela |
| Pular e subir escada | Espaço, ↑ ou W | Pular |
| Descer escada | ↓ ou S | Saia da escada para cair |
| Pegar, encaixar, conversar | E | Agir |
| Retirar uma unidade ou devolver | Q | Devolver |
| Ver mapa, mochila ou recuperar posição | I | Mapa |

No desktop, **Controles na tela** ativa os botões para uso com mouse. Também é possível clicar em objetos próximos de Mila. O som começa desligado. **Dica do Tuca** mostra uma pista e, se pedida novamente, uma estratégia mais explícita. Os encaixes podem ser revisados antes de concluir um mecanismo. Quedas preservam as peças e o progresso. O salvamento é local ao navegador.

## Mapa e mecanismos

| Lugar | Exploração e mudança física |
| --- | --- |
| Farol | Caminhe pelos cinco portais. Cada lente ilumina mais uma parte do farol. O mecanismo central aceita as cinco lentes reunidas. |
| Números | Atravesse a oficina e os trilhos suspensos. A composição abre o portão, os rebites montam a ponte e a divisão com sobra liga o elevador. |
| Padrões | Passe do bosque para a caverna e suba às copas. Complete brotos e folhas em sequência e equilibre dois canais de seiva. |
| Formas | Atravesse o jardim, o templo e a torre de cristais. Associe sólidos a objetos, encaixe planificações e compare silhuetas sobrepostas. |
| Medidas | Leve madeira da carpintaria, programe a comporta do moinho e pague o guincho em reais e centavos. |
| Possibilidades | Percorra o pátio dos telescópios e a galeria. Ordene chances, leia a energia em um gráfico e construa as colunas do registro da noite. |

Cada ilha tem uma concha opcional em uma rota elevada. Plataformas e mecanismos desenhados em Canvas compartilham coordenadas com os colisores. A imagem de fundo tem parallax independente da câmera e é carregada ao entrar no cenário.

## Matriz pedagógica

A [matriz JSON](matriz-bncc.json) descreve os 15 desafios, três níveis por ilha, objetivos, conhecimentos prévios, estratégias, feedback, dicas e critérios de conclusão. Os 28 códigos de Matemática do 3º ano estão classificados como **implementada no recorte**, **parcial** ou **planejada**, conforme a aprendizagem exigida pela mecânica. Fonte oficial nas pp. 288–290. [BNCC do Ministério da Educação](https://basenacionalcomum.mec.gov.br/images/BNCC_EI_EF_110518_versaofinal_site.pdf#page=289)

Esta versão precisa de avaliação de um professor do 3º ano antes de ser considerada validada para uso educacional. Entre os recortes de expansão estão reta numérica, frações unitárias, elaboração de problemas, croquis, massa, capacidade, áreas e coleta de dados de pesquisa.

## Código e testes

- `fisica.js` e `jogo.js` contêm colisões, simulação a 120 passos por segundo, câmera, checkpoint, NPC, transporte e progressão.
- `mundos.js` contém mapas, objetos, quantidades, desafios e dicas. `matematica.js` contém as regras de validação parametrizadas.
- `arte.js` desenha personagens, cenário jogável, máquinas e efeitos. `interface.js` contém entradas, diálogos, áudio e HUD.

```sh
node testes/fisica.cjs
node testes/matematica.cjs
node testes/jogar.cjs
```

A campanha automatizada usa Playwright e Chromium e aciona os controles pelo navegador. Defina `MILA_PLAYWRIGHT` para apontar para uma instalação externa, `MILA_CHROMIUM` para selecionar o executável, `MILA_CAPTURAS` para salvar screenshots e `MILA_ATE=ilha1` para testar só o primeiro mundo.

Os testes passaram pelos cinco mundos, pelo final e por uma segunda montagem de comprimento e pagamento. Verificaram recarga no checkpoint, queda, concha pela escada, interação por mouse, multitoque emulado, largura de 320 px, iframe e abertura por arquivo. A validação em Safari, Android e iPhone físicos está pendente.

A abertura transferiu 0,53 MB de arquivos antes de iniciar a partida, 1,18 MB até o Farol e 1,79 MB até a Ilha dos Números. Uma amostra de 120 quadros em movimento no Chromium desktop teve percentil 95 de 7 ms entre quadros. O desempenho em aparelho físico ainda precisa ser medido.

## Arte e integração

Os WebP em `assets/` foram gerados para este jogo com o gerador integrado e direção de guache, lápis de cor e papel. A Mila usa macacão terracota, camisa verde-petróleo e mochila ocre. Tuca tem casco de latão e luz verde. As paisagens usam luz dourada no cais, turquesa e verde na floresta, rosa e pedra no templo, açafrão no mercado e índigo no observatório. A Baloo 2 está incluída com licença SIL OFL.

O jogo usa arquivos locais e caminhos relativos. Para incorporar, copie esta pasta para o destino estático e aponte um iframe para seu `index.html`. O workflow existente exige inclusão autorizada da pasta em seu artefato para uma publicação no Pages.

