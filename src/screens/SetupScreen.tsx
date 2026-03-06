import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';

import './SetupScreen.css';

interface Player {
  id: string;
  name: string;
}

interface SetupScreenProps {
  onStartGame: (players: Player[]) => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onStartGame }) => {
  const { t, i18n } = useTranslation();
  const [playerCount, setPlayerCount] = useState<number | null>(2);
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [showNameForm, setShowNameForm] = useState(false);

  const handlePlayerCountChange = (value: number | null) => {
    if (value && value > 0 && value <= 10) {
      setPlayerCount(value);
      setPlayerNames(Array(value).fill(''));
    }
  };

  const handleContinue = () => {
    if (playerCount && playerCount > 0) {
      setPlayerNames(Array(playerCount).fill(''));
      setShowNameForm(true);
    }
  };

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...playerNames];
    newNames[index] = value;
    setPlayerNames(newNames);
  };

  const handleStartGame = () => {
    if (playerNames.every((name) => name.trim())) {
      const players = playerNames.map((name, index) => ({
        id: `player-${index}`,
        name: name.trim(),
      }));
      onStartGame(players);
    }
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

          {!showNameForm ? (
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
          ) : (
            <div className="player-names-section">
              <h2>{t('setup.playerNamesTitle')}</h2>
              {playerNames.map((name, index) => (
                <div key={index} className="name-input-group">
                  <label>
                    {t('game.handLabel')} {index + 1}
                  </label>
                  <InputText
                    value={name}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                    placeholder={t('setup.playerNamePlaceholder')}
                    onKeyUp={(e) => {
                      if (e.key === 'Enter' && allNamesEntered) {
                        handleStartGame();
                      }
                    }}
                  />
                </div>
              ))}
              <div className="button-group">
                <Button label={t('setup.backButton')} onClick={() => setShowNameForm(false)} severity="secondary" />
                <Button label={t('setup.startGameButton')} onClick={handleStartGame} disabled={!allNamesEntered} />
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default SetupScreen;
