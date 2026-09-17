const screens = document.querySelectorAll('.screen');
const senhaInput = document.getElementById('senha-input');

function mostrarTela(id) {
  screens.forEach(screen => screen.classList.remove('active'));
  const tela = document.getElementById(id);
  if (!tela) return;
  tela.classList.add('active');

  // Sempre começa cada tela no topo.
  if (tela.classList.contains('scrollable')) tela.scrollTop = 0;
  if (tela.id === 'senha') setTimeout(() => senhaInput.focus(), 100);
}

// Fluxo inicial: SIM -> senha / NÃO -> tela da opção indisponível.
document.querySelector('.sim-button').addEventListener('click', () => mostrarTela('senha'));
document.querySelector('.nao-button').addEventListener('click', () => mostrarTela('nao-tela'));

// IMPORTANTE: clicar na própria frase da tela "não" volta ao início.
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

senhaInput.addEventListener('input', () => {
  // A validação acontece ao pressionar Enter ou ao sair do campo.
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

