let structRoom = { 

    run: function(room) {
        if (room.controller._my) {
            let spawn = room.find(FIND_MY_STRUCTURES).filter( (s) => s.structureType == STRUCTURE_SPAWN)[0];
            
            // Room memory check 
            if (!room.memory) { room.memory = {}; }
            if (!room.memory.toBuild) { room.memory.toBuild = {}; }

            // Storage memory 
            if (!room.memory.builtStorage) { room.memory.builtStorage = room.find(FIND_STRUCTURES).filter((s) => s.structureType == STRUCTURE_STORAGE).length; }
            if (!room.memory.toBuild.storage) { room.memory.toBuild.storage = [new RoomPosition(spawn.pos.x, spawn.pos.y - 2, room.name)]; }

            // Towers memory 
            if (!room.memory.builtTowers) { room.memory.builtTowers = room.find(FIND_STRUCTURES).filter((s) => s.structureType == STRUCTURE_TOWER).length; }
            if (!room.memory.toBuild.towers) { 
                room.memory.toBuild.towers = [
                    new RoomPosition(spawn.pos.x + 2, spawn.pos.y, room.name), 
                    new RoomPosition(spawn.pos.x - 2, spawn.pos.y, room.name)
                ];
            }

            // Roads memory
            if (!room.memory.builtRoads) { room.memory.builtRoads = false; }
            if (!room.memory.toBuild.roads) { room.memory.toBuild.roads = []; }
            
            // Build extensions 
            // - auto build extensions
            
            // Find road built sites and store in memory
            if (room.memory.builtRoads == false) {
                let sources = room.find(FIND_SOURCES);

                // Roads around spawner
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        let roadPos = new RoomPosition(spawn.pos.x + i, spawn.pos.y + j, room.name);
                        room.memory.toBuild.roads.push(roadPos);
                    }
                }
                
                // Roads to sources
                for (let sourceName in sources) {
                    let source = sources[sourceName];
                    let path = spawn.pos.findPathTo(source, { ignoreCreeps: true, swampCost: 1});
                    path.pop(); // pos of target object

                    // Build container close to rather than road
                    let containerPos = path.pop();
                    room.createConstructionSite(containerPos.x, containerPos.y, STRUCTURE_CONTAINER);
                    
                    room.memory.toBuild.roads = room.memory.toBuild.roads.concat(path);
                }
                
                // Road to controller
                let controllerPath = spawn.pos.findPathTo(room.controller.pos, { ignoreCreeps: true, swampCost: 1});
                controllerPath.pop() // pos of target object
                room.memory.toBuild.roads = room.memory.toBuild.roads.concat(controllerPath);

                room.memory.builtRoads = true;
            }

            // Build storage in toBuild 
            if (room.memory.builtStorage < 1) {
                for (let storagePosId in room.memory.toBuild.storage) {
                    let storagePos = room.memory.toBuild.storage[storagePosId];
                    let pos = new RoomPosition(storagePos.x, storagePos.y, room.name);
                    if (pos.lookFor(LOOK_STRUCTURES).length != 0 || pos.lookFor(LOOK_CONSTRUCTION_SITES).length != 0 || room.createConstructionSite(pos.x, pos.y, STRUCTURE_STORAGE) == OK) {
                        let index = room.memory.toBuild.storage.indexOf(storagePos);
                        room.memory.toBuild.storage.splice(index, 1);
                        room.memory.builtStorage++;
                    }
                }
            }

            // Build towers in toBuild
            if (room.memory.builtTowers < 2) {
                for (let towerPosId in room.memory.toBuild.towers) {
                    let towerPos = room.memory.toBuild.towers[towerPosId];
                    let pos = new RoomPosition(towerPos.x, towerPos.y, room.name)
                    if (pos.lookFor(LOOK_STRUCTURES).length != 0 || pos.lookFor(LOOK_CONSTRUCTION_SITES).length != 0 || room.createConstructionSite(pos.x, pos.y, STRUCTURE_TOWER) == OK) {
                        let index = room.memory.toBuild.towers.indexOf(towerPos);
                        room.memory.toBuild.towers.splice(index, 1);
                        room.memory.builtTowers++;
                    }
                }
            }

            // Build roads in toBuild 
            for (let _ in room.memory.toBuild.roads) {
                // Wait until at least 1 tower exists to build roads
                if (room.memory.builtTowers >= 1) {
                    let pos = room.memory.toBuild.roads.pop();
                    room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD);
                }
            }
        }
    }
};

module.exports = structRoom;
