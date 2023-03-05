// återstår: funktion(er) för att kolla om man vunnit/förlorat; grej som visar hur länge man spelat och hur många minor man markerat



const playingField = document.querySelector('.playing-field');
const widthField = document.getElementById('width');
const heightField = document.getElementById('height');
const minesField = document.getElementById('mines');
const startBtn = document.querySelector('button')
let fieldBoxes = []
let gameStarted = false
let gameFinished = false


startBtn.addEventListener('click', () => {
    renderPlayingField(widthField.value, heightField.value, minesField.value)
})




function hide(element) {
    element.classList.add('invisible')
}

function renderPlayingField(xx, yy, mines) {
    playingField.innerHTML = '';
    fieldBoxes = [];
    gameFinished = false;
    gameStarted = false;
    let x = Number(xx); //kände inte för att gå igenom och byta om alla ställen jag använt dem
    let y = Number(yy)
    for (let i = 0; i<x*y; i++) {
        let box = document.createElement('aside');
        box.classList.add('box');
        box.id = `box${i}`;
        box.innerHTML = `<p></p>
        <div class="cover"></div>`;
        playingField.appendChild(box);
    }
    const boxes = document.querySelectorAll('.box')
    boxes.forEach(box => {
        fieldBoxes.push(box)
    })
    boxes.forEach(box => {
        box.addEventListener('click', ()=> {
            if (gameStarted == false) { //första klickningen
                placeMines(box.id, mines);
                placeNumbers(x, y);
                gameStarted = true
            }
            //bryt ut funktion som sätter ut siffrorna
            //

            // funktion som täcker upp en ruta
            //console.log(box)
            //hide(document.querySelector(`#${box.id} .cover`))
            uncover(box, x, y)
            // kolla efter seger eller nederlag
            checkDefeat();
            if (!gameFinished) {
                checkVictory()
            }
        })
        box.addEventListener('contextmenu', (e) => {
            e.preventDefault()
            if (document.querySelector(`#${box.id} .cover`).innerHTML == ``) {
                document.querySelector(`#${box.id} .cover`).innerHTML = `&#128681;`
            } else {
                document.querySelector(`#${box.id} .cover`).innerHTML = ``
            }
        })
    })
    playingField.style.gridTemplate = `repeat(${y}, 1fr) / repeat(${x}, 1fr)`;
}





function checkDefeat() {
    fieldBoxes.forEach(box => {
        if (box.lastChild.classList.contains('invisible') && box.firstChild.innerHTML == '💣') { //om det finns en öppnad ruta med en bomb i
            gameFinished = true //då har man förlorat
            console.log('förlust')
        }
    })
}


function checkVictory() {
    let remainingSafe = 0
    for (let box of fieldBoxes) { // letar efter säkra rutor som inte öppnats
        if (box.firstChild.innerHTML != '💣' && !box.lastChild.classList.contains('invisible')) {
            remainingSafe++
        }
    }
    if (remainingSafe == 0) { //om den inte hittar några
        gameFinished = true //då har man vunnit
        console.log('seger')
    }
}







//funktion som täcker upp en ruta och, om den är tom, åkallar sig själv på angränsande rutor
function uncover(box, x, y) {
    if (box.lastChild.innerHTML == ``) {
        hide(box.lastChild);
        if (box.firstChild.innerHTML == ``) {
            let adjacentBoxes = findAdjacent(box, x, y);
            adjacentBoxes.forEach(boxx => {
                if (!boxx.lastChild.classList.contains('invisible')) { // hindrar att den bara studsar fram och tillbaka mellan samma två för alltid
                    uncover(boxx, x, y) //call stack size exceeded inte längre
                }
            })
        }
    }
}




//funktion som placerar ut siffror
function placeNumbers(x, y) {
    fieldBoxes.forEach(box => {
        if (box.firstChild.innerHTML == '') {
            let adjacentMines = 0;
            // bryt ut funktion som returnerar angränsande rutor
            let adjacentBoxes = findAdjacent(box, x, y)
            //
            adjacentBoxes.forEach(boxx => {
                if (boxx.firstChild.innerHTML == '💣') {
                    adjacentMines++
                }
            });
            if (adjacentMines>0) {
                box.firstChild.innerHTML = adjacentMines
            }
        }
    })
}



//hittar angränsande rutor
function findAdjacent(box, x, y) {
    let adjacentBoxes = [];
    if (fieldBoxes.indexOf(box) > x-1) { // om inte i högsta raden
        adjacentBoxes.push(fieldBoxes[fieldBoxes.indexOf(box)-x]);
        if ((fieldBoxes.indexOf(box)+1) % x != 0) { // eller högra spalten
            adjacentBoxes.push(fieldBoxes[fieldBoxes.indexOf(box)-x+1])
        }
        if (fieldBoxes.indexOf(box) % x != 0) { // eller vänstra spalten
            adjacentBoxes.push(fieldBoxes[fieldBoxes.indexOf(box)-x-1])
        }
    }
    if (fieldBoxes.indexOf(box) < y*(x-1)) { // om inte i lägsta raden
        adjacentBoxes.push(fieldBoxes[fieldBoxes.indexOf(box)+x])
        //console.log(typeof fieldBoxes.indexOf(box))
        //console.log(typeof (fieldBoxes.indexOf(box)+x)) //jävla lösa typjävlar vad fan blir det en sträng för
        //console.log(x, typeof x)
        //console.log(boxes[fieldBoxes.indexOf(box)+x]) //undefined ???
        if ((fieldBoxes.indexOf(box)+1) % x != 0) { // eller högra spalten
            adjacentBoxes.push(fieldBoxes[fieldBoxes.indexOf(box)+x+1])
        }
        if (fieldBoxes.indexOf(box) % x != 0) { // eller vänstra spalten
            adjacentBoxes.push(fieldBoxes[fieldBoxes.indexOf(box)+x-1])
        }
    }
    if (fieldBoxes.indexOf(box) % x != 0) { // om inte i vänstra spalten
        adjacentBoxes.push(fieldBoxes[fieldBoxes.indexOf(box)-1])
    }
    if ((fieldBoxes.indexOf(box)+1) % x != 0) { // om inte i högra spalten
        adjacentBoxes.push(fieldBoxes[fieldBoxes.indexOf(box)+1])
    }
    return adjacentBoxes
}




function placeMines(boxID, numOfMines) {
    let copyArray = fieldBoxes.filter((box) => {
        return box.id != boxID
    })
    for (let i = 0; i<numOfMines; i++) {
        let mine = copyArray[Math.floor(Math.random()*copyArray.length)]
        mine.firstChild.innerHTML = '&#128163;'
        copyArray.splice(copyArray.indexOf(mine), 1)
    }
    
}