const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendente',
  PROCESSING: 'Em processamento',
  MINED: 'Minerada',
  FAILED: 'Falhou',
  VALID: 'Válido',
  VALIDATED: 'Validado',
  INVALID: 'Inválido',
  COMPLETED: 'Concluído',
  APPROVED: 'Aprovado',
  REJECTED: 'Rejeitado',
  PARTIAL: 'Parcial',
  SUCCESS: 'Sucesso',
  ERROR: 'Erro',
  WARNING: 'Atenção',
  ATTENTION: 'Atenção',
  EXPORTED: 'Exportado',
};

export function statusLabel(status: string | null | undefined): string {
  if (!status) return STATUS_LABELS['PENDING'];
  const normalized = status.toUpperCase();
  return STATUS_LABELS[normalized] ?? 'Status desconhecido';
}
