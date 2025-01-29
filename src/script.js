const gamemodeTimed = document.querySelector("#modo-cronometrado")
const gamemodeTimeLimit = document.querySelector("#modo-limite")
const startGameBtn = document.querySelector("#iniciar-jogo")

let gameStarted = false
let gameEnded = false

let currentGameMode = ""
let timer = 0
let timeRemaining = 0
let intervalTimed = null
let intervalTimeLimit = null

// Gerar Objetivo
function generateGoal() {
    let goalPieces = document.querySelectorAll(".piece-goal");
    let pattern = [];
    const colors = ["blue", "yellow", "red", "pink", "green"]

    goalPieces.forEach(piece => {
        let randomColor = colors[Math.floor(Math.random() * colors.length)];
        pattern.push(randomColor);
        piece.classList.add(randomColor)
    });

    return pattern;
}


// Embaralhar Tabuleiro
function shuffleBoard() {
    let pieces = Array.from(document.querySelectorAll(".piece-puzzle")); // Pega todas as peças
    let gridSize = Math.sqrt(pieces.length); // Define a matriz (exemplo: 5x5)
    let blankIndex = pieces.findIndex(piece => piece.classList.contains("blank")); // Encontra espaço vazio

    // Movimentos possíveis
    function getValidMoves(index) {
        let moves = [];
        let row = Math.floor(index / gridSize);
        let col = index % gridSize;

        if (row > 0) moves.push(index - gridSize); // Cima
        if (row < gridSize - 1) moves.push(index + gridSize); // Baixo
        if (col > 0) moves.push(index - 1); // Esquerda
        if (col < gridSize - 1) moves.push(index + 1); // Direita

        return moves;
    }

    // Move aleatoriamente para embaralhar o estado inicial
    let previousIndex = null;
    let shuffleMoves = 100;

    for (let i = 0; i < shuffleMoves; i++) {
        let validMoves = getValidMoves(blankIndex);

        // Evitar desfazer o movimento anterior
        if (previousIndex !== null) {
            validMoves = validMoves.filter(move => move !== previousIndex);
        }

        // Escolhe um movimento aleatório
        let randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];

        let blankTile = pieces[blankIndex];
        let moveTile = pieces[randomMove];

        let temp = blankTile.outerHTML;
        blankTile.outerHTML = moveTile.outerHTML;
        moveTile.outerHTML = temp;

        // Atualiza lista de peças após troca
        pieces = Array.from(document.querySelectorAll(".piece-puzzle"));
        previousIndex = blankIndex;
        blankIndex = randomMove;
    }
}

// Resetar Tabuleiro
function resetBoard() {
    let goalPieces = document.querySelectorAll(".piece-goal")
    let tempo = document.querySelector("#tempo")
    const colors = ["blue", "yellow", "red", "pink", "green"]

    goalPieces.forEach(piece => {
        colors.forEach(color => piece.classList.remove(color));
    })

    tempo.innerHTML = "00:00"
}

// Mover Peças

// Selecionar Modo de Jogo
gamemodeTimed.addEventListener("click", () => selectMode("Cronometrado"))
gamemodeTimeLimit.addEventListener("click", () => selectMode("Tempo Limite"))

function selectMode(gamemode) {
    currentGameMode = gamemode
    gamemodeTimed.classList.remove("selected-mode")
    gamemodeTimeLimit.classList.remove("selected-mode")

    if (gamemode == "Cronometrado") {
        gamemodeTimed.classList.add("selected-mode")
    }
    else if (gamemode == "Tempo Limite") {
        gamemodeTimeLimit.classList.add("selected-mode")
    }
}

function runTime() {
    let tempo = document.querySelector("#tempo")
    let segundos = 0

    if (currentGameMode == "Cronometrado") {
        clearInterval(intervalTimed)
        clearInterval(intervalTimeLimit)
        intervalTimed = setInterval(() => {
            segundos = segundos + 1
            let min = Math.floor(segundos / 60)
            let seg = segundos % 60
            tempo.innerHTML = String(min).padStart(2, "0") + ":" + String(seg).padStart(2, "0");
        }, 1000)
    }
    else if (currentGameMode == "Tempo Limite") {
        clearInterval(intervalTimed)
        clearInterval(intervalTimeLimit)
        tempo.innerHTML = "00:20"
        segundos = 20 % 60
        intervalTimeLimit = setInterval(() => {
            segundos = segundos - 1
            let min = Math.floor(segundos / 60)
            let seg = segundos % 60
            tempo.innerHTML = String(min).padStart(2, "0") + ":" + String(seg).padStart(2, "0");

            if (segundos < 0) {
                clearInterval(intervalTimeLimit)
                alert("Tempo Esgotado! Você perdeu no modo de jogo Tempo Limite.")
                tempo.innerHTML = "00:00"
            }
        }, 1000)
    }
}

// Iniciar Jogo
startGameBtn.addEventListener("click", () => iniciarJogo())

function iniciarJogo() {
    if (currentGameMode == "") {
        alert("Você precisa selecionar um Modo de Jogo primeiro!")
    }
    else {
        resetBoard()
        generateGoal()
        shuffleBoard()
        gameStarted = true
        runTime()
    }
}