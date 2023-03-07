// återstår: funktion(er) för att kolla om man vunnit/förlorat; grej som visar hur länge man spelat och hur många minor man markerat



const playingField = document.querySelector('.playing-field');
const widthField = document.getElementById('width');
const minesField = document.getElementById('mines');
const startBtn = document.querySelector('button');
const mineCounter = document.querySelector('.mines-counter')
let fieldBoxes = []
let gameStarted = false
let gameFinished = false


startBtn.addEventListener('click', () => {
    renderPlayingField(widthField.value, minesField.value)
})




function hide(element) {
    element.classList.add('invisible')
}

function renderPlayingField(xx, mines) {
    playingField.innerHTML = '';
    fieldBoxes = [];
    gameFinished = false;
    gameStarted = false;
    let minesRemaining = Number(mines);
    mineCounter.innerHTML = mineCounter.innerHTML = `Återstående minor: ${minesRemaining}`
    let x = Number(xx); //kände inte för att gå igenom och byta om alla ställen jag använt dem
    for (let i = 0; i<x*x; i++) {
        let box = document.createElement('aside');
        box.classList.add('box');
        box.id = `box${i}`;
        box.innerHTML = `<p></p>
        <div class="cover"></div>`;
        playingField.appendChild(box);
        fieldBoxes.push(box)
    }
    //const boxes = document.querySelectorAll('.box')
    //fieldBoxes.forEach(box => {
    //    fieldBoxes.push(box)
    //})
    fieldBoxes.forEach(box => {
        box.addEventListener('click', ()=> {
            if (gameStarted == false) { //första klickningen
                placeMines(box.id, mines);
                placeNumbers(x);
                gameStarted = true
            }
            //bryt ut funktion som sätter ut siffrorna
            //

            // funktion som täcker upp en ruta
            //console.log(box)
            //hide(document.querySelector(`#${box.id} .cover`))
            uncover(box, x)
            // kolla efter seger eller nederlag
            checkDefeat();
            if (!gameFinished) {
                checkVictory()
            }
        })
        box.addEventListener('contextmenu', (e) => {
            e.preventDefault()
            if (!box.lastChild.classList.contains('invisible')) {
                if (document.querySelector(`#${box.id} .cover`).innerHTML == ``) {
                    document.querySelector(`#${box.id} .cover`).innerHTML = `&#128681;`;
                    minesRemaining--;
                    mineCounter.innerHTML = `Återstående minor: ${minesRemaining}`
                } else {
                    document.querySelector(`#${box.id} .cover`).innerHTML = ``;
                    minesRemaining++;
                    mineCounter.innerHTML = `Återstående minor: ${minesRemaining}`
                }
            }
        })
    })
    playingField.style.gridTemplate = `repeat(${x}, 1fr) / repeat(${x}, 1fr)`;
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
function uncover(box, x) {
    if (box.lastChild.innerHTML == ``) {
        hide(box.lastChild);
        if (box.firstChild.innerHTML == ``) {
            let adjacentBoxes = findAdjacent(box, x);
            adjacentBoxes.forEach(boxx => {
                if (!boxx.lastChild.classList.contains('invisible')) { // hindrar att den bara studsar fram och tillbaka mellan samma två för alltid
                    uncover(boxx, x) //call stack size exceeded inte längre
                }
            })
        }
    }
}




//funktion som placerar ut siffror
function placeNumbers(x) {
    fieldBoxes.forEach(box => {
        if (box.firstChild.innerHTML == '') {
            let adjacentMines = 0;
            // bryt ut funktion som returnerar angränsande rutor
            let adjacentBoxes = findAdjacent(box, x)
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
function findAdjacent(box, x) {
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
    if (fieldBoxes.indexOf(box) < x*(x-1)) { // om inte i lägsta raden
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
        //&& !Array.from(findAdjacent(box)).contains(document.querySelector(`#${boxID}`)) //vill inte funka
    })
    for (let i = 0; i<numOfMines; i++) {
        let mine = copyArray[Math.floor(Math.random()*copyArray.length)]
        mine.firstChild.innerHTML = '&#128163;'
        copyArray.splice(copyArray.indexOf(mine), 1)
    }
}