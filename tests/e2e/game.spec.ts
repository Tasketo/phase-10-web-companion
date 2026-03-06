import { expect, Page } from '@playwright/test';
import { test } from './baseFixtures';

// Helper function to navigate to game screen
async function setupGameWithPlayers(page: Page, playerNames: string[]) {
  await page.goto('/');

  // Set player count
  const playerCountInput = page.locator('input').first();
  await playerCountInput.fill(playerNames.length.toString());

  // Click continue button
  const continueButton = page.locator('button', { hasText: 'Continue' });
  await continueButton.click();

  // Enter player names - get inputs after continue was clicked
  const nameInputs = page.locator('input');
  for (let i = 0; i < playerNames.length; i++) {
    const currentInput = nameInputs.nth(i);
    await currentInput.fill(playerNames[i]);
  }

  // Start game - wait for button to be enabled
  const startButton = page.locator('button', { hasText: 'Start Game' });
  await startButton.click();

  // Should show game screen with Hand 1
  await expect(page.locator('h1')).toContainText('Hand 1');
}

test('should display game screen with player entries', async ({ page }) => {
  await setupGameWithPlayers(page, ['Alice', 'Bob', 'Charlie']);

  // Verify heading
  await expect(page.locator('h2')).toContainText('Enter Scores');

  // Verify all players are displayed
  await expect(page.locator('text="Alice"')).toBeVisible();
  await expect(page.locator('text="Bob"')).toBeVisible();
  await expect(page.locator('text="Charlie"')).toBeVisible();

  // Verify phase descriptions are shown (at least one)
  const phases = await page.locator('.player-phase').allTextContents();
  expect(phases.length).toBeGreaterThanOrEqual(1);
  expect(phases[0]).toContain('Phase 1');
});

test('should allow entering penalty scores', async ({ page }) => {
  await setupGameWithPlayers(page, ['Alice', 'Bob']);

  // Enter penalty scores
  const scoreInputs = page.locator('.p-inputnumber input');
  await scoreInputs.nth(0).fill('25');
  await scoreInputs.nth(1).fill('15');

  // Verify values are entered
  expect(await scoreInputs.nth(0).inputValue()).toBe('25');
  expect(await scoreInputs.nth(1).inputValue()).toBe('15');
});

test('should allow marking players as completed phase', async ({ page }) => {
  await setupGameWithPlayers(page, ['Alice', 'Bob', 'Charlie']);

  // Click the checkbox input directly (not the box)
  const checkboxInputs = page.locator('.p-checkbox-input');
  await checkboxInputs.nth(0).click(); // Alice completed

  // Verify checkbox is checked
  const firstCheckbox = page.locator('.p-checkbox-input').nth(0);
  await expect(firstCheckbox).toBeChecked();
});

test('should submit hand with scores and phase completions', async ({ page }) => {
  await setupGameWithPlayers(page, ['Alice', 'Bob']);

  // Enter scores
  const scoreInputs = page.locator('.p-inputnumber input');
  await scoreInputs.nth(0).fill('30');
  await scoreInputs.nth(1).fill('20');

  // Mark Alice as completed
  const checkboxes = page.locator('.p-checkbox-input');
  await checkboxes.nth(0).click();

  // Submit
  const endButton = page.locator('button', { hasText: 'End Hand' });
  await endButton.click();

  // Should switch to leaderboard
  await expect(page.locator('h2')).toContainText('Leaderboard');
});

test('should display leaderboard with correct scores', async ({ page }) => {
  await setupGameWithPlayers(page, ['Alice', 'Bob', 'Charlie']);

  // Enter various scores (Alice: 10, Bob: 25, Charlie: 15)
  const scoreInputs = page.locator('.p-inputnumber input');
  await scoreInputs.nth(0).fill('10');
  await scoreInputs.nth(1).fill('25');
  await scoreInputs.nth(2).fill('15');

  // Submit
  const endButton = page.locator('button', { hasText: 'End Hand' });
  await endButton.click();

  // Verify leaderboard is displayed
  await expect(page.locator('h2')).toContainText('Leaderboard');

  // Players should be sorted by score (lowest first)
  const leaderboardRows = page.locator('.leaderboard-row');
  expect(await leaderboardRows.count()).toBe(3);

  // Verify ranking and scores
  const playerNames = await leaderboardRows.locator('.name').allTextContents();
  const scores = await leaderboardRows.locator('.score').allTextContents();

  expect(playerNames[0]).toContain('Alice'); // 10 pts (lowest)
  expect(scores[0]).toContain('10 pts');

  expect(playerNames[1]).toContain('Charlie'); // 15 pts
  expect(scores[1]).toContain('15 pts');

  expect(playerNames[2]).toContain('Bob'); // 25 pts (highest)
  expect(scores[2]).toContain('25 pts');
});

