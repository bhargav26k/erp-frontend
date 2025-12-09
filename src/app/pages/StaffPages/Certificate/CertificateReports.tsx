
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const CertificateReportsPage: FC = () => {
  return <div>CertificateReports</div>;
};

const CertificateReports: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.CertificateReports" })}
      </PageTitle>
      <CertificateReportsPage />
    </>
  );
};


export { CertificateReports };
