
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const LibraryUsageReportsPage: FC = () => {
  return <div>LibraryUsageReports</div>;
};

const LibraryUsageReports: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.LibraryUsageReports" })}
      </PageTitle>
      <LibraryUsageReportsPage />
    </>
  );
};


export { LibraryUsageReports };
