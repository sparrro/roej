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
            if (gameStarted == false) {
                placeMines(box.id, mines)
                gameStarted = true
            }
            if (box.firstChild.innerHTML == '') {
                let adjacentMines = 0;
                let adjacentBoxes = [];

                if (fieldBoxes.indexOf(box) > x-1) { // om inte i högsta raden
                    adjacentBoxes.push(boxes[fieldBoxes.indexOf(box)-x]);
                    if ((fieldBoxes.indexOf(box)+1) % x != 0) { // eller högra spalten
                        adjacentBoxes.push(boxes[fieldBoxes.indexOf(box)-x+1])
                    }
                    if (fieldBoxes.indexOf(box) % x != 0) { // eller vänstra spalten
                        adjacentBoxes.push(boxes[fieldBoxes.indexOf(box)-x-1])
                    }
                }
                if (fieldBoxes.indexOf(box) < y*(x-1)) { // om inte i lägsta raden
                    adjacentBoxes.push(boxes[fieldBoxes.indexOf(box)+x])
                    //console.log(typeof fieldBoxes.indexOf(box))
                    //console.log(typeof (fieldBoxes.indexOf(box)+x)) //jävla lösa typjävlar vad fan blir det en sträng för
                    //console.log(x, typeof x)
                    //console.log(boxes[fieldBoxes.indexOf(box)+x]) //undefined ???
                    if ((fieldBoxes.indexOf(box)+1) % x != 0) { // eller högra spalten
                        adjacentBoxes.push(boxes[fieldBoxes.indexOf(box)+x+1])
                    }
                    if (fieldBoxes.indexOf(box) % x != 0) { // eller vänstra spalten
                        adjacentBoxes.push(boxes[fieldBoxes.indexOf(box)+x-1])
                    }
                }
                if (fieldBoxes.indexOf(box) % x != 0) { // om inte i vänstra spalten
                    adjacentBoxes.push(boxes[fieldBoxes.indexOf(box)-1])
                }
                if ((fieldBoxes.indexOf(box)+1) % x != 0) { // om inte i högra spalten
                    adjacentBoxes.push(boxes[fieldBoxes.indexOf(box)+1])
                }

                adjacentBoxes.forEach(boxx => {
                    if (boxx.firstChild.innerHTML == '💣') {
                        adjacentMines++
                    }
                });
                if (adjacentMines>0) {
                    box.firstChild.innerHTML = adjacentMines
                }
            }
            hide(document.querySelector(`#${box.id} .cover`))
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