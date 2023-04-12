import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { Constants } from '../shared/constants';
import { LayerControl } from './shared/layers';

@Component({
  selector: 'app-submissions',
  templateUrl: './submissions.component.html',
  styleUrls: ['./submissions.component.css'],
})
export class SubmissionsComponent implements OnInit {
  map!: mapboxgl.Map;
  mapboxGeocoder!: MapboxGeocoder;

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

    // ref: https://github.com/mapbox/mapbox-gl-geocoder/blob/master/API.md#parameters
    // this.mapboxGeocoder = new MapboxGeocoder({
    //   accessToken: mapboxgl.accessToken,
    //   mapboxgl: mapboxgl,
    //   clearOnBlur: true,
    //   clearAndBlurOnEsc: true,
    // });

    this.map.on('load', () => {
      const layerControl = new LayerControl();

      this.map.addControl(layerControl, 'bottom-right');
      // const customControlForButtons = new Control({ element: this.createButtonsOnMap() });
      // this.loaded.mapBox = true;
      // // Fly to the region location if user changed the region
      // if (this.loadNewDataInsteadOfStored) {
      //     this.flyTo();
      // }
      // this.addAssetImagesOnMap();
      // this.addResearchStationImageOnMap();
      // this.addLocationsOnMap();
    });
  }
}
