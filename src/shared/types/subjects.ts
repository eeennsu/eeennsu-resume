export type ProfileIconType = 'email' | 'github' | 'velog' | 'self-blog';

export interface IActivityDone {
  subject: string;
  details?: Array<string | { problem: string; solution: string }>;
}

export interface IActivity {
  id: string;
  startDate?: string;
  endDate?: string;
  title: string;
  doneList: IActivityDone[];
}

export interface ICompanyExperience {
  companyName: string;
  startDate: string;
  endDate?: string;
  activities: IActivity[];
  note?: {
    reasonForLeaving?: string;
    description?: string;
  };
}

export interface IActivityVelogMapping {
  activityId: string;
  techTags: string[];
  featuredVelogSlugs?: string[];
  excludeVelogSlugs?: string[];
}

export interface IPortfolio {
  name: string;
  descriptionList: string[];
  githubLink: string;
  siteLink?: string;
  tools: string[];
}

export interface ICertification {
  title: string;
  detail?: string;
}

export interface IEducation {
  startDate: string;
  endDate: string;
  schoolName: string;
  department: string;
  activities: string[];
}

export interface IProfile {
  name: string;
  birthDay: string;
  descriptions: Array<{ type: ProfileIconType; value: string }>;
}

export interface ISkill {
  category: string;
  items: string[];
}
