import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from '@angular/material/dialog';
import { ConfirmationAction, ConfirmationData } from '@app/core/types';

@Component({
  template: `
    <h2 mat-dialog-title>¿Está usted seguro?</h2>
    <mat-dialog-content>
      <p class="text-lg font-medium">
        ¿Está seguro de que desea {{ action }} la tarea: “<b>{{ name }}</b>” ?
      </p>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button [mat-dialog-close]="false" color="warn" [autofocus]="false" tabindex="-1">Cancelar</button>
      <button mat-button [mat-dialog-close]="true" [autofocus]="true">Confirmar</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatDialogTitle
  ]
})
export class ConfirmationDialogComponent {

  #data = inject<ConfirmationData>(MAT_DIALOG_DATA);

  get name() {
    return this.#data.name;
  }

  get action() {
    return this.#data.action === ConfirmationAction.Remove
      ? 'eliminar'
      : 'marcar como completada';
  }

}
