import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const TeacherEvaluationPage: FC = () => {
  return <div>TeacherEvaluation</div>;
};

const TeacherEvaluation: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.TeacherEvaluation" })}
      </PageTitle>
      <TeacherEvaluationPage />
    </>
  );
};


export default TeacherEvaluation;
