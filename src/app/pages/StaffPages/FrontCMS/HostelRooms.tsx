
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const HostelRoomsPage: FC = () => {
  return <div>HostelRooms</div>;
};

const HostelRooms: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.HostelRooms" })}
      </PageTitle>
      <HostelRoomsPage />
    </>
  );
};


export { HostelRooms };