Creep.prototype.miner = function (): void {
  if (this.store.getFreeCapacity() > 0) {
    const sources = this.room.find(FIND_SOURCES);

    if (this.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
      this.moveTo(sources[0], { visualizePathStyle: { stroke: "#ffaa00" } });
    }
  } else {
    const targets = this.room.find(FIND_STRUCTURES, {
      filter: structure => {
        return (
          (structure.structureType === STRUCTURE_EXTENSION ||
            structure.structureType === STRUCTURE_SPAWN ||
            structure.structureType === STRUCTURE_CONTAINER) &&
          structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        );
      }
    });

    if (targets.length > 0) {
      if (this.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        this.moveTo(targets[0], { visualizePathStyle: { stroke: "#ffffff" } });
      }
    }
  }
};

Creep.prototype.builder = function (): void {
  if (this.memory.building && this.store[RESOURCE_ENERGY] === 0) {
    this.memory.building = false;
    this.say("🔄 harvest");
  }
  if (!this.memory.building && this.store.getFreeCapacity() === 0) {
    this.memory.building = true;
    this.say("🚧 build");
  }

  if (this.memory.building) {
    const targets = this.room.find(FIND_CONSTRUCTION_SITES);
    if (targets.length) {
      if (this.build(targets[0]) === ERR_NOT_IN_RANGE) {
        this.moveTo(targets[0], { visualizePathStyle: { stroke: "#ffffff" } });
      }
    }
  } else {
    const sources = this.room.find(FIND_SOURCES);
    if (this.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
      this.moveTo(sources[0], { visualizePathStyle: { stroke: "#ffaa00" } });
    }
  }
};

Creep.prototype.upgrader = function (): void {
  if (this.memory.upgrading && this.store[RESOURCE_ENERGY] === 0) {
    this.memory.upgrading = false;
    this.say("🔄 harvest");
  }
  if (!this.memory.upgrading && this.store.getFreeCapacity() === 0) {
    this.memory.upgrading = true;
    this.say("⚡ upgrade");
  }

  if (this.memory.upgrading && this.room.controller !== undefined) {
    if (this.upgradeController(this.room.controller) === ERR_NOT_IN_RANGE) {
      this.moveTo(this.room.controller, { visualizePathStyle: { stroke: "#ffffff" } });
    }
  } else {
    const sources = this.room.find(FIND_SOURCES);
    if (this.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
      this.moveTo(sources[0], { visualizePathStyle: { stroke: "#ffaa00" } });
    }
  }
};

Creep.prototype.work = function (): void {
  const role = this.memory.role;
  this[role]();
};
