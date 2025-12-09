/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { PageTitle } from "../../../_metronic/layout/core";
import { EngageWidget10 } from "../../../_metronic/partials/widgets";
import { Content } from "../../../_metronic/layout/components/content";
import { useAuth } from "../../modules/auth/core/Auth";
import { TablesWidget52 } from "../../../_metronic/partials/widgets/tables/TablesWidget52";
import { Dashboardheader } from "../../../_metronic/partials/components/student/DashboardHeader";
import { ListsWidget10 } from "../../../_metronic/partials/widgets/lists/ListsWidget10";
import { ListsWidget11 } from "../../../_metronic/partials/widgets/lists/ListsWidget11";
import {
  DOMAIN,
  get_school_count,
  get_company_count,
  get_assigned_subscription_count,
  get_module_count,
  get_school_details,
} from "../../routing/ApiEndpoints";
import ChartsWidget19 from "../../../_metronic/partials/widgets/charts/ChartsWidget19";
import SchoolEventsCalendar from "../../../_metronic/partials/widgets/_new/cards/SchoolEventsCalendar";
import { ToastContainer } from "react-bootstrap";
import { toast } from "react-toastify";
import { ChildProcess } from "child_process";

interface school {
  id: number;
  name: string;
  email: string;
  phone: number;
  sub_name: string;
  sub_date: string;
}

const useMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  return isMobile;
};

