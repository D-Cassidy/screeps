let roleFunctions = {

    harvest: function(creep, opts = {}) {
        // Check for containers first if harvester
        if (opts.role == 'harvester') {
            if (this.withdraw(creep, {struct: 'container'}) == OK) {return;}
            else if (this.withdraw(creep, {struct: 'storage'}) == OK) {return;}
        }
        // Check for storage first if any other role
        else {
            if (this.withdraw(creep, {struct: 'storage'}) == OK) {return;}
            else if (this.withdraw(creep, {struct: 'container'}) == OK) {return;}
        }

        // If none of the above code returned, get your hands dirty
        let source = creep.pos.findClosestByPath(FIND_SOURCES);
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
    },

    findContainer: function(creep) {
        // Find nonempty containers in room
        let containers = creep.room.find(FIND_STRUCTURES).filter((s) => 
                    s.structureType == STRUCTURE_CONTAINER
                    && s.store.getUsedCapacity(RESOURCE_ENERGY) > 0 
        );

        // Set container with highest energy as target
        let target = []
                if (containers.length > 0) {
            target = creep.room.find(FIND_STRUCTURES).filter((s) => 
                s.structureType == STRUCTURE_CONTAINER).sort((s1, s2) => 
                    s2.store.getUsedCapacity(RESOURCE_ENERGY) - s1.store.getUsedCapacity(RESOURCE_ENERGY));
        }
        return target;
    },

    findStorage: function(creep) {
        // Find nonempty storage in room
        let storage = creep.room.find(FIND_MY_STRUCTURES).filter((s) =>
            s.structureType == STRUCTURE_STORAGE
            && s.store.getUsedCapacity(RESOURCE_ENERGY) > 0
        );

        let target = [];
        if (storage.length > 0) {
            target = storage;
        }

        return target;
    },

    withdraw: function(creep, opts = {struct: 'container'}) {
        if (opts.struct == 'container') {
            let container = this.findContainer(creep);
            if (container.length > 0) {
                container = container[0];
                if (creep.withdraw(container, RESOURCE_ENERGY) == OK) {creep.memory.working = true;}
                else {creep.moveTo(container);}
                return OK;
            }
        }
        else if (opts.struct == 'storage') {
            let storage = this.findStorage(creep);
            if (storage.length > 0) {
                storage = storage[0];
                if (creep.withdraw(storage, RESOURCE_ENERGY) == OK) {creep.memory.working = true;}
                else {creep.moveTo(storage);}
                return OK;
            }
        }

        return ERR_NOT_FOUND;
    }

};

module.exports = roleFunctions;
