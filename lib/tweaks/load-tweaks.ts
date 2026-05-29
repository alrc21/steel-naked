import 'server-only';
import { promises as fs } from 'fs';
import path from 'path';
import type { TweaksData } from './types';

export async function loadTweaks(): Promise<TweaksData> {
  try {
    const filePath = path.join(process.cwd(), 'content', 'tweaks.json');
    const raw = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(raw) as TweaksData;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}
