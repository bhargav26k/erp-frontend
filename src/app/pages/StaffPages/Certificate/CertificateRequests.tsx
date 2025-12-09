
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const CertificateRequestsPage: FC = () => {
  return <div>CertificateRequests</div>;
};

const CertificateRequests: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.CertificateRequests" })}
      </PageTitle>
      <CertificateRequestsPage />
    </>
  );
};


export { CertificateRequests };
