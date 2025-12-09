
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const CatalogManagmentPage: FC = () => {
  return <div>CatalogManagment</div>;
};

const CatalogManagment: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.CatalogManagment" })}
      </PageTitle>
      <CatalogManagmentPage />
    </>
  );
};


export { CatalogManagment };
