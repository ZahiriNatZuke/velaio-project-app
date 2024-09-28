import { Component, computed, inject, Signal, signal } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { ConfirmationAction, Task, TaskStatus } from '@app/core/types';
import { TasksStore } from '@app/core/store';
import { MatAnchor, MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '@app/core/components';
import { filter, take } from 'rxjs';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    MatButtonToggleModule,
    FormsModule,
    MatButtonModule,
    MatAnchor,
    RouterLink,
    MatListModule,
    DatePipe,
    MatIconModule,
    TitleCasePipe,
    MatTooltipModule
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent {

  #dialog = inject(MatDialog);
  #tasksStore = inject(TasksStore);

  taskStatus = signal<TaskStatus | null>(null);
  tasks: Signal<Task[]> = computed(() => {
    return ( this.taskStatus() === null )
      ? this.#tasksStore.entities()
      : this.#tasksStore.entities().filter((task) => task.status === this.taskStatus());
  });

  markAsCompleted(task: Task) {
    this.#dialog.open(
      ConfirmationDialogComponent,
      { data: { name: task.name, action: ConfirmationAction.Complete } }
    ).afterClosed()
      .pipe(filter(Boolean), take(1))
      .subscribe(() => this.#tasksStore.updateTask(task.id, { status: 'completed' }));
  }

  removeTask(task: Task) {
    this.#dialog.open(
      ConfirmationDialogComponent,
      { data: { name: task.name, action: ConfirmationAction.Remove } }
    ).afterClosed()
      .pipe(filter(Boolean), take(1))
      .subscribe(() => this.#tasksStore.removeTask(task.id));
  }

}
