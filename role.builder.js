const upgrader = require('role.upgrader');
const utility = require('./role.functions');

let roleBuilder = {

    run: function(creep) {
        let working = creep.memory.working;
        
        // If working == false, fill up with energy
        if (!working) {
            if (creep.store.getFreeCapacity(RESOURCE_ENERGY) <= 0) {
                creep.memory.working = true;
            }
            else { utility.harvest(creep); }
        }
        
        // If working == true, build construction sites
        else {
            if (creep.store.getUsedCapacity(RESOURCE_ENERGY) <= 0) {
                creep.memory.working = false;
            }
            
            // If constructionSites.length == 0, run upgrader logic
            let constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (constructionSites.length <= 0) {
                upgrader.run(creep);
                return;
            }

            // If contructionSites.length >= 1, build construction site
            else {
                let target = creep.pos.findClosestByPath(constructionSites); 
                if (creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
        }
    }
};

module.exports = roleBuilder;
