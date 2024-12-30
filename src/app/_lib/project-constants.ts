export const PROJECT_MESSAGES = {
  CREATED: 'Project created successfully',
  UPDATED: 'Project updated successfully',
  DELETED: 'Project deleted successfully',
  NOT_FOUND: 'Project not found',
} as const;

export const PROJECT_STATUSES = [
  'Draft',
  'Active',
  'Completed',
  'Cancelled'
] as const;

export const SERVICE_TYPE = ['SS', 'MS'] as const;

export const RESEARCH_OBJECTIVES = [
  'Entering a New Market',
  'Creating Thought Leadership Publication',
  'Benchmarking with Competitors',
  'Forum Challenge Sign Up',
  'Gathering Marketing Effectiveness',
  'Understanding Customers to Improve Satisfaction',
  'New Product Development',
  'Creating Policy Brief'
] as const;

export const RESEARCH_SERVICES = [
  'In-Depth-Interview',
  'Desk Research',
  'Survey',
  'Mystery Shopping',
  'Product Testing'
] as const;

export const RESEARCH_REGIONS = [
  'Indonesia',
  'Singapore',
  'Malaysia',
  'Thailand',
  'India',
  'China'
] as const;

export const OUTPUT_TYPES = [
  'Slides Report',
  'White Paper Report',
  'Thought Leadership Report',
  'Data Table Report'
] as const;

export const INDUSTRIES = [
  'Semiconductor',
  'Public Policy',
  'Human Resources',
  'Finance',
  'F&B',
  'FinTech',
  'Sustainability',
  'ODS',
  'Government',
  'UI/UX',
  'Healthcare'
] as const;

export const TEAM_ROLES = [
  'Analyst',
  'FL Analyst',
  'Transcriber',
  'Oversee'
] as const;

// Type exports
export type ProjectStatus = typeof PROJECT_STATUSES[number];
export type ServiceType = typeof SERVICE_TYPE[number];
export type ResearchObjective = typeof RESEARCH_OBJECTIVES[number];
export type ResearchService = typeof RESEARCH_SERVICES[number];
export type ResearchRegion = typeof RESEARCH_REGIONS[number];
export type OutputType = typeof OUTPUT_TYPES[number];
export type Industry = typeof INDUSTRIES[number];
export type TeamRole = typeof TEAM_ROLES[number]; 