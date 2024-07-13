export const FILLER_OPTIONS = ["WORD", "SENTENCE", "PARAGRAPH"] as const;

export type TFillerOption = typeof FILLER_OPTIONS[number];
