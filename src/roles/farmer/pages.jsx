import { Activity, Bot, LockKeyhole, MessageCircle, QrCode, ShoppingCart } from 'lucide-react';

export const farmerPages = [
  { id: 'overview', label: 'Tổng quan', icon: Activity },
  { id: 'feed', label: 'Bảng tin', icon: MessageCircle },
  { id: 'ai', label: 'AI chẩn đoán', icon: Bot },
  { id: 'market', label: 'Sàn vật tư', icon: ShoppingCart },
  { id: 'orders', label: 'Escrow đơn hàng', icon: LockKeyhole },
  { id: 'ledger', label: 'QR nhật ký', icon: QrCode },
];
