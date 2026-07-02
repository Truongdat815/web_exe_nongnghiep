import RoleApp from '../shared/RoleApp';
import { AuctionPage } from '../../pages/greenova/AuctionPage';
import { DistributorPage } from '../../pages/greenova/DistributorPage';
import { OverviewPage } from '../../pages/greenova/OverviewPage';
import { distributorPages } from './pages';

export default function DistributorApp(props) {
  const pageProps = {
    state: props.shellProps.state,
    setState: props.shellProps.setState,
    role: props.shellProps.role,
    notify: props.shellProps.notify,
  };
  const pageComponents = {
    distributor: <DistributorPage {...pageProps} />,
    auction: <AuctionPage {...pageProps} />,
    overview: <OverviewPage {...pageProps} />,
  };

  return <RoleApp {...props} navItems={distributorPages} pageComponents={pageComponents} fallbackPage="distributor" />;
}
