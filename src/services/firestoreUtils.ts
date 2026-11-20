// ==================== UTILS ====================

export function getStartOfDay(date: number): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function formatDate(date: number, locale = 'es-ES'): string {
  return new Date(date).toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatTime(date: number): string {
  return new Date(date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

export function formatDateTime(date: number): string {
  return `${formatDate(date)} ${formatTime(date)}`;
}