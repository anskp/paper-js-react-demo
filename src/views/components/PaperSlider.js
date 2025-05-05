import React, { useEffect, useRef, useState } from 'react';
import Paper from 'paper';

const PaperSlider = ({
  min = 0,
  max = 100,
  initialValue = 50,
  width = 200,
  height = 30,
  onChange
}) => {
  const sliderRef = useRef(null);
  const paperScopeRef = useRef(null);
  const elementsRef = useRef({});
  const [value, setValue] = useState(initialValue);
  
  useEffect(() => {
    if (!sliderRef.current) return;
    
    // Setup Paper.js
    paperScopeRef.current = new Paper.PaperScope();
    const paperScope = paperScopeRef.current;
    paperScope.setup(sliderRef.current);
    
    const padding = 10;
    const sliderWidth = width - padding * 2;
    const trackHeight = 6;
    
    // Create track
    const track = new paperScope.Path.Rectangle({
      rectangle: new paperScope.Rectangle(
        padding, 
        height / 2 - trackHeight / 2, 
        sliderWidth, 
        trackHeight
      ),
      radius: trackHeight / 2,
      fillColor: '#e0e0e0'
    });
    
    // Calculate handle position based on value
    const valuePercentage = (value - min) / (max - min);
    const handlePosition = padding + valuePercentage * sliderWidth;
    
    // Create filled track
    const filledTrack = new paperScope.Path.Rectangle({
      rectangle: new paperScope.Rectangle(
        padding, 
        height / 2 - trackHeight / 2, 
        handlePosition - padding, 
        trackHeight
      ),
      radius: trackHeight / 2,
      fillColor: '#3498db'
    });
    
    // Create handle
    const handle = new paperScope.Path.Circle({
      center: [handlePosition, height / 2],
      radius: 10,
      fillColor: 'white',
      strokeColor: '#3498db',
      strokeWidth: 2,
      shadowColor: new paperScope.Color(0, 0, 0, 0.2),
      shadowBlur: 5,
      shadowOffset: new paperScope.Point(0, 2)
    });
    
    elementsRef.current = { track, filledTrack, handle };
    
    // Handle interactions
    let isDragging = false;
    
    handle.onMouseEnter = function() {
      document.body.style.cursor = 'pointer';
    };
    
    handle.onMouseLeave = function() {
      if (!isDragging) {
        document.body.style.cursor = 'default';
      }
    };
    
    handle.onMouseDown = function(event) {
      isDragging = true;
      document.body.style.cursor = 'grabbing';
    };
    
    paperScope.view.onMouseUp = function(event) {
      if (isDragging) {
        isDragging = false;
        document.body.style.cursor = 'default';
      }
    };
    
    paperScope.view.onMouseMove = function(event) {
      if (isDragging) {
        let newX = Math.max(padding, Math.min(padding + sliderWidth, event.point.x));
        handle.position.x = newX;
        
        // Update filled track
        filledTrack.bounds.width = newX - padding;
        
        // Calculate and set new value
        const percentage = (newX - padding) / sliderWidth;
        const newValue = Math.round(min + percentage * (max - min));
        setValue(newValue);
        
        if (onChange) {
          onChange(newValue);
        }
      }
    };
    
    // Also allow clicking on the track to set value
    track.onClick = function(event) {
      let newX = Math.max(padding, Math.min(padding + sliderWidth, event.point.x));
      handle.position.x = newX;
      
      // Update filled track
      filledTrack.bounds.width = newX - padding;
      
      // Calculate and set new value
      const percentage = (newX - padding) / sliderWidth;
      const newValue = Math.round(min + percentage * (max - min));
      setValue(newValue);
      
      if (onChange) {
        onChange(newValue);
      }
    };
    
    return () => {
      if (paperScope && paperScope.view) {
        paperScope.view.onMouseUp = null;
        paperScope.view.onMouseMove = null;
        paperScope.project.clear();
      }
    };
  }, [min, max, initialValue, width, height, onChange]);
  
  // Update handle position when value changes externally
  useEffect(() => {
    const paperScope = paperScopeRef.current;
    const elements = elementsRef.current;
    
    if (paperScope && elements.handle) {
      const padding = 10;
      const sliderWidth = width - padding * 2;
      const valuePercentage = (value - min) / (max - min);
      const handlePosition = padding + valuePercentage * sliderWidth;
      
      elements.handle.position.x = handlePosition;
      elements.filledTrack.bounds.width = handlePosition - padding;
    }
  }, [value, min, max, width]);
  
  return (
    <div>
      <canvas 
        ref={sliderRef} 
        width={width} 
        height={height} 
      />
      <div style={{ textAlign: 'center', fontSize: '12px' }}>{value}</div>
    </div>
  );
};

export default PaperSlider;