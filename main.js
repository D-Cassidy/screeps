var roleHarvester = require('role.harvester');

// TODO:
// - Automatic drone construction
// - Role deliberation
// - Harvester role 
// - Upgrader role

module.exports.loop = function () {

    for (let name in Game.spawns) {
        let spawn = Game.spawns[name];

        if (spawn.store.getUsedCapacity(RESOURCE_ENERGY) < 250) {
            let roleName = 'harvester';
            let creepName = getCreepName(roleName);
            spawn.spawnCreep([WORK, CARRY, MOVE, MOVE], creepName, {
                memory: {role: roleName}
            });
        }
    }

    for (let name in Game.creeps) {
        let creep = Game.creeps[name];
        roleHarvester.run(creep);
    }
}

function getCreepName(role) {
    return (`Drone-${role[0].toUpperCase()}${Game.time%1000}`);
}