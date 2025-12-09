import { FC, SetStateAction, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { PageTitle } from "../../../_metronic/layout/core";
import { Content } from "../../../_metronic/layout/components/content";
import { FeedsWidget2 } from "../../../_metronic/partials/widgets";
import Pagination from "react-bootstrap/Pagination";
import { useAuth } from "../../modules/auth/core/Auth";
import { DOMAIN } from "../../routing/ApiEndpoints";
interface RowData {
  title: string;
  publish_date: string; // Adjust types as needed
  message: string;
  created_by: string;
  // Add other properties if needed
}

const StudentNoticeBoardPage: FC = () => {
  const [notices, setNotices] = useState<RowData[]>([]);

  const currentDate = new Date();
  const startOfMonth = new Date(currentDate);
  startOfMonth.setMonth(currentDate.getMonth() - 1); // One month before

  // const formattedStartDate = startOfMonth.toISOString().split("T")[0];
  // const c = currentDate.toISOString().split('T')[0];
  const currentDateOnly= currentDate.toISOString().split('T')[0];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate the index range for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = notices.slice(indexOfFirstItem, indexOfLastItem);
  const currentItems = Array.isArray(notices) ? notices.slice(indexOfFirstItem, indexOfLastItem) : [];


  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Optional, for smooth scrolling behavior
    });
  };

  // Change page
  const paginate = (pageNumber: SetStateAction<number>) => {
    setCurrentPage(pageNumber);
    scrollToTop();
  
  }
   
   
   // paginate(pageNumber);
  
const {currentUser}=useAuth();
 /* @ts-ignore */
const class_id = currentUser?.class_id;
// console.log("class id",class_id)

  useEffect(() => {

    // const start_date= formattedStartDate
    const start_date='2024-01-01'
    const end_date = currentDateOnly
    
    
    const fetchTimetableData = async () => {
      try {
        // const class_id = currentUser?.class_id;
        const response = await fetch(
          `${DOMAIN}/api/student/notice-board/latest-month-data/${class_id}/${start_date}/${end_date}`,
          // {
          //   method: "POST",
          //   headers: {
          //     "Content-Type": "application/json",
          //   },
          //   body: JSON.stringify({
          //     class_id: "5",
             
          //   }),
          // }
        );
        const data = await response.json();

        // Filter timetable data for the specific day
        setNotices(data);
      } catch (error) {
        console.error("Error fetching timetable data:", error);
      }
    };

    fetchTimetableData();
  }, [class_id]);


  return (
    <div
      className="p-5"
        // style={{    overflow:'auto'}}
       
    >
      <div className="body ">
        <div
          className="col-xxl-12 col-xl-12 col-lg-12 col-md-12"
          style={{
            borderRadius: "16px",
            border: "1px solid #F5F5F5",
           overflowX: "auto",
            maxHeight: "100%",
            height: "900px",
            display: "flex",
            flexDirection: "column",
            fontFamily: "Manrope",
          }}
        >
          <div style={{  width: "100%" }}  >
            <table
              className="col-xl-12 col-xl-10 col-lg-10 col-md-10 px-5"
              style={{
                borderRadius: "16px",
                top: "223px",
                height: "auto",
                maxHeight: "100%",
                borderCollapse: "collapse",
                border: "1px solid #e6e4e4",
                overflowX: "auto",
                whiteSpace: "nowrap",
                marginBottom: "20px", // Adjust margin bottom for the table
              //  
             
              }}
            >
              <thead
                className="col-xxl-12"
                style={{
                //   height: "123px",
                  maxHeight: "100%",
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "#F5F5F5",
                  justifyContent: "space-between",
                  zIndex: 999,
             position:'sticky',
            // overflow:'auto',
              top:'0'
                }}
              >
                <tr
                  style={{
                    borderRadius: "5px",
                  }}
                >
                  <td  style={{ padding: "20px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          width: "210px",
                          display: "flex",
                          gap: "10px",
                          border: "1px solid #DADADA",
                          padding: "7px 9px 8px 10px",
                          borderRadius: "42px",
                        }}
                      >
                        <div
                          className="form-check"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <input
                            className="form-check-input"
                            type="radio"
                            name="exampleRadios"
                            id="exampleRadios1"
                            style={{ width: "15px", height: "15px" }}
                            value="Cumulative"
                            defaultChecked
                          />
                          <label
                            className="form-check-label"
                            htmlFor="exampleRadios1"
                            style={{
                              fontSize: "12px",
                              fontWeight: "600",
                              color: "#252525",
                              fontFamily: "Manrope",
                            }}
                          >
                            All
                          </label>
                        </div>
                        <div
                          className="form-check"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <input
                            className="form-check-input"
                            type="radio"
                            name="exampleRadios"
                            id="exampleRadios2"
                            value="MOM"
                            style={{ width: "15px", height: "15px" }}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="exampleRadios2"
                            style={{
                              fontSize: "12px",
                              fontWeight: "600",
                              color: "#252525",
                              fontFamily: "Manrope",
                            }}
                          >
                            Todo
                          </label>
                        </div>
                        <div
                          className="form-check"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <input
                            className="form-check-input"
                            type="radio"
                            name="exampleRadios"
                            id="exampleRadios3"
                            value="Completed"
                            style={{ width: "15px", height: "15px" }}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="exampleRadios3"
                            style={{
                              fontSize: "12px",
                              fontWeight: "600",
                              color: "#252525",
                              fontFamily: "Manrope",
                            }}
                          >
                            Completed
                          </label>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </thead>
              <tbody>

              <Content>
                <div className="row gx-xl-8" >
                  {currentItems.map((rowData, index) => (
                    <div className="row-xl-3 p-5" key={index}>
                      <FeedsWidget2
                        className="min-h-100 mb-5 mb-xxl-5"
                        title={rowData.title}
                        date={rowData.publish_date}
                        message={rowData.message}
                        created_by={rowData.created_by}
                      />
                    </div>
                  ))}
                </div>
                
                <Pagination>
                  {Array.from({
                    length: Math.ceil(notices.length / itemsPerPage),
                  }).map((_, index) => (
                    <Pagination.Item
                      key={index}
                      active={index + 1 === currentPage}
                      onClick={() => {
                        
                        paginate(index + 1);
                      }}
                    >
                      {index + 1}
                      
                    </Pagination.Item>
                  ))}
                </Pagination>
              </Content>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>




    
  );
};





