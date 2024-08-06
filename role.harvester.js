let roleHarvester = {

    run: function(creep) {

        // If working == false, fill up with energy
        if (!working) {
            let source = creep.pos.findClosestByPath(FIND_SOURCES);
            if (creep.harvest(source[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source[0]);
            }
        }

        // If working == true, get to work
        else {
            if (creep.getUsedCapacity(RESOURCE_ENERGY) <= 0) {
                creep.memory.working = false;
            }

            let spawn = Game.spawns[creep.memory.home];
            if (creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(spawn);
            }
        }
    }
};

module.exports = roleHarvester;
