const infoBunker = require('info.bunker');

let structRoom = { 
    run: function(room) {
        if (room.controller._my) {
            let spawn = room.find(FIND_MY_STRUCTURES).filter( (s) => s.structureType == STRUCTURE_SPAWN)[0];
            
            // Room memory check 
            if (!room.memory) { room.memory = {}; }
            if (!room.memory.toBuild) { room.memory.toBuild = {}; }
            if (!room.memory.bunker) { room.memory.bunker = {}; }
            if (!room.memory.bunker.bunkerStart) { room.memory.bunker.bunkerStart = new RoomPosition((spawn.pos.x + infoBunker.coordsFromInitialSpawn.dx), 
                                                                                       (spawn.pos.y + infoBunker.coordsFromInitialSpawn.dy), 
                                                                                       room.name); }
            
            // Bunker memory 
            if (!room.memory.bunker.extensions) { room.memory.bunker.extensions = infoBunker.extension; }
            if (!room.memory.bunker.tower) { room.memory.bunker.tower = infoBunker.tower; }
            if (!room.memory.bunker.storage) { room.memory.bunker.storage = infoBunker.storage; }

            // Roads memory
            if (!room.memory.repathRoadsFlag) { room.memory.repathRoadsFlag = false; }
            if (!room.memory.toBuild.roads) { room.memory.toBuild.roads = []; }
            
            // Find road built sites and store in memory
            if (room.memory.repathRoadsFlag == false) {
                let sources = room.find(FIND_SOURCES);
                
                // Roads to sources
                for (let sourceName in sources) {
                    let source = sources[sourceName];
                    let path = spawn.pos.findPathTo(source, { ignoreCreeps: true, swampCost: 1, 
                                                              avoid:room.find(FIND_CONSTRUCTION_SITES).filter((s) => s.structureType != STRUCTURE_ROAD) });
                    path.pop(); // pos of target object

                    // Build container close to rather than road
                    let containerPos = path.pop();
                    if (room.find(FIND_STRUCTURES).filter((s) => s.structureType == STRUCTURE_CONTAINER).length < 2) { 
                        room.createConstructionSite(containerPos.x, containerPos.y, STRUCTURE_CONTAINER); 
                    }
                    
                    room.memory.toBuild.roads = room.memory.toBuild.roads.concat(path);
                }
                
                // Road to controller
                let controllerPath = spawn.pos.findPathTo(room.controller.pos, { ignoreCreeps: true, swampCost: 1, 
                                                                                 avoid:room.find(FIND_CONSTRUCTION_SITES).filter((s) => s.structureType != STRUCTURE_ROAD)});
                controllerPath.pop() // pos of target object
                room.memory.toBuild.roads = room.memory.toBuild.roads.concat(controllerPath);

                room.memory.repathRoadsFlag = true;
            }
            
            let bunkerPos = room.memory.bunker.bunkerStart;
            // Build roads
            let towerCount = room.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_TOWER }).length;
            for (let _ in room.memory.toBuild.roads) {
                // Wait until at least 1 tower exists to build roads
                if (towerCount > 0) {
                    let pos = room.memory.toBuild.roads.pop();
                    room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD);
                }
            }

            // Build extensions 
            for (let _ in room.memory.bunker.extensions) {
                let pos = room.memory.bunker.extensions.pop();
                let buildPos = new RoomPosition(bunkerPos.x + pos.x, bunkerPos.y + pos.y, room.name);
                if (this.removeRoad(buildPos) == OK) { room.memory.repathRoadsFlag = false; }
                if (room.createConstructionSite(buildPos.x, buildPos.y, STRUCTURE_EXTENSION) != OK) {
                    room.memory.bunker.extensions.push(pos);
                    break;
                }
            }
            
            // Build towers
            for (let _ in room.memory.bunker.tower) {
                let pos = room.memory.bunker.tower.pop();
                let buildPos = new RoomPosition(bunkerPos.x + pos.x, bunkerPos.y + pos.y, room.name);
                if (this.removeRoad(buildPos) == OK) { room.memory.repathRoadsFlag = false; }
                if (room.createConstructionSite(buildPos.x, buildPos.y, STRUCTURE_TOWER) != OK) {
                    room.memory.bunker.tower.push(pos);
                    break;
                }
            }

            // Build storage 
            for (let _ in room.memory.bunker.storage) {
                let pos = room.memory.bunker.storage.pop();
                let buildPos = new RoomPosition(bunkerPos.x + pos.x, bunkerPos.y + pos.y, room.name);
                if (this.removeRoad(buildPos) == OK) { room.memory.repathRoadsFlag = false; }
                if (room.createConstructionSite(buildPos.x, buildPos.y, STRUCTURE_STORAGE) != OK) {
                    room.memory.bunker.storage.push(pos);
                    break;
                }
            }

            // Build towers 

            // Build Storage
        }
    },

    removeRoad: function(pos) {
        let structs = pos.lookFor(LOOK_STRUCTURES);
        if (structs.length > 0) {
            if (struct[0].structureType == STRUCTURE_ROAD){
                struct[0].destroy();
                return OK;
            }
        }
    }
};

module.exports = structRoom;
