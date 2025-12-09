
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const RoomTypePage: FC = () => {
  return <div>RoomType</div>;
};

const RoomType: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.RoomType" })}
      </PageTitle>
      <RoomTypePage />
    </>
  );
};


export { RoomType };