/* eslint-disable @typescript-eslint/no-unused-vars */
// routesConfig.js

import { DashboardWrapper } from "../pages/dashboard/DashboardWrapper";
// import { MenuTestPage } from "../pages/MenuTestPage";
// import { BuilderPageWrapper } from "../pages/layout-builder/BuilderPageWrapper";
// import { FeeDetails } from "../pages/StaffPages/FinancialManagement/FeeDetails";
// import { LeadGeneration } from "../pages/StaffPages/LeadGeneration/LeadGeneration";
// import { ViewFeeMaster } from "../pages/StaffPages/FinancialManagement/ViewFeeMaster";
// import { Income } from "../pages/StaffPages/IncomeExpenseDash/Income";
// import UserAdminPage from "../modules/user-userRoles/UserAdminPage";
// import { StuTimeTable } from "../pages/StudentPages/StuClassSchedule/StuTimeTable";
// import { StuFees } from "../pages/StudentPages/StuFees";
// import { StuHomeWork } from "../pages/StudentPages/StuHomework/StuHomeWork";
// import { StuApplyLeave } from "../pages/StudentPages/StuApplyLeave";
// import { StuNoticeBoard } from "../pages/StudentPages/StuNoticeBoard";
// import StuAttendance from "../pages/StudentPages/StuAttendance";
// import { StuSyllabusStatus } from "../pages/StudentPages/StuSyllabusStatus";
// import StuAssignments from "../pages/StudentPages/StuAssignments";
// import StuBookIssued from "../pages/StudentPages/StuBookIssued";
// import StuBooks from "../pages/StudentPages/StuBooks";
// import StuExamResult from "../pages/StudentPages/StuExamResult";
// import StuHostelRoom from "../pages/StudentPages/StuHostelRoom";
// import StuLessonPlan from "../pageCourseContentManagements/StudentPages/StuLessonPlan";
// import StuOnlineExam from "../pages/StudentPages/StuOnlineExam";
// import StuOtherDownload from "../pages/StudentPages/StuOtherDownload";
// import StuStudyMaterial from "../pages/StudentPages/StuStudyMaterial";
// import StuSyllabus from "../pages/StudentPages/StuSyllabus";
// import StuTransportRoute from "../pages/StudentPages/StuTransportRoute";
// import StuExamSchedule from "../pages/StudentPages/StuExamSchedule";
// import  EnquiryReport  from "../pages/StaffPages/AnalyticsAndReporting/EnquiryReport";
// import { Admissions } from "../pages/StaffPages/Admission/Admissions";
// import { ManageAdmins } from "../pages/SuperAdminPages/ManageAdmins";
// import { ManageSchools } from "../pages/SuperAdminPages/ManageSchools";
// import  ManageModules  from "../pages/SuperAdminPages/ManageSchools";
// import  UserRoles  from "../pages/StaffPages/SystemSettings/UserRoles";
// import  UserRolesPermission  from "../pages/StaffPages/SystemSettings/UserRolesPermission";
// import { Staff } from "../pages/StaffPages/User.tsx/Staff";
// import { Student } from "../pages/StaffPages/User.tsx/Student";
// import { Expense } from "../pages/StaffPages/Expense/Expense";
// import { StudentDetails } from "../pages/StaffPages/Student_Information/StudentDetails";
// import  StudentProfiles  from "../pages/StaffPages/StudentManagement/StudentProfiles";
import  LMSDashboard  from "../pages/StaffPages/LearningManagementSystem/LMSDashboard";
import  CourseContentManagement from "../pages/StaffPages/LearningManagementSystem/CourseContentManagement";
import  SelectSections  from "../pages/StaffPages/LearningManagementSystem/SelectSections";
import  SelectSubject  from "../pages/StaffPages/LearningManagementSystem/SelectSubject";
import { SelectLesson } from "../pages/StaffPages/LearningManagementSystem/SelectLesson";
import ClassWiseMaterial from "../pages/StaffPages/LearningManagementSystem/ClassWiseMaterial";
import { SelectTopic } from "../pages/StaffPages/LearningManagementSystem/SelectTopic";
import { AssignmentsManagement } from "../pages/StaffPages/LearningManagementSystem/AssignmentsManagement";
import CheckAssignments from "../pages/StaffPages/LearningManagementSystem/CheckAssignments";
import { Assignments } from "../pages/StudentPages/Lms/Assignments";
import { CourseContent } from "../pages/StudentPages/Lms/CourseContent";
import { StudenLessons } from "../pages/StudentPages/Lms/StudentLessons";
import { StudenTopics } from "../pages/StudentPages/Lms/StudentTopics";
import { StudenTopicMaterial } from "../pages/StudentPages/Lms/StudentTopicMaterial";
// import { Class } from "../pages/StaffPages/AcademicManagement/Class";
// import { Section } from "../pages/StaffPages/AcademicManagement/Section";
// import { Subject } from "../pages/StaffPages/AcademicManagement/Subject";
// import { ClassroomResource } from "../pages/StaffPages/AcademicManagement/ClassroomResource";
// import { ClassTimetable } from "../pages/StaffPages/AcademicManagement/ClassTimetable";
// import { PromoteStudent } from "../pages/StaffPages/AcademicManagement/PromoteStudent";
// import { SchoolProfile  from "../pages/SuperAdminPages/SchoolProfile";
// import { ManageRoles } from "../pages/SuperAdminPages/ManageRoles";
// import { OnboardingRequest } from "../pages/SuperAdminPages/OnboradingRequest";
// import { ClassSchedule } from "../pages/StaffPages/AcademicManagement/ClassSchedule";
// import { TeachersTimetable } from "../pages/StaffPages/AcademicManagement/TeachersTimetable";
// import { AssignTeacher } from "../pages/StaffPages/AcademicManagement/AssignTeacher";
// import { SubjectGroup } from "../pages/StaffPages/AcademicManagement/SubjectGroup";
// import { GradingSystem } from "../pages/StaffPages/AcademicManagement/GradingSystem";
// import { SolpReports } from "../pages/StaffPages/AcademicManagement/SolpReports";
// import  VisitorManagement  from "../pages/StaffPages/FrontOffice/VisitorManagement";
// import  PhoneCallLog  from "../pages/StaffPages/FrontOffice/PhoneCallLog";
// import  MailAndDispatchManagement  from "../pages/StaffPages/FrontOffice/MailAndDispatchManagement";
// import { DisableStudent } from "../pages/StaffPages/StudentManagement/DisableStudent";
// import  EmployeeManagement  from "../pages/StaffPages/HumanResource/EmployeeManagement";
// import  EnquiryManagement  from "../pages/StaffPages/FrontOffice/EnquiryManagement";
// import { AdmissionEnquiry } from "../pages/StaffPages/AdmissionsAndEnrollment/AdmissionEnquiry";
// import { ApplicationReview } from "../pages/StaffPages/AdmissionsAndEnrollment/ApplicationReview";
// import { AdmissionFees } from "../pages/StaffPages/FinancialManagement/Fee Collect/AdmissionFees";
// import { FeeType } from "../pages/StaffPages/FinancialManagement/FeeType";
// import { FeeGroup } from "../pages/StaffPages/FinancialManagement/FeeGroup";
// import { CollectFees } from "../pages/StaffPages/FinancialManagement/Fee Collect/CollectFees";
// import { AssignedStudent } from "../pages/StaffPages/FinancialManagement/Fee Collect/AssignedStudent";
// import ManageSubscriptions from "../pages/SuperAdminPages/ManageSubscriptions";
// import AssignSubscriptions from "../pages/SuperAdminPages/AssignSubscriptions";
// import ManageSchools from "../pages/SuperAdminPages/ManageSchools";
// import {CourseContent} from "../pages/StudentPages/CourseContent";