test('should display phase progression in leaderboard', async ({ page }) => {
  await setupGameWithPlayers(page, ['Alice', 'Bob']);

  // Alice completes phase, Bob doesn't
  const checkboxes = page.locator('.p-checkbox-input');
  await checkboxes.nth(0).click();

  const scoreInputs = page.locator('.p-inputnumber input');
  await scoreInputs.nth(0).fill('10');
  await scoreInputs.nth(1).fill('20');

  // Submit
  const endButton = page.locator('button', { hasText: 'End Hand' });
  await endButton.click();

  // Check phase descriptions in leaderboard
  const phases = await page.locator('.phase').allTextContents();
  expect(phases.length).toBe(2);
  // Alice progressed to phase 2, Bob stayed at phase 1
  const minPhase = Math.min(...phases.map((p) => parseInt(p.match(/\d+/)?.[0] || '0')));
  const maxPhase = Math.max(...phases.map((p) => parseInt(p.match(/\d+/)?.[0] || '0')));
  expect(minPhase).toBe(1);
  expect(maxPhase).toBe(2);
});

test('should allow playing next hand', async ({ page }) => {
  await setupGameWithPlayers(page, ['Alice', 'Bob']);

  // Complete first hand
  const scoreInputs = page.locator('.p-inputnumber input');
  await scoreInputs.nth(0).fill('10');
  await scoreInputs.nth(1).fill('20');

  const endButton = page.locator('button', { hasText: 'End Hand' });
  await endButton.click();

  // Click play next hand
  const nextHandButton = page.locator('button', { hasText: 'Play Next Hand' });
  await nextHandButton.click();

  // Should return to score entry for hand 2
  await expect(page.locator('h1')).toContainText('Hand 2');
  await expect(page.locator('h2')).toContainText('Enter Scores');

  // Scores should be reset
  const newScoreInputs = page.locator('.p-inputnumber input');
  expect(await newScoreInputs.nth(0).inputValue()).toBe('0');
});

test('should persist scores across multiple hands', async ({ page }) => {
  await setupGameWithPlayers(page, ['Alice', 'Bob']);

  // Hand 1: Alice 15, Bob 20
  let scoreInputs = page.locator('.p-inputnumber input');
  await scoreInputs.nth(0).fill('15');
  await scoreInputs.nth(1).fill('20');

  let endButton = page.locator('button', { hasText: 'End Hand' });
  await endButton.click();

  // Check leaderboard shows correct totals
  let scores = await page.locator('.leaderboard-row .score').allTextContents();
  expect(scores[0]).toContain('15 pts'); // Alice min
  expect(scores[1]).toContain('20 pts'); // Bob max

  // Play next hand
  const nextHandButton = page.locator('button', { hasText: 'Play Next Hand' });
  await nextHandButton.click();

  // Hand 2: Alice 5, Bob 10
  scoreInputs = page.locator('.p-inputnumber input');
  await scoreInputs.nth(0).fill('5');
  await scoreInputs.nth(1).fill('10');

  endButton = page.locator('button', { hasText: 'End Hand' });
  await endButton.click();

  // Check leaderboard shows cumulative scores
  scores = await page.locator('.leaderboard-row .score').allTextContents();
  expect(scores[0]).toContain('20 pts'); // Alice: 15 + 5
  expect(scores[1]).toContain('30 pts'); // Bob: 20 + 10
});

test('should reset game and return to setup screen', async ({ page }) => {
  await setupGameWithPlayers(page, ['Alice', 'Bob']);

  // Click reset button
  const resetButton = page.locator('button', { hasText: 'Reset Game' });
  await resetButton.click();

  // Should return to setup screen
  await expect(page.locator('text=Phase 10 Web Companion')).toBeVisible();
  await expect(page.locator('text=How many players?')).toBeVisible();
});

test('should handle edge case with maximum penalty score', async ({ page }) => {
  await setupGameWithPlayers(page, ['Player1', 'Player2']);

  // Try to enter high score
  const scoreInput = page.locator('.p-inputnumber input').first();
  await scoreInput.fill('999');

  expect(await scoreInput.inputValue()).toBe('999');

  // Submit
  const endButton = page.locator('button', { hasText: 'End Hand' });
  await endButton.click();

  // Verify score is recorded in leaderboard
  const scoreDisplay = await page.locator('.leaderboard-row .score').last().textContent();
  expect(scoreDisplay).toContain('999 pts');
});

test('should handle three player game with mixed completions', async ({ page }) => {
  await setupGameWithPlayers(page, ['Alice', 'Bob', 'Charlie']);

  // Enter various scores
  const scoreInputs = page.locator('.p-inputnumber input');
  await scoreInputs.nth(0).fill('10'); // Alice
  await scoreInputs.nth(1).fill('0'); // Bob
  await scoreInputs.nth(2).fill('30'); // Charlie

  // Mark some as completed
  const checkboxes = page.locator('.p-checkbox-input');
  await checkboxes.nth(0).click(); // Alice completed
  await checkboxes.nth(2).click(); // Charlie completed

  // Submit
  const endButton = page.locator('button', { hasText: 'End Hand' });
  await endButton.click();

  // Verify leaderboard
  const leaderboardRows = page.locator('.leaderboard-row');
  expect(await leaderboardRows.count()).toBe(3);

  // Check order (lowest to highest score): Bob 0, Alice 10, Charlie 30
  const names = await leaderboardRows.locator('.name').allTextContents();
  expect(names[0]).toContain('Bob');
  expect(names[1]).toContain('Alice');
  expect(names[2]).toContain('Charlie');

  // Verify phases appear in leaderboard
  const phases = await leaderboardRows.locator('.phase').allTextContents();
  expect(phases.length).toBe(3);
});
