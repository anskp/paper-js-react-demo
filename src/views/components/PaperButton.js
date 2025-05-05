import React, { useEffect, useRef } from 'react';
import Paper from 'paper';

const PaperButton = ({ 
  text, 
  position = { x: 0, y: 0 }, 
  size = { width: 120, height: 40 },
  colors = {
    background: '#3498db',
    backgroundHover: '#2980b9',
    text: 'white'
  },
  onClick 
}) => {
  const buttonRef = useRef(null);
  const paperScopeRef = useRef(null);
  const elementsRef = useRef({});
  
  useEffect(() => {
    if (!buttonRef.current) return;
    
    // Setup Paper.js
    paperScopeRef.current = new Paper.PaperScope();
    const paperScope = paperScopeRef.current;
    paperScope.setup(buttonRef.current);
    
    // Create button background
    const background = new paperScope.Path.Rectangle({
      rectangle: new paperScope.Rectangle(
        position.x, 
        position.y, 
        size.width, 
        size.height
      ),
      radius: 5,
      fillColor: colors.background,
      shadowColor: new paperScope.Color(0, 0, 0, 0.2),
      shadowBlur: 5,
      shadowOffset: new paperScope.Point(0, 2)
    });
    
    // Create button text
    const buttonText = new paperScope.PointText({
      point: [
        position.x + size.width / 2,
        position.y + size.height / 2 + 5
      ],
      content: text,
      fillColor: colors.text,
      fontFamily: 'Arial',
      fontSize: 14,
      justification: 'center'
    });
    
    elementsRef.current = { background, buttonText };
    
    // Handle interactions
    background.onMouseEnter = function() {
      this.fillColor = colors.backgroundHover;
      document.body.style.cursor = 'pointer';
    };
    
    background.onMouseLeave = function() {
      this.fillColor = colors.background;
      document.body.style.cursor = 'default';
    };
    
    background.onClick = function(event) {
      if (onClick) onClick(event);
    };
    
    return () => {
      if (paperScope && paperScope.view) {
        paperScope.view.onFrame = null;
        paperScope.project.clear();
      }
    };
  }, [text, position.x, position.y, size.width, size.height, colors, onClick]);
  
  return (
    <canvas 
      ref={buttonRef} 
      width={size.width + position.x * 2} 
      height={size.height + position.y * 2} 
      style={{ display: 'inline-block' }}
    />
  );
};

export default PaperButton;