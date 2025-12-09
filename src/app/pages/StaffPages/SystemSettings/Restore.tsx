
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const RestorePage: FC = () => {
  return <div>Restore</div>;
};

const Restore: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.Restore" })}
      </PageTitle>
      <RestorePage />
    </>
  );
};


export { Restore };
