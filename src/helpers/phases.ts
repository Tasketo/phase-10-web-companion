/**
 * Phase management: loading, difficulty calculation, and random generation
 */
import PHASES_DATA from '../../data/phase10_phases.json';

export interface Phase {
  number: number;
  description: string;
  requirements: Requirement[];
}

export interface Requirement {
  type: 'set' | 'run' | 'color';
  count?: number;
  size?: number;
}

// Cast JSON data to typed phases
const typedPhasesData = PHASES_DATA as { phases: Phase[] };
const TYPED_PHASES = typedPhasesData.phases;

export interface PhaseWithDifficulty extends Phase {
  difficulty: number; // 0-100 scale
  difficulty_reason?: string; // for debugging
}

/**
 * Calculate difficulty score for a phase (0-100 scale)
 * Lower = easier, Higher = harder
 */
function calculateDifficulty(phase: Phase): { score: number; reason: string } {
  let score = 0;
  const reasons: string[] = [];

  // Base score from number of requirements (more = harder)
  const requirementCount = phase.requirements.length;
  if (requirementCount === 1) {
    score += 10;
    reasons.push('single requirement');
  } else if (requirementCount === 2) {
    score += 30;
    reasons.push('two requirements');
  } else {
    score += 50;
    reasons.push(`${requirementCount} requirements`);
  }

  // Score based on requirement types
  for (const req of phase.requirements) {
    if (req.type === 'set') {
      const count = req.count || 1;
      const size = req.size || 3;

      // More sets = harder
      if (count === 1) {
        score += 5;
      } else if (count === 2) {
        score += 15;
      } else if (count === 3) {
        score += 25;
      } else {
        score += 35; // 4+ sets
      }

      // Smaller sets = easier
      if (size === 2) {
        // no additional scoring
      } else if (size === 3) {
        score += 3;
      } else if (size === 4) {
        score += 8;
      } else if (size === 5) {
        score += 12;
      } else {
        score += 20; // 6+ cards in a set
      }

      reasons.push(`set(count=${count}, size=${size})`);
    } else if (req.type === 'run') {
      const size = req.size || 3;

      // Bigger runs = harder, but shorter runs easier
      if (size === 3) {
        score += 8;
      } else if (size === 4) {
        score += 12;
      } else if (size === 5) {
        score += 15;
      } else if (size === 6) {
        score += 18;
      } else if (size === 7) {
        score += 22;
      } else if (size === 8) {
        score += 25;
      } else if (size === 9) {
        score += 30;
      } else {
        score += 35; // 10+ cards
      }

      reasons.push(`run(size=${size})`);
    } else if (req.type === 'color') {
      const count = req.count || 7;

      // Color requirements: more cards = harder
      if (count <= 5) {
        score += 12;
      } else if (count <= 6) {
        score += 14;
      } else if (count <= 7) {
        score += 18;
      } else {
        score += 25;
      }

      reasons.push(`color(count=${count})`);
    }
  }

  // Cap at 100
  score = Math.min(score, 100);

  return {
    score,
    reason: reasons.join(', '),
  };
}

/**
 * Get all unique phases from the library, sorted by difficulty
 */
function getAllPhasesSortedByDifficulty(): PhaseWithDifficulty[] {
  // Add difficulty to all phases (no deduplication - keep all variants)
  const phasesWithDifficulty: PhaseWithDifficulty[] = TYPED_PHASES.map((phase) => {
    const { score, reason } = calculateDifficulty(phase);
    return {
      ...phase,
      difficulty: score,
      difficulty_reason: reason,
    };
  });

  // Sort by difficulty (easier first)
  return phasesWithDifficulty.sort((a, b) => a.difficulty - b.difficulty);
}

/**
 * Get the classic set of 10 phases
 */
export function getClassicPhases(): Phase[] {
  // Return the first 10 phases from the data file
  return TYPED_PHASES.slice(0, 10);
}

/**
 * Generate random phases with difficulty ordering from easy to hard
 * @param count - number of phases to generate (default 10)
 * @returns array of phases ordered from easy to hard
 */
export function generateRandomPhases(count: number = 10): Phase[] {
  // Get unique phases by description to avoid duplicates
  const uniquePhasesMap = new Map<string, PhaseWithDifficulty>();
  const allPhases = getAllPhasesSortedByDifficulty();

  for (const phase of allPhases) {
    if (!uniquePhasesMap.has(phase.description)) {
      uniquePhasesMap.set(phase.description, phase);
    }
  }

  const uniquePhases = Array.from(uniquePhasesMap.values());

  if (uniquePhases.length === 0) {
    // Fallback to classic phases if no phases available
    return getClassicPhases();
  }

  // Shuffle the unique phases randomly
  const shuffled = [...uniquePhases].sort(() => Math.random() - 0.5);

  // Take exactly `count` unique phases
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  // Sort by difficulty (easier first)
  return selected.sort((a, b) => a.difficulty - b.difficulty);
}

/**
 * Get all available phases for random selection (with duplicates removed)
 */
export function getAllAvailablePhases(): Phase[] {
  const uniquePhases = new Map<string, Phase>();

  for (const phase of TYPED_PHASES) {
    const key = phase.description;
    if (!uniquePhases.has(key)) {
      uniquePhases.set(key, phase);
    }
  }

  return Array.from(uniquePhases.values());
}
