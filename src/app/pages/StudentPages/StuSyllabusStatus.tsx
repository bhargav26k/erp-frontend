import { FC } from "react";
import { useIntl } from "react-intl";
import { PageTitle } from "../../../_metronic/layout/core";
// import {
//   CardsWidget21,
//   ChartsWidget9,
//   ChartsWidget10,
// } from "../../../_metronic/partials/widgets";
import { Content } from "../../../_metronic/layout/components/content";
// import { CardsWidget24 } from "../../../_metronic/partials/widgets/_new/cards/CardsWidget24";

const StudentSyllabusStatusPage: FC = () => {
  //   const handleToggle = (value: boolean) => {
  //     console.log(value);
  //   };

  return (
    <div className="bg-body-secondary">
      <Content>
        <div className="row g-5 g-xl-10 mb-6 mb-xl-5">
          {/* <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-3 mb-md-5 mb-xl-10">
            <CardsWidget24 className="h-md-100 mb-5 mb-xl-10" />
          </div>
          <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-3 mb-md-5 mb-xl-10">
            <CardsWidget24 className="h-md-100 mb-5 mb-xl-10" />
          </div>
          <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-3 mb-md-5 mb-xl-10">
            <CardsWidget24 className="h-md-100 mb-5 mb-xl-10" />
          </div>
          <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-3 mb-md-5 mb-xl-10">
            <CardsWidget24 className="h-md-100 mb-5 mb-xl-10" />
          </div> */}
          
        </div>
      </Content>
    </div>
  );
};

const StuSyllabusStatus: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.SYLLABUSSTATUS" })}
      </PageTitle>
      <StudentSyllabusStatusPage />
    </>
  );
};

export { StuSyllabusStatus };
