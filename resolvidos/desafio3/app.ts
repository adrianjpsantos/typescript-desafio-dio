
const botaoAtualizar = document.getElementById('atualizar-saldo') as HTMLButtonElement;
const botaoLimpar = document.getElementById('limpar-saldo') as HTMLButtonElement;
const somar = document.getElementById('soma') as HTMLInputElement;
const campoSaldo = document.getElementById('campo-saldo') as HTMLSpanElement;
campoSaldo.textContent = '0';

function somarAoSaldo(numero: number) {
    let total = Number(campoSaldo.textContent) + numero;
    campoSaldo.textContent = String(total);
}

function limparSaldo() {
    campoSaldo.textContent = '0';
}

botaoAtualizar?.addEventListener('click', function () {
    somarAoSaldo(Number(somar.value));
});

botaoLimpar.addEventListener('click', function () {
    limparSaldo();
});
