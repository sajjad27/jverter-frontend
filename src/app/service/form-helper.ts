import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ErrorResponse } from '../model/error-response';
/**
 * Helper Class for FormGroup
 */
@Injectable({
    providedIn: 'root'
})
export class FormHelper {

    public markAllAsTouched(formGroup: FormGroup): void {
        (Object as any).values(formGroup.controls).forEach((control: any) => {
            control.markAsTouched();
            if (control.controls) {
                this.markAllAsTouched(control);
            }
        });
    }

    public mapErrors(errorResponse: any, formGroup: FormGroup, globalErrorMessages: string[]): void {
        // clear the array
        globalErrorMessages.splice(0, globalErrorMessages.length)
        let errorsGroubByField: any;
        if (errorResponse) {
            if (errorResponse?.error instanceof ProgressEvent) {
                globalErrorMessages.push("The server is unreachable");
            } else {
                let errRespone = errorResponse?.error as ErrorResponse
                errRespone?.errors?.forEach((err) => {
                    if (err.message) {
                        // if error response OR form does not have field to display the error msg, then put it in the global error msges
                        if (err.field == null || (err.field != null && !formGroup?.controls[err.field])) {
                            globalErrorMessages.push(err.message);
                        } else {
                            // if already inserted, add another error to it
                            if (errorsGroubByField?.hasOwnProperty(err.field)) {
                                errorsGroubByField[err.field] = { ...errorsGroubByField[err.field], [err.code as string]: err.message }
                            } else {
                                // first insert to an error for a specific field
                                errorsGroubByField = { ...errorsGroubByField, [err.field]: { [err.code as string]: err.message } }
                            }
                        }
                    }
                });
                // set errors for one field to the form so that it get the effect and show the error 
                if (errorsGroubByField) {
                    Object.keys(errorsGroubByField).forEach((fieldErrors: any) => {
                        formGroup?.controls[fieldErrors]?.setErrors(errorsGroubByField[fieldErrors])
                        formGroup?.controls[fieldErrors]?.markAsTouched()
                    })
                }
            }
        }

    }
}