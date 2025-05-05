import React, { useState } from 'react';
import PaperCanvas from '../components/PaperCanvas';
import PaperButton from '../components/PaperButton';

const InteractiveDemo = ({ controller }) => {
  const [toolMode, setToolMode] = useState('draw');
  const [paperScope, setPaperScope] = useState(null);
  const [currentPath, setCurrentPath] = useState(null);
  
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
      content: 'Draw, select and manipulate items',
      fillColor: '#333',
      fontFamily: 'Arial',
      fontSize: 16,
      justification: 'center'
    });
    
    // Add drawing grid
    createGrid(paper);
    
    // Setup tools
    setupDrawingTools(paper);
    
    // Handle resize
    paper.view.onResize = () => {
      background.bounds = paper.view.bounds;
      text.point = [paper.view.center.x, 30];
      
      // Recreate grid
      paper.project.activeLayer.children.forEach(child => {
        if (child.data && child.data.isGrid) {
          child.remove();
        }
      });
      createGrid(paper);
    };
  };
  
  const createGrid = (paper) => {
    const gridSize = 20;
    const gridGroup = new paper.Group();
    gridGroup.data = { isGrid: true };
    
    // Draw vertical lines
    for (let x = 0; x < paper.view.size.width; x += gridSize) {
      const line = new paper.Path.Line({
        from: [x, 0],
        to: [x, paper.view.size.height],
        strokeColor: '#ddd',
        strokeWidth: 1
      });
      gridGroup.addChild(line);
    }
    
    // Draw horizontal lines
    for (let y = 0; y < paper.view.size.height; y += gridSize) {
      const line = new paper.Path.Line({
        from: [0, y],
        to: [paper.view.size.width, y],
        strokeColor: '#ddd',
        strokeWidth: 1
      });
      gridGroup.addChild(line);
    }
    
    gridGroup.sendToBack();
  };
  
  const setupDrawingTools = (paper) => {
    const hitOptions = {
      segments: true,
      stroke: true,
      fill: true,
      tolerance: 5
    };
    
    let selectedItem = null;
    let segment = null;
    
    // Drawing tool
    const drawTool = new paper.Tool();
    
    drawTool.onMouseDown = (event) => {
      if (toolMode === 'draw') {
        // Create a new path
        const newPath = new paper.Path({
          segments: [event.point],
          strokeColor: '#3498db',
          strokeWidth: 4,
          strokeCap: 'round',
          strokeJoin: 'round',
          fullySelected: true
        });
        setCurrentPath(newPath);
      } else if (toolMode === 'select') {
        // Deselect previous selection
        if (selectedItem) {
          selectedItem.fullySelected = false;
        }
        
        const hitResult = paper.project.hitTest(event.point, hitOptions);
        if (hitResult) {
          // Handle segment selection
          if (hitResult.type === 'segment') {
            segment = hitResult.segment;
            selectedItem = hitResult.item;
          // Handle path selection
          } else if (hitResult.type === 'stroke' || hitResult.type === 'fill') {
            selectedItem = hitResult.item;
          }
          
          if (selectedItem) {
            selectedItem.fullySelected = true;
          }
        } else {
          selectedItem = null;
          segment = null;
        }
      } else if (toolMode === 'erase') {
        const hitResult = paper.project.hitTest(event.point, hitOptions);
        if (hitResult && hitResult.item && !hitResult.item.data?.isGrid) {
          hitResult.item.remove();
        }
      }
    };
    
    drawTool.onMouseDrag = (event) => {
      if (toolMode === 'draw' && currentPath) {
        // Add a point to the path
        currentPath.add(event.point);
      } else if (toolMode === 'select') {
        // Move selected segment
        if (segment) {
          segment.point = segment.point.add(event.delta);
          // Smooth the path
          if (selectedItem && selectedItem.smooth) {
            selectedItem.smooth();
          }
        // Move selected item
        } else if (selectedItem) {
          selectedItem.position = selectedItem.position.add(event.delta);
        }
      } else if (toolMode === 'erase') {
        const hitResult = paper.project.hitTest(event.point, hitOptions);
        if (hitResult && hitResult.item && !hitResult.item.data?.isGrid) {
          hitResult.item.remove();
        }
      }
    };
    
    drawTool.onMouseUp = (event) => {
      if (toolMode === 'draw' && currentPath) {
        // Simplify the path
        currentPath.simplify();
        
        // Add to controller
        controller.createShape('path', {
          position: { x: currentPath.position.x, y: currentPath.position.y },
          strokeColor: currentPath.strokeColor.toCSS(true),
          strokeWidth: currentPath.strokeWidth,
          paperItem: currentPath
        });
        
        setCurrentPath(null);
      }
    };
  };
  
  const clearCanvas = () => {
    if (paperScope) {
      // Keep background, text and grid
      const itemsToKeep = paperScope.project.activeLayer.children.filter(child => 
        child.data?.isGrid || child.className === 'PointText' || child.bounds.height === paperScope.view.size.height
      );
      
      while (paperScope.project.activeLayer.children.length > itemsToKeep.length) {
        const item = paperScope.project.activeLayer.children.find(child => 
          !child.data?.isGrid && child.className !== 'PointText' && child.bounds.height !== paperScope.view.size.height
        );
        if (item) item.remove();
      }
      
      // Clear shapes in controller
      controller.shapes.forEach(shape => {
        controller.removeShape(shape.id);
      });
    }
  };
  
  return (
    <div className="interactive-demo">
      <h2>Interactive Drawing</h2>
      <p>Experiment with vector drawing and manipulation tools</p>
      
      <div className="controls">
        <div>
          <h3>Tool Mode</h3>
          <div className="tool-buttons">
            {['draw', 'select', 'erase'].map((mode) => (
              <PaperButton
                key={mode}
                text={mode.charAt(0).toUpperCase() + mode.slice(1)}
                position={{ x: 10, y: 5 }}
                size={{ width: 100, height: 36 }}
                colors={{
                  background: toolMode === mode ? '#2ecc71' : '#3498db',
                  backgroundHover: toolMode === mode ? '#27ae60' : '#2980b9',
                  text: 'white'
                }}
                onClick={() => setToolMode(mode)}
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
      
      <div className="instructions">
        <h3>How to use:</h3>
        <ul>
          <li><strong>Draw:</strong> Click and drag to create paths</li>
          <li><strong>Select:</strong> Click on a path to select it, drag to move</li>
          <li><strong>Erase:</strong> Click on a path to delete it</li>
        </ul>
      </div>
    </div>
  );
};

export default InteractiveDemo;