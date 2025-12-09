
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const FacilityUtilizationReportsPage: FC = () => {
  return <div>FacilityUtilizationReports</div>;
};

const FacilityUtilizationReports: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.FacilityUtilizationReports" })}
      </PageTitle>
      <FacilityUtilizationReportsPage />
    </>
  );
};


export { FacilityUtilizationReports };
