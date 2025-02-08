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
let goalPattern = []

// Gerar Objetivo
function generateGoal() {
    let goalPieces = document.querySelectorAll(".piece-goal")
    let pattern = []
    const colors = ["blue", "yellow", "red", "pink", "green"]

    goalPieces.forEach(piece => {
        let randomColor = colors[Math.floor(Math.random() * colors.length)]
        pattern.push(randomColor)
        piece.classList.add(randomColor)
    });

    goalPattern = pattern
}

// Verificar condição de vitória
function checkWinCondition() {
    let pieces = Array.from(document.querySelectorAll(".piece-puzzle"));
    let gridSize = Math.sqrt(pieces.length);
    let centerColors = [];

    // Índices das 9 peças centrais em um grid 5x5
    let centerIndexes = [
        6, 7, 8,
        11, 12, 13,
        16, 17, 18
    ];

    centerIndexes.forEach(index => {
        let piece = pieces[index];

        // Filtra as classes para encontrar a cor da peça
        let colorClass = Array.from(piece.classList).find(cls =>
            ["blue", "yellow", "red", "pink", "green"].includes(cls)
        );

        centerColors.push(colorClass);
    });

    // Comparação com o padrão de objetivo
    if (JSON.stringify(centerColors) === JSON.stringify(goalPattern)) {
        gameEnded = true;
        clearInterval(intervalTimed);
        clearInterval(intervalTimeLimit);
        alert("Parabéns! Você venceu o jogo!");
    }
}

// Embaralhar Tabuleiro
function shuffleBoard() {
    let pieces = Array.from(document.querySelectorAll(".piece-puzzle")) // Pega todas as peças
    let gridSize = Math.sqrt(pieces.length) // Define a matriz (5x5)
    let blankIndex = pieces.findIndex(piece => piece.classList.contains("blank")) // Encontra espaço vazio

    // Movimentos possíveis
    function getValidMoves(index) {
        let moves = []
        let row = Math.floor(index / gridSize)
        let col = index % gridSize

        if (row > 0) moves.push(index - gridSize) // Cima
        if (row < gridSize - 1) moves.push(index + gridSize) // Baixo
        if (col > 0) moves.push(index - 1) // Esquerda
        if (col < gridSize - 1) moves.push(index + 1) // Direita

        return moves
    }

    // Move aleatoriamente para embaralhar o estado inicial
    let previousIndex = null
    let shuffleMoves = 100

    for (let i = 0; i < shuffleMoves; i++) {
        let validMoves = getValidMoves(blankIndex)

        // Evitar desfazer o movimento anterior
        if (previousIndex !== null) {
            validMoves = validMoves.filter(move => move !== previousIndex)
        }

        // Escolhe um movimento aleatório
        let randomMove = validMoves[Math.floor(Math.random() * validMoves.length)]

        let blankTile = pieces[blankIndex]
        let moveTile = pieces[randomMove]

        let temp = blankTile.outerHTML
        blankTile.outerHTML = moveTile.outerHTML
        moveTile.outerHTML = temp

        // Atualiza lista de peças após troca
        pieces = Array.from(document.querySelectorAll(".piece-puzzle"))
        previousIndex = blankIndex
        blankIndex = randomMove
    }

    // Adiciona os Events de click novamente às peças, após o shuffle
    addTileClickEvents()
}

function addTileClickEvents() {
    let tiles = document.querySelectorAll(".piece-puzzle")
    tiles.forEach(tile => {
        tile.addEventListener("click", movePieces)
    });
}

// Resetar Tabuleiro
function resetBoard() {
    let goalPieces = document.querySelectorAll(".piece-goal")
    let tempo = document.querySelector("#tempo")
    const colors = ["blue", "yellow", "red", "pink", "green"]
    let pieces = Array.from(document.querySelectorAll(".piece-puzzle"))
    let gridSize = Math.sqrt(pieces.length)

    // Deixa o board do objetivo em branco
    goalPieces.forEach(piece => {
        colors.forEach(color => piece.classList.remove(color))
    })

    // Coloca as linhas na ordem de cores inicial
    for(let i = 0; i < gridSize; i++){
        for (let j = 0; j < gridSize; j++) {
            let piece = pieces[i * gridSize + j]
            colors.forEach(color => piece.classList.remove(color))
            piece.classList.add(colors[i])
        }
    }

    // Resetar as variáveis globais
    tempo.innerHTML = "00:00"
    gameStarted = false
    gameEnded = false
}

// Mover Peças
const tiles = document.querySelectorAll(".piece-puzzle")
tiles.forEach(tile => tile.addEventListener("click", () => movePieces()))

function movePieces(event) {
    if (!gameStarted) {
        alert("Você precisa escolher o modo de jogo, e iniciá-lo primeiro!")
        return
    }

    let pieces = Array.from(document.querySelectorAll(".piece-puzzle"))
    let blankIndex = pieces.findIndex(piece => piece.classList.contains("blank"))
    let clickedIndex = pieces.indexOf(event.target)
    let gridSize = Math.sqrt(pieces.length)

    if (clickedIndex === -1) return

    // Determinar se o movimento é válido (peça adjacente ao espaço em branco)
    let validMoves = []
    let row = Math.floor(blankIndex / gridSize)
    let col = blankIndex % gridSize

    if (row > 0) validMoves.push(blankIndex - gridSize) // Cima
    if (row < gridSize - 1) validMoves.push(blankIndex + gridSize) // Baixo
    if (col > 0) validMoves.push(blankIndex - 1) // Esquerda
    if (col < gridSize - 1) validMoves.push(blankIndex + 1) // Direita

    if (!validMoves.includes(clickedIndex)) return

    // Trocar as classes da peça clicada com a peça em branco
    let blankTile = pieces[blankIndex]
    let clickedTile = pieces[clickedIndex]

    let tempClasses = Array.from(clickedTile.classList)
    clickedTile.className = blankTile.className
    blankTile.className = tempClasses.join(" ")

    checkWinCondition()
}

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
            tempo.innerHTML = String(min).padStart(2, "0") + ":" + String(seg).padStart(2, "0")
        }, 1000)
    }
    else if (currentGameMode == "Tempo Limite") {
        clearInterval(intervalTimed)
        clearInterval(intervalTimeLimit)
        tempo.innerHTML = "05:00"
        segundos = 5 * 60
        intervalTimeLimit = setInterval(() => {
            segundos = segundos - 1
            let min = Math.floor(segundos / 60)
            let seg = segundos % 60
            tempo.innerHTML = String(min).padStart(2, "0") + ":" + String(seg).padStart(2, "0")

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

document.addEventListener("keydown", (event) => {
    if (event.key === "r" || event.key === "R") {
        resetBoard();
    }
});