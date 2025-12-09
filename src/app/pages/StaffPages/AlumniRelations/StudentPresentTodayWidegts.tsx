
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const StudentPresentTodayWidegtsPage: FC = () => {
  return <div>StudentPresentTodayWidegts</div>;
};

const StudentPresentTodayWidegts: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.StudentPresentTodayWidegts" })}
      </PageTitle>
      <StudentPresentTodayWidegtsPage />
    </>
  );
};


export { StudentPresentTodayWidegts };
