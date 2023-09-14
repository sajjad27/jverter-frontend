import { Component, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { InputField, InputFieldType, Program, ValidatorType } from 'src/app/components/programs/model/program.model';
import { FormHelper } from 'src/app/service/form-helper';

@Component({
  selector: 'app-program',
  templateUrl: './program.component.html',
  styleUrls: ['./program.component.css']
})
export class ProgramComponent implements OnChanges {

  @Input()
  program!: Program;

  @Output() result = new Subject<string>();

  constructor(private formHelper: FormHelper) { }



  form!: FormGroup;


  ngOnChanges(): void {
    console.log(`this.program`, this.program);
    if (this.program) {
      this.createForm();
    }
  }

  createForm() {
    let formControls: any = {}
    this.program.inputFields?.forEach(inputField => {
      this.createFormControl(inputField, formControls)
    })
    this.form = new FormGroup(
      formControls
    )
  }
  createFormControl(inputField: InputField, formControls: any) {
    formControls[inputField.name] = new FormControl()
    this.addValidations(inputField, formControls)
  }

  addValidations(inputField: InputField, formControls: any) {
    if (inputField?.validations?.validatorType === ValidatorType.REQUIRED) {
      formControls[inputField.name].addValidators([Validators.required])
    }
    if (inputField?.validations?.validatorType === ValidatorType.EMAIL) {
      formControls[inputField.name].addValidators([Validators.email])
    }
  }



  enterWithEnter(event: any) {
    if (event.keyCode === 13) {
      this.enter();
    }
  }

  enter() {
    if (this.form.invalid) {
      this.formHelper.markAllAsTouched(this.form);
      return;
    }
    // const jsCode = `function greet(firstName, lastName) {
    //   return "Hello, " + firstName + " " + lastName + "!";
    // }`;

    // const params = {
    //   firstName: 'John',
    //   lastName: 'Doe'
    // };


    const result = this.executeJs();
    this.result.next(result)
  }

  executeJs(): string {
    if (!this.program.inputFields || !this.program.jsCode) {
      return "";
    }

    let jsCode = this.program.jsCode
    let params: any = {}
    for (let inputField of this.program.inputFields) {
      let key = inputField.name
      let value = this.getValue(inputField);
      params[key] = value
    }
    try {
      const keys = Object.keys(params);
      const values = Object.values(params);

      console.log(`jsCode`, jsCode);
      // jsCode = `return firstNum + secondNum;`;

      const dynamicFn = new Function(...keys, `return (function run(params) {${jsCode}})(...arguments)`);
      const result = dynamicFn(...values);
      return result;
    } catch (e) {
      console.error('Error while executing dynamic code:', e);
      return "null";
    }
  }
  getValue(inputField: InputField): string | number {

    let value = undefined
    if (inputField.InputFieldType === InputFieldType.NUMBER) {
      value = +this.form.get(inputField.name + '')?.value
    } else {
      value = this.form.get(inputField.name + '')?.value
    }
    return value
  }

}
