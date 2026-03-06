import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources: {
  [key: string]: {
    translation: {
      appTitle: string;
      appSubtitle: string;
      setup: {
        title: string;
        subtitle: string;
        playerCountLabel: string;
        continueButton: string;
        playerNamesTitle: string;
        playerNamePlaceholder: string;
        startGameButton: string;
        backButton: string;
      };
      game: {
        handLabel: string;
        enterScoresTitle: string;
        penaltyPointsLabel: string;
        completedPhaseLabel: string;
        endHandButton: string;
        leaderboardTitle: string;
        resetGameButton: string;
        playNextHandButton: string;
        gameComplete: string;
      };
      leaderboard: {
        rank: string;
        totalScore: string;
      };
      phases: {
        phase1: string;
        phase2: string;
        phase3: string;
        phase4: string;
        phase5: string;
        phase6: string;
        phase7: string;
        phase8: string;
        phase9: string;
        phase10: string;
      };
    };
  };
} = {
  en: {
    translation: {
      // App & General
      appTitle: 'Phase 10 Web Companion',
      appSubtitle: 'Track your game scores and phases',

      // Setup Screen
      setup: {
        title: 'Phase 10 Web Companion',
        subtitle: 'Track your game scores and phases',
        playerCountLabel: 'How many players?',
        continueButton: 'Continue',
        playerNamesTitle: 'Enter player names',
        playerNamePlaceholder: 'Player name',
        startGameButton: 'Start Game',
        backButton: 'Back',
      },

      // Game Screen
      game: {
        handLabel: 'Hand',
        enterScoresTitle: 'Enter Scores',
        penaltyPointsLabel: 'Penalty Points:',
        completedPhaseLabel: 'Completed Phase',
        endHandButton: 'End Hand',
        leaderboardTitle: 'Leaderboard',
        resetGameButton: 'Reset Game',
        playNextHandButton: 'Play Next Hand',
        gameComplete: 'Game Complete!',
      },

      // Leaderboard
      leaderboard: {
        rank: '#{{number}}',
        totalScore: '{{score}} pts',
      },

      // Phases
      phases: {
        phase1: 'Phase 1: 2 sets of 3',
        phase2: 'Phase 2: 1 set of 3 + 1 run of 4',
        phase3: 'Phase 3: 1 set of 4 + 1 run of 4',
        phase4: 'Phase 4: 1 run of 7',
        phase5: 'Phase 5: 1 run of 8',
        phase6: 'Phase 6: 1 run of 9',
        phase7: 'Phase 7: 2 sets of 4',
        phase8: 'Phase 8: 7 cards of one color',
        phase9: 'Phase 9: 1 set of 5 + 1 set of 2',
        phase10: 'Phase 10: 1 set of 5 + 1 set of 3',
      },
    },
  },
  de: {
    translation: {
      // App & General
      appTitle: 'Phase 10 Web Companion',
      appSubtitle: 'Verfolge Spielstände in Form von Phasen und Punkten',

      // Setup Screen
      setup: {
        title: 'Phase 10 Web Companion',
        subtitle: 'Verfolge Spielstände in Form von Phasen und Punkten',
        playerCountLabel: 'Wie viele Spieler?',
        continueButton: 'Weiter',
        playerNamesTitle: 'Spielernamen eingeben',
        playerNamePlaceholder: 'Spielername',
        startGameButton: 'Spiel starten',
        backButton: 'Zurück',
      },

      // Game Screen
      game: {
        handLabel: 'Runde',
        enterScoresTitle: 'Punkte eingeben',
        penaltyPointsLabel: 'Strafpunkte:',
        completedPhaseLabel: 'Phase abgeschlossen',
        endHandButton: 'Runde beenden',
        leaderboardTitle: 'Rangliste',
        resetGameButton: 'Spiel zurücksetzen',
        playNextHandButton: 'Nächste Runde spielen',
        gameComplete: 'Spiel abgeschlossen!',
      },

      // Leaderboard
      leaderboard: {
        rank: '#{{number}}',
        totalScore: '{{score}} Punkte',
      },

      // Phases
      phases: {
        phase1: 'Phase 1: 2 Zwillinge',
        phase2: 'Phase 2: 1 Drilling + 1 Viererfolge',
        phase3: 'Phase 3: 1 Vierling + 1 Viererfolge',
        phase4: 'Phase 4: 1 Siebenerfolge',
        phase5: 'Phase 5: 1 Achterfolge',
        phase6: 'Phase 6: 1 Neunerfolge',
        phase7: 'Phase 7: 2 Vierlinge',
        phase8: 'Phase 8: 7 Karten einer Farbe',
        phase9: 'Phase 9: 1 Fünfling + 1 Zwilling',
        phase10: 'Phase 10: 1 Fünfling + 1 Drilling',
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    debug: import.meta.env.DEV,
  });

export default i18n;
