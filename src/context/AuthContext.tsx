import React, { createContext, useContext, useState } from 'react';
import type { AuthUser, StoredUser } from '../types';

const USERS_STORAGE_KEY = 'dermstore_users_v1';
const SESSION_STORAGE_KEY = 'dermstore_session_v1';

interface AuthResult {
  ok: boolean;
  error?: string;
}

interface GoogleProfileInput {
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  signUpWithEmail: (name: string, email: string, password: string) => AuthResult;
  signInWithEmail: (email: string, password: string) => AuthResult;
  signInWithGoogleProfile: (profile: GoogleProfileInput) => AuthResult;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Deterministic salted hash for client-side localStorage credential storage.
 */
function hashPassword(password: string, normalizedEmail: string): string {
  const salted = `dermstore_salt_v1::${normalizedEmail}::${password}`;
  let h1 = 0xdeadbeef ^ salted.length;
  let h2 = 0x41c6ce57 ^ salted.length;

  for (let i = 0; i < salted.length; i++) {
    const ch = salted.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }

  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return (
    (h2 >>> 0).toString(16).padStart(8, '0') +
    (h1 >>> 0).toString(16).padStart(8, '0')
  );
}

function readStoredUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStoredUsers(users: StoredUser[]): void {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch {
    // Ignore storage quota errors
  }
}

function readStoredSession(): AuthUser | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthUser;
    if (parsed && typeof parsed.email === 'string' && typeof parsed.name === 'string') {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

function writeStoredSession(session: AuthUser | null): void {
  try {
    if (session) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  } catch {
    // Ignore storage quota errors
  }
}

function toPublicUser(stored: StoredUser): AuthUser {
  return {
    id: stored.id,
    name: stored.name,
    email: stored.email,
    provider: stored.provider,
    avatar: stored.avatar,
    createdAt: stored.createdAt,
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(readStoredSession);

  const signUpWithEmail = (
    name: string,
    email: string,
    password: string
  ): AuthResult => {
    const trimmedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (trimmedName.length < 2) {
      return { ok: false, error: 'Please enter your full name (at least 2 characters).' };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return { ok: false, error: 'Please enter a valid email address.' };
    }
    if (password.length < 6) {
      return { ok: false, error: 'Password must be at least 6 characters long.' };
    }

    const users = readStoredUsers();
    const existingIndex = users.findIndex((u) => u.email === normalizedEmail);
    const passwordHash = hashPassword(password, normalizedEmail);

    if (existingIndex !== -1) {
      const existing = users[existingIndex];
      if (existing.passwordHash) {
        return {
          ok: false,
          error: 'An account with this email already exists. Please sign in instead.',
        };
      }
      // Upgrade an existing Google-only account to also support email/password login
      const updatedUser: StoredUser = {
        ...existing,
        name: trimmedName || existing.name,
        passwordHash,
      };
      users[existingIndex] = updatedUser;
      writeStoredUsers(users);
      const sessionUser = toPublicUser(updatedUser);
      setUser(sessionUser);
      writeStoredSession(sessionUser);
      return { ok: true };
    }

    const newUser: StoredUser = {
      id: `usr_${Date.now()}`,
      name: trimmedName,
      email: normalizedEmail,
      provider: 'local',
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    writeStoredUsers([...users, newUser]);
    const sessionUser = toPublicUser(newUser);
    setUser(sessionUser);
    writeStoredSession(sessionUser);
    return { ok: true };
  };

  const signInWithEmail = (email: string, password: string): AuthResult => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) {
      return { ok: false, error: 'Please enter both your email and password.' };
    }

    const users = readStoredUsers();
    const found = users.find((u) => u.email === normalizedEmail);

    if (!found) {
      return {
        ok: false,
        error: 'No account found for this email. Please switch to Create Account first.',
      };
    }

    if (!found.passwordHash) {
      return {
        ok: false,
        error:
          'This email is linked with Google Sign-In. Use "Continue with Google" or set a password in Create Account.',
      };
    }

    const attemptedHash = hashPassword(password, normalizedEmail);
    if (attemptedHash !== found.passwordHash) {
      return { ok: false, error: 'Incorrect password. Please try again.' };
    }

    const sessionUser = toPublicUser(found);
    setUser(sessionUser);
    writeStoredSession(sessionUser);
    return { ok: true };
  };

  const signInWithGoogleProfile = (profile: GoogleProfileInput): AuthResult => {
    const normalizedEmail = profile.email.trim().toLowerCase();
    const trimmedName = profile.name.trim() || normalizedEmail.split('@')[0];

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return { ok: false, error: 'Please provide a valid Google email address.' };
    }

    const users = readStoredUsers();
    const existingIndex = users.findIndex((u) => u.email === normalizedEmail);

    let activeStoredUser: StoredUser;

    if (existingIndex !== -1) {
      activeStoredUser = {
        ...users[existingIndex],
        name: trimmedName || users[existingIndex].name,
        avatar: profile.avatar || users[existingIndex].avatar,
        provider: 'google',
      };
      users[existingIndex] = activeStoredUser;
      writeStoredUsers(users);
    } else {
      activeStoredUser = {
        id: `ggl_${Date.now()}`,
        name: trimmedName,
        email: normalizedEmail,
        provider: 'google',
        avatar: profile.avatar,
        createdAt: new Date().toISOString(),
      };
      writeStoredUsers([...users, activeStoredUser]);
    }

    const sessionUser = toPublicUser(activeStoredUser);
    setUser(sessionUser);
    writeStoredSession(sessionUser);
    return { ok: true };
  };

  const signOut = () => {
    setUser(null);
    writeStoredSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        signUpWithEmail,
        signInWithEmail,
        signInWithGoogleProfile,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
