const upgrader = require('role.upgrader');
const utility = require('./role.functions');

let roleBuilder = {

    run: function(creep) {
        let working = creep.memory.working;

        if (!working) {
            if (creep.store.getFreeCapacity(RESOURCE_ENERGY) <= 0) {
                creep.memory.working = true;
            }
            else { utility.harvest(creep); }
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
    }
};

module.exports = roleBuilder;
