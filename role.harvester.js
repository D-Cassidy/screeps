const utility = require('./role.functions');

let roleHarvester = {

    run: function(creep) {
        let working = creep.memory.working;

        // If working == false, fill up with energy
        if (!working) {
            if (creep.store.getFreeCapacity(RESOURCE_ENERGY) <= 0) {
                creep.memory.working = true;
            }
            else { utility.harvest(creep); }
        }

        // If working == true, get to work
        else {
            if (creep.store.getUsedCapacity(RESOURCE_ENERGY) <= 0) {
                creep.memory.working = false;
            }

            // find structures that are either extensions or spawns and have space for more energy
            let transferrableStructures = creep.room.find(FIND_MY_STRUCTURES).filter((struct) =>
                (struct.structureType == STRUCTURE_EXTENSION
                || struct.structureType == STRUCTURE_SPAWN
                || struct.structureType == STRUCTURE_TOWER)
                && struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            );

            // if there's nothing to transfer to, go refill energy
            if (transferrableStructures.length <= 0 && creep.store.getFreeCapacity(RESOURCE_ENERGY) <=0) {
                creep.moveTo(Game.spawns[creep.memory.home]);
            }
            else if (transferrableStructures.length <= 0) {
                creep.memory.working = false;
            }

            // put energy in structures
            let target = creep.pos.findClosestByPath(transferrableStructures);
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    }
};

module.exports = roleHarvester;
