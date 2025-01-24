import React, { useState, useEffect } from 'react';

const THEMES = {
  dinosaurs: ['TREX', 'BONE', 'CLAW', 'SCALE'],
  space: ['STAR', 'MOON', 'MARS', 'ROCKET'],
  ocean: ['FISH', 'WAVE', 'SHARK', 'CORAL']
};

const createWordSearchGrid = (words, gridSize = 8) => {
  const grid = Array(gridSize).fill().map(() => Array(gridSize).fill(''));
  const directions = [
    [0, 1],   // Horizontal
    [1, 0],   // Vertical
    [1, 1],   // Diagonal
    [-1, 1]   // Anti-diagonal
  ];

  words.forEach(word => {
    let placed = false;
    while (!placed) {
      const direction = directions[Math.floor(Math.random() * directions.length)];
      const startX = Math.floor(Math.random() * gridSize);
      const startY = Math.floor(Math.random() * gridSize);

      if (canPlaceWord(grid, word, startX, startY, direction, gridSize)) {
        placeWord(grid, word, startX, startY, direction);
        placed = true;
      }
    }
  });

  fillRemainingSpaces(grid);
  return grid;
};

const canPlaceWord = (grid, word, x, y, direction, gridSize) => {
  const [dx, dy] = direction;
  for (let i = 0; i < word.length; i++) {
    const newX = x + i * dx;
    const newY = y + i * dy;

    if (newX < 0 || newX >= gridSize || newY < 0 || newY >= gridSize) return false;
    if (grid[newY][newX] !== '' && grid[newY][newX] !== word[i]) return false;
  }
  return true;
};

const placeWord = (grid, word, x, y, direction) => {
  const [dx, dy] = direction;
  for (let i = 0; i < word.length; i++) {
    grid[y + i * dy][x + i * dx] = word[i];
  }
};

const fillRemainingSpaces = (grid) => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === '') {
        grid[y][x] = letters[Math.floor(Math.random() * letters.length)];
      }
    }
  }
};

function WordSearchGame() {
  const [theme, setTheme] = useState('dinosaurs');
  const [words, setWords] = useState(THEMES.dinosaurs);
  const [grid, setGrid] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);

  useEffect(() => {
    setGrid(createWordSearchGrid(words));
    setFoundWords([]);
    setSelectedCells([]);
  }, [theme, words]);

  const handleCellClick = (x, y) => {
    const newSelectedCells = [...selectedCells, { x, y }];
    setSelectedCells(newSelectedCells);

    if (newSelectedCells.length > 1) {
      const possibleWord = getWordFromCells(grid, newSelectedCells);
      if (words.includes(possibleWord)) {
        setFoundWords([...foundWords, possibleWord]);
        setSelectedCells([]);
      }
    }
  };

  const getWordFromCells = (grid, cells) => {
    return cells.map(cell => grid[cell.y][cell.x]).join('');
  };

  return (
    <div className="word-search-game">
      <h2>Word Search: {theme.toUpperCase()}</h2>
      <div className="theme-selector">
        {Object.keys(THEMES).map(t => (
          <button 
            key={t} 
            onClick={() => {
              setTheme(t);
              setWords(THEMES[t]);
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid">
        {grid.map((row, y) => (
          row.map((cell, x) => (
            <div 
              key={`${x}-${y}`} 
              onClick={() => handleCellClick(x, y)}
              className={`
                cell 
                ${selectedCells.some(c => c.x === x && c.y === y) ? 'selected' : ''}
              `}
            >
              {cell}
            </div>
          ))
        ))}
      </div>

      <div className="word-list">
        <h3>Words to Find:</h3>
        {words.map(word => (
          <span 
            key={word} 
            className={`
              ${foundWords.includes(word) ? 'found' : ''}
            `}
          >
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}

export default WordSearchGame;
