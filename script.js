/**
 * Chronos 3000 - Cronômetro de alta precisão
 * 
 * Este script implementa as funcionalidades de um cronômetro digital
 * com capacidade de iniciar/parar, resetar e marcar voltas.
 * 
 * @author Gabriel Ferreira
 * @version 2.0.0
 */

// Elementos do DOM
const display = document.getElementById('display');
const startStopButton = document.getElementById('startStop');
const startStopText = document.getElementById('startStopText');
const startStopIcon = startStopButton.querySelector('.material-icons-round');
const resetButton = document.getElementById('reset');
const lapButton = document.getElementById('lap');
const lapList = document.getElementById('lapList');

// Variáveis de estado do cronômetro
let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let isRunning = false;
let lapCount = 0;
let previousLapTime = 0;

/**
 * Formata o tempo em milissegundos para o formato HH:MM:SS.CC
 * @param {number} timeInMs - Tempo em milissegundos
 * @returns {string} - Tempo formatado como HH:MM:SS.CC
 */
function formatTime(timeInMs) {
    // Cálculo das unidades de tempo
    const hours = Math.floor(timeInMs / 3600000);
    const minutes = Math.floor((timeInMs % 3600000) / 60000);
    const seconds = Math.floor((timeInMs % 60000) / 1000);
    const centiseconds = Math.floor((timeInMs % 1000) / 10);
    
    // Formatação com padding de zeros à esquerda
    return [
        String(hours).padStart(2, '0'),
        String(minutes).padStart(2, '0'),
        String(seconds).padStart(2, '0')
    ].join(':') + '.' + String(centiseconds).padStart(2, '0');
}

/**
 * Atualiza o display do cronômetro com o tempo atual
 */
function updateDisplay() {
    // Calcula o tempo atual com base no estado do cronômetro
    const currentTime = isRunning 
        ? Date.now() - startTime + elapsedTime 
        : elapsedTime;
    
    // Atualiza o texto do display com o tempo formatado
    display.textContent = formatTime(currentTime);
}

/**
 * Inicia o cronômetro e atualiza a interface
 */
function startTimer() {
    // Configura o estado do cronômetro
    isRunning = true;
    startTime = Date.now();
    
    // Inicia o intervalo de atualização (10ms para precisão de centésimos)
    timerInterval = setInterval(updateDisplay, 10);
    
    // Atualiza a interface para modo "Parar"
    startStopIcon.textContent = 'pause';
    startStopText.textContent = 'Parar';
    startStopButton.style.background = 'rgba(231, 76, 60, 0.2)';
    startStopButton.setAttribute('aria-label', 'Parar o cronômetro');
    
    // Habilita o botão de volta
    lapButton.disabled = false;
}

/**
 * Para o cronômetro e atualiza a interface
 */
function stopTimer() {
    // Atualiza o estado do cronômetro
    isRunning = false;
    elapsedTime += Date.now() - startTime;
    clearInterval(timerInterval);
    
    // Atualiza a interface para modo "Continuar"
    startStopIcon.textContent = 'play_arrow';
    startStopText.textContent = 'Continuar';
    startStopButton.style.background = 'rgba(255, 255, 255, 0.1)';
    startStopButton.setAttribute('aria-label', 'Continuar o cronômetro');
}

/**
 * Reseta o cronômetro e limpa todas as voltas
 */
function resetTimer() {
    // Para o cronômetro se estiver rodando
    if (isRunning) {
        stopTimer();
    }
    
    // Reseta todas as variáveis de estado
    startTime = 0;
    elapsedTime = 0;
    lapCount = 0;
    previousLapTime = 0;
    
    // Atualiza a interface para o estado inicial
    display.textContent = '00:00:00.00';
    lapList.innerHTML = '';
    startStopIcon.textContent = 'play_arrow';
    startStopText.textContent = 'Iniciar';
    startStopButton.style.background = 'rgba(255, 255, 255, 0.1)';
    startStopButton.setAttribute('aria-label', 'Iniciar o cronômetro');
}

/**
 * Registra uma volta e adiciona à lista de voltas
 * @returns {void}
 */
function recordLap() {
    // Não registra volta se o cronômetro não estiver rodando
    if (!isRunning) return;
    
    // Incrementa o contador de voltas
    lapCount++;
    
    // Calcula o tempo da volta atual
    const currentTime = Date.now() - startTime + elapsedTime;
    const lapTime = currentTime - previousLapTime;
    previousLapTime = currentTime;
    
    // Cria o elemento de volta com informações formatadas
    const lapItem = document.createElement('div');
    lapItem.className = 'lap-item';
    lapItem.setAttribute('aria-label', `Volta ${lapCount}: ${formatTime(lapTime)}`);
    lapItem.innerHTML = `
        <span>Volta ${lapCount}</span>
        <span>${formatTime(lapTime)}</span>
    `;
    
    // Adiciona ao topo da lista para mostrar a volta mais recente primeiro
    lapList.insertBefore(lapItem, lapList.firstChild);
    
    // Efeito visual para destacar a nova volta
    setTimeout(() => lapItem.classList.add('lap-item-visible'), 10);
}

// Event Listeners para os botões de controle
startStopButton.addEventListener('click', () => {
    if (isRunning) {
        stopTimer();
    } else {
        startTimer();
    }
});

resetButton.addEventListener('click', resetTimer);

lapButton.addEventListener('click', recordLap);

// Suporte a atalhos de teclado para melhor acessibilidade
document.addEventListener('keydown', (event) => {
    // Espaço ou Enter para iniciar/parar
    if (event.code === 'Space' || event.code === 'Enter') {
        event.preventDefault();
        if (isRunning) {
            stopTimer();
        } else {
            startTimer();
        }
    }
    
    // R para resetar
    if (event.code === 'KeyR') {
        resetTimer();
    }
    
    // L para marcar volta
    if (event.code === 'KeyL' && isRunning) {
        recordLap();
    }
});

// Inicialização quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', () => {
    // Garante que o display esteja zerado ao carregar a página
    resetTimer();
    
    // Adiciona classe para ativar animações após carregamento
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});