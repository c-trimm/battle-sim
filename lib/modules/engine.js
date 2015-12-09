define(['module/troopList', 'module/map'], function(troopList, map) {
    var turnID = 1;

    function turn() {
        var actions = [];
        var self = this;

        log('<u>Turn '+turnID+'</u>');

        console.log('Turn: ' + turnID);

        troopList.each(function(troop) {
            console.log(troop.debug());
            actions.push(troop.doNextAction());
        });

        // if (_.filter(actions, function(action) { return action; }).length === 0) return false;

        console.log('------------------------');
        turnID++;
        return turnID <= 12;
    }

    function triggerNode(node, troop) {
        // This will trigger node traps, etc...
        map.drawPathNode(node.y, node.x, troop.getColor());
        log(troop.getName() + ' moved to ' + node.x + ', ' + node.y);
        return true;
    }

    function getEnemiesInRange(troop) {
        var enemies = troopList.getEnemyTroops(troop);
        var enemiesInRange = [];
        for (var i = 0; i < enemies.length; i++) {
            var enemy = enemies[i];
            if (Math.abs(enemy.getX() - troop.getX()) <= troop.getRange() && Math.abs(enemy.getY() - troop.getY()) <= troop.getRange()) {
                enemiesInRange.push(enemy);
            }
        }

        return enemiesInRange;
    }

    function log(msg) {
        var el = document.createElement('p');
        el.innerHTML = msg;
        document.getElementById('battle-log').appendChild(el);
    }

    return {
        'turn': turn,
        'getEnemiesInRange': getEnemiesInRange,
        'log': log,
        'triggerNode': triggerNode
    };
});
