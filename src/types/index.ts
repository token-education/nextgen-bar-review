export interface Topic {
  id: number;
  subject: string;
  rule: string;
  trigger: string;
  notes: string;
  date: string;
  commonVsModern?: string;
  mastered?: boolean;
}
