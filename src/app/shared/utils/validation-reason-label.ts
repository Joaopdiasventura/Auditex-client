const VALIDATION_REASON_LABELS: Record<string, string> = {
  INVALID_BLOCK_INDEX: 'Índice de bloco inválido',
  INVALID_PREVIOUS_HASH: 'Hash anterior inválido',
  INVALID_MERKLE_ROOT: 'Raiz de Merkle inválida',
  INVALID_BLOCK_HASH: 'Hash do bloco inválido',
  INVALID_PROOF_OF_WORK: 'Prova de trabalho inválida',
  INVALID_TRANSACTION_HASH: 'Hash da transação inválido',
  INVALID_TRANSACTION_SIGNATURE: 'Assinatura da transação inválida',
  INVALID_TRANSACTION_STATUS: 'Status da transação inválido',
  MISSING_TRANSACTION_BLOCK_ID: 'Identificador do bloco ausente na transação',
  INVALID_TRANSACTION_BLOCK_ID: 'Identificador do bloco inválido na transação',
  MISSING_TRANSACTION_MINED_AT: 'Data de mineração ausente na transação',
  MISSING_TRANSACTION_BLOCK_INDEX: 'Índice da transação no bloco ausente',
  DUPLICATED_TRANSACTION_NONCE: 'Nonce duplicado para a mesma chave pública',
};

export function validationReasonLabel(reason: string | null | undefined): string {
  if (!reason) return 'A validação da blockchain falhou';
  return VALIDATION_REASON_LABELS[reason] ?? 'Motivo de validação não reconhecido';
}
