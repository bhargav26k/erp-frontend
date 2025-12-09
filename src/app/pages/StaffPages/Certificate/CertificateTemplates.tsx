
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const CertificateTemplatesPage: FC = () => {
  return <div>CertificateTemplates</div>;
};

const CertificateTemplates: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.CertificateTemplates" })}
      </PageTitle>
      <CertificateTemplatesPage />
    </>
  );
};


export { CertificateTemplates };
