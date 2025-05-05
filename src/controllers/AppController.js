import { ShapeModel } from '../models/ShapeModel';
import { AnimationModel } from '../models/AnimationModel';
import { UIComponentModel } from '../models/UIComponentModel';

export class AppController {
  constructor() {
    this.shapes = [];
    this.animations = [];
    this.uiComponents = [];
    this.listeners = {};
  }

  // Shape management
  createShape(type, properties) {
    const shape = new ShapeModel(type, properties);
    this.shapes.push(shape);
    this.notify('shapes.updated', this.shapes);
    return shape;
  }

  updateShape(id, properties) {
    const shape = this.shapes.find(s => s.id === id);
    if (shape) {
      shape.updateProperties(properties);
      this.notify('shapes.updated', this.shapes);
    }
    return shape;
  }

  removeShape(id) {
    this.shapes = this.shapes.filter(s => s.id !== id);
    this.notify('shapes.updated', this.shapes);
  }

  // Animation management
  createAnimation(targetId, properties) {
    const animation = new AnimationModel(targetId, properties);
    this.animations.push(animation);
    this.notify('animations.updated', this.animations);
    return animation;
  }

  startAnimation(id) {
    const animation = this.animations.find(a => a.id === id);
    if (animation) {
      animation.start();
      this.notify('animations.updated', this.animations);
    }
    return animation;
  }

  stopAnimation(id) {
    const animation = this.animations.find(a => a.id === id);
    if (animation) {
      animation.stop();
      this.notify('animations.updated', this.animations);
    }
    return animation;
  }

  // UI Component management
  createUIComponent(type, properties) {
    const component = new UIComponentModel(type, properties);
    this.uiComponents.push(component);
    this.notify('uiComponents.updated', this.uiComponents);
    return component;
  }

  updateUIComponent(id, properties) {
    const component = this.uiComponents.find(c => c.id === id);
    if (component) {
      component.updateProperties(properties);
      this.notify('uiComponents.updated', this.uiComponents);
    }
    return component;
  }

  setUIComponentState(id, state) {
    const component = this.uiComponents.find(c => c.id === id);
    if (component) {
      component.setState(state);
      this.notify('uiComponents.updated', this.uiComponents);
    }
    return component;
  }

  // Observer pattern
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  notify(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }
}