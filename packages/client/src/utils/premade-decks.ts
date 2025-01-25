import { redAvenger } from '@game/engine/src/card/cards/core/red_avenger';
import { redBloodCultistFlagbearer } from '@game/engine/src/card/cards/core/red_blood-cultist-flagbearer';
import { redBloodCultistBrute } from '@game/engine/src/card/cards/core/red_blood_cultist_brute';
import { redBloodCultistDevotee } from '@game/engine/src/card/cards/core/red_blood_cultist_devotee';
import { redBloodCultistPriestess } from '@game/engine/src/card/cards/core/red_blood_cultist_priestess';
import { redBloodlust } from '@game/engine/src/card/cards/core/red_bloodlust';
import { redCombustion } from '@game/engine/src/card/cards/core/red_combustion';
import { redCrazedBloodCultist } from '@game/engine/src/card/cards/core/red_crazed_blood_cultist';
import { redExorcist } from '@game/engine/src/card/cards/core/red_exorcist';
import { redFireElemental } from '@game/engine/src/card/cards/core/red_fire-elemental';
import { redFireball } from '@game/engine/src/card/cards/core/red_fireball';
import { redFlameLord } from '@game/engine/src/card/cards/core/red_flame-lord';
import { redFootman } from '@game/engine/src/card/cards/core/red_footman';
import { redIgnite } from '@game/engine/src/card/cards/core/red_ignite';
import { redImmolation } from '@game/engine/src/card/cards/core/red_immolation';
import { redPyromancer } from '@game/engine/src/card/cards/core/red_pyromancer';
import { redWarLeader } from '@game/engine/src/card/cards/core/red_warleader';
import { redWillOWisp } from '@game/engine/src/card/cards/core/red_will-o-wisp';
import type { GameOptions } from '@game/engine/src/game/game';
import type { PlayerOptions } from '@game/engine/src/player/player.entity';
import { RUNES, type Rune } from '@game/engine/src/utils/rune';

export const premadeDecks: Array<{
  name: string;
  runes: Rune[];
  deck: GameOptions['teams'][number][number]['deck'];
}> = [
  {
    name: 'Destruction Rage',
    runes: [RUNES.RED],
    deck: {
      altar: { blueprintId: 'altar' },
      cards: [
        { blueprintId: redBloodCultistBrute.id },
        { blueprintId: redBloodCultistBrute.id },
        { blueprintId: redBloodCultistBrute.id },
        { blueprintId: redBloodCultistDevotee.id },
        { blueprintId: redBloodCultistDevotee.id },
        { blueprintId: redBloodCultistDevotee.id },
        { blueprintId: redBloodCultistFlagbearer.id },
        { blueprintId: redBloodCultistFlagbearer.id },
        { blueprintId: redBloodCultistFlagbearer.id },
        { blueprintId: redBloodCultistPriestess.id },
        { blueprintId: redBloodCultistPriestess.id },
        { blueprintId: redBloodCultistPriestess.id },
        { blueprintId: redCrazedBloodCultist.id },
        { blueprintId: redCrazedBloodCultist.id },
        { blueprintId: redCrazedBloodCultist.id },
        { blueprintId: redExorcist.id },
        { blueprintId: redExorcist.id },
        { blueprintId: redFireElemental.id },
        { blueprintId: redFireElemental.id },
        { blueprintId: redWarLeader.id },
        { blueprintId: redWarLeader.id },
        { blueprintId: redBloodlust.id },
        { blueprintId: redBloodlust.id },
        { blueprintId: redBloodlust.id },
        { blueprintId: redFootman.id },
        { blueprintId: redFootman.id },
        { blueprintId: redFootman.id },
        { blueprintId: redFootman.id },
        { blueprintId: redAvenger.id },
        { blueprintId: redAvenger.id }
      ]
    }
  },

  {
    name: 'Destruction Burn',
    runes: [RUNES.RED],
    deck: {
      altar: { blueprintId: 'altar' },
      cards: [
        { blueprintId: redFlameLord.id },
        { blueprintId: redFlameLord.id },
        { blueprintId: redPyromancer.id },
        { blueprintId: redPyromancer.id },
        { blueprintId: redPyromancer.id },
        { blueprintId: redFireElemental.id },
        { blueprintId: redFireElemental.id },
        { blueprintId: redFireElemental.id },
        { blueprintId: redWillOWisp.id },
        { blueprintId: redWillOWisp.id },
        { blueprintId: redWillOWisp.id },
        { blueprintId: redCombustion.id },
        { blueprintId: redCombustion.id },
        { blueprintId: redCombustion.id },
        { blueprintId: redImmolation.id },
        { blueprintId: redImmolation.id },
        { blueprintId: redImmolation.id },
        { blueprintId: redAvenger.id },
        { blueprintId: redAvenger.id },
        { blueprintId: redAvenger.id },
        { blueprintId: redFireball.id },
        { blueprintId: redFireball.id },
        { blueprintId: redExorcist.id },
        { blueprintId: redExorcist.id },
        { blueprintId: redExorcist.id },
        { blueprintId: redIgnite.id },
        { blueprintId: redIgnite.id },
        { blueprintId: redIgnite.id }
      ]
    }
  }
];
