
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const CertificateIssuancePage: FC = () => {
  return <div>CertificateIssuance</div>;
};

const CertificateIssuance: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.CertificateIssuance" })}
      </PageTitle>
      <CertificateIssuancePage />
    </>
  );
};


export { CertificateIssuance };
