
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const ItemStorePage: FC = () => {
  return <div>ItemStore</div>;
};

const ItemStore: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.ItemStore" })}
      </PageTitle>
      <ItemStorePage />
    </>
  );
};


export { ItemStore };
