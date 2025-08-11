const harvester = require('role.harvester');
const upgrader = require('role.upgrader');
const builder = require('role.builder');
const miner = require('./role.miner');

const structSpawn = require('struct.spawn');
const structTower = require('struct.tower');

const structRoom = require('struct.room');

// TODO:
// - stage 3 checklevel function
// - make creeps pick up dropped resources
// - automatic extension placement 
// - modify the auto builders to destroy roads in location if one is found, then set builtRoads to false
// - set up "bunker" auto building
// - private server for testing

module.exports.loop = function () {
    // Memory check
    if (!Memory.creeps) { Memory.creeps = {}; }
    if (!Memory.spawns) { Memory.spawns = {}; }

    // Spawn behavior 
    for (let spawnName in Game.spawns) {
        let spawn = Game.spawns[spawnName];

        // Spawn memory check
        if (!spawn.memory) {spawn.memory = {}}
        if (!spawn.memory.roles) {
            spawn.memory.roles = {}
            spawn.memory.roles['harvester'] = Object.values(Game.creeps).filter((c) => c.memory.role == 'harvester' && c.memory.home == spawn.name).length;
            spawn.memory.roles['upgrader'] = Object.values(Game.creeps).filter((c) => c.memory.role == 'upgrader' && c.memory.home == spawn.name).length;
            spawn.memory.roles['builder'] = Object.values(Game.creeps).filter((c) => c.memory.role == 'builder' && c.memory.home == spawn.name).length;
            spawn.memory.roles['miner'] = Object.values(Game.creeps).filter((c) => c.memory.role == 'miner' && c.memory.home == spawn.name).length;
        }

        // Run spawn
        structSpawn.run(spawn);
    }

    // Memory cleaning
    for (let creepName in Memory.creeps) {
        if (!Game.creeps[creepName]) {
            // Adjust role count in spawn memory
            let creepMem = Memory.creeps[creepName];
            let spawnMem = Memory.spawns[creepMem.home];
            spawnMem.roles[creepMem.role] = spawnMem.roles[creepMem.role]-1 || 0;

            // Delete dead creep from memory
            delete Memory.creeps[creepName];
        }
    }
    for (let spawnName in Memory.spawns) {
        if (!Game.spawns[spawnName]) {
            delete Memory.spawns[spawnName]
        }
    }

    // Room behavior
    for (let roomName in Game.rooms) {
        let room = Game.rooms[roomName]
        if (room.controller._my) {
            structRoom.run(room);
        }
    }

    // Struct behavior
    for (let structId in Game.structures) {
        let struct = Game.structures[structId];

        // Run tower
        if (struct.structureType == STRUCTURE_TOWER) {
            structTower.run(struct);
        }
    }

    // Creep behavior
    for (let name in Game.creeps) {
        let creep = Game.creeps[name];

        // Memory check
        if (!creep.memory) {creep.memory = {}}
        if (!creep.memory.working) {creep.memory.working = false}
        if (!creep.memory.home) {creep.suicide()}
        if (!creep.memory.role) {creep.suicide()}

        // Run based on assigned role
        let role = creep.memory.role;
        if (role == 'harvester') { harvester.run(creep); }
        else if (role == 'upgrader') { upgrader.run(creep); }
        else if (role == 'builder') { builder.run(creep); }
        else if (role == 'miner') { miner.run(creep); }
    }
}
