let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let numberOfRows = 17;
let numberOfLines = 4;
let canvasHeight = canvas.offsetHeight;
let canvasWidth = canvas.offsetWidth;
let elementWidth = canvasWidth / numberOfRows;
let elementHeight = canvasHeight / numberOfLines;

let matrix = createMatrix();
createMatrixOnCanvas();


// let canvas = document.getElementById("myCanvas");
canvas.addEventListener('mousedown', function(e) {
    let position = getCursorPosition(e);
    let coordinate = getCoordinatesFromPosition(position);
    
    selectPosition(coordinate);
})

function selectPosition(coordinateArray) {
  let normalizedPosition = getNormalizedPositionFromCoordinate(coordinateArray);
  
  let xOffset = elementWidth/2;
  let yOffset = elementHeight/2;
  let x = coordinateArray[0];
  let y = coordinateArray[1];
  let normalizedX = normalizedPosition[0] + xOffset;
  let normalizedY = normalizedPosition[1] + yOffset;
  
  createCircleAt(normalizedX, normalizedY);
  matrix[x][y] = 1;
  
  console.log(matrix);
}

function getCoordinatesFromPosition(positionArray) {
  let x = positionArray[0];
  let y = positionArray[1];
  
  let currentX = elementWidth;
  let currentY = elementHeight;
  
  let line = 0;
  let row = 0;
  
  while (currentX < x) {
    currentX += elementWidth;
    row ++;
  }
  
  while (currentY < y) {
    currentY += elementHeight;
    line ++;
  }
  
  return [line, row];
}

function getNormalizedPositionFromCoordinate(coordinateArray) {
  let y = coordinateArray[0] * elementHeight;
  let x = coordinateArray[1] * elementWidth;
  
  return [x, y];
}

function getCursorPosition(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return [x, y];
}

function createMatrixOnCanvas() {
  let xPosition = 0;
  let yPosition = 0;

  for (let i = 0; i < numberOfLines; i++) {
    for (let j = 0; j < numberOfRows; j++) {
      createSquareAt(xPosition, yPosition, j);
      xPosition += elementWidth;
    }
    xPosition = 0
    yPosition += elementHeight;
  }
}

function createCircleAt(x, y) {
  let modifier = 0.5;
  let canvasWidth = canvas.offsetWidth;
  let elementWidth = canvasWidth / 17;
  let elementRadius = elementWidth / 2 * modifier;

  ctx.beginPath();
  ctx.arc(x, y, elementRadius, 0, 2 * Math.PI);
  ctx.stroke();
}

function createSquareAt(x, y, rowNumber) {
  let canvasWidth = canvas.offsetWidth;
  let elementWidth = canvasWidth / 17;
  let elementHeight = elementWidth;
  
  ctx.beginPath();
  ctx.rect(x, y, elementWidth, elementHeight);
  ctx.stroke();
  colorBasedOnPosition(ctx, rowNumber);
}

function colorBasedOnPosition(ctx, rowNumber) {
  let row = rowNumber + 1;
  if (row % 3 == 0) {
    ctx.fillStyle = "red";
    ctx.fill();
  }
}

function createDebug(matrix) {
  let main = document.getElementById("main");
  main.innerHTML += prettyText(matrix);
}

function createMatrix() {
    let line = new Array(4)
    
    for (let i = 0; i < line.length; i++) {
        line[i] = new Array(17);
      
        for (let j = 0; j < line[i].length; j++) {
            line[i][j] = 0;
        }
    }
    
    return line;
}

// Helpers
function prettyText(matrix) {
  let text = "";
  for (let i = 0; i < matrix.length; i++) {
    text += matrix[i]+"</br>";
  }
  return text
}