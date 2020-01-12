class CursorHelper {
  static getCursorPosition(canvas, event) {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      return [x, y];
  }
}

class CanvasDrawingHelper {
  static createRect(canvas, x, y, width, height) {
    let ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.stroke();
  }
  
  static fillRect(canvas, x, y, width, height, color) {
    let ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.fillStyle = color;
    ctx.fill();
  }
  
  static fillCircle(canvas, x, y, radius, color) {
    let ctx = canvas.getContext("2d");
    let elementWidth = this.elementWidth;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  }
  
  static clearCanvas(canvas) {
    let ctx = canvas.getContext("2d");
    let width = canvas.width;
    let height = canvas.height;
    ctx.clearRect(0, 0, width, height);
  }
  
  static createTextAt(canvas, text, size, x, y, color) {
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = color;
    ctx.font = size+"px Arial";
    ctx.textAlign = "center";
    ctx.fillText(text, x, y);
  }
}

class MatrixHelper {
  static createMatrix(numberOfLines, numberOfRows) {
    let matrix = new Array(numberOfLines)
    for (let i = 0; i < matrix.length; i++) {
        matrix[i] = new Array(numberOfRows);
        for (let j = 0; j < matrix[i].length; j++) {
            matrix[i][j] = 0;
        }
    }  
    return matrix;
  }
}

class TabSectionUI {
  constructor(canvas, tabSection) {
    this.canvas = canvas;
    this.tabSection = tabSection;
    this.canvasHeight = canvas.offsetHeight;
    this.canvasWidth = canvas.offsetWidth;
    this.elementWidth = this.canvasWidth / tabSection.numberOfRows;
    this.elementHeight = this.elementWidth;
    this.ctx = canvas.getContext("2d");
    
    this._createMatrixOnCanvas();
    this.canvas.addEventListener('mousedown', this._canvasListener.bind(this));
  }
  
  _canvasListener(e) {
    let matrix = this.tabSection.matrix;
    let canvas = this.canvas;
    let ctx = this.ctx;
    let elementWidth = this.elementWidth;
    let elementHeight = this.elementHeight;
    
    let coordinate = CursorHelper.getCursorPosition(canvas, e);
    let x = coordinate[0];
    let y = coordinate[1];
    let lineRow = this._getLineRowFromXY(x, y);
    
    this.tabSection.selectPosition(lineRow);
    CanvasDrawingHelper.clearCanvas(canvas);
    AudioHelper.playAudio(lineRow[1]);
    this._createMatrixOnCanvas();
  }
  
  _createMatrixOnCanvas() {
    let xPosition = 0;
    let yPosition = 0;
    let ctx = this.ctx;
    let numberOfLines = this.tabSection.numberOfLines;
    let numberOfRows = this.tabSection.numberOfRows;
    let canvas = this.canvas;
    let elementWidth = this.elementWidth;
    let elementHeight = this.elementHeight;
    let matrix = this.tabSection.matrix;

    for (let i = 0; i < numberOfLines; i++) {
      for (let j = 0; j < numberOfRows; j++) {
        this._createRedRectBasedOnRow(xPosition, yPosition, j);
        this._createRect(xPosition, yPosition);
        let isPositionSelected = this.tabSection.isPositionSelected([i,j]);
        if (isPositionSelected) {
          this._createCircleFromPosition(i,j);
        }
        
        xPosition += elementWidth;
      }
      xPosition = 0;
      yPosition += this.elementHeight;
    }
  }
  
  _createRect(x, y) {
    let canvas = this.canvas;
    let width = this.elementWidth;
    let height = this.elementHeight;
    CanvasDrawingHelper.createRect(canvas, x, y, width, height);
  }
  
  // TODO: make this dependent on the tabSection or something else
  _createRedRectBasedOnRow(x, y, rowNumber) {
    let canvas = this.canvas;
    let width = this.elementWidth;
    let height = this.elementHeight;
    let row = rowNumber + 1;
    if (row % 3 == 0) {
      CanvasDrawingHelper.fillRect(canvas, x, y, width, height, "red")
    }
  }
  