const DashboardPage: FC = () => {
  const { currentUser } = useAuth();
  const currency = currentUser?.currency_symbol;
  const school_id = currentUser?.school_id;
  const session_id = currentUser?.session_id;
  const isMobile = useMobile();

  const [totalSchools, setTotalSchools] = useState(0);
  const [activeCompany, setActiveCompany] = useState(0);
  const [totalsubscription, setTotalSubscription] = useState(0);
  const [assignedsubscription, setAssignedSubscription] = useState(0);
  const [modules, setActiveModules] = useState(0);
  const [totalModules, setTotalModules] = useState(0);
  const [schoolDetails, setSchoolDetails] = useState(0);
  const [studentsCount, setstudentsCount] = useState(0);
  const [staffCount, setstaffCount] = useState(0);
  const [feesCount, setFeesCount] = useState(0);
  const [dueFeesCount, setDueFeesCount] = useState(0);
  const [queryCount, setQueryCount] = useState(0);
  const [admissionQueryCount, setAdmissionQueryCount] = useState(0);
  const [pendingReviewCount, setPendingReviewCount] = useState(0);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchoolCount = async () => {
      try {
        const response = await fetch(`${DOMAIN}/${get_school_count}`);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setTotalSchools(data.totalSchools);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchCompanyCount = async () => {
      try {
        const response = await fetch(`${DOMAIN}/${get_company_count}`);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setActiveCompany(data.totalActiveUsers);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchSubscriptionsCount = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/${get_assigned_subscription_count}`
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setTotalSubscription(data.totalSubscriptions);
        setAssignedSubscription(data.assignedSubscriptions);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchModulesCount = async () => {
      try {
        const response = await fetch(`${DOMAIN}/${get_module_count}`);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setActiveModules(data.usedModules);
        setTotalModules(data.totalModules);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchSchoolDetails = async () => {
      try {
        const response = await fetch(`${DOMAIN}/${get_school_details}`);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setSchoolDetails(data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchStudentsCount = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-students-count-by-schoolid/${school_id}/${session_id}`
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setstudentsCount(data);
      } catch (err) {
        console.error(err.message);
      }
    };

    const fetchStaffCount = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-staff-count-by-schoolid/${school_id}`
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        // Check if data is valid and set a default value of 0 if it's undefined or null
        setstaffCount(data ?? 0);
      } catch (err) {
        console.error(err.message);
        setstaffCount(0); // Set to 0 in case of an error
      }
    };

    const fetchFeesCount = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-fees-collected-by-schoolid/${session_id}/${school_id}`
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        // Check if data is valid and contains the expected field
        setFeesCount(data?.total_amount_collected ?? 0); // Use nullish coalescing to set 0 if data is null/undefined
      } catch (err) {
        console.error(err.message);
        setFeesCount(0); // Set to 0 in case of an error
      }
    };

    const fetchDueFeesCount = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-due-fees-collected-by-schoolid/${session_id}/${school_id}`
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        // Check if data is valid and contains the expected field
        setDueFeesCount(data?.total_amount_due ?? 0); // Use nullish coalescing to set 0 if data is null/undefined
      } catch (err) {
        console.error(err.message);
        setDueFeesCount(0); // Set to 0 in case of an error
      }
    };

    const fetchEnquiryCount = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-enquiry-count/${session_id}/${school_id}`
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setQueryCount(data[0].total_entries);
      } catch (err) {
        console.error(err.message);
      }
    };

    const fetchAdmissionEnquiryCount = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-admission-enquiry-count/${session_id}/${school_id}`
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setAdmissionQueryCount(data[0].total_entries);
      } catch (err) {
        console.error(err.message);
      }
    };

    const fetchAdmissionEnquiryPendingReviewCount = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-admission-enquiry-pending-review-count/${session_id}/${school_id}`
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setPendingReviewCount(data[0].total_entries);
      } catch (err) {
        console.error(err.message);
      }
    };

    // Call all fetch functions
    if (session_id || currentUser || school_id) {
      fetchSchoolCount();
      fetchCompanyCount();
      fetchSubscriptionsCount();
      fetchModulesCount();
      fetchSchoolDetails();
      fetchStudentsCount();
      fetchStaffCount();
      fetchFeesCount();
      fetchDueFeesCount();
      fetchEnquiryCount();
      fetchAdmissionEnquiryCount();
      fetchAdmissionEnquiryPendingReviewCount();
    }
  }, [session_id, currentUser, school_id]);

  useEffect(() => {
    const prefetchUserRole = async () => {
      if (currentUser?.role_name) {
        const role = currentUser.role_name;

        // If role_name is "School Staff", set the designation
        if (role === "School Staff" && currentUser.designation) {
          setUserRole(currentUser.designation);
        } else {
          setUserRole(role);
        }
      }
    };

    prefetchUserRole();
  }, [currentUser, session_id, school_id]);

  const [socket, setSocket] = useState(null);

  // console.log(currentUser)

  // web socket
  useEffect(() => {
    // Only establish WebSocket connection if currentUser is authenticated
    if (!currentUser || !currentUser.role_name) {
      return;
    }

    // Create a new WebSocket connection
    const socket = new WebSocket("ws://localhost:8080");

    // On WebSocket connection open
    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    // Handle incoming messages
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // Check if the message's role matches the current user's role
      if (currentUser?.role_name.includes(data.role)) {
        // Optionally, you can add more checks for userId if needed
        toast(data.message); // Show a toast with the message
      }
    };

    // On WebSocket connection close
    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // Handle WebSocket errors
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Set the WebSocket instance in state
    setSocket(socket);

    // Cleanup WebSocket connection on component unmount
    return () => {
      socket.close();
    };
  }, [currentUser?.role_name]);

  return (
    <div className="bg-white">
      {userRole === "School Master" && (
        <Content>
          <div
            className={`row ${isMobile ? "g-3" : "g-5 g-xl-5"}`}
            style={{ maxHeight: isMobile ? "auto" : "160px" }}
          >
            <div className={`${isMobile ? "col-12" : "col-xxl-3"}`}>
              <div className="d-flex h-100">
                <EngageWidget10
                  title={"No. of Students"}
                  number={studentsCount}
                  image={"students"}
                  backgroundColor={"#1F3259"}
                  titlecolor={"#fff"}
                  textcolor={"#fff"}
                />
              </div>
            </div>

            <div className={`${isMobile ? "col-12" : "col-xxl-3"}`}>
              <div className="d-flex h-100">
                <EngageWidget10
                  title={"No. of Teachers"}
                  number={staffCount}
                  image={"teachers"}
                  backgroundColor={"#DFFFB6"}
                  titlecolor={"#1F3259"}
                  textcolor={"#29B837"}
                />
              </div>
            </div>
            <div className={`${isMobile ? "col-12" : "col-xxl-3"}`}>
              <div className="d-flex h-100">
                <EngageWidget10
                  title={"Yearly Fees Collected"}
                  number={currency + " " + feesCount}
                  image={"fees"}
                  backgroundColor={"#FFE7E1"}
                  titlecolor={"#1F3259"}
                  textcolor={"#FF5B5B"}
                />
              </div>
            </div>

            <div className={`${isMobile ? "col-12" : "col-xxl-3"}`}>
              <div className="d-flex h-100">
                <EngageWidget10
                  title={"Yearly Fees Due"}
                  number={`${currency} ${dueFeesCount}`}
                  image={"expense"}
                  backgroundColor={"#F2F6FF"}
                  titlecolor={"#1F3259"}
                  textcolor={"#1F3259"}
                />
              </div>
            </div>
          </div>

          <div className="row g-5">
            <div className="col-12 col-md-12 col-sm-12 col-lg-8">
              <SchoolEventsCalendar />
            </div>
            <div className="col-12 col-md-12 col-sm-12 col-lg-4">
              <TablesWidget52 />
            </div>
          </div>

          <div className="row">
            {/* <div className="col-xxl-12 mb-5 mb-xl-10">
              <ChartsWidget19 />
            </div> */}
          </div>
        </Content>
      )}
      {userRole === "School Admin" && (
        <Content>
          <div
            className={`row ${isMobile ? "g-3" : "g-5 g-xl-5"}`}
            style={{ maxHeight: isMobile ? "auto" : "160px" }}
          >
            <div className={`${isMobile ? "col-12" : "col-xxl-3"}`}>
              <EngageWidget10
                title={"No. of Students"}
                number={studentsCount}
                image={"students"}
                backgroundColor={"#1F3259"}
                titlecolor={"#fff"}
                textcolor={"#fff"}
              />
            </div>

            <div className={`${isMobile ? "col-12" : "col-xxl-3"}`}>
              <EngageWidget10
                title={"No. of Teacher"}
                number={staffCount}
                image={"teachers"}
                backgroundColor={"#DFFFB6"}
                titlecolor={"#1F3259"}
                textcolor={"#29B837"}
              />
            </div>
            <div className={`${isMobile ? "col-12" : "col-xxl-3"}`}>
              <EngageWidget10
                title={"Yearly Fees collected"}
                number={currency + " " + feesCount}
                image={"fees"}
                backgroundColor={"#FFE7E1"}
                titlecolor={"#1F3259"}
                textcolor={"#FF5B5B"}
              />
            </div>

            <div className={`${isMobile ? "col-12" : "col-xxl-3"}`}>
              <EngageWidget10
                title={"Yearly Fees Due"}
                number={`${currency} ${parseFloat(dueFeesCount).toFixed(2)}`}
                image={"expense"}
                backgroundColor={"#F2F6FF"}
                titlecolor={"#1F3259"}
                textcolor={"#1F3259"}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-xxl-8 col-lg-8 col-md-8 mb-xl-10">
              <SchoolEventsCalendar />
            </div>
            <div className="col-xxl-4 col-lg-4 col-md-4 mb-xl-10">
              <TablesWidget52 />
            </div>
          </div>
          {/* <div className="row">
            <div className="col-xxl-12 mb-5 mb-xl-10">
              <ChartsWidget19 />
            </div>
          </div> */}
        </Content>
      )}
      {userRole === "Teacher" && (
        <Content>
          <div
            className={`row ${isMobile ? "g-3" : "g-5 g-xl-5"}`}
            style={{ maxHeight: isMobile ? "auto" : "160px" }}
          >
            <div className={`${isMobile ? "col-12" : "col-xxl-3"}`}> 
              <EngageWidget10
                title={"No. of Students"}
                number={studentsCount}
                image={"students"}
                backgroundColor={"#1F3259"}
                titlecolor={"#fff"}
                textcolor={"#fff"}
              />
            </div>

            <div className={`${isMobile ? "col-12" : "col-xxl-3"}`}> 
              <EngageWidget10
                title={"No. of Teacher"}
                number={150}
                image={"teachers"}
                backgroundColor={"#DFFFB6"}
                titlecolor={"#1F3259"}
                textcolor={"#29B837"}
              />
            </div>
            <div className={`${isMobile ? "col-12" : "col-xxl-3"}`}> 
              <EngageWidget10
                title={"Monthly Fees Collection"}
                number={"₹0"}
                image={"fees"}
                backgroundColor={"#FFE7E1"}
                titlecolor={"#1F3259"}
                textcolor={"#FF5B5B"}
              />
            </div>

            <div className={`${isMobile ? "col-12" : "col-xxl-3"}`}> 
              <EngageWidget10
                title={"Monthly Expense"}
                number={"₹0"}
                image={"expense"}
                backgroundColor={"#F2F6FF"}
                titlecolor={"#1F3259"}
                textcolor={"#1F3259"}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-xxl-8 mb-xl-10">
              <SchoolEventsCalendar />
            </div>
            <div className="col-xxl-4 mb-5 mb-xl-10">
              <TablesWidget52 />
            </div>
          </div>
          {/* <div className="row">
            <div className="col-xxl-12 mb-5 mb-xl-10">
              <ChartsWidget19 />
            </div>
          </div> */}
        </Content>
      )}
      {userRole === "Accountant" && (
        <Content>
          <div className="row g-5 g-xl-5" style={{ maxHeight: "160px" }}>
            <div className="col-xxl-3">
              <EngageWidget10
                title={"No. of Students"}
                number={studentsCount}
                image={"students"}
                backgroundColor={"#1F3259"}
                titlecolor={"#fff"}
                textcolor={"#fff"}
              />
            </div>

            <div className="col-xxl-3">
              <EngageWidget10
                title={"No. of Teacher"}
                number={staffCount}
                image={"teachers"}
                backgroundColor={"#DFFFB6"}
                titlecolor={"#1F3259"}
                textcolor={"#29B837"}
              />
            </div>
            <div className="col-xxl-3">
              <EngageWidget10
                title={"Yearly Fees collected"}
                number={currency + " " + feesCount}
                image={"fees"}
                backgroundColor={"#FFE7E1"}
                titlecolor={"#1F3259"}
                textcolor={"#FF5B5B"}
              />
            </div>

            <div className="col-xxl-3">
              <EngageWidget10
                title={"Yearly Fees Due"}
                number={`${currency} ${parseFloat(dueFeesCount).toFixed(2)}`}
                image={"expense"}
                backgroundColor={"#F2F6FF"}
                titlecolor={"#1F3259"}
                textcolor={"#1F3259"}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-xxl-8 col-lg-8 col-md-8 mb-xl-10">
              <SchoolEventsCalendar />
            </div>
            <div className="col-xxl-4 col-lg-4 col-md-4 mb-xl-10">
              <TablesWidget52 />
            </div>
          </div>
          {/* <div className="row">
         <div className="col-xxl-12 mb-5 mb-xl-10">
           <ChartsWidget19 />
         </div>
       </div> */}
        </Content>
      )}
      {userRole === "Administrative Accountant" && (
        <Content>
          <div className="row g-5 g-xl-5" style={{ maxHeight: "160px" }}>
            <div className="col-xxl-3">
              <EngageWidget10
                title={"No. of Students"}
                number={studentsCount}
                image={"students"}
                backgroundColor={"#1F3259"}
                titlecolor={"#fff"}
                textcolor={"#fff"}
              />
            </div>

            <div className="col-xxl-3">
              <EngageWidget10
                title={"No. of Teacher"}
                number={staffCount}
                image={"teachers"}
                backgroundColor={"#DFFFB6"}
                titlecolor={"#1F3259"}
                textcolor={"#29B837"}
              />
            </div>
            <div className="col-xxl-3">
              <EngageWidget10
                title={"Yearly Fees collected"}
                number={currency + " " + feesCount}
                image={"fees"}
                backgroundColor={"#FFE7E1"}
                titlecolor={"#1F3259"}
                textcolor={"#FF5B5B"}
              />
            </div>

            <div className="col-xxl-3">
              <EngageWidget10
                title={"Yearly Fees Due"}
                number={`${currency} ${parseFloat(dueFeesCount).toFixed(2)}`}
                image={"expense"}
                backgroundColor={"#F2F6FF"}
                titlecolor={"#1F3259"}
                textcolor={"#1F3259"}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-xxl-8 col-lg-8 col-md-8 mb-xl-10">
              <SchoolEventsCalendar />
            </div>
            <div className="col-xxl-4 col-lg-4 col-md-4 mb-xl-10">
              <TablesWidget52 />
            </div>
          </div>
          {/* <div className="row">
         <div className="col-xxl-12 mb-5 mb-xl-10">
           <ChartsWidget19 />
         </div>
       </div> */}
        </Content>
      )}
      {userRole === "Content Creator" && (
        <Content>
          <div className="row g-5 g-xl-5" style={{ maxHeight: "160px" }}>
            <div className="col-xxl-3">
              <EngageWidget10
                title={"No. of Students"}
                number={studentsCount}
                image={"students"}
                backgroundColor={"#1F3259"}
                titlecolor={"#fff"}
                textcolor={"#fff"}
              />
            </div>

            <div className="col-xxl-3">
              <EngageWidget10
                title={"No. of Teacher"}
                number={staffCount}
                image={"teachers"}
                backgroundColor={"#DFFFB6"}
                titlecolor={"#1F3259"}
                textcolor={"#29B837"}
              />
            </div>
            <div className="col-xxl-3">
              <EngageWidget10
                title={"Yearly Fees collected"}
                number={currency + " " + feesCount}
                image={"fees"}
                backgroundColor={"#FFE7E1"}
                titlecolor={"#1F3259"}
                textcolor={"#FF5B5B"}
              />
            </div>

            <div className="col-xxl-3">
              <EngageWidget10
                title={"Yearly Fees Due"}
                number={`${currency} ${parseFloat(dueFeesCount).toFixed(2)}`}
                image={"expense"}
                backgroundColor={"#F2F6FF"}
                titlecolor={"#1F3259"}
                textcolor={"#1F3259"}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-xxl-8 col-lg-8 col-md-8 mb-xl-10">
              <SchoolEventsCalendar />
            </div>
            <div className="col-xxl-4 col-lg-4 col-md-4 mb-xl-10">
              <TablesWidget52 />
            </div>
          </div>
          {/* <div className="row">
         <div className="col-xxl-12 mb-5 mb-xl-10">
           <ChartsWidget19 />
         </div>
       </div> */}
        </Content>
      )}
      {userRole === "Academic Administrator" && (
        <Content>
          <div className="row g-5 g-xl-5" style={{ maxHeight: "160px" }}>
            <div className="col-xxl-3">
              <EngageWidget10
                title={"No. of Students"}
                number={studentsCount}
                image={"students"}
                backgroundColor={"#1F3259"}
                titlecolor={"#fff"}
                textcolor={"#fff"}
              />
            </div>

            <div className="col-xxl-3">
              <EngageWidget10
                title={"No. of Teacher"}
                number={staffCount}
                image={"teachers"}
                backgroundColor={"#DFFFB6"}
                titlecolor={"#1F3259"}
                textcolor={"#29B837"}
              />
            </div>
            <div className="col-xxl-3">
              <EngageWidget10
                title={"Yearly Fees collected"}
                number={currency + " " + feesCount}
                image={"fees"}
                backgroundColor={"#FFE7E1"}
                titlecolor={"#1F3259"}
                textcolor={"#FF5B5B"}
              />
            </div>

            <div className="col-xxl-3">
              <EngageWidget10
                title={"Yearly Fees Due"}
                number={`${currency} ${parseFloat(dueFeesCount).toFixed(2)}`}
                image={"expense"}
                backgroundColor={"#F2F6FF"}
                titlecolor={"#1F3259"}
                textcolor={"#1F3259"}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-xxl-8 col-lg-8 col-md-8 mb-xl-10">
              <SchoolEventsCalendar />
            </div>
            <div className="col-xxl-4 col-lg-4 col-md-4 mb-xl-10">
              <TablesWidget52 />
            </div>
          </div>
          {/* <div className="row">
         <div className="col-xxl-12 mb-5 mb-xl-10">
           <ChartsWidget19 />
         </div>
       </div> */}
        </Content>
      )}
      {userRole === "General Admin" && (
        <Content>
          <div className="row g-5 g-xl-5" style={{ maxHeight: "160px" }}>
            <div className="col-xxl-3">
              <EngageWidget10
                title={"No. of Students"}
                number={studentsCount}
                image={"students"}
                backgroundColor={"#1F3259"}
                titlecolor={"#fff"}
                textcolor={"#fff"}
              />
            </div>

            <div className="col-xxl-3">
              <EngageWidget10
                title={"No. of Teacher"}
                number={staffCount}
                image={"teachers"}
                backgroundColor={"#DFFFB6"}
                titlecolor={"#1F3259"}
                textcolor={"#29B837"}
              />
            </div>
            <div className="col-xxl-3">
              <EngageWidget10
                title={"Yearly Fees collected"}
                number={currency + " " + feesCount}
                image={"fees"}
                backgroundColor={"#FFE7E1"}
                titlecolor={"#1F3259"}
                textcolor={"#FF5B5B"}
              />
            </div>

            <div className="col-xxl-3">
              <EngageWidget10
                title={"Yearly Fees Due"}
                number={`${currency} ${parseFloat(dueFeesCount).toFixed(2)}`}
                image={"expense"}
                backgroundColor={"#F2F6FF"}
                titlecolor={"#1F3259"}
                textcolor={"#1F3259"}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-xxl-8 col-lg-8 col-md-8 mb-xl-10">
              <SchoolEventsCalendar />
            </div>
            <div className="col-xxl-4 col-lg-4 col-md-4 mb-xl-10">
              <TablesWidget52 />
            </div>
          </div>
          {/* <div className="row">
         <div className="col-xxl-12 mb-5 mb-xl-10">
           <ChartsWidget19 />
         </div>
       </div> */}
        </Content>
      )}
      {userRole === "Office Staff" && (
        <Content>
          <div className="row g-5 g-xl-5" style={{ maxHeight: "160px" }}>
            <div className="col-xxl-3">
              <EngageWidget10
                title={"No. of Enquires"}
                number={queryCount}
                image={"enquiry"}
                backgroundColor={"#FFE7E1"}
                titlecolor={"#1F3259"}
                textcolor={"#FF5B5B"}
              />
            </div>

            <div className="col-xxl-3">
              <EngageWidget10
                title={"Confirmed Admissions"}
                number={admissionQueryCount}
                image={"admission"}
                backgroundColor={"#F2F6FF"}
                titlecolor={"#1F3259"}
                textcolor={"#1F3259"}
              />
            </div>
            <div className="col-xxl-3">
              <EngageWidget10
                title={"No. of Students"}
                number={studentsCount}
                image={"students"}
                backgroundColor={"#1F3259"}
                titlecolor={"#fff"}
                textcolor={"#fff"}
              />
            </div>

            <div className="col-xxl-3">
              <EngageWidget10
                title={"Pending Reviews"}
                number={pendingReviewCount}
                image={"teachers"}
                backgroundColor={"#DFFFB6"}
                titlecolor={"#1F3259"}
                textcolor={"#29B837"}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-xxl-12 mb-xl-10">
              <SchoolEventsCalendar />
            </div>
          </div>
        </Content>
      )}
      {userRole === "Super Admin" && (
        <Content>
          <div
            className="container-fluid mt-4"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "25px",
              fontFamily: "Manrope",
            }}
          >
            <div className="row">
              {/* Number of Schools Card */}
              <div className="col-md-3 mb-4">
                <div
                  className="card"
                  style={{
                    width: "100%",
                    backgroundColor: "#1F3259",
                    color: "#fff",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div className="card-body">
                    <h5
                      className="card-title"
                      style={{
                        fontFamily: "Manrope",
                        fontSize: "18px",
                        color: "#fff",
                      }}
                    >
                      Total{" "}
                      <span style={{ fontWeight: "900" }}>Companies :</span>
                    </h5>
                    <p
                      className="card-text"
                      style={{
                        fontFamily: "Manrope",
                        fontSize: "28px",
                        fontWeight: "800",
                      }}
                    >
                      {activeCompany ? activeCompany : "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Active Users Card */}
              <div className="col-md-3 mb-4">
                <div
                  className="card"
                  style={{
                    width: "100%",
                    backgroundColor: "#DFFFB6",
                    color: "#29B837",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div className="card-body">
                    <h5
                      className="card-title"
                      style={{
                        fontFamily: "Manrope",
                        fontSize: "18px",
                        color: "#1F3259",
                      }}
                    >
                      Total <span style={{ fontWeight: "900" }}>Schools :</span>
                    </h5>
                    <p
                      className="card-text"
                      style={{
                        fontFamily: "Manrope",
                        fontSize: "28px",
                        fontWeight: "800",
                      }}
                    >
                      {totalSchools ? totalSchools : "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Subscription Expiring Soon Card */}
              <div className="col-md-3 mb-4">
                <div
                  className="card"
                  style={{
                    width: "100%",
                    backgroundColor: "#FFE7E1",
                    color: "#FF5B5B",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div className="card-body">
                    <h5
                      className="card-title"
                      style={{
                        fontFamily: "Manrope",
                        fontSize: "18px",
                        color: "#1F3259",
                      }}
                    >
                      Active{" "}
                      <span style={{ fontWeight: "900" }}>Subscriptions :</span>
                    </h5>
                    <p
                      className="card-text"
                      style={{
                        fontFamily: "Manrope",
                        fontSize: "28px",
                        fontWeight: "800",
                      }}
                    >
                      {assignedsubscription ? assignedsubscription : "-"} /{" "}
                      {totalsubscription ? totalsubscription : "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pending Support Tickets Card */}
              <div className="col-md-3 mb-4">
                <div
                  className="card"
                  style={{
                    width: "100%",
                    backgroundColor: "#F2F6FF",
                    color: "#1F3259",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div className="card-body">
                    <h5
                      className="card-title"
                      style={{ fontFamily: "Manrope", fontSize: "18px" }}
                    >
                      Used <span style={{ fontWeight: "900" }}>Modules :</span>
                    </h5>
                    <p
                      className="card-text"
                      style={{
                        fontFamily: "Manrope",
                        fontSize: "28px",
                        fontWeight: "800",
                      }}
                    >
                      {modules ? modules : "-"} /
                      {totalModules ? totalModules : "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tenant Management Section */}
            <div className="row">
              <div className="col-md-12" style={{ height: "500px" }}>
                <div
                  className="card-style"
                  style={{
                    width: "100%",
                    borderRadius: "16px",
                    backgroundColor: "rgb(242, 246, 255)",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    overflow: "hidden",
                    marginTop: "20px",
                    padding: "20px",
                  }}
                >
                  <div
                    className="card-header"
                    style={{
                      backgroundColor: "rgb(242, 246, 255)",
                      padding: "16px 20px",
                      borderBottom: "1px solid #E0E4F0",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "15px",
                        fontWeight: "400",
                        color: "#1C335C",
                        fontFamily: "Manrope",
                      }}
                    >
                      <h5
                        className="card-title"
                        style={{ fontFamily: "Manrope", fontSize: "18px" }}
                      >
                        Schools Management
                      </h5>
                      <p>View all the school tenant information here.</p>
                    </span>
                  </div>
                  <div
                    style={{
                      height: "auto", // Fixed height for the table container
                      overflowY: "auto", // Enable vertical scrolling
                      padding: "16px 0", // Optional: adds some padding around the table
                    }}
                  >
                    <table
                      className="table"
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        marginTop: "10px",
                        backgroundColor: "#FFFFFF", // White background for the table
                        borderRadius: "12px", // Round corners for the table
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)", // Light shadow for the table
                      }}
                    >
                      <thead>
                        <tr
                          style={{
                            backgroundColor: "rgb(242, 246, 255)", // Header background color
                            borderBottom: "1px solid #E0E4F0",
                            fontFamily: "Manrope",
                            fontWeight: "600",
                            color: "#1C335C",
                            fontSize: "14px",
                          }}
                        >
                          <th
                            style={{
                              padding: "12px 20px",
                              textAlign: "left",
                            }}
                          >
                            #
                          </th>
                          <th
                            style={{
                              padding: "12px 20px",
                              textAlign: "left",
                            }}
                          >
                            Company Name
                          </th>
                          <th
                            style={{
                              padding: "12px 20px",
                              textAlign: "left",
                            }}
                          >
                            School Name
                          </th>
                          <th
                            style={{
                              padding: "12px 20px",
                              textAlign: "left",
                            }}
                          >
                            Subscription
                          </th>
                          <th
                            style={{
                              padding: "12px 20px",
                              textAlign: "left",
                            }}
                          >
                            Email
                          </th>
                          <th
                            style={{
                              padding: "12px 20px",
                              textAlign: "left",
                            }}
                          >
                            Phone
                          </th>
                          <th
                            style={{
                              padding: "12px 20px",
                              textAlign: "left",
                            }}
                          >
                            Assigned On
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {schoolDetails.length > 0 ? (
                          schoolDetails.map((tenant, index) => (
                            <tr
                              key={tenant.id}
                              style={{
                                backgroundColor:
                                  index % 2 === 0
                                    ? "rgb(242, 246, 255)"
                                    : "#FFFFFF",
                                borderBottom: "1px solid #E0E4F0",
                                fontFamily: "Manrope",
                                fontSize: "14px",
                                color: "#1C335C",
                              }}
                            >
                              <td
                                style={{
                                  padding: "12px 20px",
                                }}
                              >
                                {index + 1}
                              </td>
                              <td
                                style={{
                                  padding: "12px 20px",
                                }}
                              >
                                {tenant.company_name}
                              </td>
                              <td
                                style={{
                                  padding: "12px 20px",
                                }}
                              >
                                {tenant.name}
                              </td>
                              <td
                                style={{
                                  padding: "12px 20px",
                                }}
                              >
                                {tenant.sub_name}
                              </td>
                              <td
                                style={{
                                  padding: "12px 20px",
                                }}
                              >
                                {tenant.email}
                              </td>
                              <td
                                style={{
                                  padding: "12px 20px",
                                }}
                              >
                                {tenant.phone}
                              </td>

                              <td
                                style={{
                                  padding: "12px 20px",
                                }}
                              >
                                {new Date(tenant.sub_date).toLocaleString()}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="text-center">
                              No tenants available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Content>
      )}
      {userRole === "student" && (
        <Content>
          {/* <HeaderWrapper /> */}
          <Dashboardheader />

          <div className="row gy-5 g-xl-8">
            <div className="col-xl-4">
              <ListsWidget11 className="card-xl-stretch mb-xl-8" />
            </div>
            <div className="col-xl-4">
              <ListsWidget10 className="card-xl-stretch mb-xl-8" />
            </div>
            <div className="col-xl-4">
              {/* <ListsWidget4 className='card-xl-stretch mb-5 mb-xl-8' items={5} /> */}
            </div>
          </div>
        </Content>
      )}
    </div>
  );
};

const DashboardWrapper: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.DASHBOARD" })}
      </PageTitle>
      <DashboardPage />
    </>
  );
};

export { DashboardWrapper };
