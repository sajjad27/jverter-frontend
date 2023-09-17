import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AppRole } from '../model/app-role';
import { AuthService } from './auth.service';

@Directive({
  selector: '[renderRoles]'
})
export class RenderRolesDirective {

  constructor(private templateRef: TemplateRef<any>, private VCRef: ViewContainerRef, private authService: AuthService) { }

  @Input() set renderRoles(requiredRoles: AppRole[]) {
    if (this.checkUserHasRequiredRoles(requiredRoles)) {
      this.VCRef.createEmbeddedView(this.templateRef);
    } else {
      this.VCRef.clear();
    }
  }

  private checkUserHasRequiredRoles(requiredRoles: AppRole[]): boolean {
    let hasRequiredRole: boolean = requiredRoles.some(requiredRole => this.authService.userHasRole(requiredRole));
    return hasRequiredRole;
  }

}
