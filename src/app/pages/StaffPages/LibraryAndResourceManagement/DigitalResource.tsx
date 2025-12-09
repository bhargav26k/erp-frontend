
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const DigitalResourcePage: FC = () => {
  return <div>DigitalResource</div>;
};

const DigitalResource: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.DigitalResource" })}
      </PageTitle>
      <DigitalResourcePage />
    </>
  );
};


export { DigitalResource };
