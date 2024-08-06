const upgrader = require('role.upgrader');

let roleBuilder = {

    run: function(creep) {
        let working = creep.memory.working;

        if (!working) {
            if (creep.store.getFreeCapacity(RESOURCE_ENERGY) <= 0) {
                creep.memory.working = true;
            }
            else { harvest(creep); }
        }

        else {
            if (creep.store.getUsedCapacity(RESOURCE_ENERGY) <= 0) {
                creep.memory.working = false;
            }
            
            let constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (!constructionSites) {
                upgrader.run(creep);
                return;
            }

            let target = creep.pos.findClosestByPath(constructionSites); 
            if (creep.build(target) == ERR_NOT_IN_RANGE) {
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

module.exports = roleBuilder;