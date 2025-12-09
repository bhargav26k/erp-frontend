




import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const AcademicRecordsPage: FC = () => {
  return <div>AcademicRecords</div>;
};

const AcademicRecords: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.AcademicRecords" })}
      </PageTitle>
      <AcademicRecordsPage />
    </>
  );
};


export { AcademicRecords };
