"use strict";
let button = document.getElementById('soma');
let input1 = document.getElementById('input1');
let input2 = document.getElementById('input2');
function soma(numero1, numero2) {
    return numero1 + numero2;
}
function MostrarResultado(result) {
    let resultadoText = document.getElementById('resultado');
    resultadoText.textContent = result;
}
button === null || button === void 0 ? void 0 : button.addEventListener('click', () => {
    MostrarResultado(soma(Number(input1.value), Number(input2.value)));
});
