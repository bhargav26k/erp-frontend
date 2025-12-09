
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const LibraryOverviewWidegtsPage: FC = () => {
  return <div>LibraryOverviewWidegts</div>;
};

const LibraryOverviewWidegts: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.LibraryOverviewWidegts" })}
      </PageTitle>
      <LibraryOverviewWidegtsPage />
    </>
  );
};


export { LibraryOverviewWidegts };
