let roleFunctions = {

    harvest: function(creep) {
        // check for containers with energy
        let containers = creep.room.find(FIND_STRUCTURES).filter((s) => 
                s.structureType == STRUCTURE_CONTAINER
                && s.store.getUsedCapacity(RESOURCE_ENERGY) > 0 
        );
        if (containers.length > 0) {
            // this line sorts the containers by their capacity, prioritizing use of fuller containers
            let target = creep.room.find(FIND_STRUCTURES).filter((s) => 
                s.structureType == STRUCTURE_CONTAINER).sort((s1, s2) => 
                    s2.store.getUsedCapacity(RESOURCE_ENERGY) - s1.store.getUsedCapacity(RESOURCE_ENERGY))[0];
            if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
            return;
        }

        // go mine a source
        let source = creep.pos.findClosestByPath(FIND_SOURCES);
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
    }

};

module.exports = roleFunctions;