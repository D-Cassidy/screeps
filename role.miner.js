const utility = require('./role.functions');

let roleMiner = {

    run: function(creep) {
        // if creep is not standing on a continer, move to one.
        if (creep.pos.lookFor(LOOK_STRUCTURES).filter((s) => s.structureType == STRUCTURE_CONTAINER).length <= 0) {
            let containers = creep.room.find(FIND_MY_STRUCTURES).filter((s) => s.structureType == STRUCTURE_CONTAINER);
            creep.moveTo(creep.pos.findClosestByPath(containers));
        }    

        // then mine until you drop baby
        let source = creep.pos.findClosestByRange(FIND_SOURCES);
        creep.harvest(source);
    }
};

module.exports = roleMiner;