import { FC, SetStateAction, useState } from "react";
import { useIntl } from "react-intl";
import { PageTitle } from "../../../../_metronic/layout/core";
import {
  TablesWidget22,
  CardsWidget14,
  CardsWidget13,
  CardsWidget12,
  ChartsWidget14,
  ChartsWidget18,
  TablesWidget32,
} from "../../../../_metronic/partials/widgets";
import { Content } from "../../../../_metronic/layout/components/content";
import { ToolbarFeeMaster } from "../../../../_metronic/layout/components/toolbar/toolbars";
import { HeaderWrapper } from "../../../../_metronic/layout/components/header_staff";
import { CardsWidget6 } from "../../../../_metronic/partials/widgets/_new/cards/CardsWidget6";

const FeeDetailsPage: FC = () => {
  const [displayComponent, setDisplayComponent] = useState("chart");
  const [selectedValue, setSelectedValue] = useState("current_year");
  // console.log(selectedValue);
  

  const handleSelectValue = (value: SetStateAction<null>) => {
     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
    setSelectedValue(value);
  };
  const handleToggle = (value: string) => {
    setDisplayComponent(value);
  };

  return (
    <div className="bg-white">
      <HeaderWrapper toggleView={handleToggle} />
      {displayComponent === "list" ? (
        <div>
        <ToolbarFeeMaster onSelectValue={handleSelectValue} />
          <Content>
            <div className="col-xxl-12"
              style={{
                // width: "1367px",
                // height: "696px",
                top: "114px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <TablesWidget32 />
            </div>
          </Content>
        </div>
      ) : (
        <div>
          <ToolbarFeeMaster onSelectValue={handleSelectValue} />
          <Content>
            <div className="row">
              <div className="col-md-12 col-lg-12 col-xl-12 col-xxl-6">
                <div className="row p-0 mb-5 mb-xl-5">
                  <div
                    className="col-md-12 col-lg-12 col-xl-12 col-xxl-12 mb-5 mb-xl-5"
                  >
                    <div className="h-md-100">
                      
                      <CardsWidget6  
                       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
                      selectedValue={selectedValue} />
                    </div>
                  </div>
                  <div
                    className="col-md-12 col-lg-12 col-xl-12 col-xxl-12"
                  >
                    <div className="h-md-100">
                      <TablesWidget22 
                       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
                      selectedValue={selectedValue}/>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-12 col-lg-12 col-xl-12 col-xxl-6">
                <div className="row p-0 mb-5 mb-xl-5">
                  <div className="col-md-12 col-lg-12 col-xl-6 col-xxl-8">
                    <div className="h-md-100">
                      <CardsWidget14 
                       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            selectedValue={selectedValue}
                      />
                    </div>
                  </div>

                  <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-4">
                    <div className="col-md-9 col-lg-7 col-xl-7 col-xxl-12 mb-xl-2 mb-5 mb-xl-5">
                      <div className="h-md-100">
                        <CardsWidget13 
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            selectedValue={selectedValue}
                        />
                      </div>
                    </div>

                      <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-12">
                        <div className="h-md-100">
                          <CardsWidget12 />
                        </div>
                      </div>
                  </div>
                </div>
                <div className="col-md-12 col-lg-12 col-xl-12 col-xxl-12 mb-xl-6">
                  <div className="h-md-100">
                    <ChartsWidget14 
                     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            selectedValue={selectedValue}
                    />
                  </div>
                </div>
                <div className="col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                  <div className="h-md-100">
                    <ChartsWidget18 
                     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            selectedValue={selectedValue}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Content>
        </div>
      )}
    </div>
  );
};

const EnquiryReport: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.FEEDETAILS" })}
      </PageTitle>
      <FeeDetailsPage />
    </>
  );
};

export default EnquiryReport ;
