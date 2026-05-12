export const FINANCIAL_EVENT_LABELS = {
  BILLING_FILE_RECEIVED: 'Billing file received',
  BILLING_FILE_VALIDATED: 'Billing file validated',
  BILLING_PROCESSING_STARTED: 'Billing processing started',
  BILLING_PROCESSING_FINISHED: 'Billing processing finished',
  BILLING_CHARGE_CALCULATED: 'Billing charge calculated',
  BILLING_DIVERGENCE_DETECTED: 'Billing divergence detected',
  BILLING_BATCH_APPROVED: 'Billing batch approved',
  BILLING_BATCH_REJECTED: 'Billing batch rejected',
  BILLING_REPORT_EXPORTED: 'Billing report exported',
} as const;

export type FinancialEventType = keyof typeof FINANCIAL_EVENT_LABELS;

export const FINANCIAL_EVENT_TYPES = Object.keys(FINANCIAL_EVENT_LABELS) as FinancialEventType[];
