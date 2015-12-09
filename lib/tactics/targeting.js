define(['underscore', 'module/map', 'module/troopList'], function(_, map, troopList) {
    //-------------------//
    // Private Functions //
    //-------------------//
    
    function closestEnemyWithWalls(troop) {
        var enemyPaths = troop.getEnemyPaths(troopList, map);
        var closestDist = 99999;
        var target = null;
        
        _.each(enemyPaths, function(path, enemyID) {
            if (path.path.length < closestDist && path.enemy.isTargetable()) {
                target = path.enemy;
                closestDist  = path.path.length;
            }
        });

        return target;
    }

    function closestEnemyWithoutWalls(troop) {
        var enemies = troop.getEnemies();
        var closestDist = 99999;
        var target = null;

        _.each(enemies, function(enemy) {
            if (!enemy.isTargetble()) return;

            var x = enemy.getX() - troop.getX();
            var y = enemy.getY() - troop.getY();
            var dist = Math.sqrt(x*x + y*y);

            if (dist < closestDist) {
                closestDist = dist;
                target = enemy;
            }
        });

        return target;
    }


    //-------------------//
    // Exposed Functions //
    //-------------------//
    
    function closestTargetableEnemy(troop, turn) {
        // if (troop.getWeapon().requiresLineOfSight()) {
        if (true) {
            return closestEnemyWithWalls(troop, turn);
        } else {
            return closestEnemyWithoutWalls(troop, turn);
        }
    }

    return {
        'closestTargetableEnemy': closestTargetableEnemy
    };
});