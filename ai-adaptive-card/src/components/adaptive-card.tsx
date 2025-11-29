/**
 * Legacy import file for backward compatibility
 *
 * This file maintains backward compatibility for existing imports.
 * The component has been refactored into a modular structure.
 *
 * New imports should use: import AdaptiveCard from '@/components/adaptive-card'
 * Which now points to the modular structure in ./adaptive-card/
 */

export { default } from './adaptive-card/index';
export type { AdaptiveCardProps } from './adaptive-card/types';
