import React, { useEffect, useRef } from 'react';
import Paper from 'paper';

const PaperCanvas = ({ width, height, onInitialize, onResize }) => {
  const canvasRef = useRef(null);
  const paperScopeRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Create a new PaperScope to avoid conflicts between multiple canvases
    paperScopeRef.current = new Paper.PaperScope();
    const paperScope = paperScopeRef.current;
    
    // Setup Paper.js with this scope
    paperScope.setup(canvasRef.current);
    
    // Call the initialization function if provided
    if (onInitialize) {
      onInitialize(paperScope);
    }

    // Handle resize if needed
    if (onResize) {
      paperScope.view.onResize = () => {
        onResize(paperScope);
      };
    }

    return () => {
      if (paperScope && paperScope.view) {
        paperScope.view.onFrame = null;
        paperScope.view.onResize = null;
        paperScope.project.clear();
      }
    };
  }, [onInitialize, onResize]);

  return (
    <canvas 
      ref={canvasRef} 
      className="paper-canvas" 
      width={width || 500} 
      height={height || 300} 
    />
  );
};

export default PaperCanvas;