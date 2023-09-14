import { Component, forwardRef, Injector, Input } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NgControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Validation } from 'src/app/components/programs/model/program.model';


@Component({
  selector: 'app-jv-input-field',
  templateUrl: './jv-input-field.component.html',
  styleUrls: ['./jv-input-field.component.css'],
  host: { '(blur)': 'onTouched($event)' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => JvFieldComponent),
      multi: true
    }
  ]
})
export class JvFieldComponent implements ControlValueAccessor {
  control!: FormControl;
  // this required is used to add * automatically
  required: boolean = false;
  name!: string;
  errorMessages: string[] = []

  @Input() messages: Validation | undefined;
  @Input() type: string = "text";
  @Input() label: string | null = null;
  @Input() placeholder: string | null = null;


  constructor(private injector: Injector) { }

  onChange: any = () => { }
  onTouch: any = () => { }

  val = ""
  set value(val: string) {
    if (val !== this.value) {
      this.val = val;
      this.onChange(val);
    }
  }

  get value() {
    return this.val;
  }
  writeValue(value: any) {
    this.value = value
  }
  registerOnChange(fn: any) {
    this.onChange = fn
  }
  registerOnTouched(fn: any) {
    this.onTouch = fn
  }

  ngAfterViewInit(): void {
    const ngControl: any = this.injector.get(NgControl, null);
    if (ngControl) {
      setTimeout(() => {
        this.control = ngControl.control as FormControl;
        this.required = this.checkIfRequired();
        this.name = this.getControlName();
        this.mapErrorMessages();
      })
    }
  }

  mapErrorMessages() {
    // first state like required
    this.mapErrors();
    // map errors after each change on the component
    this.control.statusChanges.subscribe(result => {
      this.errorMessages = []
      this.mapErrors();
    })
  }

  mapErrors() {
    if (this.control.errors) {
      Object.keys(this.control.errors).forEach((key: any) => {
        if (this.messages) {
          let errorMessage = this.messages.message ? this.messages.message : this.control.errors?.[key];
          this.errorMessages.push(errorMessage);
        }
      })
    }
  }

  private getControlName(): string {
    let group = <FormGroup>this.control?.parent;
    if (!group) {
      return "";
    }
    let name: string = "";
    Object.keys(group.controls).forEach(key => {
      let childControl = group.get(key);
      if (childControl !== this.control) {
        return;
      }
      name = key;
    });
    return name;
  }

  onTouched(event: any) {
    this.onTouch();
  }

  checkIfRequired(): boolean {
    const { validator } = this.control
    if (validator) {
      const validation = validator(new FormControl())
      return validation !== null && validation['required'] === true
    }
    return false;
  }
}
