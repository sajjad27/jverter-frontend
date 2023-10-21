import { Component, OnInit } from '@angular/core';
import { Feature } from './model/feature.model';
import { Subscription } from 'rxjs';
import { FeaturesService } from 'src/app/service/feature-togglz.service';
import { BlockUiComponent } from '../shared/block-ui/block-ui.component';
import { BlockUiService } from 'src/app/service/block-ui.service';

@Component({
  selector: 'app-togglz',
  templateUrl: './togglz.component.html',
  styleUrls: ['./togglz.component.css']
})
export class TogglzComponent implements OnInit {

  features: Feature[] | null = null;
  $featuresSubscription!: Subscription;

  constructor(private featuresService: FeaturesService, private blockUiService: BlockUiService) { }

  ngOnInit(): void {
    this.loadTogglz()
  }

  loadTogglz() {
    this.featuresService.$features.subscribe(features => {
      this.features = features
    })
  }

  onCheckChanged(checked: boolean, featureName: string) {
    this.blockUiService.block()
    this.featuresService.changeFeatureStatus(featureName, checked).subscribe().add(() => {
      this.blockUiService.unblock()
    })
  }

}
