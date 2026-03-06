/* eslint-disable @typescript-eslint/no-explicit-any */
import { test as baseTest } from '@playwright/test';
import { randomUUID } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const istanbulCLIOutput = join(process.cwd(), '.nyc_output');

export function generateUUID(): string {
  return randomUUID();
}

export const test = baseTest.extend({
  context: async ({ context }, use) => {
    await context.addInitScript(() =>
      window.addEventListener('beforeunload', () =>
        (window as any).collectIstanbulCoverage(JSON.stringify((window as any).__coverage__)),
      ),
    );
    await mkdir(istanbulCLIOutput, { recursive: true });
    await context.exposeFunction('collectIstanbulCoverage', (coverageJSON: string) => {
      if (coverageJSON)
        writeFileSync(join(istanbulCLIOutput, `playwright_coverage_${generateUUID()}.json`), coverageJSON);
    });
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(context);
    for (const page of context.pages()) {
      await page.evaluate(() => (window as any).collectIstanbulCoverage(JSON.stringify((window as any).__coverage__)));
    }
  },
});
