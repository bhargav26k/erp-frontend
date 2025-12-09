
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const DocumentSharingPage: FC = () => {
  return <div>DocumentSharing</div>;
};

const DocumentSharing: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.DocumentSharing" })}
      </PageTitle>
      <DocumentSharingPage />
    </>
  );
};


export { DocumentSharing };
