let roleHarvester = {

    // TODO:
    // - Prioritize collecting from containers in harvest function
    // - Prioritize transferring to extensions and spawns, then towers

    run: function(creep) {
        let working = creep.memory.working;

        // If working == false, fill up with energy
        if (!working) {
            if (creep.store.getFreeCapacity(RESOURCE_ENERGY) <= 0) {
                creep.memory.working = true;
            }
            else { this.harvest(creep); }
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
            let target = creep.pos.findClosestByPath(transferrableStructures);
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    },

    harvest: function(creep) {
        let containers = creep.room.find(FIND_MY_STRUCTURES).filter((s) => 
                s.structureType == STRUCTURE_CONTAINER
                && s.store.getUsedCapacity(RESOURCE_ENERGY) > 0 
        );
        if (containers) {
            let target = creep.pos.findClosestByPath(containers);
            if (creep.withdraw(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
            return;
        }

        let source = creep.pos.findClosestByPath(FIND_SOURCES);
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
    }
};

module.exports = roleHarvester;
