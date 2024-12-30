// Constants for Model/Schema Validation
export const MODEL_YEARS_EXPERIENCE = [
  '0-3 Years',
  '3-5 Years',
  '6-10 Years',
  'Unknown'
] as const;

export const MODEL_FEEDBACK_STATUS = [
  'Good',
  'Not Good',
  'Cannot Tell Yet',
  'Somewhat',
  'Unknown'
] as const;

export const MODEL_RELATIONSHIP_SOURCES = [
  'Ex Ravenry',
  'Ravenry Team Suggestion',
  'Ravenry App',
  'External Connection',
  'Unknown',
  'Freelancer Event'
] as const;

export const MODEL_DEGREE_TYPES = [
  'Bachelor',
  'Master',
  'PhD',
  'Diploma',
  'Certificate',
  'Unknown'
] as const;

export const MODEL_FREELANCE_SERVICES = [
  'Project Manager',
  'Researcher / Analyst',
  'Consultant',
  'Writer / Editor',
  'Designer',
  'Developer'
] as const;

// Constants for Filters (including 'Any' option)
export const FILTER_YEARS_EXPERIENCE = [
  'Any',
  ...MODEL_YEARS_EXPERIENCE
] as const;

export const FILTER_FEEDBACK_STATUS = [
  'Any',
  ...MODEL_FEEDBACK_STATUS
] as const;

export const FILTER_RELATIONSHIP_SOURCES = [
  'Any',
  ...MODEL_RELATIONSHIP_SOURCES
] as const;

export const FILTER_DEGREE_TYPES = [
  'Any',
  ...MODEL_DEGREE_TYPES
] as const;

export const FILTER_FREELANCE_SERVICES = [
  'Any',
  ...MODEL_FREELANCE_SERVICES
] as const;

// Other constants
export const FREELANCER_MESSAGES = {
  CREATED: 'Freelancer added successfully.',
  UPDATED: 'Freelancer updated successfully',
  DELETED: 'Freelancer deleted successfully',
  NOT_FOUND: 'Freelancer not found',
  DUPLICATE_LINKEDIN: 'Freelancer with this LinkedIn profile already exists.',
  INVALID_ID: 'Invalid freelancer ID',
} as const;

export const FREELANCE_LIMITS = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100
} as const;

export const FREELANCER_ROLES = {
  TALENT_MANAGER: 'talent_manager',
  PROJECT_MANAGER: 'project_manager'
} as const;

export type FreelancerRole = typeof FREELANCER_ROLES[keyof typeof FREELANCER_ROLES];
export const DEFAULT_PAGE_SIZE = 10; 