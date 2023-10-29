const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 800;

const nextFigureCanvas = document.getElementById("nextFigure");
const nextFigureCtx = nextFigureCanvas.getContext("2d");
nextFigureCanvas.width = 160;
nextFigureCanvas.height = 160;

var events = {};
var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
var flipPressed = false;
var isPause = false;
var NoDoubleClick = 0;
var columns = 10;
var rows = 20;
var start = true;
var gameOver = false;
var requestId;
var tick = 0;
var figureArray = [];
var figureSize = 40;
var tetrisMap = createTetris();
var nowFigure = newFigure();
var checkFigure;
var level = 0;
var score = 0;
var counterLines = 0;
var points = {
    '1': 100,
    '2': 300,
    '3': 900,
    '4': 1500,
    '5': 3000,
    '6': 5000
}
window.onload = function(){
    for(var i = 0; i < tetrisMap.length; i++){
        for(var j = 0; j < tetrisMap[i].length; j++){
            document.getElementById('tetrisMap').innerHTML += '<div class="cel"></div>';
        }
    }
    for(var i = 0; i < 4; i++){
        for(var j = 0; j < 4; j++){
            document.getElementById('mapNextFigure').innerHTML += '<div class="cel"></div>';
        }
    }

}
document.addEventListener("keydown", keyRightHandler, false);
document.addEventListener("keyup", keyLeftHandler, false);

function keyRightHandler(e) {
    if (e.keyCode == 39) {
      rightPressed = true;
    }
    if (e.keyCode == 37) {
      leftPressed = true;
    }
    if (e.keyCode == 40) {
      upPressed = true;
    }
    if(e.keyCode == 40){
      downPressed = true;
    }
    if(e.keyCode == 32){
        flipPressed = true;
    }
  }
  function keyLeftHandler(e) {
    if (e.keyCode == 39) {
      rightPressed = false;
    }
    if (e.keyCode == 37) {
      leftPressed = false;
    }
    if(e.keyCode == 40){
      downPressed = false;
    }
    if (e.keyCode == 40) {
      upPressed = false;
    }
    if(e.keyCode == 32){
      flipPressed = false;
    }
  }
  
function gameLoop(){
    update();
    render();
    requestId = requestAnimationFrame(gameLoop);
}

document.getElementById('start').onclick = function (){
    if(isPause){
        cancelAnimationFrame(requestId);
        gameLoop();
        isPause = false;
    }else{
        cancelAnimationFrame(requestId);
        var count = 0;
        counterScore(count);
        countingLevel(count);
        tick = 0;
        gameOver = false;
        tetrisMap = createTetris();
        nowFigure = newFigure();
        nextFigure();
        gameLoop();
    }
}
document.getElementById('stop').onclick = function (){
    isPause = true;
    cancelAnimationFrame(requestId);
}

function update(){
    if(gameOver){
        return;
    }
    tick++;
    if(start){
        figureArray.push(
            newFigure(),
        );
        start = false;
}       if(figureArray[0]&&tick%20==0){

    figureArray[0].y += 1;
    if(conflictWall()){
        figureArray[0].y -= 1;
        figureArray[0].next = 1;
        saveArrayTetris();
        nextFigure();
    }
    if(conflictWall()){
        gameOver = true;
        cancelAnimationFrame(requestId);
        console.log(gameOver);
    }
}
        if(leftPressed && tick%10==0){

            figureArray[0].x -= 1;
            if(conflictWall()){
                figureArray[0].x += 1;

            }

        }if (rightPressed && tick%17==0){

            figureArray[0].x += 1;
            if(conflictWall()){
                figureArray[0].x -= 1;
            }

        }if (downPressed&& tick%17==0){
            figureArray[0].y += 1;
            if(conflictWall()){
                figureArray[0].y -= 1;
                figureArray[0].next = 1;
                saveArrayTetris();
                nextFigure();
            }

        }if (flipPressed && tick%20==0 && NoDoubleClick == 0){
            NoDoubleClick = 1;
            figureRotate();
            NoDoubleClick = 0;
        }
        
    // if(figureArray[i].checkNext == 1){
    //     figureArrayAll.push(figureArray[i]);
    //     figureArray.splice(i,1);
    //     nextFigure = true;
    // }


    }


function render(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    nextFigureCtx.clearRect(0,0,nextFigureCanvas.width,nextFigureCanvas.height);
    renderFigure();
}


function saveTetris(){
    var tetris = createTetris();
    for (var i = 0; i < tetrisMap.length; i++){
        tetris[i] = [];
        for(var j = 0; j < tetrisMap[i].length; j++){
            tetris[i][j] = tetrisMap[i][j]
        }
    }

    for(var y = 0; y < figureArray[0].pos.length; y++){
        for(var x = 0; x < figureArray[0].pos[y].length; x++){
            if(figureArray[0].pos[y][x]){
                tetris[figureArray[0].y + y][figureArray[0].x + x] = figureArray[0].pos[y][x];
            }
        }
    }

    return {
        tetris
    }
}

function createTetris(){
    var tetris = [];
    for(var i = 0; i < rows; i++){
        tetris[i] = [];
        for(var j = 0; j < columns; j++){
            tetris[i][j] = 0;
        }
    }
    return tetris;
}

