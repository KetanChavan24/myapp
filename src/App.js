import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { FaGoogle, FaGoogleDrive, FaRegStickyNote } from 'react-icons/fa';
import { SiOpenai } from 'react-icons/si';

function App() {
  const canvasRef = useRef(null);
  const [selectedApps, setSelectedApps] = useState([]);
  const [dragging, setDragging] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedAppForMenu, setSelectedAppForMenu] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth - 220;
    canvas.height = window.innerHeight - 60;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set grid background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
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

    // Draw the connections
    connections.forEach(({ from, to }) => {
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

  }, [connections, selectedApps]);

  const addApp = (app) => {
    setSelectedApps([...selectedApps, { app, x: 50, y: 50 }]);
  };

  const renderIcon = (app) => {
    switch (app) {
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
    setDragging(index);
    const app = selectedApps[index];
    setDragOffset({
      x: e.clientX - app.x,
      y: e.clientY - app.y,
    });
  };

  const handleMouseMove = (e) => {
    if (dragging === null) return;

    const newSelectedApps = [...selectedApps];
    newSelectedApps[dragging].x = e.clientX - dragOffset.x;
    newSelectedApps[dragging].y = e.clientY - dragOffset.y;
    setSelectedApps(newSelectedApps);

    // Update the connections dynamically as the app is moved
    setConnections((prevConnections) =>
      prevConnections.map((conn) => {
        if (conn.from.index === dragging) {
          return {
            ...conn,
            from: { x: newSelectedApps[dragging].x + 25, y: newSelectedApps[dragging].y + 25, index: dragging },
          };
        } else if (conn.to.index === dragging) {
          return {
            ...conn,
            to: { x: newSelectedApps[dragging].x + 25, y: newSelectedApps[dragging].y + 25, index: dragging },
          };
        }
        return conn;
      })
    );
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  const handleAppClick = (item, index) => {
    if (isConnecting) {
      const fromApp = selectedApps[selectedAppForMenu];

      // Check if the fromApp already has a connection as "from"
      const existingConnection = connections.find((conn) => conn.from.index === selectedAppForMenu);
      if (existingConnection) {
        alert(`${fromApp.app} is already connected as a starting point.`);
        setIsConnecting(false);
        setSelectedAppForMenu(null);
        return;
      }

      const toApp = item;
      const connection = {
        from: { x: fromApp.x + 25, y: fromApp.y + 25, index: selectedAppForMenu },
        to: { x: toApp.x + 25, y: toApp.y + 25, index },
      };

      setConnections([...connections, connection]);
      setIsConnecting(false);
      setSelectedAppForMenu(null);
    } else {
      setSelectedAppForMenu(index);
    }
  };

  const closeMenu = () => {
    setSelectedAppForMenu(null);
    setIsConnecting(false);
  };

  const startConnecting = () => {
    setIsConnecting(true);
  };

  return (
    <div className="app" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      <aside className="sidebar">
        <h2>Apps</h2>
        <ul>
          <li onClick={() => addApp('Gmail')}><FaGoogle className="app-icon" /> Gmail</li>
          <li onClick={() => addApp('Google Drive')}><FaGoogleDrive className="app-icon" /> Google Drive</li>
          <li onClick={() => addApp('Notion')}><FaRegStickyNote className="app-icon" /> Notion</li>
          <li onClick={() => addApp('ChatGPT')}><SiOpenai className="app-icon" /> ChatGPT</li>
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
                onClick={() => handleAppClick(item, index)}
              >
                {renderIcon(item.app)}
              </div>
            ))}
          </div>
        </div>
      </main>
      {selectedAppForMenu !== null && (
        <aside
          className="right-menu"
          style={{
            top: selectedApps[selectedAppForMenu].y,
            left: selectedApps[selectedAppForMenu].x + 60,
          }}
        >
          <div className="right-menu-header">
            <h2>{selectedApps[selectedAppForMenu].app} Options</h2>
            <button className="close-button" onClick={closeMenu}>X</button>
          </div>
          <div className="right-menu-content">
            <p>Example Task 1</p>
            <p>Example Task 2</p>
            <p onClick={startConnecting} style={{ cursor: 'pointer', color: 'blue' }}>Connect to another app</p>
          </div>
        </aside>
      )}
    </div>
  );
}

export default App;
