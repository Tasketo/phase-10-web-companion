import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { Checkbox } from 'primereact/checkbox';
import type { GameState, Player, HandResult } from '../helpers/gameState';
import PHASES_DATA from '../../data/phase10_phases.json';
import './GameScreen.css';

interface GameScreenProps {
  gameState: GameState;
  onGameStateChange: (newState: GameState) => void;
  onResetGame: () => void;
}

interface PlayerHandScore {
  playerId: string;
  penaltyScore: number;
  completedPhase: boolean;
}

const GameScreen: React.FC<GameScreenProps> = ({ gameState, onGameStateChange, onResetGame }) => {
  const { t } = useTranslation();
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [playerScores, setPlayerScores] = useState<PlayerHandScore[]>(
    gameState.players.map((p) => ({
      playerId: p.id,
      penaltyScore: 0,
      completedPhase: false,
    })),
  );

  const getPhaseDescription = (phaseIndex: number): string => {
    if (phaseIndex < 0 || phaseIndex >= PHASES_DATA.phases.length) {
      return t('game.gameComplete');
    }
    const phaseKey = `phases.phase${phaseIndex + 1}` as const;
    return t(phaseKey);
  };

  const handlePenaltyChange = (playerId: string, score: number) => {
    setPlayerScores((prev) => prev.map((ps) => (ps.playerId === playerId ? { ...ps, penaltyScore: score || 0 } : ps)));
  };

  const handleCompletedChange = (playerId: string, completed: boolean) => {
    setPlayerScores((prev) => prev.map((ps) => (ps.playerId === playerId ? { ...ps, completedPhase: completed } : ps)));
  };

  const handleEndHand = () => {
    // Create hand result
    const handResult: HandResult = {
      handNumber: gameState.currentHand,
      playerScores: {},
      completedPhases: {},
    };

    // Update players with new scores and phases
    const updatedPlayers: Player[] = gameState.players.map((player) => {
      const handScore = playerScores.find((ps) => ps.playerId === player.id);
      if (!handScore) return player;

      const newPhaseIndex = handScore.completedPhase ? player.currentPhaseIndex + 1 : player.currentPhaseIndex;

      handResult.playerScores[player.id] = handScore.penaltyScore;
      handResult.completedPhases[player.id] = handScore.completedPhase ? newPhaseIndex : -1;

      return {
        ...player,
        totalScore: player.totalScore + handScore.penaltyScore,
        currentPhaseIndex: newPhaseIndex,
      };
    });

    const newGameState: GameState = {
      ...gameState,
      players: updatedPlayers,
      handResults: [...gameState.handResults, handResult],
    };

    onGameStateChange(newGameState);
    setShowLeaderboard(true);
  };

  const handleNextHand = () => {
    // Reset scores for next hand
    setPlayerScores(
      gameState.players.map((p) => ({
        playerId: p.id,
        penaltyScore: 0,
        completedPhase: false,
      })),
    );
    setShowLeaderboard(false);
  };

  // Sort players by score (lowest score first)
  const sortedPlayers = [...gameState.players].sort((a, b) => a.totalScore - b.totalScore);

  return (
    <div className="game-screen">
      <header className="game-header">
        <h1>
          {t('game.handLabel')} {gameState.currentHand}
        </h1>
        <Button label={t('game.resetGameButton')} icon="pi pi-refresh" severity="warning" onClick={onResetGame} text />
      </header>

      <div className="game-content">
        {!showLeaderboard ? (
          <Card>
            <h2>{t('game.enterScoresTitle')}</h2>
            <div className="score-entry">
              {gameState.players.map((player) => {
                const handScore = playerScores.find((ps) => ps.playerId === player.id);
                return (
                  <div key={player.id} className="player-entry">
                    <div className="player-info">
                      <div className="player-name">{player.name}</div>
                      <div className="player-phase">{getPhaseDescription(player.currentPhaseIndex)}</div>
                    </div>

                    <div className="score-inputs">
                      <div className="input-group">
                        <label>{t('game.penaltyPointsLabel')}</label>
                        <InputNumber
                          value={handScore?.penaltyScore || 0}
                          onValueChange={(e) => handlePenaltyChange(player.id, e.value || 0)}
                          min={0}
                          max={999}
                          useGrouping={false}
                        />
                      </div>

                      <div className="input-group checkbox-group">
                        <Checkbox
                          inputId={`completed-${player.id}`}
                          checked={handScore?.completedPhase || false}
                          onChange={(e) => handleCompletedChange(player.id, e.checked || false)}
                        />
                        <label htmlFor={`completed-${player.id}`}>{t('game.completedPhaseLabel')}</label>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <Button label={t('game.endHandButton')} onClick={handleEndHand} className="end-hand-btn" />
          </Card>
        ) : (
          <Card>
            <h2>
              {t('game.leaderboardTitle')} - {t('game.handLabel')} {gameState.currentHand}
            </h2>
            <div className="leaderboard">
              {sortedPlayers.map((player, index) => (
                <div key={player.id} className="leaderboard-row">
                  <span className="rank">#{index + 1}</span>
                  <span className="name">{player.name}</span>
                  <span className="phase">{getPhaseDescription(player.currentPhaseIndex)}</span>
                  <span className="score">{t('leaderboard.totalScore', { score: player.totalScore })}</span>
                </div>
              ))}
            </div>
            <Button
              label={t('game.playNextHandButton')}
              onClick={() => {
                handleNextHand();
                const newState: GameState = {
                  ...gameState,
                  currentHand: gameState.currentHand + 1,
                };
                onGameStateChange(newState);
              }}
            />
          </Card>
        )}
      </div>
    </div>
  );
};

export default GameScreen;
