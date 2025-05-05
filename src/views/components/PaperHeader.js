import React, { useEffect, useRef } from 'react';
import Paper from 'paper';

const PaperHeader = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Setup Paper.js
    const canvas = canvasRef.current;
    Paper.setup(canvas);

    // Create a header with animated background
    const background = new Paper.Path.Rectangle({
      rectangle: new Paper.Rectangle(0, 0, Paper.view.size.width, 80),
      fillColor: {
        gradient: {
          stops: ['#2c3e50', '#3498db']
        },
        origin: [0, 0],
        destination: [Paper.view.size.width, 80]
      }
    });

    // Create title text
    const text = new Paper.PointText({
      point: [30, 50],
      content: 'Paper.js React Demo',
      fillColor: 'white',
      fontFamily: 'Arial',
      fontWeight: 'bold',
      fontSize: 24
    });

    // Create animated circles
    const circles = [];
    for (let i = 0; i < 15; i++) {
      const circle = new Paper.Path.Circle({
        center: [
          Math.random() * Paper.view.size.width,
          Math.random() * 80
        ],
        radius: Math.random() * 5 + 2,
        fillColor: 'rgba(255, 255, 255, 0.3)'
      });
      circles.push({
        path: circle,
        speed: Math.random() * 0.5 + 0.1
      });
    }

    // Animation
    Paper.view.onFrame = (event) => {
      circles.forEach(circle => {
        circle.path.position.x += circle.speed;
        if (circle.path.position.x > Paper.view.size.width + circle.path.bounds.width) {
          circle.path.position.x = -circle.path.bounds.width;
          circle.path.position.y = Math.random() * 80;
        }
      });
    };

    // Handle resize
    Paper.view.onResize = () => {
      background.bounds.width = Paper.view.size.width;
      background.fillColor = {
        gradient: {
          stops: ['#2c3e50', '#3498db']
        },
        origin: [0, 0],
        destination: [Paper.view.size.width, 80]
      };
    };

    return () => {
      Paper.view.onFrame = null;
      Paper.view.onResize = null;
      Paper.project.clear();
    };
  }, []);

  return (
    <header className="app-header">
      <canvas ref={canvasRef} className="paper-canvas" width="100%" height="80px" />
    </header>
  );
};

export default PaperHeader;