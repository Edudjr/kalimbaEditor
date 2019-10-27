class TabSection {
  constructor(canvas, numberOfLines, numberOfRows) {
    this.canvas = canvas;
    this.numberOfLines = numberOfLines;
    this.numberOfRows = numberOfRows;
    
    this.canvasHeight = canvas.offsetHeight;
    this.canvasWidth = canvas.offsetWidth;
    this.elementWidth = this.canvasWidth / numberOfRows;
    this.elementHeight = this.elementWidth;
    this.matrix = this._createMatrix();
    this.ctx = canvas.getContext("2d");
    
    this._createMatrixOnCanvas();
    this.that = this;
    this.canvas.addEventListener('mousedown', this._canvasListener.bind(this));
  }
  
  _canvasListener(e) {
    let matrix = this.matrix;
    let ctx = this.ctx;
    let canvas = this.canvas;
    let elementWidth = this.elementWidth;
    let elementHeight = this.elementHeight;
    
    let position = getCursorPosition(canvas, e);
    let coordinate = getCoordinatesFromPosition(position, elementWidth, elementHeight);
    
    this._selectPosition(coordinate, matrix);
    this._clearCanvas();
    this._createMatrixOnCanvas();
  }
  
  _createMatrixOnCanvas() {
    let xPosition = 0;
    let yPosition = 0;

    for (let i = 0; i < this.numberOfLines; i++) {
      for (let j = 0; j < this.numberOfRows; j++) {
        this._createSquareAt(xPosition, yPosition);
        this._colorBasedOnPosition(j);
        xPosition += this.elementWidth;
        
        if (this.matrix[i][j] == 1) {
          this._createCircleWithCoordinate([i,j]);
        }
      }
      xPosition = 0;
      yPosition += this.elementHeight;
    }
  }
  
  _createMatrix() {
    let numberOfLines = this.numberOfLines;
    let numberOfRows = this.numberOfRows;
    
    let matrix = new Array(numberOfLines)
    for (let i = 0; i < matrix.length; i++) {
        matrix[i] = new Array(numberOfRows);
        for (let j = 0; j < matrix[i].length; j++) {
            matrix[i][j] = 0;
        }
    }  
    return matrix;
  }
  
  _createSquareAt(x, y) {
    let canvas = this.canvas;
    let ctx = this.ctx;
    let elementWidth = this.elementWidth;
    let elementHeight = this.elementHeight;
    
    ctx.beginPath();
    ctx.rect(x, y, elementWidth, elementHeight);
    ctx.stroke();
  }
  
  _colorBasedOnPosition(rowNumber) {
    let ctx = this.ctx;
    let row = rowNumber + 1;
    if (row % 3 == 0) {
      ctx.fillStyle = "red";
      ctx.fill();
    }
  }
  
  _createCircleWithCoordinate(coordinateArray) {
    let elementWidth = this.elementWidth;
    let elementHeight = this.elementHeight;
    let normalizedPosition = getNormalizedPositionFromCoordinate(coordinateArray, elementWidth, elementHeight);
    let xOffset = elementWidth/2;
    let yOffset = elementHeight/2;
    let x = coordinateArray[0];
    let y = coordinateArray[1];
    let normalizedX = normalizedPosition[0] + xOffset;
    let normalizedY = normalizedPosition[1] + yOffset;
    
    this._createCircleAt(normalizedX, normalizedY);
  }

  _createCircleAt(x, y) {
    let elementWidth = this.elementWidth;
    let ctx = this.ctx;
    let modifier = 0.5;
    let elementRadius = elementWidth / 2 * modifier;

    ctx.beginPath();
    ctx.arc(x, y, elementRadius, 0, 2 * Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();
  }
  
  _clearCanvas() {
    let width = this.canvas.width;
    let height = this.canvas.height;
    let ctx = this.ctx;
    ctx.clearRect(0, 0, width, height);
  }
  
  _selectPosition(coordinateArray, matrix) {
    let x = coordinateArray[0];
    let y = coordinateArray[1];
  
    if (matrix[x][y] == 1) {
      matrix[x][y] = 0;
    } else {
      matrix[x][y] = 1;
    }
  }
}

let canvas = createCanvas("myCanvas");
let section = new TabSection(canvas, 4, 17);

let canvasListener = function(e) {
    let position = getCursorPosition(myCanvas, e);
    let coordinate = getCoordinatesFromPosition(position);
    
    selectPosition(coordinate);
    clearCanvas(myCanvas);
    createMatrixOnCanvas(matrix, myCanvas);
}


function createCanvas(id) {
  let main = document.getElementById("main");
  var newNode = document.createElement("canvas");
  newNode.id = id
  newNode.setAttribute('width', "425");
  newNode.setAttribute('height', "100");
  newNode.style.border = "thin solid #000000";
  
  var lastCanvas = main.getElementsByTagName("canvas")[0];
  var parentDiv = lastCanvas.parentNode;
  
  parentDiv.insertBefore(newNode, lastCanvas);

  let canvas = document.getElementById(id);
  return canvas;
}

function getCoordinatesFromPosition(positionArray, elementWidth, elementHeight) {
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

function getNormalizedPositionFromCoordinate(coordinateArray, elementWidth, elementHeight) {
  let y = coordinateArray[0] * elementHeight;
  let x = coordinateArray[1] * elementWidth;
  
  return [x, y];
}

function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return [x, y];
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