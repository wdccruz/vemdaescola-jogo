# Nina e o Mundo que Está Desaparecendo

Aventura de plataforma para crianças de 7 a 11 anos. Nina encontra um livro na biblioteca da escola e usa seu lápis para reconstruir o caminho até Borrão.

## Jogar

Abra `index.html` diretamente no navegador e escolha **Abrir o livro**. Para uma prévia HTTP local, execute `node testes/servidor.cjs` nesta pasta e abra a URL exibida.

| Ação | Teclado | Toque |
| --- | --- | --- |
| Andar | ← / → ou A / D | Setas na tela |
| Pular | Espaço, ↑ ou W. Segure para ir mais alto. | Segure **Pular** |
| Interagir | E | **Agir** |
| Reconstruir | Segure X junto à marca pontilhada | Segure **Desenhar** |
| Ver itens ou recuperar posição | I | **Mochila** |

As peças necessárias são usadas pelo lápis no local do enigma. A mochila também guarda três selos opcionais. O progresso é salvo no navegador e as quedas devolvem Nina ao ponto salvo mais recente. O som começa desligado e a preferência por movimento reduzido suaviza a apresentação sem alterar a física.

## Código

- `fisica.js` — aceleração, gravidade, salto variável, tolerância após a borda, buffer de salto, colisões, caixas e transporte por plataformas.
- `capitulos.js` — mapas, plataformas, pontos de desenho, itens, dicas e objetivos.
- `aventura.js` — ciclo fixo de simulação, câmera, inventário, progresso, checkpoints e regras dos enigmas.
- `personagens.js` — animações desenhadas em Canvas, retratos e estados de Dobri.
- `ilustracao.js` — cenário em camadas, efeitos e carregamento da arte por capítulo.
- `interface.js` — entradas de teclado e multitoque, diálogos, interface e efeitos de áudio.

## Hospedagem

O projeto é estático, com caminhos relativos e sem serviços externos. Para integrar via iframe, copie a pasta para o destino estático e ajuste o caminho conforme a posição da página que o hospeda.

```html
<iframe src="./jogos/nina-mundo-desaparecendo/" title="Nina e o Mundo que Está Desaparecendo"
        style="width:100%;height:90vh;border:0" loading="lazy"></iframe>
```

A pasta precisa ser incluída no artefato de publicação quando houver autorização. O salvamento usa apenas armazenamento local. Em contextos que bloqueiam armazenamento, checkpoints funcionam durante a sessão.

## Testes

```sh
node testes/fisica.cjs
node testes/jogar.cjs
```

O primeiro usa somente Node.js. O segundo usa Playwright e Chromium, aciona as teclas e os botões de toque reais e percorre o jogo em subdiretório. É possível informar `NINA_PLAYWRIGHT` para apontar para uma instalação externa, `NINA_CHROMIUM` para escolher o executável, `NINA_CAPTURAS` para gravar screenshots e `NINA_ATE=vila` ou `NINA_ATE=floresta` para encurtar a verificação durante o desenvolvimento.

## Arte

Capa e paisagens foram criadas com o gerador de imagens integrado, com as referências anexadas como direção artística. Os WebP finais estão em `assets/`. Os personagens jogáveis, mecanismos e efeitos foram desenhados em Canvas. A Baloo 2 é distribuída sob a licença SIL OFL, também incluída em `assets/`.

- `capa.webp` — Nina de casaco amarelo com lápis dourado e Dobri sobre um livro aberto, entre uma vila aquarelada, uma floresta e uma torre lilás. Espaço escuro à esquerda para a tipografia.
- `vila.webp` — Casas tortas de papel, janelas âmbar, telhados de ardósia, bandeirolas e ponte antiga ao longe. Aquarela, guache e lápis de cor.
- `floresta.webp` — Árvores antigas em névoa azul-petróleo, cogumelos de papel, samambaias e sementes-lanternas, em camadas de luz e sombra.
- `torre.webp` — Interior espiral de uma torre de livros ao crepúsculo, com vitrais, engrenagens de bronze e folhas douradas em suspensão.

