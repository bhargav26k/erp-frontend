
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const BookIssueReportPage: FC = () => {
  return <div>BookIssueReport</div>;
};

const BookIssueReport: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.BookIssueReport" })}
      </PageTitle>
      <BookIssueReportPage />
    </>
  );
};


export { BookIssueReport };
