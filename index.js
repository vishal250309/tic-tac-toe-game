const btn_multiplayer = document.getElementById('multiplayer');
const btn_computer = document.getElementById('computer');
const btn_easy = document.getElementById('easy');
const btn_hard = document.getElementById('hard');

btn_multiplayer.style.backgroundColor = '#f39984';
btn_easy.style.backgroundColor= '#f0ba8a';

let rival = 'MultiPlayer';
let level = 'Easy';

// ----------------------------Botones----------------------------------------

btn_computer.addEventListener('click',(e)=>{
    changeColorButton(btn_multiplayer, e.target, 'rgb(243, 153, 132)');
    rival = e.target.textContent;
});

btn_multiplayer.addEventListener('click',(e)=>{
    changeColorButton(btn_computer, e.target, 'rgb(243, 153, 132)');
    rival = e.target.textContent;
});

btn_hard.addEventListener('click',(e)=>{
    changeColorButton(btn_easy, e.target, 'rgb(240, 186, 138)');
    level = e.target.textContent;
});

btn_easy.addEventListener('click',(e)=>{
    changeColorButton(btn_hard, e.target, 'rgb(240, 186, 138)');
    level = e.target.textContent;
});

function changeColorButton(button1, button2, color){
    if(button1.style.backgroundColor === color){
        button1.style.backgroundColor = '#EBEBF2';
        button2.style.backgroundColor= color;
    }
}

//---------------------------- GAME ------------------------
const displayPlayer = document.getElementById('displayPlayer');
const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('resetButton');

let board = ['','','','','','','','',''];
let players = {
    X : '<i class="fas fa-times"></i>',
    O : '<i class="fas fa-circle-notch"></i>'
}
let currentPlayer = players.X;
let isGameActive = true;

const PLAYERX_WON = 'PLAYERX_WON';
const PLAYERO_WON = 'PLAYERO_WON';
const TIE = 'TIE';

/*
    0 1 2
    3 4 5
    6 7 8
*/
const winningConditions = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]

function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        const a = board[winCondition[0]];
        const b = board[winCondition[1]];
        const c = board[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
            announce(currentPlayer === players.X ? players.X : players.O);
            isGameActive = false;
            return;
        }

    if (!board.includes(''))
        announce(TIE);
}


const announce = (type) =>{
    switch(type){
        case players.O:
            console.log('Player O won');
            modalOpen(players.O);
            break;
        case players.X:
            console.log('Player X won');
            modalOpen(players.X);
            break;
        case TIE:
            console.log('TIE');
            modalOpen('<p class="winner">TIE</p>');
            break;
    }
}

const isValidAction = (tile) => {
    if (tile.innerHTML !== ''){
        return false;
    }

    return true;
};

const updateBoard =  (index) => {
    board[index] = currentPlayer;
}

const changePlayer = ()=>{
    currentPlayer = currentPlayer === players.X ? players.O : players.X;
    displayPlayer.innerHTML = currentPlayer;
}

const userAction = (cell, index) => {
    if(isValidAction(cell) && isGameActive){
        cell.innerHTML = currentPlayer;
        updateBoard(index);
        handleResultValidation();
        changePlayer();
    }

    if(rival  === 'Computer'){
        // TODO crear logica para un turno automatico 
        blockCell(true);
        setTimeout(optionComputer, 500);
        
    };

}

cells.forEach((cell, index) =>{
    cell.addEventListener('click', () => userAction(cell, index));
})

// --------------------- Modal -----------------------------------------

const modal = document.getElementById('modal');
const modalContainer = document.getElementById('modal-container');
const resetBModal = document.getElementById('resetButtonModal'); 

const modalOpen = (text)=>{
    modalContainer.style.opacity = '1';
    modalContainer.style.visibility = 'visible';
    let winner = modal.children[0];
    let newNod = document.createElement('div');
    newNod.innerHTML = text;
    winner.appendChild(newNod);
    modal.classList.toggle('modal-close');
};

function modalClose() {
    modalContainer.style.opacity = "0";
    modalContainer.style.visibility = "hidden";
    modal.classList.toggle("modal-close");
  }

window.addEventListener('click', (e) =>{
    if(e.target === modalContainer){
        modalClose();
    }
})

resetBModal.addEventListener('click', ()=>{
    resetGame();
    modalClose();
});

// ----------------------- ReStart --------------------------------------
const resetB = document.getElementById('resetButton');

resetB.addEventListener('click', resetGame);

function resetGame (){
    isGameActive = true;
    board = ['','','','','','','','',''];

    let displaySon = displayPlayer.children[0];
    if(displaySon !=  undefined){
        displayPlayer.removeChild(displaySon);

        modal.children[0].removeChild(modal.children[0].lastChild);
    
        cells.forEach((cell,index) => {
            let children = cell.children;
            if(children.length !== 0){
                cell.removeChild(children[0]);
            }
            
        })
    }
};

// ----------------------Computer----------------------------------
function optionComputer(){
    const cellsArr = Array.from(cells);
    let emptycells = cellsArr.filter(x => {
        return x.innerHTML === '';
    });

    let option = getRandom(0,emptycells.length);
    let cell = cellsArr.indexOf(emptycells[option]);
    
    if (isGameActive){
        cells[cell].innerHTML = currentPlayer;
        updateBoard(cell);
        handleResultValidation();
        changePlayer();
    }
    blockCell(false);
} 

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function blockCell (valid){
    cells.forEach(x => x.style.pointerEvents = valid?'none':'');
}