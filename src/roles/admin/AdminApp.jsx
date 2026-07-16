import RoleApp from '../shared/RoleApp';
import { AdminPage } from '../../pages/greenova/AdminPage';
import { ExpertPage } from '../../pages/greenova/ExpertPage';
import { OverviewPage } from '../../pages/greenova/OverviewPage';
import { IotInventoryPage } from '../../pages/greenova/IotInventoryPage';
import { OrdersPage } from '../../pages/greenova/OrdersPage';
import { FeedPage } from '../../pages/greenova/FeedPage';
import { adminPages } from './pages';

export default function AdminApp(props) {
  const pageProps = {
    state: props.shellProps.state,
    setState: props.shellProps.setState,
    role: props.shellProps.role,
    notify: props.shellProps.notify,
  };
  const pageComponents = {
    admin: <AdminPage {...pageProps} />,
    inventory: <IotInventoryPage {...pageProps} />,
    expert: <ExpertPage {...pageProps} />,
    orders: <OrdersPage {...pageProps} />,
    overview: <OverviewPage {...pageProps} />,
    feed: <FeedPage {...pageProps} />,
  };

  return <RoleApp {...props} navItems={adminPages} pageComponents={pageComponents} fallbackPage="admin" />;
}
