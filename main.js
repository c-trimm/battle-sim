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

require(['module/engine', 'module/troopList', 'module/troopFactory', 'module/map'], function(engine, troopList, troopFactory, map) {
    var gil = troopList.add(troopFactory({
        'name' : 'Gilthunder',
        'team' : 0,
        'x'    : 0,
        'y'    : 0,
        'range': 1,
        'color': 'red'
    }));

    var mel = troopList.add(troopFactory({
        'name' : 'Meliodas',
        'team' : 1,
        'x'    : 19,
        'y'    : 9,
        'range': 3,
        'color': 'blue'
    }));

    map.init();
    map.drawTroop(gil.getX(), gil.getY(), gil.getColor());
    map.drawTroop(mel.getX(), mel.getY(), mel.getColor());

    var hasTurn = true;

    while (hasTurn) {
        hasTurn = engine.turn();
    }

    engine.log('<br/><b>End of Batttle<b/>');
});
