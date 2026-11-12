import { Pipe, PipeTransform } from '@angular/core';
import { getPollutionLevel } from '../models/pollution';

/** Transforme un indice de dangerosité en statut : Faible, Modérée, Élevée, Dangereuse */
@Pipe({ name: 'pollutionLevel' })
export class PollutionLevelPipe implements PipeTransform {
  transform(index: number | null | undefined): string {
    return getPollutionLevel(index) ?? '';
  }
}
