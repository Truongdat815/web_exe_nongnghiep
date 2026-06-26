import AdminApp from './admin/AdminApp';
import BuyerApp from './buyer/BuyerApp';
import DistributorApp from './distributor/DistributorApp';
import ExpertApp from './expert/ExpertApp';
import FarmerApp from './farmer/FarmerApp';
import { adminPages } from './admin/pages';
import { buyerPages } from './buyer/pages';
import { distributorPages } from './distributor/pages';
import { expertPages } from './expert/pages';
import { farmerPages } from './farmer/pages';

export const roleApps = {
  farmer: { component: FarmerApp, pages: farmerPages },
  expert: { component: ExpertApp, pages: expertPages },
  distributor: { component: DistributorApp, pages: distributorPages },
  buyer: { component: BuyerApp, pages: buyerPages },
  admin: { component: AdminApp, pages: adminPages },
};

export function getFirstPageForRole(roleId) {
  return roleApps[roleId]?.pages?.[0]?.id || 'overview';
}
