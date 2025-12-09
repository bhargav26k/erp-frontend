
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const ImportBookPage: FC = () => {
  return <div>ImportBook</div>;
};

const ImportBook: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.ImportBook" })}
      </PageTitle>
      <ImportBookPage />
    </>
  );
};


export { ImportBook };
