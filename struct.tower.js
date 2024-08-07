let structTower = {

    run: function(tower) {
        // attack closest hostile if there's one in the room
        let hostiles = tower.room.find(FIND_HOSTILE_CREEPS);
        if (hostiles.length > 0) {
            tower.attack(tower.pos.findClosestByRange(hostiles));
            return;
        }

        // then, repair structures
        let repairableStructs = tower.room.find(FIND_STRUCTURES).filter((s) => s.hits < s.hitsMax);
        if (repairableStructs.length > 0) {
            tower.repair(repairableStructs[0]);
            return;
        }
    }
};

module.exports = structTower;