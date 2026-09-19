# Site Comemorativo de Aniversário

Site single-page (HTML/CSS/JS puro, sem backend, mobile-first) com uma trilha de 3 desafios sequenciais que desbloqueiam mensagens, uma foto especial e uma grande revelação final com confete.

**Tema visual:** estilo "realeza" — cinza chumbo de fundo, acento dourado/champagne e um toque de borgonha real, tipografia serifada (Cinzel nos títulos, Cormorant Garamond no corpo do texto, carregadas via Google Fonts com fallback para serifadas do sistema caso fique offline), cartões com moldura dupla, e os bloqueios estilizados como selo de lacre.

## Como usar

Não há build nem dependências além das fontes do Google Fonts (carregadas via `<link>` no `<head>` — se o navegador estiver offline, o site cai automaticamente para fontes serifadas do sistema, sem quebrar o layout). Basta abrir `index.html` no navegador, ou servir a pasta com qualquer servidor estático:

```bash
python3 -m http.server 8000
```

e acessar `http://localhost:8000`.

## Onde editar o conteúdo

Todo o texto está marcado com comentários `<!-- TROQUE AQUI -->` no `index.html` e com colchetes `[Escreva aqui...]`. Resumo:

| O que trocar | Onde | Arquivo |
|---|---|---|
| Nome do aniversariante | `<h1 class="hero-name">Aniversariante</h1>` | `index.html` (seção `.hero`) |
| Idade | `<p class="hero-age">XX anos</p>` | `index.html` (seção `.hero`) |
| Mensagem de abertura | `<p class="hero-message">...</p>` | `index.html` (seção `.hero`) |
| 5 mensagens/dizeres | os 5 `<p class="dizer-texto">` | `index.html` (seção `#dizeres`) |
| Carta especial (Recompensa 1) | `<div class="carta-especial">` | `index.html` (dentro de `#desafio1`) |
| Foto especial (Recompensa 2) | `assets/foto-especial.jpg` | substitua o arquivo de imagem |
| Foto/vídeo de destaque final | `assets/foto-final.jpg` | substitua o arquivo, ou troque a tag `<img>` por `<video controls>` dentro de `#finalReveal` |
| Mensagem de encerramento | `<p class="final-mensagem">` | `index.html` (seção `#finalReveal`) |
| Mascote/bot animado | `assets/bot.svg` | adicione seu próprio arquivo (veja seção "Mascote flutuante") |

Se as imagens `assets/foto-especial.jpg` e `assets/foto-final.jpg` não existirem (ou falharem ao carregar), o site cai automaticamente em um placeholder ilustrado (`assets/placeholder.svg`) e o layout não quebra.

## Mascote flutuante (bot animado)

Há um pequeno avatar animado fixo no canto inferior direito da tela, com flutuação e brilho contínuos, e um balão de fala que reage ao progresso da trilha (mensagem de boas-vindas, elogio após cada desafio concluído e uma mensagem final).

- **Para usar sua própria arte (imagem):** adicione um arquivo em `assets/bot.svg` (recomendado: SVG quadrado, ~200x200, fundo transparente). Se preferir PNG, troque o `src="assets/bot.svg"` por `src="assets/bot.png"` no bloco `<!-- BOT FLUTUANTE -->` do `index.html`.
- **Para usar um vídeo em loop:** adicione o arquivo em `assets/bot.mp4`. Se ele existir e carregar com sucesso, o site troca a imagem pelo vídeo automaticamente (em loop, mudo, sem controles — como um GIF, só que mais leve). Se o arquivo não existir ou não carregar, a imagem (ou o placeholder) continua sendo exibida normalmente.
  - Recomendado: vídeo curto (poucos segundos), quadrado ou próximo disso, formato `.mp4` (H.264), sem áudio necessário (o player já é mudo) e leve (algumas centenas de KB a no máximo alguns MB, para não pesar o carregamento da página).
  - Não precisa editar nada além de colocar o arquivo em `assets/bot.mp4` — a troca é automática via JavaScript (função `inicializarVideoBot` em `js/script.js`).
- Enquanto `assets/bot.svg`/`assets/bot.mp4` não existirem, um mascote placeholder ilustrado (`assets/bot-placeholder.svg`) é exibido automaticamente, sem quebrar o layout.
- A animação de flutuar + brilhar (o movimento do avatar na tela) é feita em CSS no próprio contêiner, então funciona por cima de qualquer imagem ou vídeo que você colocar.
- Para editar as mensagens do balão, procure o objeto `MENSAGENS_BOT` no topo da seção "BOT FLUTUANTE" em `js/script.js`.
- Clicar no avatar a qualquer momento reabre o balão com a mensagem atual.

## A trilha de desafios

1. **Jogo da memória** — 6 pares de cartas com emojis. Ao encontrar todos os pares, libera a "carta especial" (Recompensa 1) e desbloqueia o Desafio 2.
2. **Caça-palavras** — grade 10x10 com as palavras `CARNEIRO JR.`, `BATATINHA`, `CILÊNCIO`, `CONDE` e `XUXOVO` escondidas na horizontal, vertical e diagonal. Ao encontrar todas, libera a foto especial (Recompensa 2) e desbloqueia o Desafio 3.
   - Tem também um easter egg: a frase "EU TE AMO" está escondida na diagonal da grade (não aparece na lista e não conta para concluir o desafio — é só para quem prestar atenção).
3. **Quebra-cabeça deslizante 3x3** — clique numa peça adjacente ao espaço vazio para movê-la. O embaralhamento inicial é sempre solucionável. Ao resolver (números de 1 a 8 em ordem), libera a seção de revelação final com efeito de confete.

Cada seção bloqueada aparece com um efeito de blur/opacidade e um cadeado até ser desbloqueada. O progresso ("X de 3 desafios completos") e o estado de cada desafio ficam salvos no `localStorage` do navegador, então recarregar a página não reseta o que já foi concluído.

Para trocar as palavras do caça-palavras, ou os pares do jogo da memória, edite os arrays `PALAVRAS` e `EMOJIS_MEMORIA` no topo das respectivas seções em `js/script.js`.

## Estrutura de arquivos

```
index.html          estrutura das seções
css/style.css        tema visual (cinza chumbo + dourado/champagne)
js/script.js         lógica dos jogos, bloqueio/desbloqueio e progresso
assets/placeholder.svg   placeholder ilustrado usado quando uma foto real não existe
assets/foto-especial.jpg (adicionar)  foto da Recompensa 2
assets/foto-final.jpg    (adicionar)  foto/vídeo de destaque da revelação final
assets/bot-placeholder.svg  mascote padrão exibido enquanto assets/bot.svg e assets/bot.mp4 não existirem
assets/bot.svg           (adicionar)  sua própria arte (imagem) para o mascote flutuante
assets/bot.mp4           (adicionar, opcional)  vídeo em loop do mascote — se existir, substitui a imagem
```

## Resetar o progresso durante testes

No console do navegador:

```js
localStorage.removeItem('aniversario_progresso_v1');
```

e recarregue a página.
