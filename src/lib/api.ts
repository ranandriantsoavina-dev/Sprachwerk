export class ApiError extends Error {
  status: number;
  code?: string;
  constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

// Held strictly in JS memory (never localStorage/sessionStorage) so requests
// inside strict third-party iframe sandboxes stay authenticated alongside HttpOnly cookies.
let inMemorySessionToken: string | null = null;

export function setInMemorySessionToken(token: string | null) {
  inMemorySessionToken = token;
}

export function getInMemorySessionToken(): string | null {
  return inMemorySessionToken;
}

export async function apiRequest<T>(
  path: string,
  options: {
    method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
    body?: unknown;
  } = {}
): Promise<T> {
  const method = options.method || 'GET';
  const headers: Record<string, string> = {
    'X-Requested-With': 'XMLHttpRequest',
  };
  if (inMemorySessionToken) {
    headers['Authorization'] = `Bearer ${inMemorySessionToken}`;
  }
  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(path, {
    method,
    headers,
    credentials: 'include',
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const text = await response.text();
  let data: Record<string, unknown> = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text };
    }
  }

  if (!response.ok) {
    if (response.status === 401 && !path.startsWith('/api/auth/login')) {
      inMemorySessionToken = null;
    }
    throw new ApiError(
      String(data.error || `Request failed (${response.status})`),
      response.status,
      typeof data.code === 'string' ? data.code : undefined
    );
  }

  if (typeof data.sessionToken === 'string' && data.sessionToken) {
    inMemorySessionToken = data.sessionToken;
  }
  if (path === '/api/auth/logout' || (path === '/api/user/account' && method === 'DELETE')) {
    inMemorySessionToken = null;
  }

  return data as T;
}
