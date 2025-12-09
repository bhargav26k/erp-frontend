
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const QuickSessionChangePage: FC = () => {
  return <div>QuickSessionChange</div>;
};

const QuickSessionChange: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.QuickSessionChange" })}
      </PageTitle>
      <QuickSessionChangePage />
    </>
  );
};


export { QuickSessionChange };
