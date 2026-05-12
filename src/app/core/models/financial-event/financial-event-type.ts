export const FINANCIAL_EVENT_LABELS = {
  BILLING_FILE_RECEIVED: 'Arquivo de faturamento recebido',
  BILLING_FILE_VALIDATED: 'Arquivo de faturamento validado',
  BILLING_PROCESSING_STARTED: 'Processamento iniciado',
  BILLING_PROCESSING_FINISHED: 'Processamento finalizado',
  BILLING_CHARGE_CALCULATED: 'Cobrança calculada',
  BILLING_DIVERGENCE_DETECTED: 'Divergência detectada',
  BILLING_BATCH_APPROVED: 'Lote aprovado',
  BILLING_BATCH_REJECTED: 'Lote rejeitado',
  BILLING_REPORT_EXPORTED: 'Relatório exportado',
} as const;

export type FinancialEventType = keyof typeof FINANCIAL_EVENT_LABELS;

export const FINANCIAL_EVENT_TYPES = Object.keys(FINANCIAL_EVENT_LABELS) as FinancialEventType[];

export function financialEventLabel(type: string): string {
  return FINANCIAL_EVENT_LABELS[type as FinancialEventType] ?? 'Tipo de evento desconhecido';
}
