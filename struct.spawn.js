const stage = require('stages');

let structSpawn = {

    run: function(spawn) {
        let roles = spawn.memory.roles;
        let stageNo = spawn.memory.stage || 1;
        stage[stageNo].checkStage(spawn);

        // only try to run on certain ticks, so creep lives are more evenly spaced
        let numCreeps = stage[stageNo].roles['harvster']
                        + stage[stageNo].roles['upgrader']
                        + stage[stageNo].roles['builder']
                        + stage[stageNo].roles['miner'];
        if (Game.time % (Math.floor(1500/numCreeps)) != 0) {
            return;
        }

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
        else if (roles['miner'] < stage[stageNo].roles['miner']) {
            roleName = 'miner';
        }
        else { return; }
        
        // spawn creeps
        let creepName = this.getCreepName(roleName);
        let body = this.getBody(spawn, roleName);
        if (spawn.spawnCreep(
            body,
            creepName,
            {memory: {
                role: roleName,
                working: true,
                home: spawn.name
            }}
            ) == OK
        ) {
            roles[roleName] = roles[roleName]+1 || 1;
        }
    },

    getCreepName: function(role) {
        return (`DRONE-${role[0].toUpperCase()}${Game.time%1000}`);
    },

    getBody: function(spawn, role) {
        let energyAvailable = spawn.room.energyAvailable;
        let bodyTemplate = stage[spawn.memory.stage].bodyTemplate[role] || stage[spawn.memory.stage].bodyTemplate['all'];
        let bodyCost = this.calculateBodyCost(bodyTemplate);

        let body =[];
        let n = Math.floor(energyAvailable / bodyCost);
        for (let i=0; i<n; i++) {
            body = body.concat(bodyTemplate);
        }

        return body;
    },

    calculateBodyCost: function(body) {
        costs = {'work':100, 'move':50, 'carry':50};

        let len = body.length
        let cost = 0;
        for (let i=0; i<len; i++) {
            cost = cost + costs[body[i]];
        }

        return cost;
    }
};

module.exports = structSpawn;
