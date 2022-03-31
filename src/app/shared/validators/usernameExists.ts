import {  AbstractControl, AsyncValidatorFn, ValidationErrors} from '@angular/forms';
import { map, Observable, of } from 'rxjs';
import { UsersService } from '../services/users.service';

export function usernameExists(userService: UsersService){

    const  validate: AsyncValidatorFn = (control: AbstractControl):Observable<ValidationErrors | null>  => {
        return userService.is_username_exists(control.value)
        .pipe(
            map((result: boolean) => { 
                return result ? { usernameAlreadyExists: true } : null
            })
            );
    }

    return validate;
}