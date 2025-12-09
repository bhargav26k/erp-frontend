import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const CourseManagmentPage: FC = () => {
  return <div>CourseManagment</div>;
};

const CourseManagment: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.CourseManagment" })}
      </PageTitle>
      <CourseManagmentPage />
    </>
  );
};


export default CourseManagment;
