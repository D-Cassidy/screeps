const harvester = require('role.harvester');
const upgrader = require('role.upgrader');
const builder = require('role.builder');

const structSpawn = require('struct.spawn');

const stage = require('stages');

// TODO:
// - better source choosing behavior
// - tower behavior (repairs and attack)
// - spawn calculates creep body based on room capacity

module.exports.loop = function () {
    // mem check
    if (!Memory.creeps) { Memory.creeps = {}; }
    if (!Memory.spawns) { Memory.spawns = {}; }

    // spawn behavior 
    for (let spawnName in Game.spawns) {
        let spawn = Game.spawns[spawnName];

        // mem check
        if (!spawn.memory) {spawn.memory = {}}
        if (!spawn.memory.roles) {
            spawn.memory.roles = {}
            spawn.memory.roles['harvester'] = Object.values(Game.creeps).filter((c) => c.memory.role == 'harvester' && c.memory.home == spawn.name).length;
            spawn.memory.roles['upgrader'] = Object.values(Game.creeps).filter((c) => c.memory.role == 'upgrader' && c.memory.home == spawn.name).length;
            spawn.memory.roles['builder'] = Object.values(Game.creeps).fitler((c) => c.memory.role == 'builder' && c.memory.home == spawn.name).length;
        }

        // run
        structSpawn.run(spawn);
    }

    // mem cleaning
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

    // creep behavior
    for (let name in Game.creeps) {
        let creep = Game.creeps[name];

        // mem check
        if (!creep.memory) {creep.memory = {}}
        if (!creep.memory.working) {creep.memory.working = false}
        if (!creep.memory.home) {creep.suicide()}
        if (!creep.memory.role) {creep.suicide()}

        // run based on assigned role
        let role = creep.memory.role;
        if (role == 'harvester') { harvester.run(creep); }
        else if (role == 'upgrader') { upgrader.run(creep); }
        else if (role == 'builder') { builder.run(creep); }
    }
}