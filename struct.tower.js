let structTower = {

    run: function(tower) {
        // Attack closest hostile if there's one in the room
        let hostiles = tower.room.find(FIND_HOSTILE_CREEPS);
        if (hostiles.length > 0) {
            tower.attack(tower.pos.findClosestByRange(hostiles));
            return;
        }

        // Then, repair structures prioritizing lowest hitpoint structs
        let repairableStructs = tower.room.find(FIND_STRUCTURES).filter((s) => s.hits < s.hitsMax);
        let orderedRepairableStructs = repairableStructs.sort((a, b) => a.hits - b.hits);
        if (repairableStructs.length > 0) {
            tower.repair(orderedRepairableStructs[0]);
            return;
        }
    }
};

module.exports = structTower;
