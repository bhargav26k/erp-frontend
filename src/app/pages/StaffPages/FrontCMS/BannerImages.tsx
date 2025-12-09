
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const BannerImagesPage: FC = () => {
  return <div>BannerImages</div>;
};

const BannerImages: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.BannerImages" })}
      </PageTitle>
      <BannerImagesPage />
    </>
  );
};


export { BannerImages };