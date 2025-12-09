
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const AddStudentPage: FC = () => {
  return <div>AddStudent</div>;
};

const AddStudent: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.AddStudent" })}
      </PageTitle>
      <AddStudentPage />
    </>
  );
};


export { AddStudent };
