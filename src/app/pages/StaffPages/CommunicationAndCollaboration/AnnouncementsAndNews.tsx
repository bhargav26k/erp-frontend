
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const AnnouncementsAndNewsPage: FC = () => {
  return <div>AnnouncementsAndNews</div>;
};

const AnnouncementsAndNews: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.AnnouncementsAndNews" })}
      </PageTitle>
      <AnnouncementsAndNewsPage />
    </>
  );
};


export { AnnouncementsAndNews };
