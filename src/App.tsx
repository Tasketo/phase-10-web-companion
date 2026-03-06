import { useEffect, useState } from 'react';
import './i18n';
import './App.css';
import { type GameState, loadGameState, saveGameState } from './helpers/gameState';
import SetupScreen from './screens/SetupScreen';
import GameScreen from './screens/GameScreen';

function App() {
  const [gameState, setGameState] = useState<GameState | null>(() => loadGameState());

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    if (gameState) {
      saveGameState(gameState);
    }
  }, [gameState]);

  const handleStartGame = (players: Array<{ id: string; name: string }>) => {
    const newGameState: GameState = {
      players: players.map((p) => ({
        ...p,
        currentPhaseIndex: 0,
        totalScore: 0,
      })),
      currentHand: 1,
      handResults: [],
      currentPhaseIndex: 0,
    };
    setGameState(newGameState);
  };

  const handleResetGame = () => {
    setGameState(null);
    localStorage.removeItem('phase10-web.state');
  };

  return (
    <div className="app">
      {gameState === null ? (
        <SetupScreen onStartGame={handleStartGame} />
      ) : (
        <GameScreen gameState={gameState} onGameStateChange={setGameState} onResetGame={handleResetGame} />
      )}
    </div>
  );
}

export default App;
