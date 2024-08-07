const upgrader = require('role.upgrader');

let roleBuilder = {

    run: function(creep) {
        let working = creep.memory.working;

        if (!working) {
            if (creep.store.getFreeCapacity(RESOURCE_ENERGY) <= 0) {
                creep.memory.working = true;
            }
            else { this.harvest(creep); }
        }

        else {
            if (creep.store.getUsedCapacity(RESOURCE_ENERGY) <= 0) {
                creep.memory.working = false;
            }
            
            let constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (constructionSites.length <= 0) {
                upgrader.run(creep);
                return;
            }

            let target = creep.pos.findClosestByPath(constructionSites); 
            if (creep.build(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    },

    harvest: function(creep) {
        // check for containers with energy
        let containers = creep.room.find(FIND_MY_STRUCTURES).filter((s) => 
                s.structureType == STRUCTURE_CONTAINER
                && s.store.getUsedCapacity(RESOURCE_ENERGY) > 0 
        );
        if (containers.length > 0) {
            let target = creep.pos.findClosestByPath(containers);
            if (creep.withdraw(target) == ERR_NOT_IN_RANGE) {
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

module.exports = roleBuilder;
