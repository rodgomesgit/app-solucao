# Site Comemorativo de Aniversário

Site single-page (HTML/CSS/JS puro, sem backend, mobile-first) com uma trilha de 3 desafios sequenciais que desbloqueiam mensagens, uma foto especial e uma grande revelação final com confete.

## Como usar

Não há build nem dependências. Basta abrir `index.html` no navegador, ou servir a pasta com qualquer servidor estático:

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

Se as imagens `assets/foto-especial.jpg` e `assets/foto-final.jpg` não existirem (ou falharem ao carregar), o site cai automaticamente em um placeholder ilustrado (`assets/placeholder.svg`) e o layout não quebra.

## A trilha de desafios

1. **Jogo da memória** — 6 pares de cartas com emojis. Ao encontrar todos os pares, libera a "carta especial" (Recompensa 1) e desbloqueia o Desafio 2.
2. **Caça-palavras** — grade 10x10 com as palavras `AMOR`, `FAMÍLIA`, `FELICIDADE`, `SORRISO` e `PRESENTE` escondidas na horizontal, vertical e diagonal. Ao encontrar todas, libera a foto especial (Recompensa 2) e desbloqueia o Desafio 3.
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
```

## Resetar o progresso durante testes

No console do navegador:

```js
localStorage.removeItem('aniversario_progresso_v1');
```

e recarregue a página.
