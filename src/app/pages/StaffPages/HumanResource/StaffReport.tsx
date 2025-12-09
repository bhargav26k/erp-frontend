
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const StaffReportPage: FC = () => {
  return <div>StaffReport</div>;
};

const StaffReport: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.StaffReport" })}
      </PageTitle>
      <StaffReportPage />
    </>
  );
};


export { StaffReport };
