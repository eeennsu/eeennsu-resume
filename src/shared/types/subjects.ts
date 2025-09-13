export type ProfileIconType = 'email' | 'github' | 'velog' | 'self-blog';

export interface ICompanyExperience {
  companyName: string;
  startDate: string;
  endDate?: string;
  activities: Array<{
    startDate: string;
    endDate?: string;
    estimatedDuration?: number;
    title: string;
    doneList: Array<{
      subject: string;
      details?: Array<string | { problem: string; solution: string }>;
    }>;
  }>;
  note?: {
    reasonForLeaving?: string;
    description?: string;
  };
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