  _createCircleFromPosition(line, row) {
    let elementWidth = this.elementWidth;
    let elementHeight = this.elementHeight;
    let minXY = this._getMinXYFromPosition(line, row, elementWidth, elementHeight);
    let xOffset = elementWidth/2;
    let yOffset = elementHeight/2;
    let centeredX = minXY[0] + xOffset;
    let centeredY = minXY[1] + yOffset;
    
    this._createCircle(centeredX, centeredY);
  }

  _createCircle(x, y) {
    let canvas = this.canvas;
    let elementWidth = this.elementWidth;
    let modifier = 0.5;
    let elementRadius = elementWidth / 2 * modifier;
    
    CanvasDrawingHelper.fillCircle(canvas, x, y, elementRadius, "black");
  }
  
  _getMinXYFromPosition(line, row, elementWidth, elementHeight) {
    let y = line * elementHeight;
    let x = row * elementWidth;
    return [x, y];
  }
  
  // TODO: create a helper for that - position things - based on the tabSection somehow
  _getLineRowFromXY(x, y) {
    let width = this.elementWidth;
    let height = this.elementHeight;
        
    let currentX = width;
    let currentY = height;
    
    let line = 0;
    let row = 0;
    
    while (currentX < x) {
      currentX += width;
      row ++;
    }
    
    while (currentY < y) {
      currentY += height;
      line ++;
    }
    
    return [line, row];
  }
}

class TabFooterSectionUI {
  constructor(canvas, numberOfLines, numberOfRows, notesArray) {
    this.canvas = canvas;
    this.notesArray = notesArray;
    this.numberOfLines = numberOfLines;
    this.numberOfRows = numberOfRows; 
    
    this._createFooterSection();
  }
  
  _createFooterSection() {
    let canvas = this.canvas;
    let lines = this.numberOfLines;
    let rows = this.numberOfRows;
    let squareSize = this.canvas.offsetWidth / this.numberOfRows;
    let currentX = 0;
    let textOffsetX = squareSize/2;
    let textOffsetY = squareSize - 5;
    let notes = this.notesArray;
    
    for (let i = 0; i < rows; i++) {
      this._colorRectBasedOnPosition(canvas, currentX, 0, i, squareSize);
      CanvasDrawingHelper.createRect(canvas, currentX, 0, squareSize, squareSize, "red");
      CanvasDrawingHelper.createTextAt(canvas, notes[i], 15, currentX + textOffsetX, textOffsetY, "black");
      currentX += squareSize;
    }
  }
  
  _colorRectBasedOnPosition(canvas, x, y, rowNumber, squareSize) {
    let width = squareSize;
    let height = squareSize;
    let row = rowNumber + 1;
    if (row % 3 == 0) {
      CanvasDrawingHelper.fillRect(canvas, x, y, width, height, "red");
    }
  }
}

class TabSection {
  constructor(numberOfLines, numberOfRows) {
    this.numberOfLines = numberOfLines;
    this.numberOfRows = numberOfRows;
    this.matrix = MatrixHelper.createMatrix(numberOfLines, numberOfRows);
  }
  
  loadMatrix(matrix) {
      for (var i=0; i < matrix.length; i ++) {
        for (var j=0; j < matrix[i].length; j ++) {
          if (matrix[i][j] == 1) {
            this.selectPosition([i,j]);
          }
        }
      }
      console.log(this.matrix);
  }
  
  selectPosition(coordinateArray) {
    let matrix = this.matrix;
    let x = coordinateArray[0];
    let y = coordinateArray[1];
  
    if (matrix[x][y] == 1) {
      matrix[x][y] = 0;
    } else {
      matrix[x][y] = 1;
    }
  }
  
  isPositionSelected(coordinateArray) {
    let matrix = this.matrix;
    let x = coordinateArray[0];
    let y = coordinateArray[1];
  
    if (matrix[x][y] == 1) {
      return true;
    } else {
      return false;
    }
  }
}

class Tablature {
  constructor(numberOfLines, numberOfRows) {
    this.numberOfLines = numberOfLines;
    this.numberOfRows = numberOfRows;
    this.sections = [];
  }
  
  addSection(tabSection) {
    this.sections.push(tabSection);
  }
}

class TablatureController {
  constructor(lines, rows) {
    this.lastCanvasId = 0;
    this.lines = lines;
    this.rows = rows;
    this.squareSize = 25;
    this.tablature = new Tablature(this.lines, this.rows);
  }
  
