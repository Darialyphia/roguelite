import { Vec3 } from '@game/shared';
import { TERRAINS } from '../board-utils';
import type { GameMap } from '../map';

export const testMap1v1: GameMap = {
  id: 'testMap1v1',
  width: 9,
  height: 5,
  //prettier-ignore
  cells: [
    [
      [
        { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND },  { terrain: TERRAINS.GROUND },
      ],
      [
        { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND },  { terrain: TERRAINS.GROUND },
      ],
      [
        { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND },  { terrain: TERRAINS.GROUND },
      ],
      [
        { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND },  { terrain: TERRAINS.GROUND },
      ],
      [
        { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND },  { terrain: TERRAINS.GROUND },
      ],
    ]
    
  ],
  //prettier-ignore
  deployZones: [
    [
      [
        new Vec3(0,0,0), new Vec3(0,1,0), new Vec3(0,2,0),new Vec3(0,3,0), new Vec3(0,4,0),
        new Vec3(1,0,0), new Vec3(1,1,0), new Vec3(1,2,0),new Vec3(1,3,0), new Vec3(1,4,0)
      ]
    ], 
    [
      [
        new Vec3(7,0,0), new Vec3(7,1,0), new Vec3(7,2,0),new Vec3(7,3,0), new Vec3(7,4,0),
        new Vec3(8,0,0), new Vec3(8,1,0), new Vec3(8,2,0),new Vec3(8,3,0), new Vec3(8,4,0)
      ]
    ]
  ]
};
