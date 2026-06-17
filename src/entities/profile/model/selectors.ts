import { differenceInWeeks, differenceInMonths, differenceInDays, parseISO } from 'date-fns';
import type { Profile, PregnancyProfile, ChildProfile } from './types';

export function getPregnancyWeek(profile: PregnancyProfile): number {
  const fur = parseISO(profile.fur);
  const weeks = differenceInWeeks(new Date(), fur);
  return Math.min(Math.max(weeks, 1), 42);
}

export function getTrimester(profile: PregnancyProfile): 1 | 2 | 3 {
  const week = getPregnancyWeek(profile);
  if (week <= 13) return 1;
  if (week <= 26) return 2;
  return 3;
}

export function getDaysUntilFPP(profile: PregnancyProfile): number {
  const fpp = parseISO(profile.fpp);
  return Math.max(differenceInDays(fpp, new Date()), 0);
}

export function getAgeInMonths(profile: ChildProfile): number {
  return differenceInMonths(new Date(), parseISO(profile.birthDate));
}

export function getProfileKeyData(profile: Profile): string {
  if (profile.type === 'pregnancy') {
    const week = getPregnancyWeek(profile);
    return `Semana ${week}`;
  }
  const months = getAgeInMonths(profile);
  if (months < 24) return `${months} meses`;
  const years = Math.floor(months / 12);
  return `${years} año${years !== 1 ? 's' : ''}`;
}
