var lastTroopID = 0; // temp ID solution

define(['underscore', 'module/engine', 'module/tactics', 'module/map'], function(_, engine, tacticFunctions, map) {
    return function(troopData) {
        var troop = {};

        // Stats
        var $hp             = 5;
        var $movementRange  = 1;
        var $targetingRange = troopData.range;
        var $AP             = 100;
        var $speed          = 1;

        // Known info about other troops
        var $allyTeams = troopData.allies || [];
        var $enemies = [];
        var $allies = [];

        // Cache of paths to other troops
        var $pathCache = {
            enemies: {},
            allies: {}
        };

        // General Info
        var $id = ++lastTroopID;
        var $name = troopData.name;
        var $team = troopData.team;
        var $xCoord = troopData.x;
        var $yCoord = troopData.y;
        var $inRange = false;
        var $apRemaining = $AP;
        var $color = troopData.color;
        var $target = null;

        // Tactics
        var $tactics = {
            'targeting': ['closestTargetableEnemy'],
            'healing': [],
            'movement': [],
            'enagement': []
        };

        troop.debug = function() {
            return {
                name: this.getName(),
                x: this.getX(),
                y: this.getY(),
                inRange: this.getInRange(),
                pathCache: $pathCache
            };
        };

        troop.getID = function() {
            return $id;
        };

        troop.getName = function() {
            return $name;
        };

        troop.getTeam = function() {
            return $team;
        };

        troop.setX = function(x) {
            $xCoord = x;
            return $xCoord;
        };

        troop.getX = function() {
            return $xCoord;
        };

        troop.setY = function(y) {
            $yCoord = y;
            return $yCoord;
        };

        troop.getY = function() {
            return $yCoord;
        };

        troop.getTargetingRange = function() {
            return $targetingRange;
        };

        troop.getMovementRange = function() {
            return $movementRange;
        };

        troop.getColor = function() {
            return $color;
        };

        troop.getAllyTeams = function() {
            return $allyTeams;
        };

        troop.getAllies = function(troopList) {
            if ($allies.length === 0) $allies = troopList.getAllyTroops(this);
            return $allies;
        };

        troop.getEnemies = function(troopList) {
            if ($enemies.length === 0) $enemies = troopList.getEnemyTroops(this);
            return $enemies;
        };

        troop.setInRange = function(isInRange) {
            $inRange = isInRange;
            if ($inRange) engine.log($name + ' is in range of target.');
            return $inRange;
        };

        troop.getInRange = function() {
            return $inRange;
        };

        troop.getTarget = function() {
            return $target;
        };

        troop.setTarget = function(newTarget) {
            $target = newTarget;
            return $target;
        };

        troop.getTargetingTactics = function() {
            return $tactics.targeting;
        };

        troop.isTargetable = function() {
            return ($hp > 0);
        };

        troop.clearPathCache = function() {
            $pathCache.enemies = {};
            $pathCache.allies = {};
        }

        troop.getPath = function(target) {
            if (typeof $pathCache.allies[target.getID()] !== 'undefined') return $pathCache.allies[target.getID()];
            if (typeof $pathCache.enemies[target.getID()] !== 'undefined') return $pathCache.enemies[target.getID()];
            return map.findPath(this, target);
        };

        troop.getEnemyPaths = function(troopList, map) {
            var enemies = this.getEnemies(troopList);
            var paths = {};

            _.each(enemies, function(enemy, enemyID) {
                paths[enemyID] = {
                    path: map.findPath(this, enemy),
                    enemy: enemy
                };

                $pathCache.enemies[enemyID] = paths[enemyID].path;
            }, this);

            return paths;
        };

        troop.selectTarget = function() {
            var targetingTactics = $tactics.targeting;
            var newTarget = null;

            for (var i = 0; i < targetingTactics.length; i++) {
                newTarget = tacticFunctions.targeting[targetingTactics[i]](this);
                if (newTarget) break;
            }

            return newTarget;
        };

        troop.moveWithinRange = function(path) {
            if (!path || this.getInRange()) return;

            if (path.length <= 1) {
                this.setInRange(true);
                return;
            }

            var targetNode = _.last(path);
            var newPath = path.slice(0, this.getMovementRange());
            var lastNodeInMovementRange = _.last(newPath);

            // Stop moving once in range
            this.setInRange(false);
            if ((lastNodeInMovementRange.y == targetNode.y) && (lastNodeInMovementRange.x == targetNode.x)) {
                // target is within movement range
                if (newPath.length > 1) newPath = newPath.slice(0, newPath.length - this.getTargetingRange()); // get the closest node within targeting range of target
                lastNodeInMovementRange = _.last(newPath);
                this.setInRange(true);
            }

            // Trigger each node that the troop has moved through (to set off traps, etc...)
            var ableToMove = true;
            _.each(newPath, function(node) {
                if (!ableToMove) return;
                ableToMove = engine.triggerNode(node, this);
                if (!ableToMove) lastNodeInMovementRange = node;
            }, this);

            this.setX(lastNodeInMovementRange.y);
            this.setY(lastNodeInMovementRange.x);
        };

        troop.doNextAction = function() {
            $pathCache.enemies = {};
            $pathCache.allies = {};

            var actions = this.getActions(this);

            _.each(actions, function (action) {
                switch (action.action) {
                    case 'moveTo':
                        var path = this.getPath(action.target);
                        console.log(path);
                        this.moveWithinRange(path);
                        break;
                }
            }, this);

            return (actions.length > 0);
        };

        troop.getActions = function(troop) {
            var actions = [];
            var currentTarget = this.getTarget();

            if (!currentTarget || !currentTarget.isTargetable()) {
                currentTarget = this.setTarget(this.selectTarget());
            }

            if (!this.getInRange()) {
                actions.push({
                    action: 'moveTo',
                    target: currentTarget
                });
            }

            return actions;
        };


        return troop;
    };
});
