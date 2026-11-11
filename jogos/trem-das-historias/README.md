# O Trem das Histórias

Aventura de leitura e imaginação para crianças de 6 a 10 anos. Ajude Brasa, Pingo e Lume a reconstruir uma ponte com sílabas, ordenar cenas da floresta e destrancar o último vagão na cidade dos livros.

## Jogar

Abra `index.html` diretamente no navegador e escolha **Embarcar**. Use toque ou mouse para encaixar peças e girar rodas. No teclado, use Tab para navegar e Enter ou Espaço para ativar. As dicas ficam no botão do companheiro e o apito de Brasa no canto da paisagem.

O som é opcional e começa desligado a cada carregamento. O jogo respeita a preferência de movimento reduzido. A sessão vive na memória da página e não envia dados.

Para servir a prévia local com Node.js, a partir desta pasta:

```sh
node testes/jogar.cjs --serve
```

Abra a URL exibida. `TREM_PORT` permite trocar a porta padrão 8765.

## Integração

Copie a pasta inteira para o artefato estático de destino. Os caminhos dos recursos são relativos e o jogo roda sem build ou dependências de runtime. Exemplo de integração, assumindo que a página que hospeda o iframe está na raiz do site:

```html
<iframe src="./jogos/trem-das-historias/" title="O Trem das Histórias"
        loading="lazy" style="width:100%;height:85vh;border:0"></iframe>
```

O workflow de Pages do repositório empacota o jogo anterior. Incluir esta pasta no artefato será uma etapa da futura publicação autorizada.

## Testes

Com Playwright e Chromium instalados, execute:

```sh
node testes/jogar.cjs
```

O teste abre o jogo num subdiretório, completa os nove desafios com mouse, toque emulado e teclado e verifica erros recuperáveis, dicas, reinício, som, movimento reduzido, fontes, ilustrações, ausência de rolagem horizontal, iframe e abertura por arquivo. `TREM_PLAYWRIGHT` pode apontar para uma instalação do Playwright fora do repositório. `TREM_CHROMIUM` permite selecionar outro executável Chromium. Com `TREM_CAPTURAS` definido, o teste salva capturas reais da execução nesse diretório.

## Arte

A capa usa a imagem de referência fornecida no desafio, convertida para WebP. As estações, personagens, ícones e animações foram desenhados em SVG para o jogo. A fonte Baloo 2 é distribuída sob a SIL Open Font License, incluída em `assets/`.

