import { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';

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

// Mapping from phase descriptions to translation keys
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
    if (value && value > 0 && value <= 10) {
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

    if (type === 'classic') {
      const classic = getClassicPhases();
      setSelectedPhases(classic);
      setCurrentStep('phaseDisplay');
    } else {
      const random = generateRandomPhases(10);
      setSelectedPhases(random);
      setCurrentStep('phaseDisplay');
    }
  };

  const handleRegeneratePhases = () => {
    const random = generateRandomPhases(10);
    setSelectedPhases(random);
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

  // Helper function to get translated phase display name
  const getPhaseDisplayName = (phase: Phase, index: number): string => {
    // Try to find a matching description in the mapping (covers all phases)
    const translationKey = descriptionToKeyMap[phase.description];
    if (translationKey) {
      return `Phase ${index + 1}: ${t(translationKey)}`;
    }

    // Fallback to raw description
    return `Phase ${index + 1}: ${phase.description}`;
  };

  const allNamesEntered = playerNames.length > 0 && playerNames.every((name) => name.trim());

  return (
    <div className="setup-screen">
      <Card className="setup-card">
        <div className="language-switcher">
          <Button size="small" label="English" severity="help" text onClick={() => i18n.changeLanguage('en')} />
          <Button size="small" label="Deutsch" severity="help" text onClick={() => i18n.changeLanguage('de')} />
        </div>

        <div className="setup-content">
          <h1>{t('setup.title')}</h1>
          <p className="subtitle">{t('setup.subtitle')}</p>

          {/* Step 1: Player Count */}
          {currentStep === 'playerCount' && (
            <div className="player-count-section">
              <label>{t('setup.playerCountLabel')}</label>
              <InputNumber
                value={playerCount}
                onValueChange={(e) => handlePlayerCountChange(e.value ?? null)}
                min={2}
                max={10}
                showButtons
              />
              <Button label={t('setup.continueButton')} onClick={handleContinue} disabled={!playerCount} />
            </div>
          )}

          {/* Step 2: Player Names */}
          {currentStep === 'playerNames' && (
            <div className="player-names-section">
              <h2>{t('setup.playerNamesTitle')}</h2>
              {playerNames.map((name, index) => (
                <div key={index} className="name-input-group">
                  <label>
                    <Trans i18nKey="setup.playerLabel" values={{ number: index + 1 }}>
                      Player <span>{index + 1}</span>
                    </Trans>
                  </label>
                  <InputText
                    value={name}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                    placeholder={t('setup.playerNamePlaceholder')}
                    onKeyUp={(e) => {
                      if (e.key === 'Enter' && allNamesEntered) {
                        handleProceedToPhaseSelection();
                      }
                    }}
                  />
                </div>
              ))}
              <div className="button-group">
                <Button
                  label={t('setup.backButton')}
                  onClick={() => setCurrentStep('playerCount')}
                  severity="secondary"
                />
                <Button
                  label={t('setup.continueButton')}
                  onClick={handleProceedToPhaseSelection}
                  disabled={!allNamesEntered}
                />
              </div>
            </div>
          )}

          {/* Step 3: Phase Selection */}
          {currentStep === 'phaseSelection' && (
            <div className="phase-selection-section">
              <h2>{t('setup.phaseSelectionTitle')}</h2>
              <p>{t('setup.phaseSelectionDescription')}</p>
              <div className="phase-buttons-group">
                <Button
                  label={t('setup.classicPhasesButton')}
                  onClick={() => handlePhaseSetTypeSelected('classic')}
                  className="phase-button"
                />
                <Button
                  label={t('setup.randomPhasesButton')}
                  onClick={() => handlePhaseSetTypeSelected('random')}
                  className="phase-button"
                />
              </div>
              <div className="button-group">
                <Button
                  label={t('setup.backButton')}
                  onClick={() => setCurrentStep('playerNames')}
                  severity="secondary"
                />
              </div>
            </div>
          )}

          {/* Step 4: Phase Display */}
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
                <Button
                  label={t('setup.regeneratePhasesButton')}
                  onClick={handleRegeneratePhases}
                  severity="info"
                  className="regenerate-button"
                />
              )}
              <div className="button-group">
                <Button
                  label={t('setup.backButton')}
                  onClick={() => setCurrentStep('phaseSelection')}
                  severity="secondary"
                />
                <Button label={t('setup.startGameButton')} onClick={handleStartGame} />
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default SetupScreen;
