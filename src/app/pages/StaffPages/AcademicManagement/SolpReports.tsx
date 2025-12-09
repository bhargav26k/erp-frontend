import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const SolpReportsPage: FC = () => {
  return <div>SolpReports</div>;
};

const SolpReports: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.SolpReports" })}
      </PageTitle>
      <SolpReportsPage />
    </>
  );
};


export default SolpReports;
