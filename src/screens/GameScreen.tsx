import { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Button, Card, Input } from '@chakra-ui/react';
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
    gameState.players.map((player) => ({
      playerId: player.id,
      penaltyScore: 0,
      completedPhase: false,
    })),
  );

  const getPhaseDescription = (phaseIndex: number): string => {
    if (phaseIndex < 0 || phaseIndex >= gameState.phases.length) {
      return t('game.gameComplete');
    }

    const phase = gameState.phases[phaseIndex];
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
    return `Phase ${phaseIndex + 1}: ${translationKey ? t(translationKey) : phase.description}`;
  };

  const handlePenaltyChange = (playerId: string, score: number) => {
    setPlayerScores((prev) =>
      prev.map((playerScore) =>
        playerScore.playerId === playerId ? { ...playerScore, penaltyScore: score || 0 } : playerScore,
      ),
    );
  };

  const handleCompletedChange = (playerId: string, completed: boolean) => {
    setPlayerScores((prev) =>
      prev.map((playerScore) =>
        playerScore.playerId === playerId ? { ...playerScore, completedPhase: completed } : playerScore,
      ),
    );
  };

  const handleEndHand = () => {
    const handResult: HandResult = {
      handNumber: gameState.currentHand,
      playerScores: {},
      completedPhases: {},
    };

    const updatedPlayers: Player[] = gameState.players.map((player) => {
      const handScore = playerScores.find((score) => score.playerId === player.id);
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

    onGameStateChange({
      ...gameState,
      players: updatedPlayers,
      handResults: [...gameState.handResults, handResult],
    });
    setShowLeaderboard(true);
  };

  const handleNextHand = () => {
    setPlayerScores(
      gameState.players.map((player) => ({
        playerId: player.id,
        penaltyScore: 0,
        completedPhase: false,
      })),
    );
    setShowLeaderboard(false);
  };

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
        <Button variant="ghost" colorPalette="orange" onClick={onResetGame}>
          {t('game.resetGameButton')}
        </Button>
      </header>

      <div className="game-content">
        {!showLeaderboard ? (
          <Card.Root className="game-card">
            <Card.Body>
              <h2>{t('game.enterScoresTitle')}</h2>
              <div className="score-entry">
                {gameState.players.map((player) => {
                  const handScore = playerScores.find((score) => score.playerId === player.id);
                  return (
                    <div key={player.id} className="player-entry">
                      <div className="player-info">
                        <div className="player-name">{player.name}</div>
                        <div className="player-phase">{getPhaseDescription(player.currentPhaseIndex)}</div>
                      </div>

                      <div className="score-inputs">
                        <div className="input-group">
                          <label htmlFor={`score-${player.id}`}>{t('game.penaltyPointsLabel')}</label>
                          <Input
                            id={`score-${player.id}`}
                            className="score-input"
                            type="number"
                            value={handScore?.penaltyScore || 0}
                            onChange={(event) => handlePenaltyChange(player.id, Number(event.target.value) || 0)}
                            min={0}
                            max={999}
                          />
                        </div>

                        <div className="input-group checkbox-group">
                          <input
                            type="checkbox"
                            id={`completed-${player.id}`}
                            checked={handScore?.completedPhase || false}
                            onChange={(event) => handleCompletedChange(player.id, event.target.checked)}
                          />
                          <label htmlFor={`completed-${player.id}`}>{t('game.completedPhaseLabel')}</label>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Button className="end-hand-btn" colorPalette="purple" onClick={handleEndHand}>
                {t('game.endHandButton')}
              </Button>
            </Card.Body>
          </Card.Root>
        ) : (
          <Card.Root className="game-card">
            <Card.Body>
              <h2>{t('game.leaderboardTitle')}</h2>
              <div className="leaderboard">
                {sortedPlayers.map((player, index) => (
                  <div key={player.id} className="leaderboard-entry">
                    <div className="leaderboard-row">
                      <span className="rank">#{index + 1}</span>
                      <span className="name">{player.name}</span>
                      <span className="score">
                        <Trans i18nKey="leaderboard.totalScore">{{ score: player.totalScore }} pts</Trans>
                      </span>
                    </div>
                    <div>
                      <span className="phase">{getPhaseDescription(player.currentPhaseIndex)}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                colorPalette="purple"
                onClick={() => {
                  handleNextHand();
                  onGameStateChange({
                    ...gameState,
                    currentHand: gameState.currentHand + 1,
                  });
                }}
              >
                {t('game.playNextHandButton')}
              </Button>
            </Card.Body>
          </Card.Root>
        )}
      </div>
    </div>
  );
};

export default GameScreen;
