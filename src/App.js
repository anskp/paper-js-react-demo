import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PaperHeader from './views/components/PaperHeader';
import Dashboard from './views/pages/Dashboard';
import ShapesDemo from './views/pages/ShapesDemo';
import AnimationDemo from './views/pages/AnimationDemo';
import InteractiveDemo from './views/pages/InteractiveDemo';
import UIComponentsDemo from './views/pages/UIComponentsDemo';
import { AppController } from './controllers/AppController';

function App() {
  const [controller] = useState(() => new AppController());

  return (
    <Router>
      <div className="app-container">
        <PaperHeader />
        <nav className="app-nav">
          <ul>
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/shapes">Basic Shapes</Link></li>
            <li><Link to="/animations">Animations</Link></li>
            <li><Link to="/interactive">Interactive Elements</Link></li>
            <li><Link to="/ui-components">UI Components</Link></li>
          </ul>
        </nav>
        
        <Routes>
          <Route path="/" element={<Dashboard controller={controller} />} />
          <Route path="/shapes" element={<ShapesDemo controller={controller} />} />
          <Route path="/animations" element={<AnimationDemo controller={controller} />} />
          <Route path="/interactive" element={<InteractiveDemo controller={controller} />} />
          <Route path="/ui-components" element={<UIComponentsDemo controller={controller} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;