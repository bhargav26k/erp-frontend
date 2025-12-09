
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const BookInventoryReportPage: FC = () => {
  return <div>BookInventoryReport</div>;
};

const BookInventoryReport: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.BookInventoryReport" })}
      </PageTitle>
      <BookInventoryReportPage />
    </>
  );
};


export { BookInventoryReport };
