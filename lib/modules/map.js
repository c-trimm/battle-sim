define(["maps/testmap", "lib/astar"], function(map, pathfinder) {
    var fieldEl = document.getElementById('battlefield');
    var field   = fieldEl.getContext("2d");
    
    var mapHeight = map.height + 1;
    var mapWidth = map.width + 1;
    var mapColor = 'green';
    
    var blockSize = map.height / map.blockMatrix.length;
    
    fieldEl.style.width = mapWidth + "px";
    fieldEl.style.height = mapHeight + "px";
    field.canvas.width = mapWidth;
    field.canvas.height = mapHeight;
    
    var mapGraph = new pathfinder.Graph(map.blockMatrix, {
        'diagonal': true
    });
    
    function init() {
        drawGrid();
        fillWalls();
    }

    function drawGrid() {
        for (var x = 0.5; x < mapWidth; x += blockSize) {
            field.moveTo(x, 0);
            field.lineTo(x, mapHeight);
        }
        
        for (var y = 0.5; y < mapHeight; y += blockSize) {
            field.moveTo(0, y);
            field.lineTo(mapWidth, y);
        }
        
        field.strokeStyle = mapColor;
        field.stroke();
    }
    
    function fillWalls() {
        for (var y = 0; y < map.blockMatrix.length; y++) {
            for (var x = 0; x < map.blockMatrix[y].length; x++) {
                if (map.blockMatrix[y][x] == 0) {
                    field.fillStyle = mapColor;
                    field.fillRect(x*blockSize, y*blockSize, blockSize,blockSize);
                }
            }
        }
    }
    
    function drawTroop(x, y, color) {
        field.beginPath();
        field.fillStyle = color;
        var posX = x * blockSize + (blockSize/2);
        var posY = y * blockSize + (blockSize/2);
        field.arc(posX, posY, 10, 0, (Math.PI/180)*360);
        field.fill();
    }
    
    function drawPathNode(x, y, color, stopPoint) {
        field.beginPath();
        field.fillStyle = color;
        var posX = x * blockSize + (blockSize/2);
        var posY = y * blockSize + (blockSize/2);
        field.arc(posX, posY, 5, 0, (Math.PI/180)*360);
        field.fill();
        
        if (stopPoint) {
            field.beginPath();
            field.fillStyle = color;
            field.arc(posX, posY, 7, 0, (Math.PI/180)*360);
            field.stroke();
        }
    }
    
    function findPath(start, end) {
        var startGrid = mapGraph.grid[start.y][start.x];
        var endGrid = mapGraph.grid[end.y][end.x];
        return pathfinder.astar.search(mapGraph, startGrid, endGrid);
    }
    
    function simulate() {
        var troop1 = {
            'x': 0,
            'y': 0,
            'speed': 3,
            'range': 1,
            'inRange': false,
            'color': 'red'
        };
        
        var troop2 = {
            'x': 19,
            'y': 9,
            'speed': 2,
            'range': 1,
            'inRange': false,
            'color': 'blue'
        };
        
        drawTroop(troop1.x, troop1.y, troop1.color);
        drawTroop(troop2.x, troop2.y, troop2.color);
        
        var hasTurn = true;
        while (hasTurn) {
            if (!troop1.inRange) {
                var troop1Path = doPathSegment(troop1, troop2);
                troop1.x = troop1Path.newX;
                troop1.y = troop1Path.newY;
                troop1.inRange = troop1Path.inRange;
            }
            
            if (!troop2.inRange) {
                var troop2Path = doPathSegment(troop2, troop1);
                troop2.x = troop2Path.newX;
                troop2.y = troop2Path.newY;
                troop2.inRange = troop2Path.inRange;
            }
            
            hasTurn = !(troop1.inRange && troop2.inRange);
        }
    }
    
    function doPathSegment(troop1, troop2) {
        var path = findPath(troop1, troop2);
        path = path.slice(0, troop1.speed);
        
        // Stop moving once in range
        var lastNode = path[path.length-1];
        var inRange = false;
        if (lastNode && (lastNode.y == troop2.x) && (lastNode.x == troop2.y)) {
            path = path.slice(0, path.length - troop1.range);
            lastNode = path[path.length-1];
            inRange = true;
        }
        
        if (!lastNode) {
            inRange = true;
        }
        
        for (var i = 0; i < path.length; i++) {
            drawPathNode(path[i].y, path[i].x, troop1.color, i == path.length-1);
        }
        
        return {
            'newX': (typeof lastNode != 'undefined') ? lastNode.y : troop1.x,
            'newY': (typeof lastNode != 'undefined') ? lastNode.x : troop1.y,
            'inRange': inRange
        };
    }

    
    return {
        'init': init,
        'findPath': findPath,
        'simulate': simulate
    };
});