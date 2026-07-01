import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function RoleApp({ Shell, shellProps, navItems, pageComponents, fallbackPage }) {
  const location = useLocation();
  const pathPage = location.pathname.split('/')[2];
  const activePage = pageComponents[pathPage]
    ? pathPage
    : pageComponents[shellProps.activePage]
      ? shellProps.activePage
      : fallbackPage;

  useEffect(() => {
    if (activePage !== shellProps.activePage) {
      shellProps.setActivePage(activePage);
    }
  }, [activePage, shellProps]);

  return (
    <Shell {...shellProps} activePage={activePage} navItems={navItems}>
      {pageComponents[activePage] || pageComponents[fallbackPage]}
    </Shell>
  );
}
