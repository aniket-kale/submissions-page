export class LayerControl {

  layerContainers: any;
  constructor(public layerContainer: any) {
    this.layerContainers = layerContainer;
  }
  onAdd(map: any) {
    const that: any = this;
    that._map = map;
    that._container = this.layerContainers;
    that._container.className = 'mapboxgl-ctrl';
    return that._container;
  }

  onRemove() {
    const that: any = this;
    that._container.parentNode.removeChild(that._container);
    that._map = undefined;
  }
}
