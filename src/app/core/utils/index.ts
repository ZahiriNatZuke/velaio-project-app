import { AbstractControl, FormArray, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Person } from '@app/core/types';

export function generateID() {
  return Math.random().toString(36).substring(2, 9);
}

export function checkSkills(): ValidatorFn {
  return (form: AbstractControl): ValidationErrors | null => {
    const array = form as FormArray;
    const initialStatus = array.pristine || array.untouched || array.pending;
    if ( initialStatus ) return null;
    const value = ( array.value as string[] ).map(v => v.toLowerCase());
    if ( !initialStatus && value.length === 0 )
      return { skillsError: 'La persona debe tener al menos una habilidad.' };
    return [ ...new Set(value) ].length === value.length
      ? null
      : { skillsError: 'Las habilidades no se pueden repetir.' };
  };
}

export function checkPeople(): ValidatorFn {
  return (form: AbstractControl): ValidationErrors | null => {
    const array = form as FormArray;
    const initialStatus = array.pristine || array.untouched || array.pending;
    if ( initialStatus ) return null;
    const value = array.value as Person[];
    if ( !initialStatus && value.length === 0 )
      return { checkPeople: 'La tarea debe tener al menos una persona asociada a ella.' };
    return [ ...new Set(value.map(p => p.name.toLowerCase())) ].length === value.length
      ? null
      : { checkPeople: 'No se puede asociar a la misma persona a una tarea más de una vez.' };
  };
}