  loadSection(section) {
    let lines = section.numberOfLines;
    let rows = section.numberOfRows;
    let squareSize = this.squareSize;
    let width = squareSize * rows;
    let height = squareSize * lines;
    let canvasId = ++this.lastCanvasId;
    let id = "myCanvas" + canvasId;
    let canvas = CanvasHelper.createSectionCanvas(id, width, height);
    let tabSection = new TabSection(lines, rows);
    tabSection.loadMatrix(section.matrix);
    let tabSectionUI = new TabSectionUI(canvas, tabSection);
    this.tablature.addSection(tabSection);
  }
  
  createSection() {
    let lines = this.lines;
    let rows = this.rows;
    let squareSize = this.squareSize;
    let width = squareSize * rows;
    let height = squareSize * lines;
    let canvasId = ++this.lastCanvasId;
    let id = "myCanvas" + canvasId;
    let canvas = CanvasHelper.createSectionCanvas(id, width, height);
    let tabSection = new TabSection(lines, rows);
    let tabSectionUI = new TabSectionUI(canvas, tabSection);
    this.tablature.addSection(tabSection);
  }
  
  createFooter() {
    let notes = ['D','B','G','E','C','A','F','D','C','E','G','B','D','F','A','C','E'];
    let lines = this.lines;
    let rows = this.rows;
    let squareSize = this.squareSize;
    let width = squareSize * rows;
    let height = squareSize * lines;
    let canvasId = ++this.lastCanvasId;
    let id = "myCanvas" + canvasId;
    let canvas = CanvasHelper.createSectionCanvas(id, width, height);
    let tabFooterSectionUI = new TabFooterSectionUI(canvas, lines, rows, notes);
  }
  
  saveToFile() {
    let filename = 'tablature.json'
    let text = JSON.stringify(this.tablature);
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
  }
}

// CANVAS CREATION
class CanvasHelper {
  static createCanvasNode(id, width, height) {
    let main = document.getElementById("main");
    var newNode = document.createElement("canvas");
    newNode.id = id
    newNode.setAttribute('width', width);
    newNode.setAttribute('height', height);
    return newNode;
  }
  
  static createSectionCanvas(id, width, height) {
    let newNode = CanvasHelper.createCanvasNode(id, width, height);
    newNode.setAttribute('class', 'section');
    let main = document.getElementById("main");
    var lastCanvas = main.getElementsByTagName("canvas")[0];
    var parentDiv = lastCanvas.parentNode;
    
    parentDiv.insertBefore(newNode, lastCanvas);
    return newNode;
  }
  
  static clearCanvas() {
    var elements = document.getElementsByClassName("section");
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
  }
}

// AUDIO Player
class AudioHelper {
  static playAudio(row) {
    console.log(row);
    var notes = ['D2oo','B7o','G5o','E3o','C1o','A6','F4','D2','C1','E3','G5','B7','D2o','F4o','A6o','C1oo','E3oo'];
    var root = '../kalimba/';
    var name = notes[row];
    var fileName = root+name+'.mp3';
    new Audio(fileName).play();
    // new Audio('../kalimba/C1.mp3').play()
  }
}

// MAIN
var trablatureController;

function loadJsonTablature(json) {
  CanvasHelper.clearCanvas();
  let lines = json.numberOfLines;
  let rows = json.numberOfRows;
  tablatureController = new TablatureController(lines,rows);
  tablatureController.createFooter();
  json.sections.forEach(function(section) {
    tablatureController.loadSection(section);
  });
}

function saveToFile() {
  tablatureController.saveToFile();
}

function readFile (evt) {
    var files = evt.target.files;
    var file = files[0];           
    var reader = new FileReader();
    reader.onload = function(event) {
      var json = JSON.parse(event.target.result);
      loadJsonTablature(json);
    }
    reader.readAsText(file)
 }
 
 function newTablature() {
   tablatureController = new TablatureController(4,17);
   tablatureController.createFooter();
   tablatureController.createSection();
 }

// Wait until page is fully loaded
window.addEventListener('load', function () {
  newTablature();
  document.getElementById('file').addEventListener('change', readFile, false);
})


