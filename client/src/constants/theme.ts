export const COLORS = {
  primary: '#FFC107',
  primaryHover: '#FFA000',
  background: '#F5F5F5',
  google: '#4285F4',
  googleHover: '#3367D6',
  text: {
    primary: '#000000',
    muted: 'hsl(var(--muted-foreground))'
  }
} as const;

export const SIZES = {
  container: {
    maxWidth: {
      default: '95%',
      sm: 'md'
    }
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem'
  }
} as const;
