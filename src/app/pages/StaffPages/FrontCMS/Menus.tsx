
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const MenusPage: FC = () => {
  return <div>Menus</div>;
};

const Menus: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.Menus" })}
      </PageTitle>
      <MenusPage />
    </>
  );
};


export { Menus };