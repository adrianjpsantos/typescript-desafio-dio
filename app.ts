let button = document.getElementById('soma') as HTMLButtonElement;
let input1 = document.getElementById('input1') as HTMLInputElement;
let input2 = document.getElementById('input2') as HTMLInputElement;

function soma(numero1: number, numero2: number) {
    return numero1 + numero2;
}

function MostrarResultado(result: any) {
    let resultadoText = document.getElementById('resultado') as HTMLParagraphElement;
    resultadoText.textContent = result;
}

button?.addEventListener('click', () => {
    MostrarResultado(soma(Number(input1.value), Number(input2.value)));
});
