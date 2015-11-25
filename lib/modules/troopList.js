define([], function() {
    var troopList = {};

    var troops = {};
    var teams = {};

    function add(troop) {
        troops[troop.getID()] = troop;
        if (typeof teams[troop.getTeam()] == 'undefined') teams[troop.getTeam()] = {};
        teams[troop.getTeam()][troop.getID()] = troops[troop.getID()];
    };

    function getEnemyTroops(troop) {
        var enemyTeams = [];
        for (var team in teams) {
            if (!teams.hasOwnProperty(team)) continue;
            if (troop.getAllies().indexOf(team) == -1 && team != troop.getTeam()) {
                enemyTeams.push(teams[team]);
            }
        }

        var enemies = [];
        for (var i = 0; i < enemyTeams.length; i++) {
            for (var eTroop in enemyTeams[i]) {
                if (!enemyTeams[i].hasOwnProperty(eTroop)) continue;
                enemies.push(enemyTeams[i][eTroop]);
            }
        }

        return enemies;
    };

     function eachTroops(fn) {
        for (var troop in troops) {
            if (!troops.hasOwnProperty(troop)) continue;
            fn(troops[troop]);
        }
    };

    return {
        'add': add,
        'getEnemyTroops': getEnemyTroops,
        'each': eachTroops
    };
});

