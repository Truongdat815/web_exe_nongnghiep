import RoleApp from '../shared/RoleApp';
import { AIDiagnosisPage } from '../../pages/greenova/AIDiagnosisPage';
import { FeedPage } from '../../pages/greenova/FeedPage';
import { FarmerOverviewPage } from '../../pages/greenova/FarmerOverviewPage';
import { LedgerPage } from '../../pages/greenova/LedgerPage';
import { MarketplacePage } from '../../pages/greenova/MarketplacePage';
import { OrdersPage } from '../../pages/greenova/OrdersPage';
import { ProduceMarketPage } from '../../pages/greenova/ProduceMarketPage';
import { farmerPages } from './pages';

export default function FarmerApp(props) {
  const pageProps = {
    state: props.shellProps.state,
    setState: props.shellProps.setState,
    role: props.shellProps.role,
    notify: props.shellProps.notify,
  };
  const pageComponents = {
    overview: <FarmerOverviewPage {...pageProps} />,
    feed: <FeedPage {...pageProps} />,
    ai: <AIDiagnosisPage {...pageProps} />,
    market: <MarketplacePage {...pageProps} />,
    produce: <ProduceMarketPage {...pageProps} />,
    orders: <OrdersPage {...pageProps} />,
    ledger: <LedgerPage {...pageProps} />,
  };

  return <RoleApp {...props} navItems={farmerPages} pageComponents={pageComponents} fallbackPage="overview" />;
}
