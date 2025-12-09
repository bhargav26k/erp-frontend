import { useAuth } from "../../../../app/modules/auth/core/Auth";
// import { useState } from "react";
import { KTIcon } from "../../../../_metronic/helpers";
import { Dropdown1 } from "../../../../_metronic/partials";
// import { StudentProfile } from "../../../../app/modules/dashboardprofile/StudentProfile";
// import { StudentFees } from "../../../../app/modules/dashboardprofile/StudentFees";
// import { StudentExam } from "../../../../app/modules/dashboardprofile/StudentExam";
// import { StudentDocuments } from "../../../../app/modules/dashboardprofile/StudentDocuments";
// import { StudentTimeline } from "../../../../app/modules/dashboardprofile/StudentTimline";
// import { CardsWidget17 } from "../../widgets";

const Dashboardheader = () => {
  const { currentUser } = useAuth();
  // const [activeTab, setActiveTab] = useState("overview");

  // const handleTabClick = (tab: string) => {
  //   setActiveTab(tab);
  // };

  return (
    <div>
      <div className="card mb-5 mb-xl-10">
        <div className="card-body pt-9 pb-0">
          <div className="d-flex flex-wrap flex-sm-nowrap mb-3">
            <div className="me-7 mb-4">
              <div className="symbol symbol-100px symbol-lg-160px symbol-fixed position-relative">
                <img src={"/media/avatars/300-1.jpg"} alt="Metornic" />
                <div className="position-absolute translate-middle bottom-0 start-100 mb-6 bg-success rounded-circle border border-4 border-white h-20px w-20px"></div>
              </div>
            </div>

            <div className="flex-grow-1">
              <div className="d-flex  justify-content-between align-items-start flex-wrap mb-2">
                <div className="d-flex flex-column mt-5">
                  <div className="d-flex align-middle w-[350px]">
                    <span className="text-gray-800 d-flex align-middle fs-5 fw-bolder me-1 d-flex">
                      Student's name :{" "}
                    </span>
                    <a
                      href="#"
                      className="text-gray-700 d-flex align-middle text-hover-primary fs-5 ms-2 me-2 d-flex"
                    >
                      {currentUser ? (
                        <p>
                          {currentUser?.firstname +
                            " " +
                            currentUser.middlename +
                            " " +
                            currentUser.lastname}
                        </p>
                      ) : (
                        <p>Loading...</p>
                      )}
                    </a>
                    <a className="mt-1" href="#">
                      <KTIcon iconName="verify" className="fs-1 text-primary" />
                    </a>
                  </div>
                  <div className="d-flex align-middle w-[350px]">
                    <span className="text-gray-800 d-flex align-middle fs-5 fw-bolder me-1 d-flex">
                      Admission No :{" "}
                    </span>
                    <a
                      href="#"
                      className="text-gray-800 d-flex align-middle text-hover-primary fs-5  me-1 d-flex"
                    >
                      {currentUser ? (
                        <p>{currentUser?.admission_no}</p>
                      ) : (
                        <p>Loading...</p>
                      )}
                    </a>
                  </div>
                  <div className="d-flex align-middle w-[350px]">
                    <span className="text-gray-800 d-flex align-middle fs-5 fw-bolder me-1 d-flex">
                      Student's Email :{" "}
                    </span>
                    <a
                      href="#"
                      className="text-gray-800 d-flex align-middle text-hover-primary fs-5  me-1 d-flex"
                    >
                      {currentUser ? (
                        <p>{currentUser?.email}</p>
                      ) : (
                        <p>Loading...</p>
                      )}
                    </a>
                  </div>
                  <div className="d-flex align-middle w-[350px]">
                    <span className="text-gray-800 d-flex align-middle   fs-5 fw-bolder me-1 d-flex">
                      Student's Roll No :{" "}
                    </span>
                    <a
                      href="#"
                      className="text-gray-800 d-flex align-middle text-hover-primary fs-5  me-1 d-flex"
                    >
                      {currentUser ? (
                        <p>{currentUser?.roll_no}</p>
                      ) : (
                        <p>Loading...</p>
                      )}
                    </a>
                  </div>
                </div>

                <div className="d-flex my-4">
                  <a
                    href="#"
                    className="btn btn-sm btn-light me-2"
                    id="kt_user_follow_button"
                  >
                    <KTIcon iconName="check" className="fs-5 d-none" />

                    <span className="indicator-label">Follow</span>
                    <span className="indicator-progress">
                      Please wait...
                      <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                    </span>
                  </a>
                  <a
                    href="#"
                    className="btn btn-sm btn-primary me-3"
                    data-bs-toggle="modal"
                    data-bs-target="#kt_modal_offer_a_deal"
                  >
                    Hire Me
                  </a>
                  <div className="me-0">
                    <button
                      className="btn btn-sm btn-icon btn-bg-light btn-active-color-primary"
                      data-kt-menu-trigger="click"
                      data-kt-menu-placement="bottom-end"
                      data-kt-menu-flip="top-end"
                    >
                      <i className="bi bi-three-dots fs-5"></i>
                    </button>
                    <Dropdown1 />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="d-flex overflow-auto h-55px">
            <ul className="nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bolder flex-nowrap">
              <li className="nav-item">
                <button
                  className={`nav-link text-active-primary me-6 `}
                  onClick={() => handleTabClick("overview")}
                >
                  Overview
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link text-active-primary me-6 ${
                    activeTab === "fees" && "active"
                  }`}
                  onClick={() => handleTabClick("fees")}
                >
                  Fees
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link text-active-primary me-6 ${
                    activeTab === "exam" && "active"
                  }`}
                  onClick={() => handleTabClick("exam")}
                >
                  Exam
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link text-active-primary me-6 ${
                    activeTab === "documents" && "active"
                  }`}
                  onClick={() => handleTabClick("documents")}
                >
                  Documents
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link text-active-primary me-6 ${
                    activeTab === "timeline" && "active"
                  }`}
                  onClick={() => handleTabClick("timeline")}
                >
                  Timeline
                </button>
              </li>
            </ul>
          </div> */}
        </div>
      </div>
      {/* <div>
        <CardsWidget17 />
      </div> */}
      {/* <div>
        {activeTab === "overview" && <StudentProfile />}
        {activeTab === "fees" && <StudentFees />}
        {activeTab === "exam" && <StudentExam />}
        {activeTab === "documents" && <StudentDocuments />}
        {activeTab === "timeline" && <StudentTimeline />}
      </div> */}
    </div>
  );
};
export { Dashboardheader };
