import { expect } from '@playwright/test';
import { test } from './baseFixtures';

test('should display the setup screen on initial load', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Phase 10 Web Companion');
});

test('should provide language switching functionality', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('button', { hasText: 'English' })).toBeVisible();
  await expect(page.locator('button', { hasText: 'Deutsch' })).toBeVisible();

  // Switch to German and verify text changes
  await page.locator('button', { hasText: 'Deutsch' }).click();
  await expect(page.locator('.subtitle')).toContainText('Verfolge Spielstände in Form von Phasen und Punkten');

  // Switch back to English and verify text changes
  await page.locator('button', { hasText: 'English' }).click();
  await expect(page.locator('.subtitle')).toContainText('Track your game scores and phases');
});

test('should allow setting player count and entering names', async ({ page }) => {
  await page.goto('/');

  // Set player count to 3
  const playerCountInput = page.locator('input[type="text"]').first();
  await playerCountInput.fill('3');

  // Click continue button
  const continueButton = page.locator('button', { hasText: 'Continue' });
  await continueButton.click();

  // Enter player names
  const nameInputs = page.locator('input');
  await nameInputs.nth(0).fill('Alice');
  await nameInputs.nth(1).fill('Bob');
  await nameInputs.nth(2).fill('Charlie');

  // Click continue to go to phase selection
  const continueButton2 = page.locator('button', { hasText: 'Continue' });
  await continueButton2.click();

  // Verify phase selection options are visible
  await expect(page.locator('button', { hasText: 'Classic Phases' })).toBeVisible();
  await expect(page.locator('button', { hasText: 'Random Phases' })).toBeVisible();

  // Select classic phases
  const classicButton = page.locator('button', { hasText: 'Classic Phases' });
  await classicButton.click();

  // Start game
  const startButton = page.locator('button', { hasText: 'Start Game' });
  await startButton.click();

  // Should show game screen with players
  await expect(page.locator('text=Hand 1')).toBeVisible();
});

test('should allow selecting random phases and regenerating them', async ({ page }) => {
  await page.goto('/');

  // Set player count to 2
  const playerCountInput = page.locator('input').first();
  await playerCountInput.fill('2');

  // Click continue button
  const continueButton = page.locator('button', { hasText: 'Continue' });
  await continueButton.click();

  // Enter player names
  const nameInputs = page.locator('input');
  await nameInputs.nth(0).fill('Alice');
  await nameInputs.nth(1).fill('Bob');

  // Click continue to go to phase selection
  const continueButton2 = page.locator('button', { hasText: 'Continue' });
  await continueButton2.click();

  // Select random phases
  const randomButton = page.locator('button', { hasText: 'Random Phases' });
  await randomButton.click();

  // Verify phase display screen shows phases
  await expect(page.locator('text=Random Phase Set')).toBeVisible();

  // Verify regenerate button is visible
  const regenerateButton = page.locator('button', { hasText: 'Regenerate Phases' });
  await expect(regenerateButton).toBeVisible();

  // Click regenerate button to generate new phases
  await regenerateButton.click();

  // Verify new phases are displayed (might be different or same by chance, but should still have 10)
  const newPhases = await page.locator('.phase-item').allTextContents();
  expect(newPhases.length).toBeGreaterThan(0);
});

test('should generate exactly 10 random phases without duplicates', async ({ page }) => {
  await page.goto('/');

  // Set player count to 2
  const playerCountInput = page.locator('input').first();
  await playerCountInput.fill('2');

  // Click continue button
  const continueButton = page.locator('button', { hasText: 'Continue' });
  await continueButton.click();

  // Enter player names
  const nameInputs = page.locator('input');
  await nameInputs.nth(0).fill('Alice');
  await nameInputs.nth(1).fill('Bob');

  // Click continue to go to phase selection
  const continueButton2 = page.locator('button', { hasText: 'Continue' });
  await continueButton2.click();

  // Select random phases
  const randomButton = page.locator('button', { hasText: 'Random Phases' });
  await randomButton.click();

  // Verify exactly 10 phases are displayed
  await expect(page.locator('.phase-item')).toHaveCount(10);

  // Get phase text and verify no duplicates
  let phaseTexts = await page.locator('.phase-item').allTextContents();
  let uniquePhases = new Set(phaseTexts);
  expect(uniquePhases.size).toBe(10);

  // Regenerate and verify still 10 unique phases
  const regenerateButton = page.locator('button', { hasText: 'Regenerate Phases' });
  await regenerateButton.click();
  await expect(page.locator('.phase-item')).toHaveCount(10);

  phaseTexts = await page.locator('.phase-item').allTextContents();
  uniquePhases = new Set(phaseTexts);
  expect(uniquePhases.size).toBe(10);

  // Regenerate again and verify still 10 unique phases
  await regenerateButton.click();
  await expect(page.locator('.phase-item')).toHaveCount(10);

  phaseTexts = await page.locator('.phase-item').allTextContents();
  uniquePhases = new Set(phaseTexts);
  expect(uniquePhases.size).toBe(10);
});

test('should show classic phase set when classic option is selected', async ({ page }) => {
  await page.goto('/');

  // Set player count to 2
  const playerCountInput = page.locator('input[type="text"]').first();
  await playerCountInput.fill('2');

  // Click continue button
  const continueButton = page.locator('button', { hasText: 'Continue' });
  await continueButton.click();

  // Enter player names
  const nameInputs = page.locator('input');
  await nameInputs.nth(0).fill('Alice');
  await nameInputs.nth(1).fill('Bob');

  // Click continue to go to phase selection
  const continueButton2 = page.locator('button', { hasText: 'Continue' });
  await continueButton2.click();

  // Select classic phases
  const classicButton = page.locator('button', { hasText: 'Classic Phases' });
  await classicButton.click();

  // Verify phase display screen shows "Classic Phase Set"
  await expect(page.locator('text=Classic Phase Set')).toBeVisible();

  // Verify regenerate button is NOT visible (only for random phases)
  const regenerateButton = page.locator('button', { hasText: 'Regenerate Phases' });
  await expect(regenerateButton).not.toBeVisible();

  // Verify phases are displayed
  await expect(page.locator('.phase-item')).toHaveCount(10);
  await expect(page.locator('.phase-item').first()).toContainText('Phase 1: 2 sets of 3');
});
