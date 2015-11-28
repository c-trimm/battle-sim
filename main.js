require.config({
    paths: {
        "module": "lib/modules"
    }
});

require(['module/engine', 'module/troopList', 'module/troopGenerator', 'module/map'], function(engine, troopList, troopGenerator, map) {
    troopList.add(troopGenerator({
        'name' : 'Gilthunder',
        'team' : 0,
        'x'    : 0,
        'y'    : 0
    }));

    troopList.add(troopGenerator({
        'name' : 'Meliodas',
        'team' : 1,
        'x'    : 1,
        'y'    : 1
    }));

    var hasTurn = true;

    while (hasTurn) {
        hasTurn = engine.turn();
    }

    engine.log('<b>End of Batttle<b/>');
    
    map.init();
    map.simulate();
});
