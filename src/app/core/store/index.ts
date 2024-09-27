import { patchState, signalStore, withMethods } from '@ngrx/signals';
import { Task, TaskWithoutID } from '@app/core/types';
import { addEntity, removeEntity, updateEntity, withEntities } from '@ngrx/signals/entities';
import { generateID } from '@app/core/utils';

export const TasksStore = signalStore(
  { providedIn: 'root' },
  withEntities<Task>(),
  withMethods((store) => ( {
    addTask(newTask: TaskWithoutID): void {
      patchState(store, addEntity({ id: generateID(), ...newTask }));
    },
    updateTask(id: string, data: Partial<TaskWithoutID>): void {
      patchState(store, updateEntity({ id, changes: data }));
    },
    removeTask(id: string): void {
      patchState(store, removeEntity(id));
    },
  } ))
);
