export class Constants {
  public static readonly mapStyles = {
    light: {
        key: 'light',
        value: 'mapbox://styles/mapbox/light-v10',
    },
    sateLight: {
        key: 'sateLight',
        value: 'mapbox://styles/mapbox/satellite-v9',
    },
};
public static readonly mapConfig = {
  // currently not using as we have api based lat & lng
  lat: 37.0902,
  lng: -95.7129,
  latamMap: {
      lat: -4.442039,
      lng: -61.326854,
  },
  zoom: 3.3,
  // setting max bound of world
  maxBounds: [
      [-180, -85],
      [180, 85],
  ],
  minZoom: 1,
  navigationControlPosition: 'bottom-right',
  geocoderControlPosition: 'bottom-right',
  locationLayerName: 'location-layer',
  locationSourceName: 'location-source',
  assetLayerName: 'asset-layer',
  assetSourceName: 'asset-source',
  researchStationLayerName: 'research-station-layer',
  researchStationSourceName: 'research-station-source',
  mapboxglPopupClassName: 'mapboxgl-popup',
  mapboxglPopupCustomClassName: 'location-popup',
  zoomForSpecificResearchStation: 5,
  token: 'pk.eyJ1Ijoic3dhcG5pbC1taXJnYW5lIiwiYSI6ImNsNmdkc3V1NDA3Ymwza25jNjJsOGNyemIifQ.vwcBKjr_2dg839FM-lirCA',
  container: 'map',
};
}
