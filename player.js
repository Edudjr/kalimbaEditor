var matrix = createMatrix();
createDebug(matrix);
createMatrixOnCanvas();

function createMatrixOnCanvas() {
  var main = document.getElementById("myCanvas");
  let numberOfElements = 17;
  let canvasHeight = main.offsetHeight;
  let canvasWidth = main.offsetWidth;
  let elementWidth = canvasWidth / numberOfElements;
  let xOffset = yOffset = elementWidth/2;
  
  var xPosition = 0;
  var yPosition = 0;

  for (var i = 0; i < numberOfElements; i++) {
    createSquareAt(xPosition, yPosition)
    createCircleAt(xPosition + xOffset, yPosition + yOffset);
    xPosition += elementWidth;
  }
}

function createCircleAt(x, y) {
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");
  
  let modifier = 0.5;
  let canvasWidth = canvas.offsetWidth;
  let elementWidth = canvasWidth / 17;
  let elementRadius = elementWidth / 2 * modifier;

  ctx.beginPath();
  ctx.arc(x, y, elementRadius, 0, 2 * Math.PI);
  ctx.stroke();
}

function createSquareAt(x, y) {
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");
  
  let canvasWidth = canvas.offsetWidth;
  let elementWidth = canvasWidth / 17;
  let elementHeight = elementWidth;
  
  ctx.beginPath();
  ctx.rect(x, y, elementWidth, elementHeight);
  ctx.stroke();
} 

function createDebug(matrix) {
  var main = document.getElementById("main");
  main.innerHTML += prettyText(matrix);
}

function createMatrix() {
    var line = new Array(4)
    
    for (var i = 0; i < line.length; i++) {
        line[i] = new Array(17);
      
        for (var j = 0; j < line[i].length; j++) {
            line[i][j] = 0;
        }
    }
    
    return line;
}

// Helpers
function prettyText(matrix) {
  var text = "";
  for (var i = 0; i < matrix.length; i++) {
    text += matrix[i]+"</br>";
  }
  return text
}