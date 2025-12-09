
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const LibraryReportPage: FC = () => {
  return <div>LibraryReport</div>;
};

const LibraryReport: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.LibraryReport" })}
      </PageTitle>
      <LibraryReportPage />
    </>
  );
};


export { LibraryReport };
