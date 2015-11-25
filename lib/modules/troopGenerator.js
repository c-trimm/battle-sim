var lastTroopID = 0; // temp ID solution

define(['module/engine'], function(engine) {
    return function(troopData) {
        var troop = {};

        var allies = troopData.allies || [];

        var id = ++lastTroopID;
        var name = troopData.name;
        var team = troopData.team;
        var speed = 1;
        var xCoord = troopData.x;
        var yCoord = troopData.y;
        var hp = 5;
        var range = 1;

        troop.getID = function() {
            return id;
        };

        troop.getName = function() {
            return name;
        };

        troop.getTeam = function() {
            return team;
        };

        troop.getX = function() {
            return xCoord;
        };

        troop.getY = function() {
            return yCoord;
        };

        troop.getRange = function() {
            return range;
        };

        troop.getNextAction = function() {
            var enemies = engine.getEnemiesInRange(this);
            if (enemies.length > 0) {
                var names = enemies.reduce(function(prev, current) {
                    return prev + current.getName() + ' ';
                }, '');
                engine.log(this.getName() + ' is within range of the following enemies: ' + names);
                return false;
            }
            return null;
        };

        troop.getAllies = function() {
            return allies;
        };

        return troop;
    };
});
