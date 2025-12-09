
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const FacilitySchedulingPage: FC = () => {
  return <div>FacilityScheduling</div>;
};

const FacilityScheduling: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.FacilityScheduling" })}
      </PageTitle>
      <FacilitySchedulingPage />
    </>
  );
};


export { FacilityScheduling };
