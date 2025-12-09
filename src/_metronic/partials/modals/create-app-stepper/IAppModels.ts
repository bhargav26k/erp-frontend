export interface IAppBasic {
  //step 1
  name : string; 
  email: string; 
  phone: string;
  address: string;
  country:string;
  state:string;
  type_of_school:string;
  //step2
  educational_board:string;
  languages:string;
  date_format: string;
  time_format: string;
  currency: string;
  currency_symbol: string;
  start_month: string;
  //step3
  image: string;
  school_logo: string;
  school_small_logo: string;
  academic_year: string;
  bank_account_no: number;
  ifsc_code: string;
  bank_name: string;
}

export interface ICreateAppData {
  appBasic: IAppBasic
}


export const defaultCreateAppData: ICreateAppData = {
    appBasic: {
        name: "",
        email: "",
        phone: "",
        address: "",
        state: "",
        country: "",
        type_of_school: "",
        educational_board: "",
        languages: "",
        date_format: "",
        time_format: "",
        currency: "",
        currency_symbol: "",
        start_month: "",
        image: "",
        school_logo: "",
        school_small_logo: "",
        academic_year: "",
        bank_account_no: 0,
        ifsc_code: "",
        bank_name: ""
    }   
}


export type StepProps = {
  data: ICreateAppData
  updateData: (fieldsToUpdate: Partial<ICreateAppData>) => void
  hasError: boolean
}
