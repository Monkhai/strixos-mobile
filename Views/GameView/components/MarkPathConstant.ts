import { Skia } from '@shopify/react-native-skia';

export const SMALL_SIZE = 50;
// Use consistent ratios for both shapes
export const SHAPE_RATIO = 0.5; // Shape will take up 50% of the container
export const PADDING = (SMALL_SIZE * (1 - SHAPE_RATIO)) / 2; // Equal padding on all sides

export const X_START = PADDING;
export const X_END = SMALL_SIZE - PADDING;
export const X_LENGTH = X_END - X_START;

const center = SMALL_SIZE / 2;
const radius = X_LENGTH / 2; // Same size as X diagonal
const circleStart = center - radius;
const circleEnd = center + radius;

export const smallCircle = Skia.Path.MakeFromSVGString(
  `M ${circleStart} ${center} ` +
    // Top curve
    `C ${circleStart} ${center - radius / 2} ${center - radius / 2} ${center - radius} ${center} ${center - radius} ` +
    // Right curve
    `C ${center + radius / 2} ${center - radius} ${circleEnd} ${center - radius / 2} ${circleEnd} ${center} ` +
    // Bottom curve
    `C ${circleEnd} ${center + radius / 2} ${center + radius / 2} ${center + radius} ${center} ${center + radius} ` +
    // Left curve
    `C ${center - radius / 2} ${center + radius} ${circleStart} ${center + radius / 2} ${circleStart} ${center}`
)!;

export const smallXPath = Skia.Path.MakeFromSVGString(
  `M ${X_START} ${X_START} ` +
    // Draw first diagonal to bottom-right
    `C ${X_START} ${X_START} ${X_END} ${X_END} ${X_END} ${X_END} ` +
    // Draw back along same diagonal to center
    `C ${X_END} ${X_END} ${center} ${center} ${center} ${center} ` +
    // Draw from center to top-right
    `C ${center} ${center} ${X_END} ${X_START} ${X_END} ${X_START} ` +
    // Draw the second diagonal to bottom-left
    `C ${X_END} ${X_START} ${X_START} ${X_END} ${X_START} ${X_END}`
)!;

export type Mark = '-' | 'x' | 'o';
