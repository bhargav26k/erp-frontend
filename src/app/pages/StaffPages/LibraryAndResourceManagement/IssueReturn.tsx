
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const IssueReturnPage: FC = () => {
  return <div>IssueReturn</div>;
};

const IssueReturn: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.IssueReturn" })}
      </PageTitle>
      <IssueReturnPage />
    </>
  );
};


export { IssueReturn };
