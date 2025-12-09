import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const ClassroomResourcePage: FC = () => {
  return <div>ClassroomResource</div>;
};

const ClassroomResource: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.ClassroomResource" })}
      </PageTitle>
      <ClassroomResourcePage />
    </>
  );
};


export default ClassroomResource;
