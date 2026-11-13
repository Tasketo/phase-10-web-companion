import { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Button, Card, Input } from '@chakra-ui/react';

import { getClassicPhases, generateRandomPhases, type Phase } from '../helpers/phases';
import './SetupScreen.css';

interface Player {
  id: string;
  name: string;
}

interface SetupScreenProps {
  onStartGame: (players: Player[], phases: Phase[], phaseSetType: 'classic' | 'random') => void;
}

type SetupStep = 'playerCount' | 'playerNames' | 'phaseSelection' | 'phaseDisplay';

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

const SetupScreen: React.FC<SetupScreenProps> = ({ onStartGame }) => {
  const { t, i18n } = useTranslation();
  const [currentStep, setCurrentStep] = useState<SetupStep>('playerCount');
  const [playerCount, setPlayerCount] = useState<number | null>(2);
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [phaseSetType, setPhaseSetType] = useState<'classic' | 'random'>('classic');
  const [selectedPhases, setSelectedPhases] = useState<Phase[]>([]);

  const handlePlayerCountChange = (value: number | null) => {
    if (value !== null && Number.isInteger(value) && value >= 2 && value <= 10) {
      setPlayerCount(value);
      setPlayerNames(Array(value).fill(''));
    }
  };

  const handleContinue = () => {
    if (playerCount && playerCount > 0) {
      setPlayerNames(Array(playerCount).fill(''));
      setCurrentStep('playerNames');
    }
  };

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...playerNames];
    newNames[index] = value;
    setPlayerNames(newNames);
  };

  const handleProceedToPhaseSelection = () => {
    if (playerNames.every((name) => name.trim())) {
      setCurrentStep('phaseSelection');
    }
  };

  const handlePhaseSetTypeSelected = (type: 'classic' | 'random') => {
    setPhaseSetType(type);
    setSelectedPhases(type === 'classic' ? getClassicPhases() : generateRandomPhases(10));
    setCurrentStep('phaseDisplay');
  };

  const handleRegeneratePhases = () => {
    setSelectedPhases(generateRandomPhases(10));
  };

  const handleStartGame = () => {
    if (playerNames.every((name) => name.trim()) && selectedPhases.length > 0) {
      const players = playerNames.map((name, index) => ({
        id: `player-${index}`,
        name: name.trim(),
      }));
      onStartGame(players, selectedPhases, phaseSetType);
    }
  };

  const getPhaseDisplayName = (phase: Phase, index: number): string => {
    const translationKey = descriptionToKeyMap[phase.description];
    return `Phase ${index + 1}: ${translationKey ? t(translationKey) : phase.description}`;
  };

  const allNamesEntered = playerNames.length > 0 && playerNames.every((name) => name.trim());

  return (
    <div className="setup-screen">
      <Card.Root className="setup-card">
        <Card.Body padding={0}>
          <div className="language-switcher">
            <Button size="sm" variant="ghost" colorPalette="purple" onClick={() => i18n.changeLanguage('en')}>
              English
            </Button>
            <Button size="sm" variant="ghost" colorPalette="purple" onClick={() => i18n.changeLanguage('de')}>
              Deutsch
            </Button>
          </div>

          <div className="setup-content">
            <h1>{t('setup.title')}</h1>
            <p className="subtitle">{t('setup.subtitle')}</p>

            {currentStep === 'playerCount' && (
              <div className="player-count-section">
                <label htmlFor="player-count">{t('setup.playerCountLabel')}</label>
                <Input
                  id="player-count"
                  type="text"
                  inputMode="numeric"
                  value={playerCount ?? ''}
                  onChange={(event) => {
                    const value = Number(event.target.value);
                    handlePlayerCountChange(Number.isNaN(value) ? null : value);
                  }}
                  min={2}
                  max={10}
                />
                <Button colorPalette="purple" onClick={handleContinue} disabled={!playerCount}>
                  {t('setup.continueButton')}
                </Button>
              </div>
            )}

            {currentStep === 'playerNames' && (
              <div className="player-names-section">
                <h2>{t('setup.playerNamesTitle')}</h2>
                {playerNames.map((name, index) => (
                  <div key={index} className="name-input-group">
                    <label htmlFor={`player-${index}`}>
                      <Trans i18nKey="setup.playerLabel" values={{ number: index + 1 }}>
                        Player <span>{index + 1}</span>
                      </Trans>
                    </label>
                    <Input
                      id={`player-${index}`}
                      value={name}
                      onChange={(event) => handleNameChange(index, event.target.value)}
                      placeholder={t('setup.playerNamePlaceholder')}
                      onKeyUp={(event) => {
                        if (event.key === 'Enter' && allNamesEntered) {
                          handleProceedToPhaseSelection();
                        }
                      }}
                    />
                  </div>
                ))}
                <div className="button-group">
                  <Button variant="outline" colorPalette="gray" onClick={() => setCurrentStep('playerCount')}>
                    {t('setup.backButton')}
                  </Button>
                  <Button colorPalette="purple" onClick={handleProceedToPhaseSelection} disabled={!allNamesEntered}>
                    {t('setup.continueButton')}
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 'phaseSelection' && (
              <div className="phase-selection-section">
                <h2>{t('setup.phaseSelectionTitle')}</h2>
                <p>{t('setup.phaseSelectionDescription')}</p>
                <div className="phase-buttons-group">
                  <Button
                    className="phase-button"
                    colorPalette="purple"
                    onClick={() => handlePhaseSetTypeSelected('classic')}
                  >
                    {t('setup.classicPhasesButton')}
                  </Button>
                  <Button
                    className="phase-button"
                    colorPalette="purple"
                    onClick={() => handlePhaseSetTypeSelected('random')}
                  >
                    {t('setup.randomPhasesButton')}
                  </Button>
                </div>
                <div className="button-group">
                  <Button variant="outline" colorPalette="gray" onClick={() => setCurrentStep('playerNames')}>
                    {t('setup.backButton')}
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 'phaseDisplay' && (
              <div className="phase-display-section">
                <h2>{phaseSetType === 'classic' ? t('setup.classicPhaseSet') : t('setup.randomPhaseSet')}</h2>
                <div className="phases-list">
                  {selectedPhases.map((phase, index) => (
                    <div key={index} className="phase-item">
                      {getPhaseDisplayName(phase, index)}
                    </div>
                  ))}
                </div>
                {phaseSetType === 'random' && (
                  <Button className="regenerate-button" colorPalette="purple" onClick={handleRegeneratePhases}>
                    {t('setup.regeneratePhasesButton')}
                  </Button>
                )}
                <div className="button-group">
                  <Button variant="outline" colorPalette="gray" onClick={() => setCurrentStep('phaseSelection')}>
                    {t('setup.backButton')}
                  </Button>
                  <Button colorPalette="purple" onClick={handleStartGame}>
                    {t('setup.startGameButton')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card.Body>
      </Card.Root>
    </div>
  );
};

export default SetupScreen;
