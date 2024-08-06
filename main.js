const harvester = require('role.harvester');
const upgrader = require('role.upgrader');
const builder = require('role.builder');

// TODO:
// - better source choosing behavior
// - role.builder

module.exports.loop = function () {
    // mem check
    if (!Memory.creeps) { Memory.creeps = {}; }
    if (!Memory.spawns) { Memory.spawns = {}; }

    // memory cleaning
    for (let creepName in Memory.creeps) {
        if (!Game.creeps[creepName]) {
            delete Memory.creeps[creepName];
        }
    }

    let roleCount = {};
    for (let name in Game.creeps) {
        let role = Game.creeps[name].memory.role;
        roleCount[role] = roleCount[role]+1 || 1;
    }
   
    // spawn behavior 
    for (let spawnName in Game.spawns) {
        let spawn = Game.spawns[spawnName];
        if (!Memory.spawns[spawnName]) {
            Memory.spawns[spawnName];
        }

        if (spawn.store.getUsedCapacity(RESOURCE_ENERGY) >= 300) {
            let roleName = '';
            if (roleCount['harvester'] < 2) { roleName = 'harvester'; }
            else if (roleCount['upgrader'] < 2) { roleName = 'upgrader'; }
            else if (roleCount['builder'] < 4) { roleName = 'builder'; }
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
        else if (role == 'upgrader') { upgrader.run(creep); }
        else if (role == 'builder') { builder.run(creep); }
    }
}

function getCreepName(role) {
    return (`DRONE-${role[0].toUpperCase()}${Game.time%1000}`);
}