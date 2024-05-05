import { ErrorMapper } from "utils/ErrorMapper";
// eslint-disable-next-line sort-imports
import "proptotypes/Creep";

const maxCreeps = 3;
const getRole = (): Role => {
  const spawnerFreeEnergy = Game.spawns.Spawn1.store.getFreeCapacity(RESOURCE_ENERGY);

  if (spawnerFreeEnergy) {
    return "miner";
  }

  const notFinishedConstructionSites = Game.spawns.Spawn1.room.find(FIND_CONSTRUCTION_SITES).length;

  if (notFinishedConstructionSites) {
    return "builder";
  }

  return "upgrader";
};

const creepSettings = (role: CreepMemory["role"]) => ({
  body: [WORK, CARRY, MOVE] as BodyPartConstant[],
  name: `worker-${Game.time}`,
  opts: { memory: { role } } as SpawnOptions
});

export const loop = ErrorMapper.wrapLoop(() => {
  const getCreepsRoles = (): Partial<CreepsMemoryRoles> => {
    return Object.values(Game.creeps).reduce((creepsRoles: Partial<CreepsMemoryRoles>, creep: Creep) => {
      creepsRoles[creep.memory.role] = (creepsRoles[creep.memory.role] || 0) + 1;
      return creepsRoles;
    }, {});
  };

  const role = getRole();
  const spawnArgs = creepSettings(role);

  console.log("Current creeps roles:", JSON.stringify(getCreepsRoles()));
  console.log("Current role to spawn:", role);

  if (Object.keys(Game.creeps).length < maxCreeps) {
    Game.spawns.Spawn1.spawnCreep(spawnArgs.body, spawnArgs.name, spawnArgs.opts);
  }

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }

  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    creep.memory.role = role;
    creep.work();
  }
});
