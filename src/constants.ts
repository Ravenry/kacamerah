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

// Types
export type YearsExperience = typeof MODEL_YEARS_EXPERIENCE[number];
export type FeedbackStatus = typeof MODEL_FEEDBACK_STATUS[number];
export type RelationshipSource = typeof MODEL_RELATIONSHIP_SOURCES[number];
export type DegreeType = typeof MODEL_DEGREE_TYPES[number];
export type FreelanceService = typeof MODEL_FREELANCE_SERVICES[number];

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