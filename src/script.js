const tiles = document.querySelectorAll(".piece-puzzle")
const timer = document.querySelector("#time")
const gamemodeTimed = document.querySelector("#modo-cronometrado")
const gamemodeTimeLimit = document.querySelector("#modo-limite")

let gameStarted = false
let gameEnded = false

let player = ""
let time = 0