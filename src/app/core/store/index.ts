import { patchState, signalStore, withHooks, withMethods } from '@ngrx/signals';
import { Task, TaskWithoutID } from '@app/core/types';
import { addEntities, addEntity, removeEntity, updateEntity, withEntities } from '@ngrx/signals/entities';
import { generateID } from '@app/core/utils';
import { effect } from '@angular/core';

// @ts-ignore
export const TasksStore = signalStore(
  { providedIn: 'root', protectedState: true },
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
    loadTaskFromStorage(): void {
      try {
        if ( localStorage.getItem('tasks-store') ) {
          const tasks: Task[] = JSON.parse(localStorage.getItem('tasks-store')!);
          patchState(store, addEntities(tasks));
        }
      } catch ( _ ) {
        console.log('La información recuperada del localStorage no tiene un formato correcto');
      }
    }
  } )),
  withHooks({
    onInit: ({ loadTaskFromStorage, entities }) => {
      loadTaskFromStorage();
      effect(() => {
        localStorage.setItem('tasks-store', JSON.stringify(entities()));
      });
    }
  })
);
