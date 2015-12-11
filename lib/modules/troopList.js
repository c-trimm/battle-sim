define(['underscore'], function(_) {
    var troopList = {};

    var $troops = {};
    var $teams = {};

    function add(troop) {
        $troops[troop.getID()] = troop;
        if (typeof $teams[troop.getTeam()] == 'undefined') $teams[troop.getTeam()] = {};
        $teams[troop.getTeam()][troop.getID()] = $troops[troop.getID()];
        return $troops[troop.getID()];
    }

    function getEnemyTroops(troop) {
        var enemies = {};

        for (var team in $teams) {
            if (!_.has($teams, team)) continue;
            if (troop.getAllyTeams().indexOf(team) == -1 && team != troop.getTeam()) {
                _.extend(enemies, $teams[team]);
            }
        }

        return enemies;
    }

    function getAllyTroops(troop) {
        var allies = {};

        for (var team in $teams) {
            if (!_.has($teams, team)) continue;
            if (troop.getAllyTeams().indexOf(team) > -1 || team == troop.getTeam()) {
                _.extend(allies, $teams[team]);
            }
        }

        return allies;
    }

     function eachTroops(fn) {
        for (var troop in $troops) {
            if (!_.has($troops, troop)) continue;
            fn($troops[troop]);
        }
    }

    return {
        'add': add,
        'getEnemyTroops': getEnemyTroops,
        'each': eachTroops
    };
});

