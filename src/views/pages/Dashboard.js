import React from 'react';
import PaperCanvas from '../components/PaperCanvas';
import PaperButton from '../components/PaperButton';

const Dashboard = ({ controller }) => {
  const initializePaper = (paper) => {
    // Create a welcome message
    const text = new paper.PointText({
      point: [paper.view.center.x, 50],
      content: 'Welcome to Paper.js React Demo',
      fillColor: '#333',
      fontFamily: 'Arial',
      fontWeight: 'bold',
      fontSize: 24,
      justification: 'center'
    });

    // Create a dynamic background
    const background = new paper.Path.Rectangle({
      rectangle: paper.view.bounds,
      fillColor: {
        gradient: {
          stops: [
            [new paper.Color('#f9f9f9'), 0],
            [new paper.Color('#e0e0e0'), 1]
          ]
        },
        origin: paper.view.bounds.topLeft,
        destination: paper.view.bounds.bottomRight
      }
    });
    background.sendToBack();

    // Create some floating particles
    const particles = [];
    for (let i = 0; i < 30; i++) {
      const size = Math.random() * 10 + 5;
      const particle = new paper.Path.Circle({
        center: [
          Math.random() * paper.view.size.width,
          Math.random() * paper.view.size.height
        ],
        radius: size / 2,
        fillColor: new paper.Color({
          hue: Math.random() * 360,
          saturation: 0.5,
          brightness: 0.8,
          alpha: 0.6
        })
      });
      
      particles.push({
        path: particle,
        velocity: new paper.Point(
          Math.random() * 2 - 1,
          Math.random() * 2 - 1
        ),
        size: size
      });
    }

    // Create example icons
    const iconSize = 40;
    const iconSpacing = 100;
    const startX = paper.view.center.x - (2 * iconSpacing);
    const icons = [];

    // Shapes icon
    const shapesIcon = new paper.Group();
    shapesIcon.addChild(new paper.Path.Rectangle({
      rectangle: new paper.Rectangle(0, 0, iconSize * 0.6, iconSize * 0.6),
      fillColor: '#3498db',
      position: [startX, paper.view.center.y]
    }));
    shapesIcon.addChild(new paper.Path.Circle({
      center: [startX + iconSize * 0.4, paper.view.center.y - iconSize * 0.3],
      radius: iconSize * 0.3,
      fillColor: '#e74c3c'
    }));

    // Animation icon
    const animationIcon = new paper.Group();
    for (let i = 0; i < 3; i++) {
      animationIcon.addChild(new paper.Path.Circle({
        center: [startX + iconSpacing + i * 10, paper.view.center.y - i * 10],
        radius: iconSize * 0.3,
        fillColor: new paper.Color({
          hue: 120 + i * 30,
          saturation: 0.7,
          brightness: 0.8
        }),
        opacity: 1 - i * 0.2
      }));
    }

    // Interactive icon
    const interactiveIcon = new paper.Group();
    interactiveIcon.addChild(new paper.Path.Circle({
      center: [startX + iconSpacing * 2, paper.view.center.y],
      radius: iconSize * 0.3,
      fillColor: '#9b59b6'
    }));
    const hand = new paper.Path();
    hand.add(new paper.Point(startX + iconSpacing * 2 - 5, paper.view.center.y + 20));
    hand.add(new paper.Point(startX + iconSpacing * 2, paper.view.center.y + 5));
    hand.add(new paper.Point(startX + iconSpacing * 2 + 5, paper.view.center.y + 20));
    hand.closed = true;
    hand.fillColor = '#9b59b6';
    interactiveIcon.addChild(hand);

    // UI Components icon
    const uiIcon = new paper.Group();
    const uiRect = new paper.Path.Rectangle({
      rectangle: new paper.Rectangle(0, 0, iconSize * 0.8, iconSize * 0.5),
      radius: 5,
      fillColor: '#f39c12',
      position: [startX + iconSpacing * 3, paper.view.center.y]
    });
    uiIcon.addChild(uiRect);
    uiIcon.addChild(new paper.Path.Circle({
      center: [startX + iconSpacing * 3 - iconSize * 0.25, paper.view.center.y],
      radius: iconSize * 0.1,
      fillColor: 'white'
    }));
    uiIcon.addChild(new paper.Path.Rectangle({
      rectangle: new paper.Rectangle(0, 0, iconSize * 0.3, iconSize * 0.1),
      radius: 2,
      fillColor: 'white',
      position: [startX + iconSpacing * 3 + iconSize * 0.15, paper.view.center.y]
    }));

    icons.push(shapesIcon, animationIcon, interactiveIcon, uiIcon);

    // Add labels
    const labels = [
      { text: 'Shapes', position: [startX, paper.view.center.y + iconSize * 0.8] },
      { text: 'Animations', position: [startX + iconSpacing, paper.view.center.y + iconSize * 0.8] },
      { text: 'Interactive', position: [startX + iconSpacing * 2, paper.view.center.y + iconSize * 0.8] },
      { text: 'UI Components', position: [startX + iconSpacing * 3, paper.view.center.y + iconSize * 0.8] }
    ];

    labels.forEach(label => {
      new paper.PointText({
        point: label.position,
        content: label.text,
        fillColor: '#333',
        fontFamily: 'Arial',
        fontSize: 14,
        justification: 'center'
      });
    });

    // Add animation
    paper.view.onFrame = (event) => {
      // Animate particles
      particles.forEach(particle => {
        // Move based on velocity
        particle.path.position = particle.path.position.add(particle.velocity);
        
        // Bounce off the edges
        if (particle.path.position.x < particle.size || particle.path.position.x > paper.view.size.width - particle.size) {
          particle.velocity.x *= -1;
        }
        
        if (particle.path.position.y < particle.size || particle.path.position.y > paper.view.size.height - particle.size) {
          particle.velocity.y *= -1;
        }
      });

      // Subtle icon animations
      icons.forEach((icon, i) => {
        icon.rotation = Math.sin(event.time * 2 + i) * 2;
      });
    };

    // Handle resize
    paper.view.onResize = () => {
      background.bounds = paper.view.bounds;
      background.fillColor = {
        gradient: {
          stops: [
            [new paper.Color('#f9f9f9'), 0],
            [new paper.Color('#e0e0e0'), 1]
          ]
        },
        origin: paper.view.bounds.topLeft,
        destination: paper.view.bounds.bottomRight
      };
      text.point = [paper.view.center.x, 50];
    };
  };

  return (
    <div className="dashboard-container">
      <h1>Paper.js React Demo</h1>
      <p>A showcase of Paper.js capabilities combined with React and MVC architecture</p>
      
      <div className="demo-section">
        <PaperCanvas 
          width={800} 
          height={400} 
          onInitialize={initializePaper} 
        />
      </div>
      
      <div className="controls">
        <PaperButton 
          text="Explore Demos" 
          position={{ x: 10, y: 5 }} 
          size={{ width: 150, height: 40 }}
          onClick={() => window.scrollTo(0, 400)}
        />
      </div>
    </div>
  );
};

export default Dashboard;