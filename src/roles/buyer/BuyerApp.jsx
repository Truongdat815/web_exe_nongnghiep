import RoleApp from '../shared/RoleApp';
import { AuctionPage } from '../../pages/greenova/AuctionPage';
import { BuyerPage } from '../../pages/greenova/BuyerPage';
import { LedgerPage } from '../../pages/greenova/LedgerPage';
import { OverviewPage } from '../../pages/greenova/OverviewPage';
import { buyerPages } from './pages';

export default function BuyerApp(props) {
  const pageProps = {
    state: props.shellProps.state,
    setState: props.shellProps.setState,
    role: props.shellProps.role,
    notify: props.shellProps.notify,
  };
  const pageComponents = {
    buyer: <BuyerPage {...pageProps} />,
    ledger: <LedgerPage {...pageProps} />,
    auction: <AuctionPage {...pageProps} />,
    overview: <OverviewPage {...pageProps} />,
  };

  return <RoleApp {...props} navItems={buyerPages} pageComponents={pageComponents} fallbackPage="buyer" />;
}
