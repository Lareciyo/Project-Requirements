//These queryies grab parts of the page so it can be changed and or updated later 
const board = document.querySelector('#gameboard');//where I've the drawn the board
const playerDisplay = document.querySelector('#player'); //shows whose turn it will be
const infoDisplay = document.querySelector('#info-display');//shows the messages
const resetBtn = document.querySelector('#reset-btn'); //button to reset game

let selectedSquare = null;  //nothing is selected at the start
let currentPlayer = 'White'; //White always start first in chess
let boardState = []; 
let draggedPiece = null;//should keep track of the pieces being dragged
let dragFrom = null;
//8 rows and 8 columns should be enough
//=====================SETTING THE BOARD===============================
function initBoardState(){
    boardState = [];
    for(let row = 0; row < 8; row++){
        boardState[row]=[];
        for(let col = 0; col < 8; col++){
            boardState[row][col] = startPieces[row * 8 + col];
        }
    }
}
//This is the board creation 
function createBoard(){
    board.innerHTML = '';
    for(let row = 0; row < 8; row++){
        for(let col = 0; col < 8; col++){
            const square = document.createElement('div');
            square.classList.add('square');
            square.classList.add((row + col) % 2 === 0 ? 'white' : 'black');
            square.dataset.row = row;
            square.dataset.col = col;

            const piece = boardState[row][col];
            if(piece !== ''){
                const pieceDiv = document.createElement('div');
                pieceDiv.innerText = piece;
                pieceDiv.classList.add('piece');
                pieceDiv.setAttribute('draggable', true);
                pieceDiv.dataset.row = row;
                pieceDiv.dataset.col = col;
                square.appendChild(pieceDiv)
            }
            board.appendChild(square)
        }
    }
    setupDragHandlers();
}
//===========================DRAGGABLES====================================
//this is the creation of the drag events