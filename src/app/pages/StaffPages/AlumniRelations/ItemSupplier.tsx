
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const ItemSupplierPage: FC = () => {
  return <div>ItemSupplier</div>;
};

const ItemSupplier: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.ItemSupplier" })}
      </PageTitle>
      <ItemSupplierPage />
    </>
  );
};


export { ItemSupplier };
