
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const DisciplinaryReportsPage: FC = () => {
  return <div>DisciplinaryReports</div>;
};

const DisciplinaryReports: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.DisciplinaryReports" })}
      </PageTitle>
      <DisciplinaryReportsPage />
    </>
  );
};


export { DisciplinaryReports };
