/**
 * Travel-themed typography system
 * Inspired by airport terminals, passport documents, and vintage travel
 */

export const Typography = {
  // Airport terminal/departure board style - monospace
  terminal: {
    fontFamily: 'Courier New', // Monospace for digital board feel
    letterSpacing: 1.2,
  },
  
  // Passport/official document style
  document: {
    fontFamily: 'System', // Clean, official font
    letterSpacing: 0.5,
  },
  
  // Vintage travel poster style
  vintage: {
    fontFamily: 'System',
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
  },
  
  // Font sizes
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    display: 48,
  },
  
  // Font weights
  weights: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

// Pre-defined text styles for common use cases
export const TextStyles = {
  // Headers
  terminalHeader: {
    ...Typography.terminal,
    fontSize: Typography.sizes.xxxl,
    fontWeight: Typography.weights.bold,
    letterSpacing: 2,
  },
  
  documentTitle: {
    ...Typography.document,
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.semibold,
  },
  
  // Scores and numbers (airport board style)
  scoreDisplay: {
    ...Typography.terminal,
    fontSize: Typography.sizes.display,
    fontWeight: Typography.weights.bold,
    letterSpacing: 3,
  },
  
  terminalNumber: {
    ...Typography.terminal,
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.medium,
    letterSpacing: 2,
  },
  
  // Body text
  documentBody: {
    ...Typography.document,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.regular,
    lineHeight: 24,
  },
  
  // Labels and captions
  passportStamp: {
    ...Typography.vintage,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
  },
  
  // Buttons
  buttonText: {
    ...Typography.document,
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    letterSpacing: 1,
  },
};