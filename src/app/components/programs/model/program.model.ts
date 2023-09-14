export interface Program {
    id?: number;
    title: string;
    description: string;
    inputFields?: InputField[];
    jsCode?: string;
}

export interface InputField {
    name: string,
    label: string,
    placeholder: string,
    validations: Validation, 
    InputFieldType: InputFieldType,
}

export interface Validation { 
    validatorType: ValidatorType,
    message: string
}

export enum InputFieldType {
    TEXT, NUMBER
  }
  export enum ValidatorType {
    REQUIRED, EMAIL
  }
  