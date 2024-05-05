interface Creep {
  work(): void;
  upgrader(): void;
  builder(): void;
  miner(): void;
  hasFreeCapacity: boolean;
}

interface SpawnMemory {
  active: boolean;
}

interface Memory {
  logistics: {
    resourceProviders: {
      energy: {
        [key: Id<Source>]: {
          active: boolean;
          providerCors: any[];
        };
      };
    };
  };
}

interface CreepMemory {
  role: Role;
  building?: boolean;
  upgrading?: boolean;
  _move?: {
    dest: {
      x: number;
      y: number;
      room: string;
    };
    time: number;
    path: string;
  };
}
