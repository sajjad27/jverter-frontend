import { Component, OnInit } from '@angular/core';
import { InputField, InputFieldType, Program, ValidatorType } from 'src/app/components/programs/model/program.model';
import { ModalService } from 'src/app/service/modal.service';
import { ProgramService } from '../service/programs-service';
import { Subscription } from 'rxjs';
import { AuthService } from './auth/authService/auth.service';
import { AppRole } from './auth/model/app-role';

@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.css']
})
export class ProgramsComponent implements OnInit {

  constructor(private modalService: ModalService, private programService: ProgramService, private authService: AuthService) { }

  programs: Program[] = [];
  filteredPrograms: Program[] = [];
  programsSubscription!: Subscription;

  appRole = AppRole;



  ngOnInit(): void {
    this.loadPrograms()
    this.filterItems("")
  }
  loadPrograms() {
    this.programsSubscription = this.programService.$programs.subscribe(programs => {
      this.programs = programs
      this.filterItems("")
    })

    this.programService.dispatchAllProgramsSummary();
    // this.addTmpForms();
  }

  addTmpForms() {
    this.programs = [{ title: "Adder", description: "TaskMaster is a powerful task management application that helps you stay organized and productive. Create tasks, set due dates, prioritize, and track progress easily. Never miss a deadline again!" },
    { title: "Subtracter", description: "FitTrack is your personal fitness companion. Track your workouts, set goals, and monitor your progress all in one place. Whether you're a beginner or a fitness enthusiast, FitTrack will help you achieve your health and wellness goals." },
    { title: "Multiplier", description: "TravelPal is your ultimate travel companion. Plan your trips, discover popular attractions, find the best restaurants, and get real-time navigation assistance. Explore new destinations and make the most out of your travel adventures with TravelPal." },
    { title: "Divider", description: "convenient meal planning app that simplifies your cooking experience. Snap a photo of your ingredients, and SnapEat will generate delicious recipes based on what you have. Say goodbye to food waste and hello to easy and tasty meals!" },
    ]

    let form1inputField1: InputField = { label: "first Num", validations: { validatorType: ValidatorType.REQUIRED, message: 'firstNum is required' }, placeholder: "firstNum", name: "firstNum", InputFieldType: InputFieldType.NUMBER }
    let form1inputField2: InputField = { label: "second Num", validations: { validatorType: ValidatorType.REQUIRED, message: 'secondNum is required' }, placeholder: "secondNum", name: "secondNum", InputFieldType: InputFieldType.NUMBER }
    this.programs[0].inputFields = [form1inputField1, form1inputField2]
    let jsCode1 = `function run(params) {return firstNum + secondNum;}`
    this.programs[0].jsCode = jsCode1

    let form2inputField1: InputField = { label: "firstNum", validations: { validatorType: ValidatorType.REQUIRED, message: 'firstNum is required' }, placeholder: "firstNum", name: "firstNum", InputFieldType: InputFieldType.NUMBER }
    let form2inputField2: InputField = { label: "secondNum", validations: { validatorType: ValidatorType.REQUIRED, message: 'secondNum is required' }, placeholder: "secondNum", name: "secondNum", InputFieldType: InputFieldType.NUMBER }
    this.programs[1].inputFields = [form2inputField1, form2inputField2]
    let jsCode2 = `function run(params) {return firstNum - secondNum;}`
    this.programs[1].jsCode = jsCode2

    let form3inputField1: InputField = { label: "firstNum", validations: { validatorType: ValidatorType.REQUIRED, message: 'firstNum is required' }, placeholder: "firstNum", name: "firstNum", InputFieldType: InputFieldType.NUMBER }
    let form3inputField2: InputField = { label: "secondNum", validations: { validatorType: ValidatorType.REQUIRED, message: 'secondNum is required' }, placeholder: "secondNum", name: "secondNum", InputFieldType: InputFieldType.NUMBER }
    this.programs[2].inputFields = [form3inputField1, form3inputField2]
    let jsCode3 = `function run(params) {return firstNum * secondNum;}`
    this.programs[2].jsCode = jsCode3

    let form4inputField1: InputField = { label: "dividend", validations: { validatorType: ValidatorType.REQUIRED, message: 'dividend is required' }, placeholder: "dividend", name: "dividend", InputFieldType: InputFieldType.NUMBER }
    let form4inputField2: InputField = { label: "divisor", validations: { validatorType: ValidatorType.REQUIRED, message: 'divisor is required' }, placeholder: "divisor", name: "divisor", InputFieldType: InputFieldType.NUMBER }
    this.programs[3].inputFields = [form4inputField1, form4inputField2]
    let jsCode4 = `function run(params) {return dividend / divisor;}`
    this.programs[3].jsCode = jsCode4

  }

  filterItems(value: string): void {
    if (value) {
      this.filteredPrograms = this.programs.filter(program => program.title.toLowerCase().includes(value.toLowerCase()) || program.description.toLowerCase().includes(value.toLowerCase()));
    } else {
      this.filteredPrograms = this.programs.slice()
    }
  }

  openProgram(program: Program) {
    this.modalService.openModal(program).subscribe(() => {
    });
  }


  signin() {

    this.authService.logIn({ username: "sajad", password: "sajad" }).subscribe(() => {
      // this.routeToDefaultPage();
      let manyRoles = this.authService.getUserRoles()
    }, errorResponse => {
      // this.isLoading = false;
      // this.formHelper.mapErrors(errorResponse, this.form, this.globalErrorMessages);
    });

  }
}
