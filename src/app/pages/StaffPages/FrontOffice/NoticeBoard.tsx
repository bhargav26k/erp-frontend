
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const NoticeBoardPage: FC = () => {
  return <div>NoticeBoard</div>;
};

const NoticeBoard: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.NoticeBoard" })}
      </PageTitle>
      <NoticeBoardPage />
    </>
  );
};


export { NoticeBoard };