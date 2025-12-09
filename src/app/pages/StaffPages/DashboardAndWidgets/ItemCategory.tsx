
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const ItemCategoryPage: FC = () => {
  return <div>ItemCategory</div>;
};

const ItemCategory: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.ItemCategory" })}
      </PageTitle>
      <ItemCategoryPage />
    </>
  );
};


export { ItemCategory };
