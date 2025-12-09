
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const EventCalendarPage: FC = () => {
  return <div>EventCalendar</div>;
};

const EventCalendar: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.EventCalendar" })}
      </PageTitle>
      <EventCalendarPage />
    </>
  );
};


export { EventCalendar };
