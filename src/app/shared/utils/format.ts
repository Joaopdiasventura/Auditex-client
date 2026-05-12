export function shortValue(value: string | null | undefined, head = 10, tail = 8): string {
  if (!value) return '-';
  const limit = head + tail + 3;
  if (value.length <= limit) return value;
  return `${value.slice(0, head)}...${value.slice(-tail)}`;
}

export function formatDateTime(value: string | null | undefined, timeStyle: 'short' | 'medium' = 'short'): string {
  if (!value) return '-';
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle,
  }).format(new Date(value));
}

export function formatJson(value: unknown): string {
  return JSON.stringify(value, null, 2);
}
