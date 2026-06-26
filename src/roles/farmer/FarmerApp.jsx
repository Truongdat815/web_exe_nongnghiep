import RoleApp from '../shared/RoleApp';
import { AIDiagnosisPage } from '../../pages/greenova/AIDiagnosisPage';
import { FeedPage } from '../../pages/greenova/FeedPage';
import { LedgerPage } from '../../pages/greenova/LedgerPage';
import { MarketplacePage } from '../../pages/greenova/MarketplacePage';
import { OrdersPage } from '../../pages/greenova/OrdersPage';
import { OverviewPage } from '../../pages/greenova/OverviewPage';
import { farmerPages } from './pages';

export default function FarmerApp(props) {
  const pageProps = {
    state: props.shellProps.state,
    setState: props.shellProps.setState,
    role: props.shellProps.role,
    notify: props.shellProps.notify,
  };
  const pageComponents = {
    overview: <OverviewPage {...pageProps} />,
    feed: <FeedPage {...pageProps} />,
    ai: <AIDiagnosisPage {...pageProps} />,
    market: <MarketplacePage {...pageProps} />,
    orders: <OrdersPage {...pageProps} />,
    ledger: <LedgerPage {...pageProps} />,
  };

  return <RoleApp {...props} navItems={farmerPages} pageComponents={pageComponents} fallbackPage="overview" />;
}
