import { ElementKey } from './colors';
import { Energie } from '../engine/wheel';

export const elementIcon: Record<ElementKey, string> = {
  feu: '🔥',
  air: '🌬️',
  terre: '🌍',
  eau: '🌊',
};

export const energieIcon: Record<Energie, string> = {
  feminine: '🌙',
  masculine: '☀️',
};

export const energieLabel: Record<Energie, string> = {
  feminine: 'Énergie féminine',
  masculine: 'Énergie masculine',
};
