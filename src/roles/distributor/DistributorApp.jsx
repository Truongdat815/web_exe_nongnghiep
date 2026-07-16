import RoleApp from '../shared/RoleApp';
import {
  DistributorDashboardPage,
  DistributorOrdersPage,
  DistributorProfilePage,
  DistributorStorePage,
  useDistributorDemoState,
} from '../../pages/greenova/DistributorPage';
import { FeedPage } from '../../pages/greenova/FeedPage';
import { distributorPages } from './pages';

export default function DistributorApp(props) {
  const dealer = useDistributorDemoState(props.shellProps.notify);
  const pageProps = {
    state: props.shellProps.state,
    setState: props.shellProps.setState,
    role: props.shellProps.role,
    notify: props.shellProps.notify,
    dealer,
  };
  const pageComponents = {
    dashboard: <DistributorDashboardPage {...pageProps} />,
    store: <DistributorStorePage {...pageProps} />,
    orders: <DistributorOrdersPage {...pageProps} />,
    profile: <DistributorProfilePage {...pageProps} />,
    feed: <FeedPage {...pageProps} />,
  };

  return <RoleApp {...props} navItems={distributorPages} pageComponents={pageComponents} fallbackPage="dashboard" />;
}