const StuNoticeBoard: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.HOMEWORK" })}
      </PageTitle>
      <StudentNoticeBoardPage />
    </>
  );
};

export { StuNoticeBoard };

{
  /* 
import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { PageTitle } from "../../../_metronic/layout/core";
import { Content } from "../../../_metronic/layout/components/content";
import { FeedsWidget2 } from "../../../_metronic/partials/widgets";

interface RowData {
  title: string;
  publish_date: string; // Adjust types as needed
  message: string;
  created_by: string;
  // Add other properties if needed
}

const StudentNoticeBoardPage: FC = () => {
  const [notices, setNotices] = useState<RowData[]>([]);


  const currentDate = new Date();
  const startOfMonth = new Date(currentDate);
  startOfMonth.setMonth(currentDate.getMonth() - 1); // One month before

  const formattedStartDate = startOfMonth.toISOString().split("T")[0];
  // const c = currentDate.toISOString().split('T')[0];

  useEffect(() => {
    const fetchTimetableData = async () => {
      try {
        // const class_id = currentUser?.class_id;
        const response = await fetch(
          "https://erp.innoveraschool.com/site/student_notices",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              class_id: "5",
              start_date: formattedStartDate,
              end_date: currentDate,
            }),
          }
        );
        const data = await response.json();
        console.log(data);

        // Filter timetable data for the specific day
        setNotices(data);
      } catch (error) {
        console.error("Error fetching timetable data:", error);
      }
    };

    fetchTimetableData();
  }, []);

  return (
    <div className="bg-body-secondary">
      <Content>
        <div>
          <span className="fs-2 fw-bold">Notice Board</span>
        </div>
        <div className="row gx-xl-8">
          {notices.map((rowData, index) => (
            <div className="col-xl-3 p-5" key={index}>
              <FeedsWidget2
                className="min-h-100 mb-5 mb-xxl-5"
                title={rowData.title}
                date={rowData.publish_date}
                message={rowData.message}
                created_by={rowData.created_by}
              />
            </div>
          ))}
        </div>
      </Content>
    </div>
  );
};

const StuNoticeBoard: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.HOMEWORK" })}
      </PageTitle>
      <StudentNoticeBoardPage />
    </>
  );
};

export { StuNoticeBoard };

*/
}
