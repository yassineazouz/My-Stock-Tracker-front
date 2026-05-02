import { expect, test } from '@playwright/test';

const emptyPortfolio = {
  id: 1,
  owner: 'yassine',
  totalValue: 0,
  walletValue: 10000,
  initialInvestment: 10000,
  stocks: [],
  alerts: [],
  activeAlerts: 0,
  performancePercent: -100,
};

test('creates, checks, and deletes a price alert', async ({ page }) => {
  let alerts = [];

  await page.route('**/api/auth/login', async (route) => {
    await route.fulfill({
      json: { username: 'yassine', displayName: 'Yassine', email: 'yassine@example.com', token: 'test-token' },
    });
  });

  await page.route('**/api/user/yassine', async (route) => {
    await route.fulfill({ json: { ...emptyPortfolio, activeAlerts: alerts.length } });
  });

  await page.route('**/api/alerts/yassine', async (route) => {
    const request = route.request();

    if (request.method() === 'GET') {
      await route.fulfill({ json: alerts });
      return;
    }

    const body = JSON.parse(request.postData() ?? '{}');
    const alert = {
      id: 1,
      symbol: body.symbol,
      companyName: body.companyName,
      targetPrice: body.targetPrice,
      currentPrice: 175,
      direction: body.direction,
      active: true,
      createdAt: '2026-05-01T12:00:00Z',
    };
    alerts = [alert];
    await route.fulfill({ json: alert });
  });

  await page.route('**/api/alerts/yassine/1', async (route) => {
    alerts = [];
    await route.fulfill({ status: 204 });
  });

  await page.route('**/api/alerts/check', async (route) => {
    alerts = alerts.map((alert) => ({
      ...alert,
      active: false,
      currentPrice: 181.5,
      triggeredPrice: 181.5,
      triggeredAt: '2026-05-01T13:30:00Z',
      lastCheckedAt: '2026-05-01T13:30:00Z',
    }));
    await route.fulfill({ json: alerts });
  });

  await page.goto('/');
  await page.getByLabel('Username').fill('yassine');
  await page.getByLabel('Password').fill('password123');
  await page.locator('form').getByRole('button', { name: 'Login' }).click();
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

  await page.goto('/alerts');

  await expect(page.getByText('No alerts yet')).toBeVisible();

  await page.getByRole('button', { name: 'New Alert' }).click();
  await page.getByLabel('Symbol').fill('AAPL');
  await page.getByLabel('Company').fill('Apple Inc.');
  await page.getByLabel('Target price').fill('180');
  await page.getByRole('button', { name: 'Save alert' }).click();

  await expect(page.getByText('AAPL')).toBeVisible();
  await expect(page.getByText('Active')).toBeVisible();

  await page.getByRole('button', { name: 'Check now' }).click();
  await expect(page.getByText('1 alert was triggered.')).toBeVisible();
  await expect(page.getByText('Triggered', { exact: true })).toBeVisible();
  await expect(page.getByText(/Triggered at \$181\.50/)).toBeVisible();

  await page.getByRole('button', { name: 'Delete AAPL alert' }).click();
  await expect(page.getByText('No alerts yet')).toBeVisible();
});
