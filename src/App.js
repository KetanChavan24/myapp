import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { FaGoogle, FaGoogleDrive, FaRegStickyNote } from 'react-icons/fa';
import { SiOpenai } from 'react-icons/si'; // Assuming SiOpenai represents ChatGPT

function App() {
  const canvasRef = useRef(null);
  const [selectedApps, setSelectedApps] = useState([]);
  const [dragging, setDragging] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedAppForMenu, setSelectedAppForMenu] = useState(null); // State to handle selected app for menu

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

  const addApp = (app) => {
    setSelectedApps([...selectedApps, { app, x: 50, y: 50 }]);
  };

  const renderIcon = (app) => {
    switch(app) {
      case 'Gmail':
        return <FaGoogle className="selected-app-icon" style={{ color: '#4285F4' }} />;
      case 'Google Drive':
        return <FaGoogleDrive className="selected-app-icon" style={{ color: '#0F9D58' }} />;
      case 'Notion':
        return <FaRegStickyNote className="selected-app-icon" style={{ color: '#000000' }} />;
      case 'ChatGPT':
        return <SiOpenai className="selected-app-icon" style={{ color: '#00A67E' }} />;
      default:
        return null;
    }
  };

  const handleMouseDown = (e, index) => {
    const appElement = e.target.getBoundingClientRect();
    setDragging(index);
    setDragOffset({
      x: e.clientX - appElement.left,
      y: e.clientY - appElement.top,
    });
  };

  const handleMouseMove = (e) => {
    if (dragging === null) return;
    const newSelectedApps = [...selectedApps];
    newSelectedApps[dragging].x = e.clientX - dragOffset.x;
    newSelectedApps[dragging].y = e.clientY - dragOffset.y;
    setSelectedApps(newSelectedApps);
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  const handleAppClick = (item) => {
    setSelectedAppForMenu(item);
  };

  const closeMenu = () => {
    setSelectedAppForMenu(null);
  };

  return (
    <div className="app" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      <aside className="sidebar">
        <h2>Apps</h2>
        <ul>
          <li onClick={() => addApp('Gmail')}><FaGoogle className="app-icon"/> Gmail</li>
          <li onClick={() => addApp('Google Drive')}><FaGoogleDrive className="app-icon"/> Google Drive</li>
          <li onClick={() => addApp('Notion')}><FaRegStickyNote className="app-icon"/> Notion</li>
          <li onClick={() => addApp('ChatGPT')}><SiOpenai className="app-icon"/> ChatGPT</li>
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
          <div className="selected-apps">
            {selectedApps.map((item, index) => (
              <div
                key={index}
                className="selected-app"
                style={{ left: item.x, top: item.y }}
                onMouseDown={(e) => handleMouseDown(e, index)}
                onClick={() => handleAppClick(item)} // Add onClick handler
              >
                {renderIcon(item.app)}
              </div>
            ))}
          </div>
        </div>
      </main>
      {selectedAppForMenu && (
        <aside className="right-menu" style={{ top: selectedAppForMenu.y, left: selectedAppForMenu.x - 300 }}>
          <div className="right-menu-header">
            <h2>{selectedAppForMenu.app} Options</h2>
            <button className="close-button" onClick={closeMenu}>X</button>
          </div>
          <div className="right-menu-content">
            {/* Add options or details for the selected app here */}
            <p>Details or options for {selectedAppForMenu.app}</p>
          </div>
        </aside>
      )}
    </div>
  );
}

export default App;
