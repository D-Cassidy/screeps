const harvester = require('role.harvester');
const upgrader = require('role.upgrader');
const builder = require('role.builder');

// TODO:
// - better source choosing behavior
// - tower behavior (repairs and attack)
// - harvester transfer to extensions
// - spawn calculates creep body based on room capacity

module.exports.loop = function () {
    // mem check
    if (!Memory.creeps) { Memory.creeps = {}; }
    if (!Memory.spawns) { Memory.spawns = {}; }

    // memory cleaning
    for (let creepName in Memory.creeps) {
        if (!Game.creeps[creepName]) {
            // adjust role count in spawn memory
            let creepMem = Memory.creeps[creepName];
            let spawnMem = Memory.spawns[creepMem.home];
            spawnMem.roles[creepMem.role] = spawnMem.roles[creepMem.role]-1 || 0;

            // delete dead creep from memory
            delete Memory.creeps[creepName];
        }
    }

    // spawn behavior 
    for (let spawnName in Game.spawns) {
        // access relevant memory
        let spawn = Game.spawns[spawnName];
        if (!Memory.spawns[spawnName]) {
            Memory.spawns[spawnName] = {};
            Memory.spawns[spawnName].roles = {};
        }
        let roles = Memory.spawns[spawnName].roles;

        let roleName = '';
        if (roles['harvester'] < 2) { roleName = 'harvester'; }
        else if (roles['upgrader'] < 2) { roleName = 'upgrader'; }
        else if (roles['builder'] < 6) { roleName = 'builder'; }
        else { break; }
        
        let creepName = getCreepName(roleName);
        if (spawn.spawnCreep(
            [WORK, CARRY, CARRY, MOVE, MOVE], 
            creepName,
            {memory: {
                role: roleName,
                working: true,
                home: spawnName
            }}
            ) == OK
        ) {
            roles[roleName] = roles[roleName]+1 || 1;
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