
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const ExtracurricularActivityReportsPage: FC = () => {
  return <div>ExtracurricularActivityReports</div>;
};

const ExtracurricularActivityReports: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.ExtracurricularActivityReports" })}
      </PageTitle>
      <ExtracurricularActivityReportsPage />
    </>
  );
};


export { ExtracurricularActivityReports };
