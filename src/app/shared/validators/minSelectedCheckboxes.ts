import { AbstractControl, FormArray, ValidatorFn } from "@angular/forms";

export function minSelectedCheckboxes(min = 1) {
    const validator: ValidatorFn = (formArray: AbstractControl) => {
      if (formArray instanceof FormArray) {
        const totalSelected = formArray.controls.map((control) => {
            return control.value
          }).reduce((prev, next) => {
            return (next ? prev + next : prev)
          }, 0);
        return totalSelected >= min ? null : { required: true };
      }
  
      throw new Error('formArray is not an instance of FormArray');
    };
  
    return validator;
  }