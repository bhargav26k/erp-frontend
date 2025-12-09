
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const AuditTrailReportPage: FC = () => {
  return <div>AuditTrailReport</div>;
};

const AuditTrailReport: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.AuditTrailReport" })}
      </PageTitle>
      <AuditTrailReportPage />
    </>
  );
};


export { AuditTrailReport };
