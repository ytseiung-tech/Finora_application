export interface Passbook {
  id: string;
  name: string;
  color: string;
  photoUri?: string;      // Optional photo URI for passbook
  balance: number;
  isActive: boolean;
  ratio?: number; // Allocation ratio (percentage)
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePassbookRequest {
  name: string;
  color: string;
  photoUri?: string;
}

export interface UpdatePassbookRequest {
  id: string;
  name?: string;
  color?: string;
  photoUri?: string;
  isActive?: boolean;
  ratio?: number;
}

// Morandi color palette matching iOS/Android with transparent option
export const MORANDI_COLORS = {
  transparent: 'transparent',
  primaryBlue: '#7B68EE',
  sageGreen: '#87A96B',
  dustyPurple: '#9A8194',
  warmYellow: '#E6D690',
  blushPink: '#D4A5A5',
  softGray: '#B8B8B8',
  deepBlue: '#5A4FCF',
  mutedGreen: '#6B7B5A',
} as const;

export type MorandiColor = keyof typeof MORANDI_COLORS;
