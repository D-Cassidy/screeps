const utility = require('./role.functions');

let roleHarvester = {

    run: function(creep) {
        let working = creep.memory.working;

        // If working == false, fill up with energy
        if (!working) {
            if (creep.store.getFreeCapacity(RESOURCE_ENERGY) <= 0) {
                creep.memory.working = true;
            }
            else { 
                // Prioritize getting energy from storage if extensions or spawns need energy
                if (creep.memory.harvestMode == 'storage') {utility.harvest(creep)}
                else {utility.harvest(creep, {role: 'harvester'});}
            }
        }

        // If working == true, get to work
        else {
            if (creep.store.getUsedCapacity(RESOURCE_ENERGY) <= 0) {
                let transferrableStructures = creep.room.find(FIND_MY_STRUCTURES).filter((s) => (
                    (s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_SPAWN)
                    && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
                );
                if (transferrableStructures.length > 0) {creep.memory.harvestMode = 'storage'}
                else {creep.memory.harvestMode = 'container'}
                creep.memory.working = false;
            }
            
            let transferPriority = [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_TOWER, STRUCTURE_STORAGE];

            for (let i=0; i<transferPriority.length; i++) {
            // Find structures that are either extensions or spawns and have space for more energy
                var transferrableStructures = creep.room.find(FIND_MY_STRUCTURES).filter((struct) =>
                    (struct.structureType == transferPriority[i]
                    && struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                ));
                if (transferrableStructures.length > 0) {break;}
            }

            // If there's nothing to transfer to, go refill energy
            if (transferrableStructures.length <= 0 && creep.store.getFreeCapacity(RESOURCE_ENERGY) <=0) {
                creep.moveTo(Game.spawns[creep.memory.home]);
            }
            else if (transferrableStructures.length <= 0) {
                creep.memory.working = false;
            }

            // Put energy in structures
            let target = creep.pos.findClosestByPath(transferrableStructures);
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    }
};

module.exports = roleHarvester;
