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
    lat: 37.0902,
    lng: -95.7129,
    zoom: 3.3,
    // setting max bound of world
    maxBounds: [
      [-180, -85],
      [180, 85],
    ],
    minZoom: 1,
    token:
      'pk.eyJ1Ijoic3dhcG5pbC1taXJnYW5lIiwiYSI6ImNsNmdkc3V1NDA3Ymwza25jNjJsOGNyemIifQ.vwcBKjr_2dg839FM-lirCA',
    container: 'map',
  };
  public static readonly apiUrl = 'https://gist.githubusercontent.com/aniket-kale/ac05898fcea1ecf336a3b6ca70c16cef/raw/590c5bd9c26c32aef2b4f8b3b7f18a606db83f16/submissions.json';
  public static readonly submissionImagePath = 'assets/images/submission.png';
}
