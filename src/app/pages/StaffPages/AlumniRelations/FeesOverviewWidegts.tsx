
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const FeesOverviewWidegtsPage: FC = () => {
  return <div>FeesOverviewWidegts</div>;
};

const FeesOverviewWidegts: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.FeesOverviewWidegts" })}
      </PageTitle>
      <FeesOverviewWidegtsPage />
    </>
  );
};


export { FeesOverviewWidegts };
