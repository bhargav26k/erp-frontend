
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const SpaceUtilizationPage: FC = () => {
  return <div>SpaceUtilization</div>;
};

const SpaceUtilization: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.SpaceUtilization" })}
      </PageTitle>
      <SpaceUtilizationPage />
    </>
  );
};


export { SpaceUtilization };
