export enum MaintenanceStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum AssignmentStatus {
  IN_USE = 'đang sử dụng',
  COMPLETED = 'đã hoàn tất',
  PENDING = 'chờ xử lý',
}

export enum EnrollmentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  CANCELED = 'canceled',
  EXPIRED = 'expired',
}
