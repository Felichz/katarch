import type { Chapter } from '../types';
import { terreno } from './terreno';
import { concurrencia } from './concurrencia';
import { podio } from './podio';
import { principios } from './principios';
import { estilo } from './estilo';
import { dominio } from './dominio';

export const CHAPTERS: Record<string, Chapter> = { terreno, podio, principios, estilo, dominio, concurrencia };
