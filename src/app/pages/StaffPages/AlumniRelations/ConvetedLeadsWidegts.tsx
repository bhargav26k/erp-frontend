
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const ConvetedLeadsWidegtsPage: FC = () => {
  return <div>ConvetedLeadsWidegts</div>;
};

const ConvetedLeadsWidegts: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.ConvetedLeadsWidegts" })}
      </PageTitle>
      <ConvetedLeadsWidegtsPage />
    </>
  );
};


export { ConvetedLeadsWidegts };
