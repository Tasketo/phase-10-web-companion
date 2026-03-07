import { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { Checkbox } from 'primereact/checkbox';
import type { GameState, Player, HandResult } from '../helpers/gameState';
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
    if (phaseIndex < 0 || phaseIndex >= gameState.phases.length) {
      return t('game.gameComplete');
    }
    const phase = gameState.phases[phaseIndex];
    // Map description to translation key
    const descriptionToKeyMap: Record<string, string> = {
      '2 sets of 3': 'phaseDescriptions.twoSetsOfThree',
      '1 set of 3 + 1 run of 4': 'phaseDescriptions.oneSetOfThreeAndOneRunOfFour',
      '1 set of 4 + 1 run of 4': 'phaseDescriptions.oneSetOfFourAndOneRunOfFour',
      'Run of 7': 'phaseDescriptions.runOfSeven',
      'Run of 8': 'phaseDescriptions.runOfEight',
      'Run of 9': 'phaseDescriptions.runOfNine',
      '2 sets of 4': 'phaseDescriptions.twoSetsOfFour',
      '7 cards of one color': 'phaseDescriptions.sevenCardsOfOneColor',
      '1 set of 5 + 1 set of 2': 'phaseDescriptions.oneSetOfFiveAndOneSetOfTwo',
      '1 set of 5 + 1 set of 3': 'phaseDescriptions.oneSetOfFiveAndOneSetOfThree',
      '5 cards of one color + 1 run of 3': 'phaseDescriptions.fiveCardsOfOneColorAndOneRunOfThree',
      '4 sets of 2': 'phaseDescriptions.fourSetsOfTwo',
      '2 runs of 4': 'phaseDescriptions.twoRunsOfFour',
      '6 cards of one color + 1 set of 3': 'phaseDescriptions.sixCardsOfOneColorAndOneSetOfThree',
      '1 set of 2 + 1 set of 3 + 1 set of 4': 'phaseDescriptions.oneSetOfTwoAndOneSetOfThreeAndOneSetOfFour',
    };
    const translationKey = descriptionToKeyMap[phase.description];
    if (translationKey) {
      return `Phase ${phaseIndex + 1}: ${t(translationKey)}`;
    }
    // Fallback to raw description
    return `Phase ${phaseIndex + 1}: ${phase.description}`;
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
          <Trans
            i18nKey="game.leaderboardWithHand"
            values={{
              leaderboard: t('game.leaderboardTitle'),
              hand: t('game.handLabel'),
              number: gameState.currentHand,
            }}
          >
            <span>{t('game.leaderboardTitle')}</span>
            <span>{t('game.handLabel')}</span>
            <span>{gameState.currentHand}</span>
          </Trans>
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
            <h2>{t('game.leaderboardTitle')}</h2>
            <div className="leaderboard">
              {sortedPlayers.map((player, index) => (
                <div key={player.id} className="leaderboard-row">
                  <span className="rank">
                    <Trans i18nKey="leaderboard.rank" values={{ number: index + 1 }}>
                      #{{ number: index + 1 }}
                    </Trans>
                  </span>
                  <span className="name">{player.name}</span>
                  <span className="phase">{getPhaseDescription(player.currentPhaseIndex)}</span>
                  <span className="score">
                    <Trans i18nKey="leaderboard.totalScore" values={{ score: player.totalScore }}>
                      {{ score: player.totalScore }} pts
                    </Trans>
                  </span>
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
