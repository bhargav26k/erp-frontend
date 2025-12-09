
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const ResourceAvailaibilityPage: FC = () => {
  return <div>ResourceAvailaibility</div>;
};

const ResourceAvailaibility: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.ResourceAvailaibility" })}
      </PageTitle>
      <ResourceAvailaibilityPage />
    </>
  );
};


export { ResourceAvailaibility };
