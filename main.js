const harvester = require('role.harvester');
const upgrader = require('role.upgrader');
const builder = require('role.builder');
const miner = require('./role.miner');

const structSpawn = require('struct.spawn');

const structTower = require('struct.tower');

// TODO:
// - stage 3 checklevel function
// - automatic extension placement 
// - predefined 2 tower + storage placement (?)
//  - will need to place flags and make roads avoid them on initial spawner placement

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
            
            // Room memory check 
            if (!room.memory) { room.memory = {}; }
            if (!room.memory.builtRoads) { room.memory.builtRoads = false; }
            if (!room.memory.toBuild) { room.memory.toBuild = {}; }
            if (!room.memory.toBuild.roads) { room.memory.toBuild.roads = []; }
            
            // Save paths in memory to build roads on
            if (room.memory.builtRoads == false) {
                let spawn = room.find(FIND_MY_STRUCTURES).filter( (s) => s.structureType == STRUCTURE_SPAWN)[0];
                let sources = room.find(FIND_SOURCES);
                
                // Roads to sources
                for (let sourceName in sources) {
                    let source = sources[sourceName];
                    let path = spawn.pos.findPathTo(source);
                    path.pop(); // pos of target object

                    // Build container close to rather than road
                    let containerPos = path.pop();
                    room.createConstructionSite(containerPos.x, containerPos.y, STRUCTURE_CONTAINER);
                    
                    room.memory.toBuild.roads = room.memory.toBuild.roads.concat(path);
                }
                
                // Road to controller
                let controllerPath = spawn.pos.findPathTo(room.controller.pos);
                controllerPath.pop() // pos of target object
                room.memory.toBuild.roads = room.memory.toBuild.roads.concat(controllerPath);

                room.memory.builtRoads = true;
            }

            // Build stuff in toBuild 
            for (let _ in room.memory.toBuild.STRUCTURE_ROAD) {  
                let pos = room.memory.toBuild.STRUCTURE_ROAD.pop();
                room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD);
            }
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
