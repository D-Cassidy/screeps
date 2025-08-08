const utility = require('./role.functions');

let roleMiner = {
    
    run: function(creep) {
        // If creep is not standing on a continer, move to one.
        if (creep.pos.lookFor(LOOK_STRUCTURES).filter((s) => s.structureType == STRUCTURE_CONTAINER).length <= 0) {
            let containers = creep.room.find(FIND_STRUCTURES).filter((s) => s.structureType == STRUCTURE_CONTAINER && s.pos.lookFor(LOOK_CREEPS).length <= 0);
            creep.moveTo(creep.pos.findClosestByPath(containers));
        }    

        // Then mine until you drop baby
        let source = creep.pos.findClosestByRange(FIND_SOURCES);
        creep.harvest(source);
    }
};

module.exports = roleMiner;
