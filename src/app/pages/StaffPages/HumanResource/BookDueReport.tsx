
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const BookDueReportPage: FC = () => {
  return <div>BookDueReport</div>;
};

const BookDueReport: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.BookDueReport" })}
      </PageTitle>
      <BookDueReportPage />
    </>
  );
};


export { BookDueReport };
