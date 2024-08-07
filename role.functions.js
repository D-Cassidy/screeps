let roleFunctions = {

    harvest: function(creep) {
        // check for containers with energy
        let containers = creep.room.find(FIND_STRUCTURES).filter((s) => 
                s.structureType == STRUCTURE_CONTAINER
                && s.store.getUsedCapacity(RESOURCE_ENERGY) > 0 
        );
        if (containers.length > 0) {
            let target = creep.pos.findClosestByPath(containers);
            if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
            console.log('here?')
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