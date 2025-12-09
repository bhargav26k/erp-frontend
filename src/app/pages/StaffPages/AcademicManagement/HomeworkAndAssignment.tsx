import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const HomeworkAndAssignmentPage: FC = () => {
  return <div>HomeworkAndAssignment</div>;
};

const HomeworkAndAssignment: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.HomeworkAndAssignment" })}
      </PageTitle>
      <HomeworkAndAssignmentPage />
    </>
  );
};


export default HomeworkAndAssignment;
