
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const MediaManagerPage: FC = () => {
  return <div>MediaManager</div>;
};

const MediaManager: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.MediaManager" })}
      </PageTitle>
      <MediaManagerPage />
    </>
  );
};


export { MediaManager };