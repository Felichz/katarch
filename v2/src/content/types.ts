/**
 * Content model for the guided course.
 *
 * A chapter is a sequence of steps. Each step is ONE screen: a short text
 * panel plus a stage (the visual). Consecutive steps that share the same
 * `visual.scene` keep the same diagram mounted and only change its `state`,
 * so the diagram builds and animates while the reader advances.
 */

export type Tone = 'info' | 'warn' | 'note';

export interface PredictOption {
  label: string;
  /** true for the option that matches what the team actually did */
  correct?: boolean;
  /** short feedback shown after choosing this option */
  feedback: string;
}

export type TextBlock =
  | { t: 'p'; html: string }
  | { t: 'list'; items: string[]; ordered?: boolean }
  | { t: 'cards'; cards: { title: string; tag?: string; html: string }[] }
  | { t: 'callout'; tone: Tone; title: string; html: string }
  | { t: 'predict'; question: string; options: PredictOption[] }
  | { t: 'decision'; id: string };

export interface Evidence {
  src: string;
  alt: string;
  caption: string;
}

export interface Step {
  id: string;
  /** small label above the title, e.g. "Problema 1" */
  kicker?: string;
  title: string;
  blocks: TextBlock[];
  /**
   * split  → text panel + stage (default)
   * cover  → chapter opening screen
   * stage  → the visual takes the whole screen, text becomes a caption strip
   */
  layout?: 'split' | 'cover' | 'stage';
  visual?: { scene: string; state?: string; props?: Record<string, unknown> };
  /** the original ArchColider artifact behind this diagram */
  evidence?: Evidence;
  /** plain-language reading of the diagram, for screen readers and "ver como texto" */
  describe?: string;
}

export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number;
  why: string;
}

export interface Chapter {
  id: string;
  number: number;
  phase: string;
  title: string;
  subtitle: string;
  minutes: number;
  learn: string[];
  /** original docs opened from inside scenes (not referenced in prose) */
  extraDocs?: string[];
  steps: Step[];
}

export interface CourseEntry {
  id: string;
  number: number;
  phase: string;
  title: string;
  blurb: string;
  available: boolean;
}
