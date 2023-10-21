// feature-flag.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, finalize, tap, throwError } from 'rxjs';
import { getUrl } from 'src/environments/URLs.service';
import { Feature } from '../components/togglz/model/feature.model';
import { isEqual } from 'lodash-es';

@Injectable({
    providedIn: 'root'
})
export class FeaturesService {
    features: Feature[] = []
    $features: BehaviorSubject<Feature[] | null> = new BehaviorSubject<Feature[] | null>(null);
    constructor(private http: HttpClient) { }

    dispatchAllFeatures() {
        return this.http.get<Feature[]>(getUrl("allTogglz")).pipe(tap(features => {
            this.features = features;
            this.$features.next(this.features)
        }));
    }

    changeFeatureStatus(featureName: string, checked: boolean) {
        const index = this.features.findIndex(feature => feature.name === featureName);
        this.features[index].enabled = checked;

        let body: Feature = { name: featureName, enabled: checked }
        return this.http.post<Feature>(getUrl("singleTogglz"), body).pipe(
            catchError((error) => {
                this.features[index].enabled = !checked;
                return throwError(error);
            }),
            finalize(() => {
                this.$features.next(this.features)
            })
        );
    }
}

