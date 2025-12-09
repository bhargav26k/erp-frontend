import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const ProgressReportPage: FC = () => {
  return <div>ProgressReport</div>;
};

const ProgressReport: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.ProgressReport" })}
      </PageTitle>
      <ProgressReportPage />
    </>
  );
};


export default ProgressReport;
