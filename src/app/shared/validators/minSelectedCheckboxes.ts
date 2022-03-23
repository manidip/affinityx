import { AbstractControl, FormArray, ValidatorFn } from "@angular/forms";

export function minSelectedCheckboxes(min = 1) {
    const validator: ValidatorFn = (formArray: AbstractControl) => {
      if (formArray instanceof FormArray) {
        const totalSelected = formArray.controls
        // get a list of checkbox values (boolean)
          .map((control) => control.value)
          // total up the number of checked checkboxes
          .reduce((prev, next) => (next ? prev + next : prev), 0);
        return totalSelected >= min ? null : { required: true };
      }
  
      throw new Error('formArray is not an instance of FormArray');
    };
  
    return validator;
  }