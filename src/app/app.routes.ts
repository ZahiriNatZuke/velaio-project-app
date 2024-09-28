import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tasks',
    pathMatch: 'full',
  },
  {
    path: 'tasks',
    loadComponent: () => import('@app/views').then(c => c.TasksComponent),
    title: 'Task List'
  },
  {
    path: 'form',
    loadComponent: () => import('@app/views').then(c => c.TaskFormComponent),
    title: 'Task Form',
    data: {
      action: 'create'
    }
  },
  {
    path: 'form/:id',
    loadComponent: () => import('@app/views').then(c => c.TaskFormComponent),
    title: 'Task Form',
    data: {
      action: 'update'
    }
  },
  {
    path: '**',
    redirectTo: 'tasks',
    pathMatch: 'full',
  }
];
