import React, { useState } from 'react';
import PaperCanvas from '../components/PaperCanvas';
import PaperButton from '../components/PaperButton';
import PaperSlider from '../components/PaperSlider';
import PaperToggle from '../components/PaperToggle';

const ShapesDemo = ({ controller }) => {
  const [shapeType, setShapeType] = useState('circle');
  const [fillColor, setFillColor] = useState('#3498db');
  const [strokeColor, setStrokeColor] = useState('#2980b9');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [paperScope, setPaperScope] = useState(null);

  const initializePaper = (paper) => {
    setPaperScope(paper);
    
    // Create a background
    const background = new paper.Path.Rectangle({
      rectangle: paper.view.bounds,
      fillColor: '#f9f9f9'
    });
    background.sendToBack();
    
    // Add instructions
    const text = new paper.PointText({
      point: [paper.view.center.x, 30],
      content: 'Click on the canvas to create shapes',
      fillColor: '#333',
      fontFamily: 'Arial',
      fontSize: 16,
      justification: 'center'
    });
    
    // Set up click handler to create shapes
    paper.view.onMouseDown = (event) => {
      if (event.point.y < 50) return; // Avoid creating shapes on the text
      
      createShape(paper, shapeType, {
        position: event.point,
        fillColor,
        strokeColor,
        strokeWidth
      });
    };
    
    // Handle resize
    paper.view.onResize = () => {
      background.bounds = paper.view.bounds;
      text.point = [paper.view.center.x, 30];
    };
  };
  
  const createShape = (paper, type, properties) => {
    let shape;
    const size = 50;
    
    switch (type) {
      case 'circle':
        shape = new paper.Path.Circle({
          center: properties.position,
          radius: size / 2,
          fillColor: properties.fillColor,
          strokeColor: properties.strokeColor,
          strokeWidth: properties.strokeWidth
        });
        break;
        
      case 'square':
        shape = new paper.Path.Rectangle({
          rectangle: new paper.Rectangle(
            properties.position.x - size / 2,
            properties.position.y - size / 2,
            size,
            size
          ),
          fillColor: properties.fillColor,
          strokeColor: properties.strokeColor,
          strokeWidth: properties.strokeWidth
        });
        break;
        
      case 'triangle':
        shape = new paper.Path.RegularPolygon({
          center: properties.position,
          sides: 3,
          radius: size / 2,
          fillColor: properties.fillColor,
          strokeColor: properties.strokeColor,
          strokeWidth: properties.strokeWidth
        });
        break;
        
      case 'star':
        shape = new paper.Path.Star({
          center: properties.position,
          points: 5,
          radius1: size / 2,
          radius2: size / 4,
          fillColor: properties.fillColor,
          strokeColor: properties.strokeColor,
          strokeWidth: properties.strokeWidth
        });
        break;
    }
    
    // Add to controller
    const model = controller.createShape(type, {
      position: { x: properties.position.x, y: properties.position.y },
      fillColor: properties.fillColor,
      strokeColor: properties.strokeColor,
      strokeWidth: properties.strokeWidth,
      paperItem: shape
    });
    
    // Make shapes draggable
    shape.onMouseDrag = (event) => {
      shape.position = shape.position.add(event.delta);
      
      // Update model
      controller.updateShape(model.id, {
        position: { x: shape.position.x, y: shape.position.y }
      });
    };
    
    return shape;
  };
  
  const clearCanvas = () => {
    if (paperScope) {
      // Keep background and text
      const itemsToKeep = 2;
      while (paperScope.project.activeLayer.children.length > itemsToKeep) {
        paperScope.project.activeLayer.lastChild.remove();
      }
      
      // Clear shapes in controller
      controller.shapes.forEach(shape => {
        controller.removeShape(shape.id);
      });
    }
  };
  
  return (
    <div className="shapes-demo">
      <h2>Basic Shapes</h2>
      <p>Create different vector shapes using Paper.js</p>
      
      <div className="controls">
        <div>
          <h3>Shape Type</h3>
          <div className="shape-buttons">
            {['circle', 'square', 'triangle', 'star'].map((type) => (
              <PaperButton
                key={type}
                text={type.charAt(0).toUpperCase() + type.slice(1)}
                position={{ x: 10, y: 5 }}
                size={{ width: 100, height: 36 }}
                colors={{
                  background: shapeType === type ? '#2ecc71' : '#3498db',
                  backgroundHover: shapeType === type ? '#27ae60' : '#2980b9',
                  text: 'white'
                }}
                onClick={() => setShapeType(type)}
              />
            ))}
          </div>
        </div>
        
        <div>
          <h3>Fill Color</h3>
          <div className="color-picker">
            {['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6'].map((color) => (
              <div
                key={color}
                className="color-swatch"
                style={{
                  backgroundColor: color,
                  border: fillColor === color ? '3px solid #333' : '1px solid #ccc'
                }}
                onClick={() => setFillColor(color)}
              />
            ))}
          </div>
        </div>
        
        <div>
          <h3>Stroke Width</h3>
          <PaperSlider
            min={0}
            max={10}
            initialValue={strokeWidth}
            width={200}
            onChange={setStrokeWidth}
          />
        </div>
      </div>
      
      <div className="paper-container">
        <PaperCanvas
          width={800}
          height={500}
          onInitialize={initializePaper}
        />
      </div>
      
      <div className="bottom-controls">
        <PaperButton
          text="Clear Canvas"
          position={{ x: 10, y: 5 }}
          size={{ width: 120, height: 36 }}
          colors={{
            background: '#e74c3c',
            backgroundHover: '#c0392b',
            text: 'white'
          }}
          onClick={clearCanvas}
        />
      </div>
    </div>
  );
};

export default ShapesDemo;