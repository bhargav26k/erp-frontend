
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const AssignVehiclePage: FC = () => {
  return <div>AssignVehicle</div>;
};

const AssignVehicle: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.AssignVehicle" })}
      </PageTitle>
      <AssignVehiclePage />
    </>
  );
};


export { AssignVehicle };
