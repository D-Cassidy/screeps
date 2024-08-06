let roleHarvester = {

    run: function(creep) {
        let working = creep.memory.working;

        // If working == false, fill up with energy
        if (!working) {
            if (creep.store.getFreeCapacity(RESOURCE_ENERGY) <= 0) {
                creep.memory.working = true;
            }
            else { harvest(creep); }
        }

        // If working == true, get to work
        else {
            if (creep.store.getUsedCapacity(RESOURCE_ENERGY) <= 0) {
                creep.memory.working = false;
            }

            let transferrableStructures = creep.room.find(FIND_MY_STRUCTURES).filter((struct) => {
                struct.structureType == STRUCTURE_EXTENSION
                || struct.structureType == STRUCTURE_SPAWN;
            });
            let target = creep.pos.findClosestByPath(transferrableStructures);
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    }
};

function harvest(creep) {
    let source = creep.pos.findClosestByPath(FIND_SOURCES);
    if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source);
    }
};

module.exports = roleHarvester;
