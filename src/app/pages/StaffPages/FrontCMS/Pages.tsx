
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const PagesPage: FC = () => {
  return <div>Pages</div>;
};

const Pages: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.Pages" })}
      </PageTitle>
      <PagesPage />
    </>
  );
};


export { Pages };