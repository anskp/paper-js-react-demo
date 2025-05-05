import React, { useState } from 'react';
import PaperCanvas from '../components/PaperCanvas';
import PaperButton from '../components/PaperButton';
import PaperSlider from '../components/PaperSlider';
import PaperToggle from '../components/PaperToggle';

const UIComponentsDemo = ({ controller }) => {
  const [circleSize, setCircleSize] = useState(50);
  const [showCircle, setShowCircle] = useState(true);
  const [circleColor, setCircleColor] = useState('#3498db');
  const [paperScope, setPaperScope] = useState(null);
  const [circle, setCircle] = useState(null);
  
  const initializePaper = (paper) => {
    setPaperScope(paper);
    
    // Create a background
    const background = new paper.Path.Rectangle({
      rectangle: paper.view.bounds,
      fillColor: '#f9f9f9'
    });
    background.sendToBack();
    
    // Add title
    const title = new paper.PointText({
      point: [paper.view.center.x, 30],
      content: 'Paper.js UI Components',
      fillColor: '#333',
      fontFamily: 'Arial',
      fontSize: 18,
      fontWeight: 'bold',
      justification: 'center'
    });
    
    // Add subtitle
    const subtitle = new paper.PointText({
      point: [paper.view.center.x, 55],
      content: 'Control the visualization with custom UI elements',
      fillColor: '#777',
      fontFamily: 'Arial',
      fontSize: 14,
      justification: 'center'
    });
    
    // Create a circle that will be controlled by UI components
    const newCircle = new paper.Path.Circle({
      center: paper.view.center,
      radius: circleSize,
      fillColor: circleColor,
      visible: showCircle
    });
    
    // Add shadow
    newCircle.shadowColor = new paper.Color(0, 0, 0, 0.2);
    newCircle.shadowBlur = 12;
    newCircle.shadowOffset = new paper.Point(5, 5);
    
    setCircle(newCircle);
    
    // Create UI component models in the controller
    controller.createUIComponent('slider', {
      type: 'slider',
      position: { x: 100, y: 100 },
      size: { width: 200, height: 30 },
      value: circleSize,
      min: 10,
      max: 100,
      onChange: setCircleSize
    });
    
    controller.createUIComponent('toggle', {
      type: 'toggle',
      position: { x: 400, y: 100 },
      size: { width: 60, height: 30 },
      value: showCircle,
      onChange: setShowCircle
    });
    
    // Handle resize
    paper.view.onResize = () => {
      background.bounds = paper.view.bounds;
      title.point = [paper.view.center.x, 30];
      subtitle.point = [paper.view.center.x, 55];
      if (newCircle) {
        newCircle.position = paper.view.center;
      }
    };
    
    // Add animation
    let hue = 0;
    paper.view.onFrame = (event) => {
      if (newCircle && showCircle) {
        // Gentle pulsing animation
        const scale = 1 + Math.sin(event.time * 2) * 0.05;
        newCircle.scale(scale / newCircle.scaling.x);
        
        // Adjust position with sine wave motion
        newCircle.position.y = paper.view.center.y + Math.sin(event.time * 1.5) * 20;
        
        // Change color if rainbow mode is active
        if (rainbowMode) {
          hue = (hue + 0.5) % 360;
          newCircle.fillColor = new paper.Color({
            hue: hue,
            saturation: 0.7,
            brightness: 0.9
          });
        }
      }
    };
  };
  
  // State for rainbow mode
  const [rainbowMode, setRainbowMode] = useState(false);
  
  useEffect(() => {
    if (circle) {
      circle.visible = showCircle;
    }
  }, [showCircle, circle]);
  
  useEffect(() => {
    if (circle) {
      circle.bounds.width = circleSize * 2;
      circle.bounds.height = circleSize * 2;
      circle.position = paperScope?.view.center;
    }
  }, [circleSize, circle, paperScope]);
  
  useEffect(() => {
    if (circle && !rainbowMode) {
      circle.fillColor = circleColor;
    }
  }, [circleColor, circle, rainbowMode]);
  
  const handleColorChange = (color) => {
    setRainbowMode(false);
    setCircleColor(color);
  };
  
  return (
    <div className="ui-components-demo">
      <h2>UI Components</h2>
      <p>Building interactive UI controls with Paper.js</p>
      
      <div className="controls">
        <div>
          <h3>Circle Size</h3>
          <PaperSlider
            min={10}
            max={100}
            initialValue={circleSize}
            width={200}
            onChange={setCircleSize}
          />
        </div>
        
        <div>
          <h3>Show Circle</h3>
          <PaperToggle
            initialValue={showCircle}
            onChange={setShowCircle}
          />
        </div>
        
        <div>
          <h3>Rainbow Mode</h3>
          <PaperToggle
            initialValue={rainbowMode}
            onChange={setRainbowMode}
            colors={{
              on: '#9b59b6',
              off: '#e0e0e0',
              handle: 'white'
            }}
          />
        </div>
        
        <div>
          <h3>Circle Color</h3>
          <div className="color-picker">
            {['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6'].map((color) => (
              <div
                key={color}
                className="color-swatch"
                style={{
                  backgroundColor: color,
                  border: circleColor === color && !rainbowMode ? '3px solid #333' : '1px solid #ccc',
                  opacity: rainbowMode ? 0.5 : 1
                }}
                onClick={() => handleColorChange(color)}
              />
            ))}
          </div>
        </div>
      </div>
      
      <div className="paper-container">
        <PaperCanvas
          width={800}
          height={500}
          onInitialize={initializePaper}
        />
      </div>
      
      <div className="ui-explanation">
        <h3>Custom UI Components</h3>
        <p>
          Each UI control is created using Paper.js, providing a consistent visual style
          and the ability to create unique interactive elements. The implementation follows
          the MVC pattern, where:
        </p>
        <ul>
          <li><strong>Model:</strong> UIComponentModel defines properties and state</li>
          <li><strong>View:</strong> React components render using Paper.js</li>
          <li><strong>Controller:</strong> Manages components and handles user interactions</li>
        </ul>
      </div>
    </div>
  );
};

// Import useEffect
import { useEffect } from 'react';

export default UIComponentsDemo;