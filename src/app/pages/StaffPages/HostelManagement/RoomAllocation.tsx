
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const RoomAllocationPage: FC = () => {
  return <div>RoomAllocation</div>;
};

const RoomAllocation: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.RoomAllocation" })}
      </PageTitle>
      <RoomAllocationPage />
    </>
  );
};


export { RoomAllocation };
