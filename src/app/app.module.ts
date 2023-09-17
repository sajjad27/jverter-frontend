import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { JWT_OPTIONS, JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { routes } from './app-routing.module';
import { AppComponent } from './app.component';
import { RenderRolesDirective } from './components/programs/components/auth/authService/render-roles.directive';
import { ProgramComponent } from './components/programs/components/program/program.component';
import { ProgramsComponent } from './components/programs/components/programs.component';
import { JvFieldComponent } from './components/shared/jv-input-field/jv-input-field.component';
import { ModalComponent } from './components/shared/modal/modal.component';
import { NoResultFoundComponent } from './components/shared/no-result-found/no-result-found.component';
import { ProgressBarComponent } from './components/shared/progress-bar/progress-bar.component';
import { AuthInterceptor } from './components/programs/components/auth/interceptor/AuthInterceptor.service';


@NgModule({
  declarations: [
    AppComponent,
    ProgramsComponent,
    ProgramComponent,
    ModalComponent,
    JvFieldComponent,
    NoResultFoundComponent,
    ProgressBarComponent,
    RenderRolesDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }, { provide: JWT_OPTIONS, useValue: JWT_OPTIONS }],
  bootstrap: [AppComponent]
})
export class AppModule { }
