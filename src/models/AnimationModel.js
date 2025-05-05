export class AnimationModel {
  constructor(targetId, properties = {}) {
    this.targetId = targetId;
    this.properties = {
      duration: properties.duration || 1000,
      easing: properties.easing || 'linear',
      repeat: properties.repeat || false,
      ...properties
    };
    this.id = `animation_${Math.random().toString(36).substr(2, 9)}`;
    this.isPlaying = false;
  }

  start() {
    this.isPlaying = true;
    return this;
  }

  stop() {
    this.isPlaying = false;
    return this;
  }

  updateProperties(newProperties) {
    this.properties = { ...this.properties, ...newProperties };
    return this;
  }
}