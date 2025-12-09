
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const SystemFieldsPage: FC = () => {
  return <div>SystemFields</div>;
};

const SystemFields: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.SystemFields" })}
      </PageTitle>
      <SystemFieldsPage />
    </>
  );
};


export { SystemFields };
