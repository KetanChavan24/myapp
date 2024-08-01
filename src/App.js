import React, { useEffect, useRef } from 'react';
import './App.css';

function App() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth - 220; // Adjusted for sidebar width and padding
    canvas.height = window.innerHeight - 60; // Adjusted for header height
    
    // Set up canvas style
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Example drawing - a grid like Excalidraw
    ctx.strokeStyle = '#e0e0e0';
    for (let x = 0.5; x < canvas.width; x += 20) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
    }
    for (let y = 0.5; y < canvas.height; y += 20) {
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
    }
    ctx.stroke();
  }, []);

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>Apps</h2>
        <ul>
          <li>Add App 1</li>
          <li>Add App 2</li>
          <li>Add App 3</li>
          {/* Add more app options here */}
        </ul>
      </aside>
      <main className="main-content">
        <header className="header">
          <div className="header-content">
            <div className="header-left">
              <h1>Create New Path</h1>
            </div>
            <div className="header-right">
              <button className="header-button">Save</button>
              <button className="header-button">Test</button>
              <button className="header-button header-button-primary">Publish</button>
            </div>
          </div>
        </header>
        <div className="canvas-container">
          <canvas ref={canvasRef} id="canvas"></canvas>
        </div>
      </main>
    </div>
  );
}

export default App;
