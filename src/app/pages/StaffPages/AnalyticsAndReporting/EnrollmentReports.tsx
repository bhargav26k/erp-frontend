
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const EnrollmentReportsPage: FC = () => {
  return <div>EnrollmentReports</div>;
};

const EnrollmentReports: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.EnrollmentReports" })}
      </PageTitle>
      <EnrollmentReportsPage />
    </>
  );
};


export { EnrollmentReports };
