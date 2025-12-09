
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const StaffPresentTodayWidegtsPage: FC = () => {
  return <div>StaffPresentTodayWidegts</div>;
};

const StaffPresentTodayWidegts: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.StaffPresentTodayWidegts" })}
      </PageTitle>
      <StaffPresentTodayWidegtsPage />
    </>
  );
};


export { StaffPresentTodayWidegts };
