require.config({
    paths: {
        module: "lib/modules",
        tactics: "lib/tactics",
        underscore: "lib/underscore"
    },
    shim: {
        underscore: {
            exports: "_"
        }
    }
});

require(['module/engine', 'module/troopList', 'module/troopGenerator', 'module/map'], function(engine, troopList, troopGenerator, map) {
    var gil = troopList.add(troopGenerator({
        'name' : 'Gilthunder',
        'team' : 0,
        'x'    : 0,
        'y'    : 0,
        'color': 'red'
    }));

    var mel = troopList.add(troopGenerator({
        'name' : 'Meliodas',
        'team' : 1,
        'x'    : 19,
        'y'    : 9,
        'color': 'blue'
    }));

    map.init();
    map.drawTroop(gil.getX(), gil.getY(), gil.getColor());
    map.drawTroop(mel.getX(), mel.getY(), mel.getColor());

    var hasTurn = true;

    while (hasTurn) {
        hasTurn = engine.turn();
    }

    engine.log('<b>End of Batttle<b/>');
});
