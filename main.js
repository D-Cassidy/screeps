const harvester = require('role.harvester');
const upgrader = require('role.upgrader');
const builder = require('role.builder');

const stage = require('stages');

// TODO:
// - better source choosing behavior
// - tower behavior (repairs and attack)
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
        if (!spawn.memory) {
            spawn.memory = {};
            spawn.memory.roles = {};
        }

        let roles = spawn.memory.roles;
        let stageNo = spawn.memory.stage || 1;
        stage[stageNo].checkStage(spawn);

        // check which creeps need spawning
        let roleName = '';
        if (roles['harvester'] < stage[stageNo].roles['harvester']) { 
            roleName = 'harvester'; 
        }
        else if (roles['upgrader'] < stage[stageNo].roles['upgrader']) { 
            roleName = 'upgrader'; 
        }
        else if (roles['builder'] < stage[stageNo].roles['builder']) { 
            roleName = 'builder'; 
        }
        else { break; }
        
        // spawn creeps
        let creepName = getCreepName(roleName);
        let body = getBody(spawn);
        if (spawn.spawnCreep(
            body,
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

function getBody(spawn) {
    let energyAvailable = spawn.room.energyAvailable;
    let bodyTemplate = stage[spawn.memory.stage].bodyTemplate;
    let bodyCost = calculateBodyCost(bodyTemplate);

    let body =[];
    let n = Math.floor(energyAvailable / bodyCost);
    for (let i=0; i<n; i++) {
        body = body.concat(bodyTemplate);
    }

    return body;
}

function calculateBodyCost(body) {
    costs = {WORK:100, MOVE:50, CARRY:50};

    let len = body.length
    let cost = 0;
    for (let i=0; i<len; i++) {
        cost = cost + costs[body[i]];
    }

    return cost;
}