# Paper.js React Demo

A structured React application demonstrating Paper.js with MVC architecture. This project showcases how to integrate Paper.js, a powerful vector graphics scripting framework, with React to create interactive graphics and UI components.

## Features

- **MVC Architecture**: Organized with Model-View-Controller pattern for better code organization and maintainability
- **Interactive Demos**: Multiple demos showcasing different Paper.js capabilities
- **Custom UI Components**: UI components built with Paper.js
- **Responsive Design**: Works on various screen sizes

## Demo Sections

1. **Basic Shapes**: Create and manipulate vector shapes
2. **Animations**: Explore dynamic animations
3. **Interactive Drawing**: Draw, select, and manipulate paths
4. **UI Components**: Custom UI controls built with Paper.js

## Project Structure

```
src/
  ├── models/         # Data models
  │   ├── ShapeModel.js
  │   ├── AnimationModel.js
  │   └── UIComponentModel.js
  ├── views/          # React components using Paper.js
  │   ├── components/ # Reusable UI components
  │   │   ├── PaperHeader.js
  │   │   ├── PaperCanvas.js
  │   │   ├── PaperButton.js
  │   │   ├── PaperSlider.js
  │   │   └── PaperToggle.js
  │   └── pages/      # Page components
  │       ├── Dashboard.js
  │       ├── ShapesDemo.js
  │       ├── AnimationDemo.js
  │       ├── InteractiveDemo.js
  │       └── UIComponentsDemo.js
  ├── controllers/    # Logic connecting models and views
  │   └── AppController.js
  ├── App.js          # Main application
  └── index.js        # Entry point
```

## Technologies Used

- React
- Paper.js
- React Router

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/anskp/paper-js-react-demo.git
   ```

2. Install dependencies:
   ```
   cd paper-js-react-demo
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Usage

- Navigate through different demos using the top navigation
- Interact with the canvas in each demo to explore Paper.js capabilities
- Use the custom UI controls to manipulate the canvas elements

## License

MIT

## Acknowledgements

- [Paper.js](http://paperjs.org/) - The Swiss Army Knife of Vector Graphics Scripting
- [React](https://reactjs.org/) - A JavaScript library for building user interfaces