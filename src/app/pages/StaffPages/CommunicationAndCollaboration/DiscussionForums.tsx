
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const DiscussionForumsPage: FC = () => {
  return <div>DiscussionForums</div>;
};

const DiscussionForums: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.DiscussionForums" })}
      </PageTitle>
      <DiscussionForumsPage />
    </>
  );
};


export { DiscussionForums };
