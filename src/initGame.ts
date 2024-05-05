import { mainRoom } from "./utils/helper";

export default (): void => {
  Memory.logistics = {
    resourceProviders: {
      energy: {}
    }
  };

  for (const source of mainRoom.find(FIND_SOURCES)) {
    const sourceX = source.pos.x;
    const sourceY = source.pos.y;
    const terrainArr = mainRoom.lookForAtArea(LOOK_TERRAIN, sourceY - 1, sourceX - 1, sourceY + 1, sourceX + 1, true);

    Memory.logistics.resourceProviders.energy[source.id] = {
      active: false,
      providerCors: terrainArr.filter(terrain => terrain.terrain !== "wall")
    };
  }
};
