# O Mistério da Biblioteca Encantada

Jogo educativo para crianças de 6 a 10 anos, feito para integração futura ao Vem da Escola.
Dois livros vivos, **Lilo** e **Lila**, recuperam as palavras mágicas de uma biblioteca em três fases curtas (3 a 5 minutos no total).

Projeto independente: não tem ligação com o site institucional, com o redesign nem com o sistema de bibliotecas.

## Jogar

Abra `index.html` no navegador (funciona com duplo clique) ou sirva a pasta:

```bash
python3 -m http.server 8000
```

Controles: setas ou A/D para andar, espaço ou seta para cima para pular, E ou Enter para investigar.
No toque e no mouse: toque nas coisas do cenário, ou use os botões da bandeja.
`index.html?fase=2` e `?fase=3` abrem direto naquela fase (para testar).

## As fases

1. **A Biblioteca Misteriosa** — explorar, mexer nos objetos e achar as cinco letras; depois montar a palavra LIVRO.
2. **O Jardim das Palavras** — completar três pequenas histórias tocando nas flores certas (letras e sílabas): SOL, FLOR, GATO.
3. **O Castelo dos Livros** — um padrão de cores, uma ordem de tamanhos e as sílabas da última palavra: MAGIA.

## Hospedagem

É um site estático, sem build e sem backend: basta publicar a pasta inteira.
Todos os caminhos são relativos, então funciona em qualquer subpasta (por exemplo, GitHub Pages).

## Integração ao Vem da Escola

Recomendado: página própria com o jogo em `iframe`, carregado só quando a criança pede:

```html
<iframe src="/jogos/biblioteca-encantada/" title="O Mistério da Biblioteca Encantada"
        loading="lazy" style="width:100%;aspect-ratio:16/9;border:0;border-radius:12px"
        allow="autoplay"></iframe>
```

Assim o jogo não pesa nas outras páginas. Em celulares, um botão "Jogar em tela cheia" que abra a página do jogo diretamente dá a melhor experiência.

## Privacidade

Sem cadastro, anúncios, links externos ou coleta de dados. A única coisa guardada é o recorde de estrelas, no próprio aparelho (`localStorage`). O som começa desligado.

## Teste

```bash
node tests/jogar.mjs
```

Joga o jogo inteiro sozinho em três formatos de tela, a partir de uma subpasta, e confere o teclado (precisa do Playwright).

## Créditos

Fonte Baloo 2 (licença SIL OFL, em `fonts/`). Personagens, cenários e código originais deste projeto.
