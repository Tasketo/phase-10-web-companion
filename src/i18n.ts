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
        playerLabel: string;
        continueButton: string;
        playerNamesTitle: string;
        playerNamePlaceholder: string;
        phaseSelectionTitle: string;
        phaseSelectionDescription: string;
        classicPhasesButton: string;
        randomPhasesButton: string;
        classicPhaseSet: string;
        randomPhaseSet: string;
        regeneratePhasesButton: string;
        startGameButton: string;
        backButton: string;
      };
      game: {
        handLabel: string;
        leaderboardWithHand: string;
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
      phaseDescriptions: {
        twoSetsOfThree: string;
        oneSetOfThreeAndOneRunOfFour: string;
        oneSetOfFourAndOneRunOfFour: string;
        runOfSeven: string;
        runOfEight: string;
        runOfNine: string;
        twoSetsOfFour: string;
        sevenCardsOfOneColor: string;
        oneSetOfFiveAndOneSetOfTwo: string;
        oneSetOfFiveAndOneSetOfThree: string;
        fiveCardsOfOneColorAndOneRunOfThree: string;
        fourSetsOfTwo: string;
        twoRunsOfFour: string;
        sixCardsOfOneColorAndOneSetOfThree: string;
        oneSetOfTwoAndOneSetOfThreeAndOneSetOfFour: string;
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
        playerLabel: 'Player <1>{{number}}</1>',
        continueButton: 'Continue',
        playerNamesTitle: 'Enter player names',
        playerNamePlaceholder: 'Player name',
        phaseSelectionTitle: 'Choose Phase Set',
        phaseSelectionDescription: 'Select how you want to play:',
        classicPhasesButton: 'Classic Phases',
        randomPhasesButton: 'Random Phases',
        classicPhaseSet: 'Classic Phase Set',
        randomPhaseSet: 'Random Phase Set',
        regeneratePhasesButton: 'Regenerate Phases',
        startGameButton: 'Start Game',
        backButton: 'Back',
      },

      // Game Screen
      game: {
        handLabel: 'Hand',
        leaderboardWithHand: '<0>{{leaderboard}}</0> - <1>{{hand}}</1> <2>{{number}}</2>',
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
        rank: '<0>{{number}}</0>',
        totalScore: '<0>{{score}}</0> pts',
      },

      // Phase Descriptions
      phaseDescriptions: {
        twoSetsOfThree: '2 sets of 3',
        oneSetOfThreeAndOneRunOfFour: '1 set of 3 + 1 run of 4',
        oneSetOfFourAndOneRunOfFour: '1 set of 4 + 1 run of 4',
        runOfSeven: 'Run of 7',
        runOfEight: 'Run of 8',
        runOfNine: 'Run of 9',
        twoSetsOfFour: '2 sets of 4',
        sevenCardsOfOneColor: '7 cards of one color',
        oneSetOfFiveAndOneSetOfTwo: '1 set of 5 + 1 set of 2',
        oneSetOfFiveAndOneSetOfThree: '1 set of 5 + 1 set of 3',
        fiveCardsOfOneColorAndOneRunOfThree: '5 cards of one color + 1 run of 3',
        fourSetsOfTwo: '4 sets of 2',
        twoRunsOfFour: '2 runs of 4',
        sixCardsOfOneColorAndOneSetOfThree: '6 cards of one color + 1 set of 3',
        oneSetOfTwoAndOneSetOfThreeAndOneSetOfFour: '1 set of 2 + 1 set of 3 + 1 set of 4',
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
        playerLabel: 'Spieler <1>{{number}}</1>',
        continueButton: 'Weiter',
        playerNamesTitle: 'Spielernamen eingeben',
        playerNamePlaceholder: 'Spielername',
        phaseSelectionTitle: 'Variante auswählen',
        phaseSelectionDescription: 'Wähle die Spielvariante:',
        classicPhasesButton: 'Klassische Phasen',
        randomPhasesButton: 'Zufällige Phasen',
        classicPhaseSet: 'Klassischer Phasen',
        randomPhaseSet: 'Zufälliger Phasen',
        regeneratePhasesButton: 'Phasen generieren',
        startGameButton: 'Spiel starten',
        backButton: 'Zurück',
      },

      // Game Screen
      game: {
        handLabel: 'Runde',
        leaderboardWithHand: '<0>{{leaderboard}}</0> - <1>{{hand}}</1> <2>{{number}}</2>',
        enterScoresTitle: 'Punkte eingeben',
        penaltyPointsLabel: 'Strafpunkte:',
        completedPhaseLabel: 'Phase abgeschlossen',
        endHandButton: 'Runde beenden',
        leaderboardTitle: 'Rangliste',
        resetGameButton: 'Spiel zurücksetzen',
        playNextHandButton: 'Nächste Runde spielen',
        gameComplete: 'Spiel komplett!',
      },

      // Leaderboard
      leaderboard: {
        rank: '<0>{{number}}</0>',
        totalScore: '<0>{{score}}</0> Punkte',
      },

      // Phase Descriptions
      phaseDescriptions: {
        twoSetsOfThree: '2 Zwillinge',
        oneSetOfThreeAndOneRunOfFour: '1 Drilling + 1 Viererfolge',
        oneSetOfFourAndOneRunOfFour: '1 Vierling + 1 Viererfolge',
        runOfSeven: '1 Siebenerfolge',
        runOfEight: '1 Achterfolge',
        runOfNine: '1 Neunerfolge',
        twoSetsOfFour: '2 Vierlinge',
        sevenCardsOfOneColor: '7 Karten einer Farbe',
        oneSetOfFiveAndOneSetOfTwo: '1 Fünfling + 1 Zwilling',
        oneSetOfFiveAndOneSetOfThree: '1 Fünfling + 1 Drilling',
        fiveCardsOfOneColorAndOneRunOfThree: '5 Karten einer Farbe + 1 Dreierfolge',
        fourSetsOfTwo: '4 Zwillinge',
        twoRunsOfFour: '2 Viererfolgen',
        sixCardsOfOneColorAndOneSetOfThree: '6 Karten einer Farbe + 1 Drilling',
        oneSetOfTwoAndOneSetOfThreeAndOneSetOfFour: '1 Zwilling + 1 Drilling + 1 Vierling',
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
