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

  // Start game
  const startButton = page.locator('button', { hasText: 'Start Game' });
  await startButton.click();

  // Should show game screen with players
  await expect(page.locator('text=Hand 1')).toBeVisible();
});
