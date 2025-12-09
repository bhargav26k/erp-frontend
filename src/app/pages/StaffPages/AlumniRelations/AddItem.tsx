
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const AddItemPage: FC = () => {
  return <div>AddItem</div>;
};

const AddItem: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.AddItem" })}
      </PageTitle>
      <AddItemPage />
    </>
  );
};


export { AddItem };
