
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const StudentProfilePage: FC = () => {
  return <div>StudentProfile</div>;
};

const StudentProfile: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.StudentProfile" })}
      </PageTitle>
      <StudentProfilePage />
    </>
  );
};


export { StudentProfile };
