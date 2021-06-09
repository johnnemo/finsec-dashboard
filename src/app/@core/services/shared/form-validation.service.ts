import {Injectable} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Injectable({
              providedIn: 'root'
            })
export class FormValidationService {

  constructor() {
  }


  logValidationErrors(group: FormGroup, formErrors: any, loginValidationMessages: any): void {
    // Loop through each control key in the FormGroup
    Object.keys(group.controls).forEach((key: string) => {
      // Get the control. The control can be a nested form group
      const abstractControl = group.get(key);
      // If the control is nested form group, recursively call
      // this same method
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl, formErrors, loginValidationMessages);
        // If the control is a FormControl
      } else {
        // Clear the existing validation errors
        formErrors[key] = ' ';
        if (abstractControl && !abstractControl.valid && (abstractControl.touched || abstractControl.dirty)) {
          // Get all the validation messages of the form control
          // that has failed the validation
          const messages = loginValidationMessages[key];
          // Find which validation has failed. For example required,
          // minlength or maxlength. Store that error message in the
          // formErrors object. The UI will bind to this object to
          // display the validation errors
          for (const errorKey in abstractControl.errors) {
            if (errorKey) {
              formErrors[key] += messages[errorKey] + ' ';
            }
          }
        }
      }
    });
  }
}
