import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { routes } from './app-routing.module';
import { AppComponent } from './app.component';
import { RenderRolesDirective } from './components/programs/components/auth/authService/render-roles.directive';
import { ProgramComponent } from './components/programs/components/program/program.component';
import { ProgramsComponent } from './components/programs/components/programs.component';
import { JvFieldComponent } from './components/shared/jv-input-field/jv-input-field.component';
import { ModalComponent } from './components/shared/modal/modal.component';
import { NoResultFoundComponent } from './components/shared/no-result-found/no-result-found.component';
import { ProgressBarComponent } from './components/shared/progress-bar/progress-bar.component';


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
    RouterModule.forRoot(routes),
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('access_token'); // Change this to your token storage mechanism
        },
        // allowedDomains: ['example.com'], // Replace with your domain(s)
        // disallowedRoutes: ['example.com/auth/authenticate'], // Replace with your excluded route(s)
      },
    }
    )
  ],
  providers: [JwtHelperService],
  bootstrap: [AppComponent]
})
export class AppModule { }
