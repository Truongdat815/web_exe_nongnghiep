import RoleApp from '../shared/RoleApp';
import { AIDiagnosisPage } from '../../pages/greenova/AIDiagnosisPage';
import { FeedPage } from '../../pages/greenova/FeedPage';
import { OverviewWrapperPage } from '../../pages/greenova/OverviewWrapperPage';
import { ProfilePage } from '../../pages/greenova/ProfilePage';
import { CommerceWrapperPage } from '../../pages/greenova/CommerceWrapperPage';
import { farmerPages } from './pages';

export default function FarmerApp(props) {
  const pageProps = {
    state: props.shellProps.state,
    setState: props.shellProps.setState,
    role: props.shellProps.role,
    notify: props.shellProps.notify,
  };
  const pageComponents = {
    overview: <OverviewWrapperPage {...pageProps} />,
    feed: <FeedPage {...pageProps} />,
    ai: <AIDiagnosisPage {...pageProps} />,
    commerce: <CommerceWrapperPage {...pageProps} />,
    profile: <ProfilePage {...pageProps} />,
  };

  return <RoleApp {...props} navItems={farmerPages} pageComponents={pageComponents} fallbackPage="overview" />;
}
