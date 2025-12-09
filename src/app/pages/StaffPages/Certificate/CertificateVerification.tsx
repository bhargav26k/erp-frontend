
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const CertificateVerificationPage: FC = () => {
  return <div>CertificateVerification</div>;
};

const CertificateVerification: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.CertificateVerification" })}
      </PageTitle>
      <CertificateVerificationPage />
    </>
  );
};


export { CertificateVerification };
