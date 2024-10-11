export interface Plan {
  id: number;
  plan: string;
  steps: number;
  added: Date;
  finish_by: Date;
  state: boolean;
  progress: number;
}
