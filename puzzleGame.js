const playTime = document.querySelector(".play-time");
const container = document.querySelector(".image-container");
const startBtn = document.querySelector(".start-button");
const gameText = document.querySelector(".game-text");
const tiles = document.querySelectorAll(".image-container > li")


const dragged = {
    el: null,
    class: null,
    index: null,
}

container.addEventListener("dragstart", e => {
    const obj = e.target;
    dragged.el = obj;
    dragged.class = obj.className;
    dragged.index = ([...obj.parentNode.children].indexOf(obj));
});

container.addEventListener("dragover", e => {
    e.preventDefault();
});

container.addEventListener("drop", e => {
    const obj = e.target;
    let originPlace;
    let isLast = false;
    
    if(dragged.el.nextSibling){
        originPlace = dragged.el.nextSibling;
    } else {
        originPlace = dragged.el.previousSibling;
        isLast = true;
    }
    const droppedIndex = ([...obj.parentNode.children].indexOf(obj));
    // drag 
    dragged.index > droppedIndex ? obj.before(dragged.el) : obj.after(dragged.el);
    
    // drop
    isLast ? originPlace.after(obj) : originPlace.before(obj);
    
    // game check (finish or not finish)
    checkStatus();
    
});

let timeInterval = null;
let time = 0;
let isPlaying = false;

startBtn.addEventListener("click", () => {
    setGame();
});

function setGame() {
    time = 0;
    playTime.innerText = time;
    gameText.style.display = "none";
    isPlaying = true;
    clearInterval(timeInterval);

    timeInterval = setInterval(() => {
        time++;
        playTime.innerText = time;
    }, 1000);
    
    const gameTiles = shuffleImage([...tiles]);
    container.innerHTML = "";
    gameTiles.forEach(tile => {
        container.appendChild(tile);
    })
}

function shuffleImage(array) {
    let index = array.length - 1;
    while (index > 0) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [array[index], array[randomIndex]] = [array[randomIndex], array[index]];
        index--;
    }
    return array;
}

function checkStatus() {
    const currentList = [...container.children];
    const unMatched = currentList.filter((list, index) => {
        return Number(list.getAttribute("data-type")) !== index;
    })

    if(unMatched.length === 0) {
        if(isPlaying === true) {
            isPlaying = false;
            clearInterval(timeInterval);
            gameText.style.display = "block";
        }
    }
}