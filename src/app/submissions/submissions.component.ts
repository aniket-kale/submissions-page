import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { Constants } from '../shared/constants';
import { LayerControl } from './shared/layers';
import { SubmissionsService } from './submissions.service';
import { Submission } from './shared/submissions.interface';
import { Search } from './shared/search.model';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-submissions',
  templateUrl: './submissions.component.html',
  styleUrls: ['./submissions.component.css'],
})
export class SubmissionsComponent implements OnInit {
  map!: mapboxgl.Map;
  mapboxGeocoder!: MapboxGeocoder;
  submissions: Array<Submission> = [];
  filteredSubmissions: Array<Submission> = [];
  searchModel = new Search();

  constructor(private submissionsService: SubmissionsService) {}

  ngOnInit() {
    // base map switcher event
    this.submissionsService.baseMapSwitcher$.subscribe(
      (baseMapStyle: string) => {
        if (baseMapStyle) {
          this.onChangeOfBaseMap(baseMapStyle);
        }
      }
    );
    this.initMapBox();
  }

  /**
   * to initialize the map and add controls including custom control
   */
  initMapBox(): void {
    this.map = new mapboxgl.Map({
      accessToken: Constants.mapConfig.token,
      container: Constants.mapConfig.container,
      style: Constants.mapStyles.light.value,
      zoom: Constants.mapConfig.zoom,
      center: [Constants.mapConfig.lng, Constants.mapConfig.lat],
      minZoom: Constants.mapConfig.minZoom,
      pitch: 0, // pitch in degrees
      attributionControl: false,
    });
    // Ref: https://docs.mapbox.com/mapbox-gl-js/example/render-world-copies/
    this.map.setRenderWorldCopies(false);
    // Zoom and rotation controls
    this.map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
    // Full screen control
    this.map.addControl(new mapboxgl.FullscreenControl());

    // on map load event
    this.map.on('load', () => {
      // call get submission api
      this.getSubmissions();

      // create layer container
      const layerContainer = this.submissionsService.getLayerContainer();
      const layerControl = new LayerControl(layerContainer);
      this.map.addControl(layerControl, 'bottom-right');

      // For development purpose
      const win: any = window;
      win.mapbox = this.map;

      // Fly to the location where we have all data
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
  }

  /**
   * To get submission from API
   */
  getSubmissions(): void {
    this.submissionsService
      .getSubmissions()
      .subscribe((submissions: Array<Submission>) => {
        // to maintain all submissions
        this.submissions = submissions;
        // to maintain filtered/searched submissions
        this.filteredSubmissions = [...this.submissions];
        // update filter
        this.onChangeOfFilter();
      });
  }

  /**
   * On change of filter by name, status, and date
   */
  onChangeOfFilter(): void {
    // cloning all submissions
    let filteredData = [...this.submissions];
    // update case of name
    const searchString = this.searchModel.searchString.toLowerCase();

    // update filter if search value exists
    if (this.searchModel.searchString) {
      filteredData = filteredData.filter((submission) => {
        return (
          submission.name.toLowerCase().includes(searchString) ||
          submission.from.toLowerCase().includes(searchString) ||
          submission.to.toLowerCase().includes(searchString)
        );
      });
    }

    // update filter if status exists
    if (this.searchModel.status) {
      filteredData = filteredData.filter(
        (submission) => submission.status === this.searchModel.status
      );
    }

    // update filter if date exists
    if (this.searchModel.date) {
      filteredData = filteredData.filter(
        (submission) =>
          // adding submission which are under the searched date
          new Date(submission.date) <= new Date(this.searchModel.date)
      );
    }

    // coping the filters data and assigning it to the actual filtered submissions
    this.filteredSubmissions = [...filteredData];

    // add features on the map based on filter
    this.addFeaturesOnMap();
  }

  /**
   * add features on the map based on filter
   */
  addFeaturesOnMap(): void {
    // convert submissions to geojson features
    const features = this.filteredSubmissions.map((submission: Submission) => {
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [submission.lng, submission.lat],
        },
        properties: {},
      };
    });

    // load icon image to the map
    this.map.loadImage(Constants.submissionImagePath, (error, image: any) => {
      // throw error if icon doesn't add
      if (error) throw error;

      // check if image is already exists
      if (!this.map.hasImage('submission')) {
        // remove if already exists
        this.map.addImage('submission', image);
      }
      // check if layer is already exists
      if (this.map.getLayer('submissionLayer')) {
        // remove if already exists
        this.map.removeLayer('submissionLayer');
      }

      // check if source is already exists
      if (this.map.getSource('submissionSource')) {
        // remove if already exists
        this.map.removeSource('submissionSource');
      }

      // add submissin source to the map with all geojson features
      this.map.addSource('submissionSource', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: features as any,
        },
      });

      // add submissin layer to the map along with submissionSource
      this.map.addLayer({
        id: 'submissionLayer',
        type: 'symbol',
        source: 'submissionSource',
        layout: {
          'icon-image': 'submission',
        },
      });
    });
  }

  /**
   * on click of export button
   */
  onClickOfExport(): void {
    // defining column headers and it's values
    const fileToExport: Array<{
      Name: string;
      From: string;
      To: string;
      Date: string;
      Status: string;
      Coordinates: string;
    }> = this.filteredSubmissions.map((submission: Submission) => {
      return {
        Name: submission.name,
        From: submission.from,
        To: submission.to,
        Date: submission.date,
        Status: submission.status,
        Coordinates: `{${submission.lng},${submission.lat}}`,
      };
    });
    // passing to export function to download excel
    this.exportToExcel(
      fileToExport,
      'my-submissions-' + new Date().getTime() + '.xlsx'
    );
  }

  /**
   * used to export data in excel
   * @param submissionDataToExport submissions data to export
   * @param fileName file name
   */
  exportToExcel(
    submissionDataToExport: Array<{
      Name: string;
      From: string;
      To: string;
      Date: string;
      Status: string;
      Coordinates: string;
    }>,
    fileName: string
  ): void {
    // generate workbook and add the worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(submissionDataToExport);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();

    // save to file
    XLSX.utils.book_append_sheet(workbook, ws, 'Sheet1');
    XLSX.writeFile(workbook, fileName);
  }


  /**
   * used to change the base map style
   * @param style style name
   */
  onChangeOfBaseMap(style: string): void {
    this.map.setStyle(style);
    this.map.on('style.load', () => {
      // rendering features on the map as soon as styles changes
      this.addFeaturesOnMap();
    });
  }
}
