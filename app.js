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
    console.log('Board state initialized:', boardState)
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
                const pieceDiv = document.createElement('div');//create the piece
                pieceDiv.innerText = piece; // shows the chess symbol
                pieceDiv.classList.add('piece');  //styles the piece
                pieceDiv.setAttribute('draggable', true); //makes it draggable
                pieceDiv.dataset.row = row;  //remember's where it's from 
                pieceDiv.dataset.col = col; //remember's where it's from 
                square.appendChild(pieceDiv) //places the piece on the square
            }
            board.appendChild(square)  //adds the square to the board
        }
    }
    console.log('Board created with current boardState.')
    setupDragHandlers();//lets the piece resp to dragging
}
//===========================DRAGGABLES====================================
//this is the creation of the drag events
function setupDragHandlers(){
    const pieces = document.querySelectorAll(".piece");
    pieces.forEach(piece => piece.addEventListener('dragstart', handleDragStart));
    console.log(`Drag handlers set up for ${pieces.length} pieces.`)
    const squares = document.querySelectorAll('.square');
    squares.forEach(square => {
        square.addEventListener('dragover', e => e.preventDefault());
        square.addEventListener('drop', handleDrop)
    })
}
//=============================When dragging starts listen

function handleDragStart(e){
    const toRow = parseInt(square.dataset.row);
    const toCol = parseInt(square.dataset.col);
    const piece = boardState[row][col];
    //==========================currentPlayers piece
    //drag only your own piece
    if(getPieceColor(piece)!== currentPlayer){
        e.preventDefault();
        infoDisplay.innerText = `It's ${currentPlayer}'s turn.`;
        return;
    }
    draggedPiece = piece;// save piece
    dragFrom = [row, col]; //save staring position

}

//=======================dropped piece
function handleDrop(event){
    const toRow = parseInt(e.currentTarget.dataset.row);
    const toCol = parseInt(e.currentTarget.dataset.col);
    const [fromRow, fromCol] = dragFrom;
    boardState[toRow][toCol] = draggedPiece; //move piece
    boardState[fromRow][fromCol] = ''; //clear old spot
    //check moves
    if(isMoveLegal(fromRow, fromCol, toRow, toCol)){
        boardState[toRow][toCol] = draggedPiece; //move piece
        boardState[fromRow][fromCol] = ''; //clear old spot
        //rewarding the pawn for making it across the board upgrade to a queen
        if(draggedPiece === '♙' && toRow === 0)//if this white pawn reaches the top row it will be replaced with a white queen
            boardState[toRow][toCol] = '♕';
        if(draggedPiece === '♟' && toRow === 7)//if this black pawn reaches the bottom row it will be replaced with a black queen
            boardState[toRow][toCol] = '♛';

        createBoard(); //updates the board with queen info

        //switch to the other player
        currentPlayer = currentPlayer === "White" ? "Black" : "White";//if currentPlayer is white, it becomes black
        playerDisplay.innerText = currentPlayer;//displays whose turn it is next
        infoDisplay.innerText = ''; //clears out old messages
    }else{
        infoDisplay.innerText = "Frivolous Move, Are You Nervous!";
    }

    draggedPiece = null; //reset dragged piece and it's previous position
    dragFrom = null; //resets the drag-and-drop-logic so the board should be ready for the next turn.
}

//======================RESET BUTTON LOGIC

resetBtn.addEventListener('click', () => {//when the reset button is clicked , it clears the board and starts a new game
    selectedSquare = null;//clear out the square the player clicked on
    draggedPiece = null;
    dragFrom = null;//clear out the square memory
    currentPlayer = 'White';//the game always starts with white
    playerDisplay.innerText = currentPlayer;//updates the player display box, keeps the user informed
    infoDisplay.innerText = '';//clears out any old messages

    initBoardState();//loading a fresh chessboard
    createBoard();//the function redraws the board on the screen

})
//===================SPOILS OF WAR

