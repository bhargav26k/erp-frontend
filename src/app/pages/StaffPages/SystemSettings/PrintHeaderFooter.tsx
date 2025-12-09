
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const PrintHeaderFooterPage: FC = () => {
  return <div>PrintHeaderFooter</div>;
};

const PrintHeaderFooter: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.PrintHeaderFooter" })}
      </PageTitle>
      <PrintHeaderFooterPage />
    </>
  );
};


export { PrintHeaderFooter };
