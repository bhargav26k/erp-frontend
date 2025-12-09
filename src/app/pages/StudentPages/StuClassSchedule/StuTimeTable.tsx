import { FC, SetStateAction, useState } from "react";
import { useIntl } from "react-intl";
import { PageTitle } from "../../../../_metronic/layout/core";
import { Content } from "../../../../_metronic/layout/components/content";
import { HeaderWrapper } from "../../../../_metronic/layout/components/header_student";
import { ToolbarStudent } from "../../../../_metronic/layout/components/toolbar/toolbars/ToolbarStudent";
import { TablesWidget25 } from "../../../../_metronic/partials/widgets";

const StudentTimeTablePage: FC = () => {
  const [view, setView] = useState('week'); // Initialize view state with 'week'
  const [toolBarAction, setToolBarAction] = useState(null); // Initialize view state with 'week'
  const [dateTextValue, setDateTextValue] = useState(null);
  const [clickCount, setClickCount] = useState(0);

  const handleViewChange = (newView: SetStateAction<string>) => {
    // Update the view state when the view changes
    setView(newView);
  };
  const handleToolbarAction = (toolbarAction: SetStateAction<null>) =>{
    setToolBarAction(toolbarAction);
  }
  const handleDateText =(datetext: SetStateAction<null>)=>{
    // console.log(datetext);
    setDateTextValue(datetext)
    
  }
  const handleClickCount = (click: SetStateAction<number>) =>{
    setClickCount(click)
  }
  return (
    <div className="bg-white">
        <HeaderWrapper title={"Time Table"} />
      <ToolbarStudent onViewChange={handleViewChange}  toolbarCall={handleToolbarAction} DateText={dateTextValue} clickCount={handleClickCount}/>
      <Content>

      <div className="row">
              <div
                className="col-xxl-12"
                style={{
                  top: "114px",
                  display: "flex",
                  flexDirection: "column",
                  fontFamily:"Manrope",
                }}
              >
                <TablesWidget25 defaultViewProp={view} toolbarAction={toolBarAction} DateText={handleDateText} Clicks={clickCount}/>
              </div>
            </div>
      </Content>
    </div>
  );
};

const StuTimeTable: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "Class Schedule" })}
      </PageTitle>
      <StudentTimeTablePage />
    </>
  );
};

export { StuTimeTable };
