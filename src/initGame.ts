export default () => {
  for (const spawner in Game.spawns) {
    Game.spawns[spawner].memory.active = false;
  }
};
