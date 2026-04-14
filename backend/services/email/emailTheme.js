// emailTheme.js (concept)
const EMAIL_THEME = {
  background: '#f6f7fb',          // subtle, not pure white
  bodyText: '#000000',
  mutedText: 'rgba(0, 0, 0, 0.65)',

  cardBg: '#ffffff',
  primaryActionBg: '#ffcc00',     // from --action-bg-color
  primaryActionText: '#000000',
  accentColor: '#007bff',        // from --accent-color

  borderRadiusSm: 6,
  borderRadiusMd: 14,
  borderRadiusLg: 22,

  fontPrimary:
    '"Nunito", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
  fontDisplay: '"Saira", system-ui, sans-serif',

  spacingXs: 4,
  spacingSm: 8,
  spacingMd: 16,
  spacingLg: 32,
  spacingXl: 48,
};

module.exports = EMAIL_THEME;
