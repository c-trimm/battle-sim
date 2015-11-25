define(['module/troopList'], function(troopList) {
    var engine = {};

    var turnID = 1;

    function turn() {
        var actions = [];
        var self = this;

        log('<u>Turn '+turnID+'</u>');

        troopList.each(function(troop) {
            var action = troop.getNextAction();
            if (action) actions.push(action);
        });

        if (actions.length == 0) return false;

        for (var i = 0; i < actions.length; i++) {
            actions[i]();
        }

        turnID++;
        return true;
    };

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
    };

    function log(msg) {
        var el = document.createElement('p');
        el.innerHTML = msg;
        document.getElementById('battle-log').appendChild(el);
    };

    return {
        'turn': turn,
        'getEnemiesInRange': getEnemiesInRange,
        'log': log
    };
});
