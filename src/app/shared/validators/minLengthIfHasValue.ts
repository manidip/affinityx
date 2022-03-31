import { AbstractControl, ValidatorFn } from "@angular/forms";

export function minLengthIfHasValue(min = 6) {
    const validator: ValidatorFn = (control: AbstractControl) => {
      
      if (control.value == '') return null;
     
      return  (control.value.length > min) ? null : { minRequiredLength: true };

    };
  
    return validator;
  }