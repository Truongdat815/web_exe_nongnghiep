import RoleApp from '../shared/RoleApp';
import { ExpertBookingsPage } from '../../pages/greenova/ExpertBookingsPage';
import { ExpertPage } from '../../pages/greenova/ExpertPage';
import { ExpertProfilePage } from '../../pages/greenova/ExpertProfilePage';
import { ExpertRegionPage } from '../../pages/greenova/ExpertRegionPage';
import { FeedPage } from '../../pages/greenova/FeedPage';
import { expertPages } from './pages';

export default function ExpertApp(props) {
  const pageProps = {
    state: props.shellProps.state,
    setState: props.shellProps.setState,
    role: props.shellProps.role,
    notify: props.shellProps.notify,
  };
  const pageComponents = {
    feed: <FeedPage {...pageProps} />,
    bookings: <ExpertBookingsPage {...pageProps} />,
    region: <ExpertRegionPage {...pageProps} />,
    expert: <ExpertPage {...pageProps} />,
    profile: <ExpertProfilePage {...pageProps} />,
  };

  return <RoleApp {...props} navItems={expertPages} pageComponents={pageComponents} fallbackPage="feed" />;
}
