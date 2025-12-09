
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const FeesStatementPage: FC = () => {
  return <div>FeesStatement</div>;
};

const FeesStatement: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.FeesStatement" })}
      </PageTitle>
      <FeesStatementPage />
    </>
  );
};


export { FeesStatement };
