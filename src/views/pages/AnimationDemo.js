import React, { useState } from 'react';
import PaperCanvas from '../components/PaperCanvas';
import PaperButton from '../components/PaperButton';
import PaperSlider from '../components/PaperSlider';
import PaperToggle from '../components/PaperToggle';

const AnimationDemo = ({ controller }) => {
  const [animationType, setAnimationType] = useState('orbit');
  const [speed, setSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [paperScope, setPaperScope] = useState(null);
  const [animations, setAnimations] = useState([]);

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
      content: 'Paper.js Animation Demo',
      fillColor: '#333',
      fontFamily: 'Arial',
      fontSize: 18,
      fontWeight: 'bold',
      justification: 'center'
    });
    
    // Create animations
    createAnimations(paper);
    
    // Handle resize
    paper.view.onResize = () => {
      background.bounds = paper.view.bounds;
      text.point = [paper.view.center.x, 30];
      
      // Re-center animations
      resetAnimations(paper);
    };
  };
  
  const createAnimations = (paper) => {
    const newAnimations = [];
    
    // Orbit animation
    const orbitCenter = new paper.Point(paper.view.center.x - 150, paper.view.center.y);
    const orbitGroup = new paper.Group();
    
    const orbitCircle = new paper.Path.Circle({
      center: orbitCenter,
      radius: 100,
      strokeColor: '#aaa',
      strokeWidth: 1,
      dashArray: [4, 4]
    });
    
    const planets = [];
    const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12'];
    
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const planet = new paper.Path.Circle({
        center: [
          orbitCenter.x + Math.cos(angle) * 100,
          orbitCenter.y + Math.sin(angle) * 100
        ],
        radius: 10 - i * 2,
        fillColor: colors[i]
      });
      planets.push({
        path: planet,
        angle: angle,
        speed: (4 - i) * 0.5,
        orbitRadius: 100
      });
    }
    
    const sun = new paper.Path.Circle({
      center: orbitCenter,
      radius: 20,
      fillColor: {
        gradient: {
          stops: ['#f39c12', '#e74c3c']
        },
        origin: orbitCenter.subtract([15, 15]),
        destination: orbitCenter.add([15, 15])
      }
    });
    
    orbitGroup.addChild(orbitCircle);
    planets.forEach(planet => orbitGroup.addChild(planet.path));
    orbitGroup.addChild(sun);
    
    const orbitAnimation = {
      type: 'orbit',
      group: orbitGroup,
      planets: planets,
      center: orbitCenter,
      update: (delta) => {
        planets.forEach(planet => {
          planet.angle += planet.speed * speed * delta * 0.05;
          planet.path.position = new paper.Point(
            orbitCenter.x + Math.cos(planet.angle) * planet.orbitRadius,
            orbitCenter.y + Math.sin(planet.angle) * planet.orbitRadius
          );
        });
      }
    };
    
    newAnimations.push(orbitAnimation);
    
    // Wave animation
    const waveCenter = new paper.Point(paper.view.center.x + 150, paper.view.center.y);
    const waveGroup = new paper.Group();
    
    const wavePoints = [];
    const waveSegments = 10;
    const waveWidth = 200;
    
    for (let i = 0; i <= waveSegments; i++) {
      wavePoints.push(new paper.Point(
        waveCenter.x - waveWidth / 2 + i * (waveWidth / waveSegments),
        waveCenter.y
      ));
    }
    
    const wavePath = new paper.Path({
      segments: wavePoints,
      strokeColor: '#3498db',
      strokeWidth: 4,
      strokeCap: 'round'
    });
    
    waveGroup.addChild(wavePath);
    
    // Add dots
    const dots = [];
    for (let i = 0; i <= waveSegments; i++) {
      const dot = new paper.Path.Circle({
        center: wavePoints[i],
        radius: 4,
        fillColor: '#3498db'
      });
      dots.push(dot);
      waveGroup.addChild(dot);
    }
    
    const waveAnimation = {
      type: 'wave',
      group: waveGroup,
      wave: wavePath,
      dots: dots,
      time: 0,
      update: (delta) => {
        waveAnimation.time += delta * speed * 0.05;
        
        for (let i = 0; i <= waveSegments; i++) {
          const x = waveCenter.x - waveWidth / 2 + i * (waveWidth / waveSegments);
          const phase = waveAnimation.time + i * 0.3;
          const y = waveCenter.y + Math.sin(phase) * 30;
          
          // Update path point
          wavePath.segments[i].point.y = y;
          
          // Update dot
          dots[i].position.y = y;
        }
        
        // Smooth the path
        wavePath.smooth();
      }
    };
    
    newAnimations.push(waveAnimation);
    
    // Particle animation
    const particleCenter = new paper.Point(paper.view.center.x, paper.view.center.y + 150);
    const particleGroup = new paper.Group();
    
    const particles = [];
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * 8 + 4;
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 10;
      
      const particle = new paper.Path.Circle({
        center: [
          particleCenter.x + Math.cos(angle) * distance,
          particleCenter.y + Math.sin(angle) * distance
        ],
        radius: size / 2,
        fillColor: new paper.Color({
          hue: Math.random() * 360,
          saturation: 0.7,
          brightness: 0.9,
          alpha: 0.8
        })
      });
      
      particles.push({
        path: particle,
        velocity: new paper.Point(
          Math.cos(angle) * (Math.random() * 2 + 1),
          Math.sin(angle) * (Math.random() * 2 + 1)
        ),
        life: 1,
        initialSize: size
      });
      
      particleGroup.addChild(particle);
    }
    
    const emitter = new paper.Path.Circle({
      center: particleCenter,
      radius: 15,
      fillColor: {
        gradient: {
          stops: [
            [new paper.Color('#9b59b6'), 0],
            [new paper.Color('#8e44ad'), 1]
          ]
        },
        origin: particleCenter.subtract([10, 10]),
        destination: particleCenter.add([10, 10])
      }
    });
    
    particleGroup.addChild(emitter);
    
    const particleAnimation = {
      type: 'particles',
      group: particleGroup,
      particles: particles,
      center: particleCenter,
      emitter: emitter,
      update: (delta) => {
        particles.forEach((particle, index) => {
          // Reduce life
          particle.life -= 0.02 * speed * delta;
          
          // Move particle
          particle.path.position = particle.path.position.add(
            particle.velocity.multiply(speed * delta * 0.5)
          );
          
          // Scale down as life reduces
          particle.path.scale(0.98);
          
          // Reduce opacity
          particle.path.opacity = particle.life;
          
          // Reset particle if life is depleted
          if (particle.life <= 0) {
            // Reset position
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 10;
            
            particle.path.position = new paper.Point(
              particleCenter.x + Math.cos(angle) * distance,
              particleCenter.y + Math.sin(angle) * distance
            );
            
            // Reset velocity
            particle.velocity = new paper.Point(
              Math.cos(angle) * (Math.random() * 2 + 1),
              Math.sin(angle) * (Math.random() * 2 + 1)
            );
            
            // Reset life and size
            particle.life = 1;
            particle.path.scale(particle.initialSize / particle.path.bounds.width);
            particle.path.opacity = 1;
          }
        });
      }
    };
    
    newAnimations.push(particleAnimation);
    
    // Start animation loop
    paper.view.onFrame = (event) => {
      if (isPlaying) {
        newAnimations.forEach(animation => {
          if (animation.type === animationType || animationType === 'all') {
            animation.update(event.delta);
          }
        });
      }
    };
    
    setAnimations(newAnimations);
  };
  
  const resetAnimations = (paper) => {
    animations.forEach(animation => {
      if (animation.type === 'orbit') {
        const center = new paper.Point(paper.view.center.x - 150, paper.view.center.y);
        const offset = center.subtract(animation.center);
        animation.group.position = animation.group.position.add(offset);
        animation.center = center;
      } else if (animation.type === 'wave') {
        const center = new paper.Point(paper.view.center.x + 150, paper.view.center.y);
        const offset = center.subtract(animation.wave.bounds.center);
        animation.group.position = animation.group.position.add(offset);
      } else if (animation.type === 'particles') {
        const center = new paper.Point(paper.view.center.x, paper.view.center.y + 150);
        const offset = center.subtract(animation.center);
        animation.group.position = animation.group.position.add(offset);
        animation.center = center;
      }
    });
  };
  
  return (
    <div className="animation-demo">
      <h2>Animations</h2>
      <p>Explore dynamic animations created with Paper.js</p>
      
      <div className="controls">
        <div>
          <h3>Animation Type</h3>
          <div className="animation-buttons">
            {['all', 'orbit', 'wave', 'particles'].map((type) => (
              <PaperButton
                key={type}
                text={type.charAt(0).toUpperCase() + type.slice(1)}
                position={{ x: 10, y: 5 }}
                size={{ width: 100, height: 36 }}
                colors={{
                  background: animationType === type ? '#2ecc71' : '#3498db',
                  backgroundHover: animationType === type ? '#27ae60' : '#2980b9',
                  text: 'white'
                }}
                onClick={() => setAnimationType(type)}
              />
            ))}
          </div>
        </div>
        
        <div>
          <h3>Speed</h3>
          <PaperSlider
            min={0.1}
            max={3}
            initialValue={speed}
            width={200}
            onChange={setSpeed}
          />
        </div>
        
        <div>
          <h3>Play/Pause</h3>
          <PaperToggle
            initialValue={isPlaying}
            onChange={setIsPlaying}
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
    </div>
  );
};

export default AnimationDemo;