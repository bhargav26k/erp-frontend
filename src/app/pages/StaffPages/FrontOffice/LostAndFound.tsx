
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const LostAndFoundPage: FC = () => {
  return <div>LostAndFound</div>;
};

const LostAndFound: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.LostAndFound" })}
      </PageTitle>
      <LostAndFoundPage />
    </>
  );
};


export { LostAndFound };