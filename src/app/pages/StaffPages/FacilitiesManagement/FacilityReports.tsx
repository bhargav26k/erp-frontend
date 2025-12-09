
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const FacilityReportsPage: FC = () => {
  return <div>FacilityReports</div>;
};

const FacilityReports: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.FacilityReports" })}
      </PageTitle>
      <FacilityReportsPage />
    </>
  );
};


export { FacilityReports };
