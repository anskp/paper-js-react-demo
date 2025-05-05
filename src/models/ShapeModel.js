export class ShapeModel {
  constructor(type, properties = {}) {
    this.type = type; // 'circle', 'rectangle', 'path', etc.
    this.properties = {
      position: properties.position || { x: 0, y: 0 },
      fillColor: properties.fillColor || '#3498db',
      strokeColor: properties.strokeColor || '#2980b9',
      strokeWidth: properties.strokeWidth || 2,
      ...properties
    };
    this.id = `shape_${Math.random().toString(36).substr(2, 9)}`;
  }

  updateProperties(newProperties) {
    this.properties = { ...this.properties, ...newProperties };
    return this;
  }

  getProperties() {
    return this.properties;
  }

  clone() {
    return new ShapeModel(this.type, { ...this.properties });
  }
}