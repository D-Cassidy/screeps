const harvester = require('role.harvester');
const upgrader = require('role.upgrader');
const builder = require('role.builder');
const miner = require('./role.miner');

const structSpawn = require('struct.spawn');

const stage = require('stages');
const structTower = require('struct.tower');

// TODO:
// - stage 3 checklevel function
// - stage 4 description
// - remote mining starting at stage where storage completes

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
            spawn.memory.roles['builder'] = Object.values(Game.creeps).filter((c) => c.memory.role == 'builder' && c.memory.home == spawn.name).length;
            spawn.memory.roles['miner'] = Object.values(Game.creeps).filter((c) => c.memory.role == 'miner' && c.memory.home == spawn.name).length;
        }

        // run spawn
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

    // struct behavior
    for (let structId in Game.structures) {
        let struct = Game.structures[structId];

        // run tower
        if (struct.structureType == STRUCTURE_TOWER) {
            structTower.run(struct);
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
        else if (role == 'miner') { miner.run(creep); }
    }
}