/* eslint-disable react-refresh/only-export-components */
// Define your base domain
// const DOMAIN = 'https://onepitaraapi.payplatter.in/';
// const DOMAIN = "http://localhost:5000";
const DOMAIN = import.meta.env.VITE_API_DOMAIN; 
// const DOMAIN = "http://localhost:3000";
// const FrontDomain = "https://onepitara.payplatter.in/";
//enquiries page endpoints
const getTotalNumberofEnquiries = "api/staff/gettotalnumbers";
const getClassWiseEnquiryThisYear =
  "api/staff/getclasswisetableenquirythisyear";
const getEnquiriesBySources = "api/staff/getallenquriesbysources";
const getWinRatePercentage = "api/staff/getwinratepercentage";
const getMonthWiseEnquiries = "api/staff/getmonthwiseenquiries";
const getEnquiriesStatus = "api/staff/getdetailedenquirystatus";
const getStaffRoles = "api/school/get-roles";
// const getEnquiries = 'api/staff/get-enquires';
// const getEnquiriesByID = 'api/staff/get-enquires/1';

// admissions page endpoints
const getAllAdmissions = "api/staff/getalladmissions";
const getStudentAdmissionDetails = "api/staff/getstudentadmissiondetials";

//superAdmin apis 
//  ------------------------------------------------------------------------------------
// SuperAdmin Dashboard
const get_school_count = "api/superadmin/school-count";
const get_schoolbyid = "api/superadmin/get_schoolbyid";
  const get_company_count = "api/superadmin/company-count";
const get_assigned_subscription_count = "api/superadmin/assigned-subscription-count";
const get_module_count = "api/superadmin/module-count";
const get_school_details = "api/superadmin/school-details";

// SuperAdmin School List
const get_schools = "api/superadmin/get_schools";
// SuperAdmin CreateSchool
const get_subscriptions = "api/superadmin/get-allsubscriptions";
const get_acedamic_year = "api/superadmin/get_academicyear";
const AddSchool = 'api/superadmin/create_school';
// SuperAdmin school profile

// const get_subscriptionById = 'api/superadmin/get-subscription-id'
// SuperAdmin SchoolEdit
const upload_school_files = "api/superadmin/school_update_upload";
const update_school = "api/superadmin/school_update";
// SuperAdmin Manager Users
const getUsersBySchoolId = "api/superadmin/school-users";
const getAllRoles = "api/superadmin/get_rolemodule";
const getAllDesignations = "api/superadmin/get-designations";
const getUserDetails = "api/superadmin/get_user";
const AddUser = "api/superadmin/add_user";
const UpdateUser = "api/superadmin/edit_user";
const DeleteUser = "api/superadmin/delete_user";
// SuperAdmin Manage Designation School Profile
const getSchoolWiseDesignations = "api/superadmin/get-designations";
const AddSchoolDesignations = 'api/superadmin/store-school-designations';

// SuperAdmin Manage All Designation
const getDesignationById = "api/superadmin/get_designation";
const AddDesignation = "api/superadmin/add_designation";
const UpdateDesignation = "api/superadmin/edit_designation";
const DeleteDesignation = "api/superadmin/delete_designationmodule";

// SuperAdmin Designation module 
const getDesignationModule = 'api/superadmin/designation-modules';
const StoreDesignationPermission = 'api/superadmin/store-designation-permission';
// SuperAdmin Manage Subscription
const AddSubscription = "api/superadmin/create-subscription";
const UpdateSubscription = "api/superadmin/update-subscription";
const DeleteSubscription = "api/superadmin/delete-subscription";
// SuperAdmin Manage Schools with Subscriptions List
const getAllSchoolsWithSubscription = "api/superadmin/get-all-schools-with-subscription";
// SuperAdmin Change Subscription for school
const UpdateSubscriptionForSchool = 'api/superadmin/update-subscription-for-school'


const getParentModule = "api/superadmin/get-parent-module";
const storeModuleRequest = "api/superadmin/save-module-request";
const getAssignedRoles = "api/superadmin/school-roles";
const getSchoolModuleById = "api/superadmin/get_schoolmodulesbyid";

//student apis
const getTimetableStudentWise = "api/student/time-table";
const getSchoolWiseSessions = 'api/school/get-school-sessions';
const getMasterUsers = 'api/school/get-master-users';
// const getNoticeBoardLastestMonth = 'api/student/notice-board/latest-month-data'

// eslint-disable-next-line react-refresh/only-export-components
// eslint-disable-next-line react-refresh/only-export-components
export {
  DOMAIN,
  // super admin dashboard
  get_school_count,
  get_company_count,
  get_assigned_subscription_count,
  get_module_count,
  get_school_details,
  //  super admin manage school list
  get_schools,
  //  create school modal
  get_subscriptions,
  get_acedamic_year,
  AddSchool,
  //  school profile
  // get_subscriptionById,

  //  school details card
  get_schoolbyid,
  // SuperAdmin SchoolEdit
  upload_school_files,
  update_school,
  // Super Admin Manager Users
  getUsersBySchoolId,
  getAllRoles,
  getAllDesignations,
  getUserDetails,
  AddUser,
  UpdateUser,
  DeleteUser,
// SuperAdmin Manage Designation School Profile
AddSchoolDesignations,
getSchoolWiseDesignations,
  // Manage Designation
  getDesignationById,
  AddDesignation,
  UpdateDesignation,
  DeleteDesignation,
  // SuperAdmin Designation module 
  getDesignationModule,
  StoreDesignationPermission,
  // SuperAdmin Manage Subscription
  AddSubscription,
  UpdateSubscription,
  DeleteSubscription,
  // SuperAdmin Manage Schools with Subscriptions List
  getAllSchoolsWithSubscription,
// SuperAdmin Change Subscription for school
UpdateSubscriptionForSchool,


  getParentModule,
  storeModuleRequest,
  getAssignedRoles,
  getSchoolModuleById,
  getTimetableStudentWise,
  getTotalNumberofEnquiries,
  getStaffRoles,
  getClassWiseEnquiryThisYear,
  getEnquiriesBySources,
  getWinRatePercentage,
  getMonthWiseEnquiries,
  getEnquiriesStatus,
  getAllAdmissions,
  getStudentAdmissionDetails,
  getMasterUsers,getSchoolWiseSessions,
  
};
