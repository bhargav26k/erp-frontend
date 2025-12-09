export interface AuthModel {
  session_id: string | AuthModel | undefined
  school_id: AuthModel | undefined
  user_id(user_id: AuthModel, role: string): unknown
  // user_id: AuthModel | undefined
  id: string
  api_token: AuthModel | undefined
  email: string | undefined
  role: string 
  mobile: string | undefined
  mobile_no: string | undefined
  res_code: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  message(arg0: string, message: any): unknown
  // mobile: string
  username: string
  refreshToken?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error:any
  }

export interface UserAddressModel {
  addressLine: string
  city: string
  state: string
  postCode: string
}

export interface UserCommunicationModel {
  email: boolean
  sms: boolean
  phone: boolean
}

export interface UserEmailSettingsModel {
  emailNotification?: boolean
  sendCopyToPersonalEmail?: boolean
  activityRelatesEmail?: {
    youHaveNewNotifications?: boolean
    youAreSentADirectMessage?: boolean
    someoneAddsYouAsAsAConnection?: boolean
    uponNewOrder?: boolean
    newMembershipApproval?: boolean
    memberRegistration?: true
  }
  updatesFromKeenthemes?: {
    newsAboutKeenthemesProductsAndFeatureUpdates?: boolean
    tipsOnGettingMoreOutOfKeen?: boolean
    thingsYouMissedSindeYouLastLoggedIntoKeen?: boolean
    newsAboutStartOnPartnerProductsAndOtherServices?: boolean
    tipsOnStartBusinessProducts?: boolean
  }
}

export interface UserSocialNetworksModel {
  linkedIn: string
  facebook: string
  twitter: string
  instagram: string
}

export interface SuperAdminModel {
  id:string,
  username:string,
  role:string,
  roleId?:string,
  role_name?:string,
  school_id?:string,
  firstname?:string,
  middlename?:string,
  lastname?:string,
  admission_no?:number,
  email?:string,
  roll_no?:string,
  student_session_id?:number,
  currency_symbol?:string,
  designation?:string,
}

export interface AdminModel {
  
    id: string,
    role:string,
    roleId?:string,
    role_name?:string,
    employee_id: string,
    lang_id: string,
    department: string,
    designation: string,
    qualification: string,
    work_exp:string,
    name: string,
    surname: string,
    father_name: string,
    mother_name: string,
    contact_no: string,
    emergency_contact_no: string,
    email: string,
    dob: string,
    marital_status: string,
    date_of_joining: string,
    date_of_leaving:string,
    local_address:  string,
    permanent_address:  string,
    note:  string,
    image: string,
    password: string,
    gender: string,
    account_title: string,
    bank_account_no: string,
    bank_name: string,
    ifsc_code: string,
    bank_branch: string,
    payscale: string,
    basic_salary: string,
    epf_no: string,
    contract_type: string,
    shift: string,
    location: string,
    facebook: string,
    twitter: string,
    linkedin: string,
    instagram: string,
    resume: string,
    joining_letter: string,
    resignation_letter: string,
    other_document_name:  string,
    other_document_file: string,
    user_id: string,
    is_active: string,
    verification_code: string,
    disable_at: string,
    language: string,
    language_id: string,
    firstname:string,
    middlename:string,
    lastname:string
    roll_no:string,
    admission_no:string 
    student_session_id :string
    class_id:string,
    school_id?:string,
    currency_symbol?:string,
}
  

export interface StudentModel {
  id: string,
  // username: string
  // password: string | undefined
  // email: string
  // first_name: string
  // last_name: string
  // fullname?: string
  // occupation?: string
  // companyName?: string
  // mobile?: string
  // roles?: Array<number>
  // pic?: string
  // language?: 'en' | 'de' | 'es' | 'fr' | 'ja' | 'zh' | 'ru'
  // timeZone?: string
  // website?: 'https://keenthemes.com'
  // emailSettings?: UserEmailSettingsModel
  // auth?: AuthModel
  // communication?: UserCommunicationModel
  // address?: UserAddressModel
  // socialNetworks?: UserSocialNetworksModel
  roleId?:string,
  school_id?:string,
  role_name?:string,
  student_id:string,
  admission_no: string,
  roll_no: string,
  admission_date:string,
  mobileno: string,
  email: string,
  religion: string,
  cast: string,
  dob:string,
  gender:string,
  current_address:string,
  permanent_address:string,
  blood_group:string,
  adhar_no:string,
  father_name:string,
  father_phone:string,
  mother_name:string,
  mother_phone:string,
  academic_year:string,
  class_id:string,
  section_id:string,
  student_class:string,
  student_section:string,
  student_session_id:string,
  student_year_id:string,
  student_year:string,
  firstname:string,
  middlename:string,
  lastname:string,
  token: string,
  role:string,
  user_id:string,
  currency_symbol:string,
  designation:string,
}
