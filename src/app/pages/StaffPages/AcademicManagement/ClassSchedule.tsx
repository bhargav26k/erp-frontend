import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const ClassSchedulePage: FC = () => {
  return <div>ClassSchedule</div>;
};

const ClassSchedule: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.ClassSchedule" })}
      </PageTitle>
      <ClassSchedulePage />
    </>
  );
};


export default ClassSchedule;