function newFigure (){
    var count = deleteLine();
    counterScore(count);
    countingLevel(count);
    deleteLine();
    var index = Math.floor(Math.random() * 7);
    var figure = {x: 5, y: 0, next: 0, color: index};
    if(checkFigure == index){
        index++;
    }
    switch (index){
        case 0:
            figure.pos = [
                [0,0,0,0,],
                [1,1,1,1,],
                [0,0,0,0,],
                [0,0,0,0,],
            ];
            break;
        case 1:
            figure.pos = [
                [0,0,0],
                [2,2,2],
                [0,0,2],
            ];
            break;
        case 2:
            figure.pos = [
                [0,0,0],
                [3,3,3],
                [3,0,0],
            ];
            break;
        case 3:
            figure.pos = [
                [0,0,0,0],
                [0,4,4,0],
                [0,4,4,0],
                [0,0,0,0],
            ];
            break;
        case 4:
            figure.pos = [
                [0,0,0],
                [0,5,5],
                [5,5,0],
            ];
            break;
        case 5:
            figure.pos = [
                [0,0,0],
                [6,6,6],
                [0,6,0],
            ];
            break;
        case 6:
            figure.pos = [
                [0,0,0],
                [7,7,0],
                [0,7,7],
            ];
            break;
            default:
                figure.pos = [
                    [0,0,0],
                    [0,5,5],
                    [5,5,0],
                ];
    }
    checkFigure = index;
    return figure;
}

function swapFigure(){
    for(var y = 0; y < figureArray[0].pos.length; y++){
        for(var x = 0; x < figureArray[0].pos[y].length; x++){
            if(figureArray[0].pos[y][x]){
                tetrisMap[figureArray[0].y + y][figureArray[0].x + x] = figureArray[0].pos[y][x];
            }
        }
    }
}

function conflictWall(){
    for(var y = 0; y < figureArray[0].pos.length; y++){
        for(var x = 0; x < figureArray[0].pos[y].length; x++){
            if(
               figureArray[0].pos[y][x] &&
               ((tetrisMap[figureArray[0].y + y] === undefined || tetrisMap[figureArray[0].y + y][figureArray[0].x +x] === undefined)||
               tetrisMap[figureArray[0].y + y][figureArray[0].x + x])

                ){
                return true;
            }
        }
    }
    return false
}

function figureRotate(){
    var pos = figureArray[0].pos;
    var length = figureArray[0].pos.length;
    var temp = [];
    for (var u = 0; u < length; u++){
        temp[u] = new Array(length).fill(0);
    }
    for(var i = 0; i < length; i++){
        for(var j = 0; j < length; j++){
            temp[j][i] = figureArray[0].pos[length - 1 - i][j];
        }
    }
    figureArray[0].pos = temp;
    if(conflictWall()){
        figureArray[0].pos = pos;
    }
}

function saveArrayTetris(){
    for(var y = 0; y < figureArray[0].pos.length; y++){
        for(var x = 0; x < figureArray[0].pos[y].length; x++){
            if(figureArray[0].pos[y][x]){
                tetrisMap[figureArray[0].y + y][figureArray[0].x + x] = figureArray[0].pos[y][x];
            }
        }
    }
    }

function renderFigure(){
    var tetris = saveTetris().tetris;
    var colors =  {
        '1': 'rebeccapurple',
        '2': 'white',
        '3': 'red',
        '4': 'aqua',
        '5': 'forestgreen',
        '6': 'gold',
        '7': 'magenta',
    };
 for(var y = 0; y < tetris.length; y++){
     var line = tetris[y];
     for(var x = 0; x < line.length; x++){
        var block = line[x];
        if(block){
         ctx.fillStyle = colors[block];
         ctx.strokeStyle = 'black';
         ctx.lineWidth = 2;
         ctx.fillRect(x * figureSize, y * figureSize, figureSize, figureSize);
         ctx.strokeRect(x * figureSize, y * figureSize, figureSize, figureSize);
        }
     }
 }
 for(var y = 0; y < nowFigure.pos.length; y++){
    var line2 = nowFigure.pos[y];
    for(var x = 0; x < line2.length; x++){
       var block2 = line2[x];
       if(block2){
       nextFigureCtx.fillStyle = colors[block2];
        nextFigureCtx.strokeStyle = 'black';
        nextFigureCtx.lineWidth = 2;
        nextFigureCtx.fillRect(x * figureSize, y * figureSize, figureSize, figureSize);
        nextFigureCtx.strokeRect(x * figureSize, y * figureSize, figureSize, figureSize);
       }
    }
    
}

}
 function nextFigure(){
    figureArray[0] = nowFigure;
    nowFigure = newFigure();
    for(var i = 0; i < rows; i++){
        if(i == figureArray[0].y){
           for(var j = 0; j < columns; j++){
            if(j == figureArray[0].x){
                saveTetris().tetris[i][j] = 1;
            }
        } 
    }  
}
 }

function deleteLine(){
    var line = [];
    for(var y = rows - 1; y >= 0; y--){
        var count = 0;
        for(var x = 0; x < columns; x++){
            if(tetrisMap[y][x] !== 0){
               count++;
            }
        }
        if(count == 0){
            break;
        }else if(count < columns){
            continue;
        }else if (count == columns){
            line.unshift(y);
        }
    }
    for(var i of line){
        tetrisMap.splice(i,1);
        tetrisMap.unshift(new Array(columns).fill(0));
    }
    return line.length;
}

function counterScore(count){
    if(count > 0){
        score += points[count];
        counterLines += count;
        document.querySelector('.score').innerHTML = "score " + score;
    }
}

function countingLevel(){ 
        level = Math.floor(counterLines * 0.1);
        document.querySelector('.level').innerHTML = "level " + level;
}
