
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const AddItemStockPage: FC = () => {
  return <div>AddItemStock</div>;
};

const AddItemStock: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.AddItemStock" })}
      </PageTitle>
      <AddItemStockPage />
    </>
  );
};


export { AddItemStock };
