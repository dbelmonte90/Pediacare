export type MilestoneCategory = 'motor' | 'cognitive' | 'language' | 'social' | 'educational';

export interface Milestone {
  id: string;
  category: MilestoneCategory;
  title: string;
  description: string;
  ageGroup: string;
  ageMonthsMin: number;
  ageMonthsMax: number;  // child is overdue if older than this without achieving it
}
