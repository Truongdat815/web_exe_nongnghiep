import { Activity, Bot, MessageCircle, NotebookTabs, ShoppingCart, Store } from 'lucide-react';

export const farmerPages = [
  { id: 'overview', label: 'Tổng quan', icon: Activity },
  { id: 'feed', label: 'Bảng tin', icon: MessageCircle },
  { id: 'ai', label: 'Chat AI', icon: Bot },
  { id: 'market', label: 'Mua vật tư', icon: ShoppingCart },
  { id: 'produce', label: 'Bán nông sản', icon: Store },
  { id: 'ledger', label: 'Nhật ký QR', icon: NotebookTabs },
];
