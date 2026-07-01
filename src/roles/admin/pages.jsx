import { Activity, ClipboardList, LockKeyhole, ShieldCheck, Cpu } from 'lucide-react';

export const adminPages = [
  { id: 'admin', label: 'Điều phối', icon: ShieldCheck },
  { id: 'orders', label: 'Tranh chấp', icon: LockKeyhole },
  { id: 'inventory', label: 'Kho IoT', icon: Cpu },
  { id: 'expert', label: 'Yêu cầu SOS', icon: ClipboardList },
  { id: 'overview', label: 'Toàn hệ thống', icon: Activity },
];
