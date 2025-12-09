
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const NewsPage: FC = () => {
  return <div>News</div>;
};

const News: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.News" })}
      </PageTitle>
      <NewsPage />
    </>
  );
};


export { News };