import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { routes } from './app-routing.module';
import { AppComponent } from './app.component';
import { JvFieldComponent } from './components/shared/jv-input-field/jv-input-field.component';
import { ModalComponent } from './components/shared/modal/modal.component';
import { NoResultFoundComponent } from './components/shared/no-result-found/no-result-found.component';
import { ProgramComponent } from './components/programs/components/program/program.component';
import { ProgramsComponent } from './components/programs/components/programs.component';
import { HttpClientModule } from '@angular/common/http';
import { ProgressBarComponent } from './components/shared/progress-bar/progress-bar.component';


@NgModule({
  declarations: [
    AppComponent,
    ProgramsComponent,
    ProgramComponent,
    ModalComponent,
    JvFieldComponent,
    NoResultFoundComponent,
    ProgressBarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
