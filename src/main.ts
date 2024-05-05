import { ErrorMapper } from "utils/ErrorMapper";
import initGame from "initGame";
// eslint-disable-next-line sort-imports
import "proptotypes/Creep";
import { workers } from "configs/bodySetups";

const maxCreeps = 4;
const getRole = (): Role => {
  const containers: StructureContainer[] = Game.rooms.sim.find(FIND_STRUCTURES, {
    filter: structure => structure.structureType === STRUCTURE_CONTAINER
  });
  const spawnerFreeEnergy =
    Game.rooms.sim.energyCapacityAvailable > Game.rooms.sim.energyAvailable ||
    containers[0].store.getFreeCapacity(RESOURCE_ENERGY);
  console.log("STRUCTURE_CONTAINER", containers[0].store.getFreeCapacity(RESOURCE_ENERGY));

  if (spawnerFreeEnergy) {
    return "miner";
  }

  const notFinishedConstructionSites = Game.spawns.Spawn1.room.find(FIND_CONSTRUCTION_SITES).length;

  if (notFinishedConstructionSites) {
    return "builder";
  }

  return "upgrader";
};

const creepSettings = (role: CreepMemory["role"]) => {
  const energyCapacity = Game.rooms.sim.energyCapacityAvailable;
  const isBodyExists = energyCapacity in workers;
  const bodyKey: keyof typeof workers = isBodyExists
    ? energyCapacity
    : Object.keys(workers).sort((a, b) => Number(a) - Number(b))[0];

  return {
    body: workers[bodyKey],
    name: `worker-${Game.time}`,
    opts: { memory: { role } } as SpawnOptions
  };
};

initGame();
export const loop = ErrorMapper.wrapLoop(() => {
  // const getCreepsRoles = (): Partial<CreepsMemoryRoles> => {
  //   return Object.values(Game.creeps).reduce((creepsRoles: Partial<CreepsMemoryRoles>, creep: Creep) => {
  //     creepsRoles[creep.memory.role] = (creepsRoles[creep.memory.role] || 0) + 1;
  //     return creepsRoles;
  //   }, {});
  // };

  const role = getRole();
  const spawnArgs = creepSettings(role);

  // SPAWN LOGIC
  if (Object.keys(Game.creeps).length < maxCreeps) {
    Game.spawns.Spawn1.spawnCreep(spawnArgs.body, spawnArgs.name, spawnArgs.opts);
  }

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }

  // CREEP LOGIC
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    creep.memory.role = role;
    creep.work();
  }
});
