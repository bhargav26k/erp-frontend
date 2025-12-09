import { FC, useState } from "react";
import { useIntl } from "react-intl";
import { PageTitle } from "../../../../_metronic/layout/core";
import {
  TablesWidget10,
  CardsWidget16,
  ChartsWidget15,
  CardsWidget11,
  CardsWidget10,
  TablesWidget23,
} from "../../../../_metronic/partials/widgets";
import { Content } from "../../../../_metronic/layout/components/content";
import { ToolbarFeeMaster } from "../../../../_metronic/layout/components/toolbar/toolbars";
import { HeaderWrapper } from "../../../../_metronic/layout/components/header_staff";

const AdmissionsPage: FC = () => {
  const [displayComponent, setDisplayComponent] = useState("chart");
  const [selectedValue, setSelectedValue] = useState("current_year");

  // @ts-expect-error    
  const handleSelectValue = (value) => {
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
            <div className="row">
              <div
                className="col-xxl-12"
                style={{
                  top: "114px",
                  display: "flex",
                  flexDirection: "column",
                  fontFamily: "Manrope",
                }}
              >
                <TablesWidget10 />
              </div>
            </div>
          </Content>
        </div>
      ) : (
        <div>
          <ToolbarFeeMaster onSelectValue={handleSelectValue} />
          <Content>
            <div className="row">
              <div className="col-md-12 col-lg-12 col-xl-12 col-xxl-5">
                <div className="row p-0 mb-5 mb-xl-5" style={{ gap: "auto" }}>
                  <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-6 ">
                    <div className="h-md-100 ">
                      <CardsWidget11 />
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-6 ">
                    <div className=" h-md-100 ">
                      <CardsWidget10 />
                    </div>
                  </div>
                </div>

                <div className=" col-md-12 col-lg-12 col-xl-12 col-xxl-12 ">
                  <div className=" h-md-100">
                    <TablesWidget23
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-expect-error
                      selectedValue={selectedValue}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-12 col-lg-12 col-xl-12 col-xxl-7">
                <div className="col-md-12 col-lg-12 col-xl-12 col-xxl-12 ">
                  <div className="h-md-100 mb-5 mb-xl-5">
                    <CardsWidget16
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-expect-error
                      selectedValue={selectedValue}
                    />
                  </div>
                </div>
                <div className=" col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                  <div className=" h-md-100">
                    <ChartsWidget15
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

const Admissions: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.Admissions" })}
      </PageTitle>
      <AdmissionsPage />
    </>
  );
};

export default Admissions;
