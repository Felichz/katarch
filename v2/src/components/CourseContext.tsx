import { createContext, useContext } from 'react';

export interface ConceptData { title: string; body: string }
export interface DocData { title: string; file: string; html: string; htmlEs: string | null }
export interface DecisionData {
  title: string;
  problem: string;
  decision: string;
  tradeoff: string;
  adrs: { id: string; label: string }[];
}

export type DrawerState =
  | { kind: 'concept'; id: string }
  | { kind: 'doc'; id: string }
  | { kind: 'decision'; id: string }
  | { kind: 'steps' }
  | null;

export interface CourseCtx {
  concepts: Record<string, ConceptData>;
  docs: Record<string, DocData>;
  decisions: Record<string, DecisionData>;
  open: (d: DrawerState) => void;
}

export const Ctx = createContext<CourseCtx>({
  concepts: {},
  docs: {},
  decisions: {},
  open: () => {},
});

export const useCourse = () => useContext(Ctx);

export const GH_BLOB_BASE = 'https://github.com/TheKataLog/ArchColider/blob/master/';
