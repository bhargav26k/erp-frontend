
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const EventsPage: FC = () => {
  return <div>Events</div>;
};

const Events: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.Events" })}
      </PageTitle>
      <EventsPage />
    </>
  );
};


export { Events };
