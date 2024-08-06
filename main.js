var roleHarvester = require('role.harvester');

// TODO:
// - Automatic drone construction
// - Role deliberation
// - Upgrader role

module.exports.loop = function () {

    for (let spawnName in Game.spawns) {
        let spawn = Game.spawns[spawnName];

        if (spawn.store.getUsedCapacity(RESOURCE_ENERGY) > 250) {
            let roleName = 'harvester';
            let creepName = getCreepName(roleName);
            spawn.spawnCreep([WORK, CARRY, MOVE, MOVE], creepName, {
                memory: {
                    role: roleName,
                    working: true,
                    home: spawnName
               }
            });
        }
    }

    for (let name in Game.creeps) {
        let creep = Game.creeps[name];
        roleHarvester.run(creep);
    }
}

function getCreepName(role) {
    return (`DRONE-${role[0].toUpperCase()}${Game.time%1000}`);
}