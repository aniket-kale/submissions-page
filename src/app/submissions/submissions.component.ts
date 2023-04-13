import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { Constants } from '../shared/constants';
import { LayerControl } from './shared/layers';
import { SubmissionsService } from './submissions.service';
import { Submission } from './shared/submissions.interface';

@Component({
  selector: 'app-submissions',
  templateUrl: './submissions.component.html',
  styleUrls: ['./submissions.component.css'],
})
export class SubmissionsComponent implements OnInit {
  map!: mapboxgl.Map;
  mapboxGeocoder!: MapboxGeocoder;
  submissions: Array<Submission> = [];

  constructor(private submissionsService: SubmissionsService) {}

  ngOnInit() {
    this.initMapBox();
  }

  initMapBox() {
    this.map = new mapboxgl.Map({
      accessToken: Constants.mapConfig.token,
      container: Constants.mapConfig.container,
      style: Constants.mapStyles.light.value,
      zoom: Constants.mapConfig.zoom,
      center: [Constants.mapConfig.lng, Constants.mapConfig.lat],
      minZoom: Constants.mapConfig.minZoom,
      // setting max bound of world
      // maxBounds: Constants.mapConfig.maxBounds,
      pitch: 0, // pitch in degrees
      attributionControl: false,
    });
    // Ref: https://docs.mapbox.com/mapbox-gl-js/example/render-world-copies/
    this.map.setRenderWorldCopies(false);
    // Zoom and rotation controls
    this.map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

    this.map.addControl(new mapboxgl.FullscreenControl());

    this.map.on('load', () => {
      this.getSubmissions();
      const layerControl = new LayerControl();
      this.map.addControl(layerControl, 'bottom-right');
      // For development purpose
      const win: any = window;
      win.mapbox = this.map;

      this.map.flyTo({
        center: [-79.5242, 43.637],
        zoom: 10.5,
        speed: 1.5,
        curve: 1,
        easing(t) {
          return t;
        },
      });
    });

    this.map.on('click', (e) => {
      console.log('e: ', e.lngLat);
    });
  }

  getSubmissions(): void {
    this.submissionsService
      .getSubmissions()
      .subscribe((submissions: Array<Submission>) => {
        this.submissions = submissions;
        this.addFeaturesOnMap();
      });
  }

  addFeaturesOnMap() {
    const features = this.submissions.map((submission: Submission) => {
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [submission.lng, submission.lat],
        },
        properties: {},
      };
    });

    this.map.loadImage(Constants.submissionImagePath, (error, image: any) => {
      if (error) throw error;

      this.map.addImage('submission', image);

      this.map.addSource('point', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: features as any,
        },
      });

      this.map.addLayer({
        id: 'points',
        type: 'symbol',
        source: 'point',
        layout: {
          'icon-image': 'submission',
          // 'icon-size': 1.5
        },
      });
    });
  }
}
