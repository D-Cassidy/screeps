let stages = [
    // stage 0
    {},

    // stage 1
    {
        roles: {
            'harvester':2,
            'upgrader':2,
            'builder':6
        },

        bodyTemplate: [WORK, CARRY, CARRY, MOVE, MOVE],
        
        // Conditions for next stage: RCL 2 && 5 Extensions
        checkStage: function(spawn) {
            if (!spawn.memory.stage) { spawn.memory.stage = 1 };

            let structs = spawn.room.find(FIND_MY_STRUCTURES);
            if (spawn.room.controller.level >= 2
                && spawn.room.find(FIND_MY_STRUCTURES).filter((struct) => 
                    struct.structureType == STRUCTURE_EXTENSION).length >= 5
            ) {
                spawn.memory.stage = spawn.memory.stage+1;
            }
        }
    },

    // stage 2
    {
        roles: {
            'harvester':2,
            'upgrader':2,
            'builder':4
        },

        bodyTemplate: [WORK, CARRY, MOVE],

        // Conditions for next stage: RCL 3 && 10 Extensions && 1 Tower
        checkStage: function(spawn) {
            let structs = spawn.room.find(FIND_MY_STRUCTURES); 
            if (spawn.room.controller.level >= 3
                && structs.filter((struct) =>
                    struct.structureType == STRUCTURE_EXTENSION).length >= 10
                && structs.filter((struct) =>
                    struct.structureType == STRUCTURE_TOWER).length >= 1
            ) {
                spawn.memory.stage = spawn.memory.stage+1;
            }
        }
    },

    // stage 3
    {}, 
    
    // stage 4
    {},

    //stage 5
];

module.exports = stages;