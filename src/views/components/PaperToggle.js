import React, { useEffect, useRef, useState } from 'react';
import Paper from 'paper';

const PaperToggle = ({ 
  initialValue = false, 
  width = 60, 
  height = 30,
  colors = {
    on: '#2ecc71',
    off: '#e0e0e0',
    handle: 'white'
  },
  onChange 
}) => {
  const toggleRef = useRef(null);
  const paperScopeRef = useRef(null);
  const elementsRef = useRef({});
  const [isOn, setIsOn] = useState(initialValue);
  
  useEffect(() => {
    if (!toggleRef.current) return;
    
    // Setup Paper.js
    paperScopeRef.current = new Paper.PaperScope();
    const paperScope = paperScopeRef.current;
    paperScope.setup(toggleRef.current);
    
    // Create track
    const track = new paperScope.Path.Rectangle({
      rectangle: new paperScope.Rectangle(
        0, 
        height / 2 - height / 3, 
        width, 
        height / 1.5
      ),
      radius: height / 3,
      fillColor: isOn ? colors.on : colors.off
    });
    
    // Calculate handle position based on state
    const handlePosition = isOn ? width - height / 2 : height / 2;
    
    // Create handle
    const handle = new paperScope.Path.Circle({
      center: [handlePosition, height / 2],
      radius: height / 2 - 2,
      fillColor: colors.handle,
      shadowColor: new paperScope.Color(0, 0, 0, 0.2),
      shadowBlur: 5,
      shadowOffset: new paperScope.Point(0, 2)
    });
    
    elementsRef.current = { track, handle };
    
    // Handle interactions
    track.onClick = handle.onClick = function() {
      const newState = !isOn;
      setIsOn(newState);
      
      // Animate the transition
      const targetX = newState ? width - height / 2 : height / 2;
      const startX = handle.position.x;
      let progress = 0;
      
      function animate() {
        progress += 0.1;
        if (progress >= 1) {
          handle.position.x = targetX;
          track.fillColor = newState ? colors.on : colors.off;
          return;
        }
        
        // Ease function for smooth animation
        const easedProgress = -Math.cos(progress * Math.PI) / 2 + 0.5;
        handle.position.x = startX + (targetX - startX) * easedProgress;
        track.fillColor = paperScope.Color.interpolate(
          new paperScope.Color(newState ? colors.off : colors.on),
          new paperScope.Color(newState ? colors.on : colors.off),
          easedProgress
        );
        
        requestAnimationFrame(animate);
      }
      
      animate();
      
      if (onChange) {
        onChange(newState);
      }
    };
    
    // Handle hover
    track.onMouseEnter = handle.onMouseEnter = function() {
      document.body.style.cursor = 'pointer';
    };
    
    track.onMouseLeave = handle.onMouseLeave = function() {
      document.body.style.cursor = 'default';
    };
    
    return () => {
      if (paperScope && paperScope.view) {
        paperScope.view.onFrame = null;
        paperScope.project.clear();
      }
    };
  }, [initialValue, width, height, colors, onChange]);
  
  // Update toggle state when it changes externally
  useEffect(() => {
    const paperScope = paperScopeRef.current;
    const elements = elementsRef.current;
    
    if (paperScope && elements.handle && elements.track) {
      elements.handle.position.x = isOn ? width - height / 2 : height / 2;
      elements.track.fillColor = isOn ? colors.on : colors.off;
    }
  }, [isOn, width, height, colors]);
  
  return (
    <canvas 
      ref={toggleRef} 
      width={width} 
      height={height} 
    />
  );
};

export default PaperToggle;