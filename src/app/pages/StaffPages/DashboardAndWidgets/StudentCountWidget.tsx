
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const StudentCountWidgetPage: FC = () => {
  return <div>StudentCountWidget</div>;
};

const StudentCountWidget: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.StudentCountWidget" })}
      </PageTitle>
      <StudentCountWidgetPage />
    </>
  );
};


export { StudentCountWidget };
