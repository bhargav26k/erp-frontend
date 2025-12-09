
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const MonthlyFeesCollectionWidgetPage: FC = () => {
  return <div>MonthlyFeesCollectionWidget</div>;
};

const MonthlyFeesCollectionWidget: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.MonthlyFeesCollectionWidget" })}
      </PageTitle>
      <MonthlyFeesCollectionWidgetPage />
    </>
  );
};


export { MonthlyFeesCollectionWidget };
