export default function RoleApp({ Shell, shellProps, navItems, pageComponents, fallbackPage }) {
  const activePage = pageComponents[shellProps.activePage] ? shellProps.activePage : fallbackPage;

  return (
    <Shell {...shellProps} activePage={activePage} navItems={navItems}>
      {pageComponents[activePage] || pageComponents[fallbackPage]}
    </Shell>
  );
}
