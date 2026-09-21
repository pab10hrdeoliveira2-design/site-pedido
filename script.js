const screens = document.querySelectorAll('.screen');
const senhaInput = document.getElementById('senha-input');
const finalScreen = document.getElementById('final');
const fotosCoracao = document.querySelectorAll('.foto-coracao');
const transicao = document.getElementById('transicao');
let transicaoTimer = null;

function executarTransicao() {
  if (!transicao) return;

  if (transicaoTimer) clearTimeout(transicaoTimer);

  // Reinicia a animação APNG a cada troca de tela, forçando um novo carregamento.
  const atual = transicao.querySelector('img');
  const nova = atual.cloneNode(false);
  nova.src = `assets/transicao_morcegos.png?v=${Date.now()}`;
  transicao.replaceChild(nova, atual);

  // Mostra a camada por cima da tela atual.
  transicao.classList.add('active');

  // A transição baseada no vídeo dura cerca de 2,8 segundos.
  transicaoTimer = setTimeout(() => {
    transicao.classList.remove('active');
  }, 2850);
}

function mostrarTela(id) {
  screens.forEach(screen => screen.classList.remove('active'));
  const tela = document.getElementById(id);
  if (!tela) return;
  tela.classList.add('active');
  executarTransicao();

  // Sempre começa cada tela no topo.
  if (tela.classList.contains('scrollable')) {
    // Garantia extra: a tela final não possui/não exibe o botão SIM.
    tela.querySelectorAll('.sim-button, img[src*="sim.png"]').forEach(el => el.remove());
    tela.scrollTop = 0;
    requestAnimationFrame(atualizarFotos);
  }

  if (tela.id === 'senha') setTimeout(() => senhaInput.focus(), 100);
}

// Fluxo inicial: SIM -> senha / NÃO -> tela da opção indisponível.
document.querySelector('.sim-button').addEventListener('click', () => mostrarTela('senha'));
document.querySelector('.nao-button').addEventListener('click', () => mostrarTela('nao-tela'));

// Clicar na própria frase da tela "não" volta ao início.
document.querySelector('.unavailable-button').addEventListener('click', () => mostrarTela('inicio'));

// Dicas -> tela da dica.
document.getElementById('dicas-btn').addEventListener('click', () => mostrarTela('dica'));

// Botões de voltar genéricos.
document.querySelectorAll('[data-target]').forEach(button => {
  button.addEventListener('click', () => mostrarTela(button.dataset.target));
});

// Senha correta.
senhaInput.addEventListener('keydown', event => {
  if (event.key === 'Enter') verificarSenha();
});

function verificarSenha() {
  const senha = senhaInput.value.trim().toLowerCase();
  if (senha === 'lindona') {
    senhaInput.value = '';
    mostrarTela('final');
  } else {
    senhaInput.value = '';
    mostrarTela('erro');
  }
}

// Faz as fotos diminuírem e ficarem mais transparentes quando chegam
// perto da borda superior ou inferior da área visível da tela final.
function atualizarFotos() {
  if (!finalScreen.classList.contains('active')) return;

  const viewportHeight = finalScreen.clientHeight;
  const zonaBorda = Math.max(100, viewportHeight * 0.20);

  fotosCoracao.forEach(foto => {
    const rect = foto.getBoundingClientRect();
    const telaRect = finalScreen.getBoundingClientRect();
    const topo = rect.top - telaRect.top;
    const baixo = telaRect.bottom - rect.bottom;

    let proximidade = 1;

    if (topo < zonaBorda) {
      proximidade = Math.min(proximidade, Math.max(0, topo / zonaBorda));
    }

    if (baixo < zonaBorda) {
      proximidade = Math.min(proximidade, Math.max(0, baixo / zonaBorda));
    }

    // Nunca some completamente: apenas reduz opacidade e tamanho.
    const escala = 0.72 + (proximidade * 0.28);
    const opacidade = 0.25 + (proximidade * 0.75);

    foto.style.transform = `scale(${escala})`;
    foto.style.opacity = opacidade;
  });
}

finalScreen.addEventListener('scroll', atualizarFotos, { passive: true });
window.addEventListener('resize', atualizarFotos);

// Atualiza quando as imagens terminarem de carregar.
fotosCoracao.forEach(foto => {
  foto.addEventListener('load', atualizarFotos);
});
