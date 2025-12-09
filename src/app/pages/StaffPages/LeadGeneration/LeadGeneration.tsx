import { FC } from "react";
import { useIntl } from "react-intl";
import { PageTitle } from "../../../../_metronic/layout/core";
import {
  CardsWidget21,
  ChartsWidget9,
  ChartsWidget10,
  
} from "../../../../_metronic/partials/widgets";
// import { ToolbarWrapper } from "../../../../_metronic/layout/components/toolbar";
import { Content } from "../../../../_metronic/layout/components/content";
import { ToolbarDashBoard } from "../../../../_metronic/layout/components/toolbar/toolbars";

const LeadGenerationPage: FC = () => {


  return (
    <div className="bg-body-secondary">    
      <ToolbarDashBoard />

      <Content>
        <div className="row g-5 g-xl-10 mb-6 mb-xl-5">
          {/* begin::Col */}
          <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-3 mb-md-5 mb-xl-10">
            <CardsWidget21
            />
          </div>
          <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-3 mb-md-5 mb-xl-10">
            <CardsWidget21
              
            />
          </div>
          <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-3 mb-md-5 mb-xl-10">
            <CardsWidget21
              
            />
          </div>
          <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-3 mb-md-5 mb-xl-10">
            <CardsWidget21
              
            />
          </div>
        </div>
        <div className="row g-5 g-xl-10 mb-5 mb-xl-10">
          <div className="col-xxl-6">
            <ChartsWidget10 className="h-md-100 " />
          </div>
          <div className="col-xxl-6">
            <ChartsWidget9 className="h-md-100" />
          </div>
        </div>
      </Content>
    </div>
  );
};

const LeadGeneration: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.LEADGENERATION" })}
      </PageTitle>
      <LeadGenerationPage />
    </>
  );
};

export { LeadGeneration };
