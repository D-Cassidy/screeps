const harvester = require('role.harvester');
const upgrader = require('role.upgrader');

// TODO:
// - better source choosing behavior
// - role.builder

module.exports.loop = function () {
    // keeps count of roles for automatic construction
    let roleCount = {
        'harvester':0,
        'upgrader':0
    };

    // memory cleaning
    for (let creepName in Memory.creeps) {
        if (!Game.creeps[creepName]) {
            delete Memory.creeps[creepName];
            break;
        }

        let role = Memory.creeps[creepName].role;
        roleCount[role] = roleCount[role]+1;
    }

    // spawn behavior 
    for (let spawnName in Game.spawns) {
        let spawn = Game.spawns[spawnName];

        if (spawn.store.getUsedCapacity(RESOURCE_ENERGY) >= 300) {
            let roleName = '';
            if (roleCount['harvester'] < 4) { roleName = 'harvester'; }
            else if (roleCount['upgrader'] < 4) { roleName = 'upgrader'; }
            else { break; }
            
            let creepName = getCreepName(roleName);
            spawn.spawnCreep([WORK, CARRY, CARRY, MOVE, MOVE], creepName, {
                memory: {
                    role: roleName,
                    working: true,
                    home: spawnName
               }
            });
        }
    }

    // creep behavior
    for (let name in Game.creeps) {
        let creep = Game.creeps[name];

        let role = creep.memory.role;
        if (role == 'harvester') { harvester.run(creep); }
        else if (role == 'upgrader') {upgrader.run(creep); }
    }
}

function getCreepName(role) {
    return (`DRONE-${role[0].toUpperCase()}${Game.time%1000}`);
}