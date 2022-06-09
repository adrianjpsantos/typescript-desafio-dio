"use strict";
const botaoAtualizar = document.getElementById('atualizar-saldo');
const botaoLimpar = document.getElementById('limpar-saldo');
const somar = document.getElementById('soma');
const campoSaldo = document.getElementById('campo-saldo');
campoSaldo.textContent = '0';
function somarAoSaldo(numero) {
    let total = Number(campoSaldo.textContent) + numero;
    campoSaldo.textContent = String(total);
}
function limparSaldo() {
    campoSaldo.textContent = '0';
}
botaoAtualizar === null || botaoAtualizar === void 0 ? void 0 : botaoAtualizar.addEventListener('click', function () {
    somarAoSaldo(Number(somar.value));
});
botaoLimpar.addEventListener('click', function () {
    limparSaldo();
});
