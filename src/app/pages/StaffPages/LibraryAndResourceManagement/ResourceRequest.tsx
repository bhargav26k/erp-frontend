
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const ResourceRequestPage: FC = () => {
  return <div>ResourceRequest</div>;
};

const ResourceRequest: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.ResourceRequest" })}
      </PageTitle>
      <ResourceRequestPage />
    </>
  );
};


export { ResourceRequest };
