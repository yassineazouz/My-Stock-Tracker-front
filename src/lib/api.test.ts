import { afterEach, describe, expect, it, vi } from 'vitest';
import { checkAlertsNow, createAlert, deleteAlert, fetchAlerts, login, signup } from './api';

function mockFetch(response: Partial<Response> & { json?: () => Promise<unknown> }) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));
}

describe('alert api', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    window.localStorage.clear();
  });

  function storeTestUser() {
    window.localStorage.setItem(
      'stock-tracker-user',
      JSON.stringify({
        username: 'yassine',
        displayName: 'Yassine',
        email: 'yassine@example.com',
        token: 'test-token',
      })
    );
  }

  it('fetches alerts', async () => {
    storeTestUser();
    mockFetch({
      ok: true,
      json: async () => [{ id: 1, symbol: 'AAPL' }],
    });

    await expect(fetchAlerts()).resolves.toEqual([{ id: 1, symbol: 'AAPL' }]);
    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/alerts/yassine', {
      headers: { Authorization: 'Bearer test-token' },
    });
  });

  it('creates alerts', async () => {
    storeTestUser();
    mockFetch({
      ok: true,
      json: async () => ({ id: 2, symbol: 'MSFT' }),
    });

    await expect(
      createAlert({ symbol: 'MSFT', targetPrice: 300, direction: 'ABOVE' })
    ).resolves.toEqual({ id: 2, symbol: 'MSFT' });

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/alerts/yassine',
      expect.objectContaining({
        method: 'POST',
        headers: {
          Authorization: 'Bearer test-token',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbol: 'MSFT', targetPrice: 300, direction: 'ABOVE' }),
      })
    );
  });

  it('deletes alerts', async () => {
    storeTestUser();
    mockFetch({ ok: true });

    await expect(deleteAlert(7)).resolves.toBeUndefined();
    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/alerts/yassine/7', {
      method: 'DELETE',
      headers: { Authorization: 'Bearer test-token' },
    });
  });

  it('checks alerts now', async () => {
    storeTestUser();
    mockFetch({
      ok: true,
      json: async () => [{ id: 3, active: false }],
    });

    await expect(checkAlertsNow()).resolves.toEqual([{ id: 3, active: false }]);
    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/alerts/check', {
      method: 'POST',
      headers: { Authorization: 'Bearer test-token' },
    });
  });

  it('throws on failed response', async () => {
    storeTestUser();
    mockFetch({ ok: false, status: 500 });

    await expect(fetchAlerts()).rejects.toThrow('Failed to fetch alerts (500)');
  });

  it('logs in', async () => {
    mockFetch({
      ok: true,
      json: async () => ({ username: 'yassine', displayName: 'Yassine', email: 'yassine@example.com', token: 'token' }),
    });

    await expect(login({ username: 'yassine', password: 'password123' })).resolves.toEqual({
      username: 'yassine',
      displayName: 'Yassine',
      email: 'yassine@example.com',
      token: 'token',
    });
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/auth/login',
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('signs up', async () => {
    mockFetch({
      ok: true,
      json: async () => ({ username: 'new_user', displayName: 'New User', email: 'new@example.com', token: 'new-token' }),
    });

    await expect(
      signup({
        username: 'new_user',
        displayName: 'New User',
        email: 'new@example.com',
        password: 'password123',
      })
    ).resolves.toEqual({ username: 'new_user', displayName: 'New User', email: 'new@example.com', token: 'new-token' });
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/auth/signup',
      expect.objectContaining({ method: 'POST' })
    );
  });
});
