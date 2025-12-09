
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const GalleryPage: FC = () => {
  return <div>Gallery</div>;
};

const Gallery: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.Gallery" })}
      </PageTitle>
      <GalleryPage />
    </>
  );
};


export { Gallery };