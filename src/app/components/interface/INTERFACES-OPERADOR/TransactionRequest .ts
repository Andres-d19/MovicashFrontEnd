export interface TransactionRequest {
  numeroCuentaOrdenante: number;
  numeroCuentaBeneficiario: number;
  concepto: string;
  monto: number;
  tipo: string;
}
