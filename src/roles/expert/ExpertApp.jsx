import RoleApp from '../shared/RoleApp';
import { ExpertPage } from '../../pages/greenova/ExpertPage';
import { FeedPage } from '../../pages/greenova/FeedPage';
import { LedgerPage } from '../../pages/greenova/LedgerPage';
import { OverviewPage } from '../../pages/greenova/OverviewPage';
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
    expert: <ExpertPage {...pageProps} />,
    overview: <OverviewPage {...pageProps} />,
    ledger: <LedgerPage {...pageProps} />,
  };

  return <RoleApp {...props} navItems={expertPages} pageComponents={pageComponents} fallbackPage="feed" />;
}
