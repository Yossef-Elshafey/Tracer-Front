export interface Plan {
  id: number;
  plan: string;
  steps: number;
  added: Date;
  finish_by: Date;
  state: boolean;
  progress: number;
}

export interface Task {
  id: number;
  title: string;
  done: boolean;
  added: Date;
}

export interface CalendarInfo {
  start: number;
  endDate: number;
  end: number;
  endPrevDate: number;
}
