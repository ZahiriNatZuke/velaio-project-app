import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormAction, Person, TaskStatus, TaskWithoutID } from '@app/core/types';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { checkPeople, checkSkills } from '@app/core/utils';
import { TasksStore } from '@app/core/store';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    JsonPipe
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
  providers: [ provideNativeDateAdapter() ],
})
export class TaskFormComponent implements OnInit {

  #fb = inject(FormBuilder);
  #router = inject(Router);
  #tasksStore = inject(TasksStore);

  action = input.required<FormAction>();
  taskId = input<string | undefined>(undefined, { alias: 'id' });
  minDueDate = signal(new Date());

  taskFormGroup = this.#fb.group({
    name: this.#fb.nonNullable.control<string>('', Validators.required),
    dueDate: this.#fb.nonNullable.control<any>('', [ Validators.required ]),
    status: this.#fb.nonNullable.control<TaskStatus>('pending', Validators.required),
    people: this.#fb.array<FormGroup>([ this.createPersonFormGroup() ], { validators: [ checkPeople() ] }),
  });

  ngOnInit(): void {
    if ( this.action() === 'update' && this.taskId() ) {
      if ( this.#tasksStore.checkTask(this.taskId()!) ) {
        const { name, people, status, dueDate } = this.#tasksStore.getTask(this.taskId()!)!;
        this.taskFormGroup.reset({
          name, dueDate, status
        });
        this.taskFormGroup.controls.people.clear();
        people.forEach(p => this.taskFormGroup.controls.people.push(this.createPersonFormGroup(p)));
        this.taskFormGroup.updateValueAndValidity();
      } else {
        this.#router.navigate([ '/form' ]);
      }
    }
  }

  get peopleFormArray() {
    return this.taskFormGroup.controls.people as FormArray<FormGroup>;
  }

  createPersonFormGroup(person: Person | null = null) {
    if ( person === null )
      return this.#fb.nonNullable.group({
        name: this.#fb.nonNullable.control<string>('', [ Validators.required, Validators.minLength(5) ]),
        age: this.#fb.nonNullable.control<number>(18, [ Validators.required, Validators.min(18) ]),
        skills: this.#fb.nonNullable.array<FormControl<string>>([
          this.#fb.nonNullable.control<string>('', [ Validators.required ])
        ], {
          validators: [ checkSkills() ]
        })
      });

    return this.#fb.nonNullable.group({
      name: this.#fb.nonNullable.control(person.name, [ Validators.required, Validators.minLength(5) ]),
      age: this.#fb.nonNullable.control(person.age, [ Validators.required, Validators.min(18) ]),
      skills: this.#fb.nonNullable.array<FormControl<string>>(
        person.skills.map(s => this.#fb.nonNullable.control<string>(s, [ Validators.required ]))
        , {
          validators: [ checkSkills() ]
        })
    });
  }

  getSkillsFormArray(personFormGroup: FormGroup): FormArray {
    return personFormGroup.controls[ 'skills' ] as FormArray<FormControl<string>>;
  }

  addPerson() {
    this.peopleFormArray.push(this.createPersonFormGroup());
  }

  removePerson(controlIndex: number) {
    this.peopleFormArray.removeAt(controlIndex);
  }

  removeSkill(skillControl: FormArray, skillIndex: number) {
    skillControl.removeAt(skillIndex);
  }

  addSkill(skillsArray: FormArray) {
    skillsArray.push(this.#fb.nonNullable.control<string>('', [ Validators.required ]));
  }

  saveTask() {
    if ( this.taskFormGroup.valid ) {
      this.action() === 'create'
        ? this.#tasksStore.addTask(this.taskFormGroup.value as TaskWithoutID)
        : this.#tasksStore.updateTask(this.taskId()!, this.taskFormGroup.value);
      this.goToTaskList();
    }
  }

  goToTaskList() {
    this.#router.navigate([ '/tasks' ]);
  }

}
