
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const RoutesPage: FC = () => {
  return <div>Routes</div>;
};

const Routes: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.Routes" })}
      </PageTitle>
      <RoutesPage />
    </>
  );
};


export { Routes };
