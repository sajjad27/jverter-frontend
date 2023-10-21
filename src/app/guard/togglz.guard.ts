// feature-flag.guard.ts

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { FeaturesService } from '../service/feature-togglz.service';

@Injectable({
  providedIn: 'root'
})
export class TogglzGuard  {

  constructor(private featuresService: FeaturesService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.featuresService.dispatchAllFeatures().pipe(
      map(() => true)) 
    ;
  }
}
