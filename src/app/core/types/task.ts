import { Person } from '@app/core/types';

export interface Task {
  id: string;
  name: string;
  dueDate: Date;
  status: TaskStatus;
  people: Person[];
}

export type TaskStatus = 'completed' | 'pending';

export type TaskWithoutID = Omit<Task, 'id'>;
