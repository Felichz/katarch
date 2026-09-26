import type { ComponentType } from 'react';
import type { SceneProps } from './kit';
import { Mission, Ecosystem, Stats, Rate, Growth } from './ch1';
import { Quiz } from './quiz';
import * as ch6 from './ch6';
import { Teams, Styles, Bets, Rubric } from './ch2';
import { Sorter, DomainMap, Acl, Wrapper, Facade, Maps, Metamodel, Composition } from './ch5';
import { EntityTrap, Constraints, ValueMap, ModMono, Whiteboard, Spectrum, Fork, Reframe } from './ch4';
import { WeekZero, Reqs, Questions, Views, Principles, Trace, AdrAnatomy } from './ch3';

export const SCENES: Record<string, ComponentType<SceneProps>> = {
  mission: Mission,
  ecosystem: Ecosystem,
  stats: Stats,
  rate: Rate,
  growth: Growth,
  quiz: Quiz,
  teams: Teams,
  styles: Styles,
  bets: Bets,
  rubric: Rubric,
  weekzero: WeekZero,
  reqs: Reqs,
  questions: Questions,
  views: Views,
  principles: Principles,
  trace: Trace,
  adr: AdrAnatomy,
  entitytrap: EntityTrap,
  constraints: Constraints,
  valuemap: ValueMap,
  modmono: ModMono,
  whiteboard: Whiteboard,
  spectrum: Spectrum,
  fork: Fork,
  reframe: Reframe,
  sorter: Sorter,
  domainmap: DomainMap,
  acl: Acl,
  wrapper: Wrapper,
  facade: Facade,
  maps: Maps,
  metamodel: Metamodel,
  composition: Composition,
  ...ch6.SCENES6,
};
