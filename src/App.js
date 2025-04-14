import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const canvasSize = { width: 400, height: 400 };
const initialSnake = [[8, 7], [8, 8]];
const initialFood = [10, 10];
const scale = 20;

function App() {
  const [snake, setSnake] = useState(initialSnake);
  const [food, setFood] = useState(initialFood);
  const [direction, setDirection] = useState('UP');
  const [gameOver, setGameOver] = useState(false);
  const canvasRef = useRef(null);

  const moveSnake = () => {
    const head = [...snake[0]];
    switch (direction) {
      case 'UP':
        head[1] -= 1;
        break;
      case 'DOWN':
        head[1] += 1;
        break;
      case 'LEFT':
        head[0] -= 1;
        break;
      case 'RIGHT':
        head[0] += 1;
        break;
      default:
        break;
    }

    const newSnake = [head, ...snake];

    if (head[0] === food[0] && head[1] === food[1]) {
      setFood([
        Math.floor(Math.random() * (canvasSize.width / scale)),
        Math.floor(Math.random() * (canvasSize.height / scale)),
      ]);
    } else {
      newSnake.pop();
    }

    if (
      head[0] < 0 || head[1] < 0 ||
      head[0] >= canvasSize.width / scale || head[1] >= canvasSize.height / scale ||
      snake.some(segment => segment[0] === head[0] && segment[1] === head[1])
    ) {
      setGameOver(true);
    } else {
      setSnake(newSnake);
    }
  };

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowUp': setDirection('UP'); break;
      case 'ArrowDown': setDirection('DOWN'); break;
      case 'ArrowLeft': setDirection('LEFT'); break;
      case 'ArrowRight': setDirection('RIGHT'); break;
      default: break;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    const interval = setInterval(() => {
      if (!gameOver) moveSnake();
    }, 200);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearInterval(interval);
    };
  }, [snake, direction, gameOver]);

  useEffect(() => {
    const context = canvasRef.current.getContext('2d');
    context.setTransform(scale, 0, 0, scale, 0, 0);
    context.clearRect(0, 0, canvasSize.width, canvasSize.height);

    context.fillStyle = 'green';
    snake.forEach(([x, y]) => context.fillRect(x, y, 1, 1));

    context.fillStyle = 'red';
    context.fillRect(food[0], food[1], 1, 1);
  }, [snake, food]);

  return (
    <div className="App">
      <h2>🐍 Snake Game</h2>
      {gameOver && <h3>Game Over! Refresh the page to restart.</h3>}
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        style={{ border: '2px solid white', backgroundColor: 'black' }}
      />
    </div>
  );
}

export default App;
