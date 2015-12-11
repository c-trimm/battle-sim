define(["maps/testmap", "lib/astar"], function(map, pathfinder) {
    var $fieldEl = document.getElementById('battlefield');
    var $field   = $fieldEl.getContext("2d");

    var $mapHeight = map.height + 1;
    var $mapWidth = map.width + 1;
    var $mapColor = 'green';

    var $blockSize = map.height / map.blockMatrix.length;

    $fieldEl.style.width = $mapWidth + "px";
    $fieldEl.style.height = $mapHeight + "px";
    $field.canvas.width = $mapWidth;
    $field.canvas.height = $mapHeight;

    var mapGraph = new pathfinder.Graph(map.blockMatrix, {
        'diagonal': true
    });

    function init() {
        drawGrid();
        fillWalls();
    }

    function drawGrid() {
        for (var x = 0.5; x < $mapWidth; x += $blockSize) {
            $field.moveTo(x, 0);
            $field.lineTo(x, $mapHeight);
        }

        for (var y = 0.5; y < $mapHeight; y += $blockSize) {
            $field.moveTo(0, y);
            $field.lineTo($mapWidth, y);
        }

        $field.strokeStyle = $mapColor;
        $field.stroke();
    }

    function fillWalls() {
        for (var y = 0; y < map.blockMatrix.length; y++) {
            for (var x = 0; x < map.blockMatrix[y].length; x++) {
                if (map.blockMatrix[y][x] === 0) {
                    $field.fillStyle = $mapColor;
                    $field.fillRect(x*$blockSize, y*$blockSize, $blockSize,$blockSize);
                }
            }
        }
    }

    function drawTroop(x, y, color) {
        $field.beginPath();
        $field.fillStyle = color;
        var posX = x * $blockSize + ($blockSize/2);
        var posY = y * $blockSize + ($blockSize/2);
        $field.arc(posX, posY, 10, 0, (Math.PI/180)*360);
        $field.fill();
    }

    function drawPathNode(x, y, color, stopPoint) {
        $field.beginPath();
        $field.fillStyle = color;
        var posX = x * $blockSize + ($blockSize/2);
        var posY = y * $blockSize + ($blockSize/2);
        $field.arc(posX, posY, 5, 0, (Math.PI/180)*360);
        $field.fill();

        if (stopPoint) {
            $field.beginPath();
            $field.fillStyle = color;
            $field.arc(posX, posY, 7, 0, (Math.PI/180)*360);
            $field.stroke();
        }
    }

    function findPath(start, end) {
        var startGrid = mapGraph.grid[start.getY()][start.getX()];
        var endGrid = mapGraph.grid[end.getY()][end.getX()];
        return pathfinder.astar.search(mapGraph, startGrid, endGrid);
    }

    return {
        'init': init,
        'findPath': findPath,
        'drawTroop': drawTroop,
        'drawPathNode': drawPathNode
    };
});