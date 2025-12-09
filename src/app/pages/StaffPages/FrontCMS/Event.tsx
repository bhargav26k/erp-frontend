
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const EventPage: FC = () => {
  return <div>Event</div>;
};

const Event: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.Event" })}
      </PageTitle>
      <EventPage />
    </>
  );
};


export { Event };