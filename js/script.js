(function () {
  'use strict';

  var STORAGE_KEY = 'aniversario_progresso_v1';

  /* =========================================================
     PROGRESSO / LOCALSTORAGE
     ========================================================= */
  function carregarProgresso() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { c1: false, c2: false, c3: false };
      var dados = JSON.parse(raw);
      return {
        c1: !!dados.c1,
        c2: !!dados.c2,
        c3: !!dados.c3
      };
    } catch (e) {
      return { c1: false, c2: false, c3: false };
    }
  }

  function salvarProgresso(progresso) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progresso));
    } catch (e) {
      /* localStorage indisponível — segue sem persistir */
    }
  }

  var progresso = carregarProgresso();

  function atualizarBarraProgresso() {
    var total = 3;
    var completos = (progresso.c1 ? 1 : 0) + (progresso.c2 ? 1 : 0) + (progresso.c3 ? 1 : 0);
    var fill = document.getElementById('progressoFill');
    var texto = document.getElementById('progressoTexto');
    fill.style.width = (completos / total * 100) + '%';
    texto.textContent = completos + ' de ' + total + ' desafios completos';
  }

  function desbloquear(wrapperId) {
    var wrapper = document.getElementById(wrapperId);
    if (wrapper) wrapper.classList.remove('locked');
  }

  function bloquear(wrapperId) {
    var wrapper = document.getElementById(wrapperId);
    if (wrapper) wrapper.classList.add('locked');
  }

  function aplicarEstadoInicialDeBloqueio() {
    // Desafio 2 depende do 1, Desafio 3 depende do 2, Final depende do 3.
    if (progresso.c1) desbloquear('wrapperDesafio2'); else bloquear('wrapperDesafio2');
    if (progresso.c2) desbloquear('wrapperDesafio3'); else bloquear('wrapperDesafio3');
    if (progresso.c3) desbloquear('wrapperFinal'); else bloquear('wrapperFinal');
  }

  function concluirDesafio(numero) {
    if (numero === 1 && !progresso.c1) {
      progresso.c1 = true;
      salvarProgresso(progresso);
      document.getElementById('recompensa1').hidden = false;
      desbloquear('wrapperDesafio2');
      atualizarBarraProgresso();
      mostrarMensagemBot(MENSAGENS_BOT.c1);
    }
    if (numero === 2 && !progresso.c2) {
      progresso.c2 = true;
      salvarProgresso(progresso);
      document.getElementById('recompensa2').hidden = false;
      desbloquear('wrapperDesafio3');
      atualizarBarraProgresso();
      mostrarMensagemBot(MENSAGENS_BOT.c2);
    }
    if (numero === 3 && !progresso.c3) {
      progresso.c3 = true;
      salvarProgresso(progresso);
      desbloquear('wrapperFinal');
      atualizarBarraProgresso();
      dispararConfete();
      mostrarMensagemBot(MENSAGENS_BOT.final);
    }
  }

  /* =========================================================
     BOT FLUTUANTE (mascote animado)
     ========================================================= */
  var MENSAGENS_BOT = {
    inicio: 'Oi! Vamos começar sua trilha de aniversário? 🎉',
    c1: 'Mandou bem no jogo da memória! 💛 Bora pro próximo?',
    c2: 'Uau, encontrou todas as palavras! ✨',
    final: 'Você completou a trilha inteira! Parabéns! 🥳'
  };

  var botTimeoutId = null;

  function mensagemAtualDoBot() {
    if (!progresso.c1) return MENSAGENS_BOT.inicio;
    if (!progresso.c2) return MENSAGENS_BOT.c1;
    if (!progresso.c3) return MENSAGENS_BOT.c2;
    return MENSAGENS_BOT.final;
  }

  function mostrarMensagemBot(texto) {
    var balao = document.getElementById('botBalao');
    var msgEl = document.getElementById('botMensagem');
    if (!balao || !msgEl) return;
    msgEl.textContent = texto;
    balao.classList.add('visivel');
    clearTimeout(botTimeoutId);
    botTimeoutId = setTimeout(function () {
      balao.classList.remove('visivel');
    }, 5000);
  }

  function inicializarBot() {
    var botao = document.getElementById('botAvatarBtn');
    if (!botao) return;
    botao.addEventListener('click', function () {
      mostrarMensagemBot(mensagemAtualDoBot());
    });
    setTimeout(function () {
      mostrarMensagemBot(mensagemAtualDoBot());
    }, 1200);
  }

  function inicializarVideoBot() {
    var video = document.getElementById('botVideo');
    if (!video) return;
    video.addEventListener('loadeddata', function () {
      video.classList.add('carregado');
      video.play().catch(function () { /* autoplay pode exigir interação em alguns navegadores */ });
    });
    video.addEventListener('error', function () {
      video.classList.remove('carregado');
    });
  }

  /* =========================================================
     DESAFIO 1 — JOGO DA MEMÓRIA
     ========================================================= */
  var EMOJIS_MEMORIA = ['🎂', '🎉', '🎁', '🎈', '⭐', '❤️'];

  function embaralhar(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = array[i];
      array[i] = array[j];
      array[j] = tmp;
    }
    return array;
  }

  function iniciarJogoMemoria() {
    var grid = document.getElementById('memoriaGrid');
    var statusEl = document.getElementById('memoriaStatus');

    if (progresso.c1) {
      grid.innerHTML = '';
      statusEl.textContent = 'Desafio concluído! 🎉';
      document.getElementById('recompensa1').hidden = false;
      return;
    }

    var cartas = embaralhar(EMOJIS_MEMORIA.concat(EMOJIS_MEMORIA));
    var viradas = [];
    var paresEncontrados = 0;
    var bloqueadoTemporario = false;

    grid.innerHTML = '';
    cartas.forEach(function (emoji, indice) {
      var carta = document.createElement('button');
      carta.type = 'button';
      carta.className = 'carta';
      carta.setAttribute('data-emoji', emoji);
      carta.setAttribute('data-indice', indice);
      carta.setAttribute('aria-label', 'Carta');
      carta.innerHTML = '<span class="verso">?</span><span class="face">' + emoji + '</span>';
      carta.addEventListener('click', onClicarCarta);
      grid.appendChild(carta);
    });

    function onClicarCarta(ev) {
      if (bloqueadoTemporario) return;
      var carta = ev.currentTarget;
      if (carta.classList.contains('virada') || carta.classList.contains('encontrada')) return;
      if (viradas.length >= 2) return;

      carta.classList.add('virada');
      viradas.push(carta);

      if (viradas.length === 2) {
        var a = viradas[0], b = viradas[1];
        if (a.getAttribute('data-emoji') === b.getAttribute('data-emoji')) {
          a.classList.add('encontrada');
          b.classList.add('encontrada');
          viradas = [];
          paresEncontrados++;
          statusEl.textContent = 'Pares encontrados: ' + paresEncontrados + ' de 6';
          if (paresEncontrados === 6) {
            statusEl.textContent = 'Desafio concluído! 🎉';
            concluirDesafio(1);
          }
        } else {
          bloqueadoTemporario = true;
          setTimeout(function () {
            a.classList.remove('virada');
            b.classList.remove('virada');
            viradas = [];
            bloqueadoTemporario = false;
          }, 700);
        }
      }
    }
  }

  /* =========================================================
     DESAFIO 2 — CAÇA-PALAVRAS
     ========================================================= */
  var TAMANHO_GRADE = 10;
  var PALAVRAS = [
    { texto: 'CARNEIROJR', label: 'CARNEIRO JR.', celulas: gerarCelulas(0, 0, 0, 1) },
    { texto: 'BATATINHA', label: 'BATATINHA', celulas: gerarCelulas(1, 0, 1, 0) },
    { texto: 'CILENCIO', label: 'CILÊNCIO', celulas: gerarCelulas(9, 2, 0, 1) },
    { texto: 'CONDE', label: 'CONDE', celulas: gerarCelulas(1, 9, 1, 0) },
    { texto: 'XUXOVO', label: 'XUXOVO', celulas: gerarCelulas(1, 2, 1, 1) }
  ];

  // Easter egg: fica escondida na diagonal da grade, não entra na lista
  // de palavras a encontrar nem conta para concluir o desafio.
  var SEGREDO_DIAGONAL = { texto: 'EUTEAMO', celulas: gerarCelulas(1, 7, 1, -1) };

  function gerarCelulas(linhaInicial, colInicial, passoLinha, passoCol) {
    // gerado dinamicamente por palavra na hora da criação da grade (ver montarGradeCacaPalavras)
    return { linha: linhaInicial, coluna: colInicial, passoLinha: passoLinha, passoCol: passoCol };
  }

  function montarGradeCacaPalavras() {
    var grade = [];
    for (var i = 0; i < TAMANHO_GRADE; i++) {
      grade.push(new Array(TAMANHO_GRADE).fill(null));
    }

    function escreverNaGrade(texto, celulas) {
      var coords = [];
      var linha = celulas.linha, coluna = celulas.coluna;
      texto.split('').forEach(function (letra) {
        grade[linha][coluna] = letra;
        coords.push(linha + ',' + coluna);
        linha += celulas.passoLinha;
        coluna += celulas.passoCol;
      });
      return coords;
    }

    var listaPalavras = [];
    PALAVRAS.forEach(function (p) {
      var coords = escreverNaGrade(p.texto, p.celulas);
      listaPalavras.push({ texto: p.texto, label: p.label || p.texto, coords: coords, encontrada: false });
    });

    escreverNaGrade(SEGREDO_DIAGONAL.texto, SEGREDO_DIAGONAL.celulas);

    var alfabeto = 'AEIOSRTNMDCL';
    for (var l = 0; l < TAMANHO_GRADE; l++) {
      for (var c = 0; c < TAMANHO_GRADE; c++) {
        if (!grade[l][c]) {
          grade[l][c] = alfabeto.charAt(Math.floor(Math.random() * alfabeto.length));
        }
      }
    }

    return { grade: grade, palavras: listaPalavras };
  }

  function iniciarCacaPalavras() {
    var gridEl = document.getElementById('cacapalavrasGrid');
    var listaEl = document.getElementById('cacapalavrasLista');

    if (progresso.c2) {
      gridEl.innerHTML = '';
      gridEl.style.display = 'none';
      listaEl.innerHTML = '<li>Desafio concluído! 🎉</li>';
      document.getElementById('recompensa2').hidden = false;
      return;
    }

    var dados = montarGradeCacaPalavras();
    var grade = dados.grade;
    var palavras = dados.palavras;
    var totalPalavras = palavras.length;
    var encontradasCount = 0;

    gridEl.innerHTML = '';
    listaEl.innerHTML = '';

    palavras.forEach(function (p) {
      var li = document.createElement('li');
      li.textContent = p.label;
      li.setAttribute('data-palavra', p.texto);
      listaEl.appendChild(li);
    });

    var celulasEl = [];
    for (var l = 0; l < TAMANHO_GRADE; l++) {
      for (var c = 0; c < TAMANHO_GRADE; c++) {
        var cel = document.createElement('div');
        cel.className = 'letra-cel';
        cel.textContent = grade[l][c];
        cel.setAttribute('data-coord', l + ',' + c);
        gridEl.appendChild(cel);
        celulasEl.push(cel);
      }
    }

    var selecionando = false;
    var celulaInicial = null;
    var selecaoAtual = [];

    function coordDoElemento(el) {
      if (!el || !el.classList || !el.classList.contains('letra-cel')) return null;
      return el.getAttribute('data-coord');
    }

    function limparSelecaoVisual() {
      selecaoAtual.forEach(function (coord) {
        var el = gridEl.querySelector('[data-coord="' + coord + '"]');
        if (el) el.classList.remove('selecionada');
      });
      selecaoAtual = [];
    }

    function calcularLinhaEntre(coordA, coordB) {
      var a = coordA.split(',').map(Number);
      var b = coordB.split(',').map(Number);
      var dLinha = b[0] - a[0];
      var dCol = b[1] - a[1];
      var passos = Math.max(Math.abs(dLinha), Math.abs(dCol));
      if (passos === 0) return [coordA];
      var passoLinha = dLinha === 0 ? 0 : dLinha / Math.abs(dLinha);
      var passoCol = dCol === 0 ? 0 : dCol / Math.abs(dCol);
      // só aceitar linha reta: horizontal, vertical ou diagonal
      if (Math.abs(dLinha) !== 0 && Math.abs(dCol) !== 0 && Math.abs(dLinha) !== Math.abs(dCol)) {
        return null;
      }
      var coords = [];
      for (var i = 0; i <= passos; i++) {
        coords.push((a[0] + passoLinha * i) + ',' + (a[1] + passoCol * i));
      }
      return coords;
    }

    function tentarCasarPalavra(coords) {
      var direta = coords.join('|');
      var invertida = coords.slice().reverse().join('|');
      for (var i = 0; i < palavras.length; i++) {
        var p = palavras[i];
        if (p.encontrada) continue;
        var alvo = p.coords.join('|');
        if (alvo === direta || alvo === invertida) return p;
      }
      return null;
    }

    function finalizarSelecao(coordFinal) {
      if (!celulaInicial) return;
      var coords = calcularLinhaEntre(celulaInicial, coordFinal);
      limparSelecaoVisual();
      if (coords) {
        var palavraEncontrada = tentarCasarPalavra(coords);
        if (palavraEncontrada) {
          palavraEncontrada.encontrada = true;
          encontradasCount++;
          coords.forEach(function (coord) {
            var el = gridEl.querySelector('[data-coord="' + coord + '"]');
            if (el) el.classList.add('encontrada');
          });
          var liAlvo = listaEl.querySelector('[data-palavra="' + palavraEncontrada.texto + '"]');
          if (liAlvo) liAlvo.classList.add('encontrada');

          if (encontradasCount === totalPalavras) {
            concluirDesafio(2);
          }
        }
      }
      celulaInicial = null;
      selecionando = false;
    }

    function iniciarSelecao(coord) {
      selecionando = true;
      celulaInicial = coord;
      limparSelecaoVisual();
      selecaoAtual = [coord];
      var el = gridEl.querySelector('[data-coord="' + coord + '"]');
      if (el) el.classList.add('selecionada');
    }

    function moverSelecao(coord) {
      if (!selecionando || !celulaInicial) return;
      var coords = calcularLinhaEntre(celulaInicial, coord);
      if (!coords) return;
      limparSelecaoVisual();
      selecaoAtual = coords;
      coords.forEach(function (c) {
        var el = gridEl.querySelector('[data-coord="' + c + '"]');
        if (el) el.classList.add('selecionada');
      });
    }

    gridEl.addEventListener('pointerdown', function (ev) {
      var coord = coordDoElemento(ev.target);
      if (!coord) return;
      ev.preventDefault();
      iniciarSelecao(coord);
    });

    gridEl.addEventListener('pointermove', function (ev) {
      if (!selecionando) return;
      var alvo = document.elementFromPoint(ev.clientX, ev.clientY);
      var coord = coordDoElemento(alvo);
      if (coord) moverSelecao(coord);
    });

    window.addEventListener('pointerup', function (ev) {
      if (!selecionando) return;
      var alvo = document.elementFromPoint(ev.clientX, ev.clientY) || ev.target;
      var coord = coordDoElemento(alvo) || (selecaoAtual.length ? selecaoAtual[selecaoAtual.length - 1] : null);
      finalizarSelecao(coord);
    });
  }

  /* =========================================================
     DESAFIO 3 — QUEBRA-CABEÇA DESLIZANTE 3x3
     ========================================================= */
  function estadoResolvido() {
    return [1, 2, 3, 4, 5, 6, 7, 8, 0];
  }

  function embaralharSolucionavel() {
    var estado = estadoResolvido();
    var indiceVazio = 8;
    var numMovimentos = 120;

    for (var i = 0; i < numMovimentos; i++) {
      var vizinhos = vizinhosDoIndice(indiceVazio);
      var escolhido = vizinhos[Math.floor(Math.random() * vizinhos.length)];
      var tmp = estado[indiceVazio];
      estado[indiceVazio] = estado[escolhido];
      estado[escolhido] = tmp;
      indiceVazio = escolhido;
    }

    if (estado.join(',') === estadoResolvido().join(',')) {
      return embaralharSolucionavel();
    }
    return estado;
  }

  function vizinhosDoIndice(indice) {
    var linha = Math.floor(indice / 3);
    var coluna = indice % 3;
    var vizinhos = [];
    if (linha > 0) vizinhos.push(indice - 3);
    if (linha < 2) vizinhos.push(indice + 3);
    if (coluna > 0) vizinhos.push(indice - 1);
    if (coluna < 2) vizinhos.push(indice + 1);
    return vizinhos;
  }

  function iniciarQuebraCabeca() {
    var gridEl = document.getElementById('puzzleGrid');
    var botaoReiniciar = document.getElementById('puzzleReiniciar');

    if (progresso.c3) {
      gridEl.innerHTML = '';
      botaoReiniciar.hidden = true;
      var msg = document.createElement('p');
      msg.style.textAlign = 'center';
      msg.style.color = 'var(--text-muted)';
      msg.textContent = 'Desafio concluído! 🎉';
      gridEl.parentNode.insertBefore(msg, gridEl);
      return;
    }

    var estado = embaralharSolucionavel();

    function renderizar() {
      gridEl.innerHTML = '';
      estado.forEach(function (valor, indice) {
        var peca = document.createElement('div');
        if (valor === 0) {
          peca.className = 'puzzle-vazio';
        } else {
          peca.className = 'puzzle-peca';
          peca.textContent = valor;
          peca.setAttribute('data-indice', indice);
          peca.addEventListener('click', function (ev) {
            moverPeca(Number(ev.currentTarget.getAttribute('data-indice')));
          });
        }
        gridEl.appendChild(peca);
      });
    }

    function moverPeca(indice) {
      var indiceVazio = estado.indexOf(0);
      var vizinhos = vizinhosDoIndice(indiceVazio);
      if (vizinhos.indexOf(indice) === -1) return;
      var tmp = estado[indiceVazio];
      estado[indiceVazio] = estado[indice];
      estado[indice] = tmp;
      renderizar();
      if (estado.join(',') === estadoResolvido().join(',')) {
        concluirDesafio(3);
      }
    }

    botaoReiniciar.addEventListener('click', function () {
      estado = embaralharSolucionavel();
      renderizar();
    });

    renderizar();
  }

  /* =========================================================
     CONFETE (canvas simples, sem dependências)
     ========================================================= */
  function dispararConfete() {
    var canvas = document.getElementById('confeteCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var secao = canvas.closest('.final-reveal');

    function ajustarTamanho() {
      canvas.width = secao.clientWidth;
      canvas.height = secao.clientHeight;
    }
    ajustarTamanho();
    window.addEventListener('resize', ajustarTamanho);

    var cores = ['#d4af6a', '#b8935a', '#f2efe9', '#383d42'];
    var particulas = [];
    var total = 90;

    for (var i = 0; i < total; i++) {
      particulas.push({
        x: Math.random() * canvas.width,
        y: -Math.random() * canvas.height,
        tamanho: 4 + Math.random() * 5,
        velocidadeY: 2 + Math.random() * 3,
        velocidadeX: -1.5 + Math.random() * 3,
        cor: cores[Math.floor(Math.random() * cores.length)],
        rotacao: Math.random() * Math.PI,
        velocidadeRotacao: -0.1 + Math.random() * 0.2
      });
    }

    var quadros = 0;
    var maxQuadros = 260;

    function animar() {
      quadros++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particulas.forEach(function (p) {
        p.x += p.velocidadeX;
        p.y += p.velocidadeY;
        p.rotacao += p.velocidadeRotacao;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotacao);
        ctx.fillStyle = p.cor;
        ctx.fillRect(-p.tamanho / 2, -p.tamanho / 2, p.tamanho, p.tamanho * 0.6);
        ctx.restore();
      });
      if (quadros < maxQuadros) {
        requestAnimationFrame(animar);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    animar();
  }

  /* =========================================================
     INICIALIZAÇÃO
     ========================================================= */
  document.addEventListener('DOMContentLoaded', function () {
    aplicarEstadoInicialDeBloqueio();
    atualizarBarraProgresso();
    iniciarJogoMemoria();
    iniciarCacaPalavras();
    iniciarQuebraCabeca();
    inicializarBot();
    inicializarVideoBot();
    if (progresso.c3) dispararConfete();
  });
})();
