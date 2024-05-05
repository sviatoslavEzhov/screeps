interface BodySetups {
  [key: string]: BodyPartConstant[];
}

export const workers: BodySetups = {
  300: [WORK, CARRY, MOVE, MOVE],
  350: [WORK, WORK, CARRY, MOVE, MOVE]
};
