
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const CustomFieldsPage: FC = () => {
  return <div>CustomFields</div>;
};

const CustomFields: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.CustomFields" })}
      </PageTitle>
      <CustomFieldsPage />
    </>
  );
};


export { CustomFields };
