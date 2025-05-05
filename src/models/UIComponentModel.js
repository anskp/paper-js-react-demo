export class UIComponentModel {
  constructor(type, properties = {}) {
    this.type = type; // 'button', 'slider', 'toggle', etc.
    this.properties = {
      position: properties.position || { x: 0, y: 0 },
      size: properties.size || { width: 100, height: 30 },
      text: properties.text || '',
      value: properties.value || 0,
      ...properties
    };
    this.id = `ui_${Math.random().toString(36).substr(2, 9)}`;
    this.state = {
      isHovered: false,
      isActive: false,
      ...properties.initialState
    };
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    return this;
  }

  updateProperties(newProperties) {
    this.properties = { ...this.properties, ...newProperties };
    return this;
  }
}