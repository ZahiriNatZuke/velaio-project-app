import { patchState, signalStore, withMethods } from '@ngrx/signals';
import { Task, TaskWithoutID } from '@app/core/types';
import { addEntity, removeEntity, updateEntity, withEntities } from '@ngrx/signals/entities';
import { generateID } from '@app/core/utils';

export const TasksStore = signalStore(
  { providedIn: 'root' },
  withEntities<Task>(),
  withMethods((store) => ( {
    getTask(id: string): Task | undefined {
      return store.ids().includes(id)
        ? store.entityMap()[ id ]
        : undefined;
    },
    checkTask(id: string): boolean {
      return store.ids().includes(id);
    },
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
