let structTower = {

    run: function(tower) {
        // attack closest hostile if there's one in the room
        let hostiles = tower.room.find(FIND_HOSTILE_CREEPS);
        if (hostiles) {
            tower.attack(tower.pos.findClosestByRange(hostiles));
            return;
        }

        // then, repair structures
        let repairableStructs = tower.room.find(FIND_MY_STRUCTURES).filter((s) => s.hits < s.hitsMax);
        if (repairableStructs) {
            tower.repair(repaireableStructs[0]);
            return;
        }
    }
};

module.exports = structTower;