import { Directive, computed, input } from '@angular/core';
import { PollutionLevel, getPollutionLevel } from '../models/pollution';

interface LevelStyle {
  background: string;
  color: string;
  border: string;
}

const LEVEL_STYLES: Record<PollutionLevel, LevelStyle> = {
  Faible: { background: '#d4f5de', color: '#1d6b43', border: '#9edbb4' }, // vert clair
  Modérée: { background: '#fff3a8', color: '#6b5600', border: '#ecd84a' }, // jaune
  Élevée: { background: '#ffc58a', color: '#7a3d00', border: '#f29a3d' }, // orange
  Dangereuse: { background: '#d9402f', color: '#ffffff', border: '#b02a1c' }, // rouge
};

/** Colore l'élément selon le niveau de pollution : [appHighlightPollution]="indice" */
@Directive({
  selector: '[appHighlightPollution]',
  host: {
    '[style.background-color]': 'style()?.background',
    '[style.color]': 'style()?.color',
    '[style.border-color]': 'style()?.border',
  },
})
export class HighlightPollutionDirective {
  readonly appHighlightPollution = input<number | null | undefined>();

  protected readonly style = computed(() => {
    const level = getPollutionLevel(this.appHighlightPollution());
    return level ? LEVEL_STYLES[level] : null;
  });
}
