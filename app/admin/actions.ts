'use server';

import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import {
  checkPassword,
  createSessionCookieValue,
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS
} from '@/lib/admin-auth';
import {setMessageStatus, type MessageStatus} from '@/lib/messages';
import {saveSettings} from '@/lib/site-config';
import {SETTING_KEYS} from '@/lib/site-config-shared';

export async function login(formData: FormData): Promise<void> {
  const password = String(formData.get('password') ?? '');

  if (!checkPassword(password)) {
    redirect('/admin/login?error=1');
  }

  const jar = await cookies();
  jar.set(SESSION_COOKIE, createSessionCookieValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS
  });

  redirect('/admin');
}

export async function logout(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  redirect('/admin/login');
}

export async function markMessage(id: number, status: MessageStatus): Promise<void> {
  await setMessageStatus(id, status);
  revalidatePath('/admin');
}

export async function updateSettings(formData: FormData): Promise<void> {
  const entries: Record<string, string> = {};
  for (const key of SETTING_KEYS) {
    const value = formData.get(key);
    if (typeof value === 'string') entries[key] = value;
  }

  await saveSettings(entries);
  revalidatePath('/admin/settings');
}
