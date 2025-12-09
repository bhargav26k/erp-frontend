
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const StudentProfileUpdatePage: FC = () => {
  return <div>StudentProfileUpdate</div>;
};

const StudentProfileUpdate: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.StudentProfileUpdate" })}
      </PageTitle>
      <StudentProfileUpdatePage />
    </>
  );
};


export { StudentProfileUpdate };
