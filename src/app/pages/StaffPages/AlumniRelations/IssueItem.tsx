
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const IssueItemPage: FC = () => {
  return <div>IssueItem</div>;
};

const IssueItem: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.IssueItem" })}
      </PageTitle>
      <IssueItemPage />
    </>
  );
};


export { IssueItem };