export const routesConfig = {
  principal: [
    {
      path: "/school-overview",
      component: DashboardWrapper,
      sidebarName: "School Overview",
    },
    {
      path: "/staff-attendance",
      component: DashboardWrapper,
      sidebarName: "Staff Attendance",
    },
    {
      path: "/student-attendance",
      component: DashboardWrapper,
      sidebarName: "Student Attendance",
    },
    {
      path: "/announcements",
      component: DashboardWrapper,
      sidebarName: "Announcements",
    },
    { path: "/reports", component: DashboardWrapper, sidebarName: "Reports" },
    { path: "/events", component: DashboardWrapper, sidebarName: "Events" },
  ],
  "Vice Principal": [
    {
      path: "/disciplinary-records",
      component: DashboardWrapper,
      sidebarName: "Disciplinary Records",
    },
    {
      path: "/staff-performance",
      component: DashboardWrapper,
      sidebarName: "Staff Performance",
    },
    {
      path: "/substitute-management",
      component: DashboardWrapper,
      sidebarName: "Substitute Management",
    },
    {
      path: "/student-analytics",
      component: DashboardWrapper,
      sidebarName: "Student Analytics",
    },
    {
      path: "/lms-course-management",
      component: CourseContentManagement,
      sidebarName: "Course Content Management",
    },
    { path: "/events", component: DashboardWrapper, sidebarName: "Events" },
  ],
  schoolBoardMember: [
    {
      path: "/school-performance",
      component: DashboardWrapper,
      sidebarName: "School Performance",
    },
    {
      path: "/board-meetings",
      component: DashboardWrapper,
      sidebarName: "Board Meetings",
    },
    {
      path: "/strategic-reports",
      component: DashboardWrapper,
      sidebarName: "Strategic Reports",
    },
    {
      path: "/discussions",
      component: DashboardWrapper,
      sidebarName: "Discussions",
    },
  ],
  administrativeStaff: [
    {
      path: "/school-records",
      component: DashboardWrapper,
      sidebarName: "School Records",
    },
    {
      path: "/data-entry",
      component: DashboardWrapper,
      sidebarName: "Data Entry",
    },
    {
      path: "/schedules",
      component: DashboardWrapper,
      sidebarName: "Schedules",
    },
    {
      path: "/communication-tools",
      component: DashboardWrapper,
      sidebarName: "Communication Tools",
    },
  ],
  'School Staff': [
    { path: "/", component: DashboardWrapper, sidebarName: "Dashboard" },
    {
      path: "/dashboard",
      component: DashboardWrapper,
      sidebarName: "Dashboard",
    },
    {
      path: "/gradebook",
      component: DashboardWrapper,
      sidebarName: "Gradebook",
    },
    {
      path: "/attendance-management",
      component: DashboardWrapper,
      sidebarName: "Attendance Management",
    },
    {
      path: "/lesson-planning",
      component: DashboardWrapper,
      sidebarName: "Lesson Planning",
    },
    {
      path: "/resource-sharing",
      component: DashboardWrapper,
      sidebarName: "Resource Sharing",
    },
    {
      path: "/student-analytics",
      component: DashboardWrapper,
      sidebarName: "Student Analytics",
    },
    {
      path: "/communication-tools",
      component: DashboardWrapper,
      sidebarName: "Communication Tools",
    },
    {
      path: "/lms-dashboard",
      component: LMSDashboard,
      sidebarName: "LMS Dashboard",
    },
    {
      path: "/lms-course-management",
      component: CourseContentManagement,
      sidebarName: "Course Content Management",
    },
    {
      path: "/lms-course-management/select-sections/:classId",
      component: SelectSections,
    },
    {
      path: "/lms-course-management/material-wise",
      component: ClassWiseMaterial,
    },
    {
      path: "/lms-course-management/select-subjects",
      component: SelectSubject,
    },
    {
      path: "/lms-course-management/select-lessons",
      component: SelectLesson,
    },
    {
      path: "/lms-course-management/select-Topics",
      component: SelectTopic,
    },

    {
      path: "/lms-Assigmnent-management",
      component: AssignmentsManagement,
      sidebarName: "Assignment Management",
    },

    {
      path: "/lms-Assigmnent-management/assignment-wise",
      component: CheckAssignments,
    },
    {
      path: "/lms-Assigmnent-management/select-sections/:classId",
      component: SelectSections,
    },

    {
      path: "/lms-Assigmnent-management/select-subjects",
      component: SelectSubject,
    },
    {
      path: "/lms-Assigmnent-management/select-lessons",
      component: SelectLesson,
    },
    {
      path: "/lms-Assigmnent-management/select-Topics",
      component: SelectTopic,
    },
    {
      path: "/upload-center",
      // component: SelectSections,
    },
    {
      path: "/view-topics",
      component: CourseContentManagement,
    },
  ],
  student: [
    { path: "/", component: DashboardWrapper, sidebarName: "Dashboard" },
    // {
    //   path: "/dashboard",
    //   component: DashboardStudent,
    //   sidebarName: "Dashboard",
    // },
    {
      path: "/assignments",
      component: Assignments,
      sidebarName: "Assignments",
    },
    {
      path: "/course-content",
      component: CourseContent,
      sidebarName: "Course Content",
    },
    {
      path: "/course-content/lessons",
      component: StudenLessons,
    },
    {
      path: "/course-content/topics",
      component: StudenTopics,
    },
    {
      path: "/course-content/topicuploads",
      component: StudenTopicMaterial,
    },
  ],
  staff: [
    { path: "/", component: DashboardWrapper, sidebarName: "Dashboard" },
    // {
    //   path: "/dashboard",
    //   component: DashboardWrapper,
    //   sidebarName: "Dashboard",
    // },
    // {
    //   path: "/enquiry-details",
    //   component: EnquiryDetails,
    //   sidebarName: "Inquiry Management",
    // },
  ],

  //     Principal
  // Vice Principal
  // School Board Member
  // Administrative Staff
  // Teacher
  // Department Head
  // Librarian
  // Academic Coordinator
  // Counselor
  // Nurse
  // Teaching Assistant
  // IT Support Staff
  // Office Staff
  // Registrar
  //
  // Accountant
  // Maintenance Worker
  // Security Personnel
  // Student
  // Parent/Guardian
  // Extracurricular Coordinator
  // Alumni
  // Vendor/Service Provider

  // 'School Admin': [
  //   {
  //     path: "/",
  //     component: DashboardWrapper,
  //     sidebarName: "Dashboard",
  //   },
  //   // {
  //   //   path: "/dashboard",
  //   //   component: DashboardWrapper,
  //   //   sidebarName: "Dashboard",
  //   // },
  //   {
  //     path: "/enquiry-management",
  //     component: EnquiryManagement,
  //     sidebarName: "Enquiry Management",
  //   },
  //   {
  //     path: "/enquiry-report",
  //     component: EnquiryReport,
  //     sidebarName: "Enquiry Report",
  //   },
  //   {
  //     path: "/student-profile",
  //     component: StudentProfiles,
  //     sidebarName: "Student Profiles",
  //   },
  //   {
  //     path: "/employee-management",
  //     component: EmployeeManagement,
  //     sidebarName: "Employee Management",
  //   },
  //   {
  //     path: "/lms-dashboard",
  //     component: LMSDashboard,
  //     sidebarName: "LMS Dashboard",
  //   },
  //   {
  //     path: "/lms-course-management",
  //     component: CourseContentManagement,
  //     sidebarName: "Course Content Management",
  //   },
  //   {
  //     path: "/lms-course-management/select-sections/:classId",
  //     component: SelectSections,
  //   },
  //   {
  //     path: "/lms-course-management/material-wise",
  //     component: ClassWiseMaterial,
  //   },
  //   {
  //     path: "/lms-course-management/select-subjects",
  //     component: SelectSubject,
  //   },
  //   {
  //     path: "/lms-course-management/select-lessons",
  //     component: SelectLesson,
  //   },
  //   {
  //     path: "/lms-course-management/select-Topics",
  //     component: SelectTopic,
  //   },

  //   {
  //     path: "/lms-Assigmnent-management",
  //     component: AssignmentsManagement,
  //     sidebarName: "Assignment Management",
  //   },

  //   {
  //     path: "/lms-Assigmnent-management/assignment-wise",
  //     component: CheckAssignments,
  //   },
  //   {
  //     path: "/lms-Assigmnent-management/select-sections/:classId",
  //     component: SelectSections,
  //   },

  //   {
  //     path: "/lms-Assigmnent-management/select-subjects",
  //     component: SelectSubject,
  //   },
  //   {
  //     path: "/lms-Assigmnent-management/select-lessons",
  //     component: SelectLesson,
  //   },
  //   {
  //     path: "/lms-Assigmnent-management/select-Topics",
  //     component: SelectTopic,
  //   },
  //   {
  //     path: "/upload-center",
  //     // component: SelectSections,
  //   },
  //   {
  //     path: "/view-topics",
  //     component: CourseContentManagement,
  //   },
  //   {
  //     path: "/user-roles",
  //     component: UserRoles,
  //     sidebarName: "User Roles",
  //   },
  //   {
  //     path: "/users-staff",
  //     component: Staff,
  //     sidebarName: "Staff",
  //   },
  //   {
  //     path: "/users-student",
  //     component: Student,
  //     sidebarName: "Student",
  //   },
  //   {
  //     path: "/user-roles/permission",
  //     component: UserRolesPermission,
  //     sidebarName: "User Roles Permission",
  //   },
  //   {
  //     path: "/fee-&-payments",
  //     component: FeeDetails,
  //     sidebarName: "Fee Management",
  //   },
  //   {
  //     path: "/lead-generation",
  //     component: LeadGeneration,
  //     sidebarName: "Lead Generation",
  //   },
  //   {
  //     path: "/fee-&-payments/view-fee-master",
  //     component: ViewFeeMaster,
  //   },
  //   {
  //     path: "/income-management",
  //     component: Income,
  //     sidebarName: "Income Management",
  //   },
  //   {
  //     path: "/admission-enquiries",
  //     component: AdmissionEnquiry,
  //     sidebarName: "Admission Enquiries",
  //   },
  //   {
  //     path: "/admissions-report",
  //     component: Admissions,
  //     sidebarName: "Admissions Analytics",
  //   },
  //   {
  //     path: "/applicaiton-review",
  //     component: ApplicationReview,
  //     sidebarName: "Application Review",
  //   },
  //   {
  //     path: "/admission-fees",
  //     component: AdmissionFees,
  //     sidebarName: "Admission Fees",
  //   },
  //   {
  //     path: "/fee-type",
  //     component: FeeType,
  //     sidebarName: "FeeType",
  //   },
  //   {
  //     path: "/fee-group",
  //     component: FeeGroup,
  //     sidebarName: "Fee Group",
  //   },
  //   {
  //     path: "/fee-master",
  //     component: ViewFeeMaster,
  //     sidebarName: "Fee Master",
  //   },
  //   {
  //     path: "/fee-collect",
  //     component: CollectFees,
  //     sidebarName: "Fee Collect",
  //   },
  //   {
  //     path: "/fee-collect/assigned-students",
  //     component: AssignedStudent,
  //   },
  //   {
  //     path: "/fee-master/assign-master",
  //     component: ViewFeeMaster,
  //   },
  //   {
  //     path: "/expense-management",
  //     component: Expense,
  //     sidebarName: "Expense Management",
  //   },
  //   {
  //     path: "/expense-management",
  //     component: Expense,
  //     sidebarName: "Expense Management",
  //   },
  //   {
  //     path: "/manage-classes",
  //     component: Class,
  //     sidebarName: "Manage Classes",
  //   },
  //   {
  //     path: "/manage-sections",
  //     component: Section,
  //     sidebarName: "Manage Sections",
  //   },
  //   {
  //     path: "/class-resourse",
  //     component: ClassroomResource,
  //     sidebarName: "Classroom Resources",
  //   },
  //   {
  //     path: "/class-timetable",
  //     component: ClassTimetable,
  //     sidebarName: "Class Timetable",
  //   },
  //   {
  //     path: "/teacher-timetable",
  //     component: TeachersTimetable,
  //     sidebarName: "Teachers Timetable",
  //   },
  //   {
  //     path: "/manage-subject",
  //     component: Subject,
  //     sidebarName: "Manage Subject",
  //   },
  //   {
  //     path: "/promote-student",
  //     component: PromoteStudent,
  //     sidebarName: "Promote Student",
  //   },
  //   {
  //     path: "/assign-classteacher",
  //     component: AssignTeacher,
  //     sidebarName: "Assign Class Teacher",
  //   },
  //   {
  //     path: "/subject-group",
  //     component: SubjectGroup,
  //     sidebarName: "Subject Group",
  //   },
  //   {
  //     path: "/grading-system",
  //     component: GradingSystem,
  //     sidebarName: "Grading System",
  //   },
  //   {
  //     path: "/visitor-management",
  //     component: VisitorManagement,
  //     sidebarName: "Visitor Management",
  //   },
  //   {
  //     path: "/phone-call-log",
  //     component: PhoneCallLog,
  //     sidebarName: "Phone Call Log",
  //   },
  //   {
  //     path: "/postal-r&d-management",
  //     component: MailAndDispatchManagement,
  //     sidebarName: "Mail & Dispatch Management",
  //   },
  //   {
  //     path: "/student-disable",
  //     component: DisableStudent,
  //     sidebarName: "Disable Student",
  //   },
  // ],
  // 'Super Admin': [
  //   { path: "/", 
  //     component: DashboardWrapper, 
  //     sidebarName: "Dashboard" },
  //   {
  //     path: "/superadmin/school-profile/:schoolId",
  //     component: SchoolProfile,
  //   },
  //   {
  //     path: "/superadmin/manage/schools",
  //     component: ManageSchools,
  //     sidebarName: "Schools",
  //   },
  //   {
  //     path: "/superadmin/subscriptions/modules",
  //     component: ManageModules,
  //   },
  //   {
  //     path: "/superadmin/manage/schools/roles",
  //     component: ManageRoles,
  //   },
  //   {
  //     path: "/superadmin/manage/onboarding-requests",
  //     component: OnboardingRequest,
  //     sidebarName: "Onboarding Schools",
  //   },
  //   {
  //     path: "/superadmin/manage/subscriptions",
  //     component: ManageSubscriptions,
  //     sidebarName: "Subscriptions",
  //   },
  //   {
  //     path: "/superadmin/manage/assigned-subscriptions",
  //     component: AssignSubscriptions,
  //     sidebarName: "Assign Subscriptions",
  //   },
  // ],
};
