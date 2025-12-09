
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const CertificateRecordsPage: FC = () => {
  return <div>CertificateRecords</div>;
};

const CertificateRecords: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.CertificateRecords" })}
      </PageTitle>
      <CertificateRecordsPage />
    </>
  );
};


export { CertificateRecords };
