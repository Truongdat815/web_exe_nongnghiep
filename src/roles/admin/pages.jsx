import { Activity, ClipboardList, ShieldCheck, Cpu, Radio, Scale } from 'lucide-react';

export const adminPages = [
  { id: 'admin', label: 'Điều phối', icon: ShieldCheck },
  { id: 'inventory', label: 'Kho IoT', icon: Cpu },
  { id: 'expert', label: 'Yêu cầu SOS', icon: ClipboardList },
  { id: 'orders', label: 'Tranh chấp & Escrow', icon: Scale },
  { id: 'overview', label: 'Toàn hệ thống', icon: Activity },
  { id: 'feed', label: 'Bảng tin', icon: Radio },
];
