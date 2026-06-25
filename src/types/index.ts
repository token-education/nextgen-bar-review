export interface UserProgress {
  interval: number;
  repetition: number;
  efactor: number;
  nextReviewDate: string;
}

export interface Topic {
  id: number;
  subject: string;
  rule: string;
  question: string;
  trigger: string;
  notes: string;
  date: string;
  commonVsModern?: string;
  mastered?: boolean;
}
