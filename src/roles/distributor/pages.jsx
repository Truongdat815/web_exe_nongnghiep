import { AlertTriangle, Gavel, LockKeyhole, Package } from 'lucide-react';

export const distributorPages = [
  { id: 'distributor', label: 'Kho & đơn', icon: Package },
  { id: 'auction', label: 'Đấu giá', icon: Gavel },
  { id: 'orders', label: 'Escrow', icon: LockKeyhole },
  { id: 'overview', label: 'Cảnh báo vùng', icon: AlertTriangle },
];
