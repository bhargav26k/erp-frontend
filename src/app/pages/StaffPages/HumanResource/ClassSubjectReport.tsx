

import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const ClassSubjectReportPage: FC = () => {
  return <div>ClassSubjectReport</div>;
};

const ClassSubjectReport: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.ClassSubjectReport" })}
      </PageTitle>
      <ClassSubjectReportPage />
    </>
  );
};


export { ClassSubjectReport };
