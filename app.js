
const gameBoard = document.querySelector("#gameboard"); //Grab the board
const playerDisplay = document.querySelector("#player"); //Show whose turn it is
const infoDisplay = document.querySelector("#info-display"); //show win or error messages

const width = 8; //chess board_ 8 squares wide
let playerGo = "white";
playerDisplay.textContent = playerGo;

const startPieces = [
  rook,
  knight,
  bishop,
  queen,
  king,
  bishop,
  knight,
  rook,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  rook,
  knight,
  bishop,
  queen,
  king,
  bishop,
  knight,
  rook,
];

function createBoard() {
  startPieces.forEach((startPiece, i) => {
    const square = document.createElement("div");
    square.classList.add("square");
    square.innerHTML = startPiece;

    square.firstChild?.setAttribute("draggable", true);

    square.setAttribute("square-id", i);

   const row = Math.floor((63 - i) / 8) + 1;
   square.classList.add(row % 2 === 0 ? (i % 2 === 0 ? "beige" : "brown") : (i % 2 === 0 ? "brown" : "beige"));

   if(i <= 15) square.firstChild?.firstChild?.classList.add("black");
    if(i >= 48) square.firstChild?.firstChild?.classList.add("white");
   
    gameBoard.append(square);
  });
}
createBoard();

let startPositionId, draggedElement;

document.querySelectorAll(".square").forEach(square => {
square.addEventListener("dragstart", dragStart);
square.addEventListener("dragover", e => e.preventDefault());
  square.addEventListener("drop", dragDrop);
})


function dragDrop(e){
    const correctGo = draggedElement.firstChild.classList.contains(playerGo);
     e.stopPropagation();
   const taken = e.target.classList.contains("piece");
  const valid = checkIfValid(e.target);
  const opponent = playerGo === "white" ? "black" : "white";
  const takenByOpponent = e.target.firstChild?.classList.contains(opponent);
  if(!correctGo) return;
  if(takenByOpponent && valid){
e.target.parentNode.append(draggedElement);
      e.target.remove();
      checkForWin();
      changePlayer();
      return;
  }


  if(taken && !takenByOpponent){
 infoDisplay.textContent = "Frivolous Move, Stop Disrespecting My Game!";
      setTimeout(() => (infoDisplay.textContent = ""), 1500);
      return;
  }
  if(valid){
    e.target.app(draggedElement);
    checkForWin();
    changePlayer();
  }
}


function checkIfValid(target) {
  const targetId =
    Number(target.getAttribute("square-id")) ||
    Number(target.parentNode.getAttribute("square-id"));
  const startId = Number(startPositionId);
  const piece = draggedElement.id;
  console.log("targetId", targetId);
  console.log("startId", startId);
  console.log("piece", piece);

  if(piece === "pawn") {
    const startRow = [48, 49, 50, 51, 52, 53, 54, 55]; //white pawns
    if(
        (startRow.includes(startId) && startId - width * 2 === targetId) || 
        startId - width == target || 
        (startId - width - 1 === target && document.querySelector(`[square-id ='${startId - width - 1}']`)?.firstChild) ||
        (startId - width + 1 === target && document.querySelector(`[square-id ='${startId - width + 1}']`)?.firstChild)
    ) return true;
  }

  if(piece === "knight"){
    const moves = [17, 15, 10, 6, -17, -15, -10, -6];
    return moves.includes(targetId - startId)
  }
  if(piece === "bishop") return targetId === startId + width + 1;
  if(piece === "queen") return targetId === startId + width + 1;
  if(piece === "king") {
    const diff = targetId - startId;
    return [1, -1, width, -width, width - 1, width + 1, -width + 1].includes(diff)
  }
}

function changePlayer() {
  if (playerGo === "black") {
    reverseIds();
    playerGo = "white";
  }else{
    revertIds();
    playerGo = "black";}
    playerDisplay.textContent = "playerGo";
  }


function reverseIds() {
  const allSquares = document.querySelectorAll(".square").forEach((sq, i) =>
    sq.setAttribute("square-id", width * width - 1 - i)
  );
  
}

function revertIds() {
  document.querySelectorAll(".square").forEach((sq, i) => sq.setAttribute("square-id", i));
}



function checkForWin(){
    const kings = Array.from(document.querySelectorAll("#king"));
    const whiteAlive = kings.some(k => k.firstChild?.classList.contains("white"));
    const blackAlive = kings.some(k => k.firstChild?.classList.contains("black"))
    if(!whiteAlive){
        infoDisplay.textContent = "Black Wins!";
        disableDragging();
    }

    if(!blackAlive){
        infoDisplay.textContent = "White Wins!";
        disableDragging();
    }
}
function disableDragging(){
    document.querySelectorAll(".square").forEach(sq => {
        sq.firstChild?.setAttribute("draggable", false)
    })
}