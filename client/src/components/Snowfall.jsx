import { useEffect } from 'react';
import '../styles/snowfall.css';

export default function SnowfallEffect() {
  useEffect(() => {
    const container = document.getElementById('snowfall-container');
    if (!container) return;

    const numberOfSnowflakes = 80;
    container.innerHTML = '';

    for (let i = 0; i < numberOfSnowflakes; i++) {
      const snowflake = document.createElement('div');
      snowflake.className = 'snowflake';
      
      const leftPosition = Math.random() * 100;
      const duration = 10 + Math.random() * 20;
      const delay = Math.random() * duration * -0.8; // Negative delay to start mid-animation
      const size = 0.5 + Math.random() * 3;
      
      snowflake.style.left = leftPosition + '%';
      snowflake.style.animationDuration = duration + 's';
      snowflake.style.animationDelay = delay + 's';
      snowflake.style.fontSize = size + 'em';
      snowflake.style.opacity = 0.3 + Math.random() * 0.7;
      
      container.appendChild(snowflake);
    }
  }, []);

  return <div id="snowfall-container" className="snowfall-container" />;
}

