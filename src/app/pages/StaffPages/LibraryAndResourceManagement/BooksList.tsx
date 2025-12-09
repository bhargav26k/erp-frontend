
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const BooksListPage: FC = () => {
  return <div>BooksList</div>;
};

const BooksList: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.BooksList" })}
      </PageTitle>
      <BooksListPage />
    </>
  );
};


export { BooksList };
