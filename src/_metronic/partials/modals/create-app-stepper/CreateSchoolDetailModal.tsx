import React from "react";
import { Modal } from "react-bootstrap";
import { KTIcon } from "../../../helpers";

interface School {
  name: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  state: string;
  type_of_school: string;
  educational_board: string;
  languages: string;
  date_format: string;
  time_format: string;
  currency: string;
  currency_symbol: string;
  start_month: string;
  image: string;
  school_logo: string;
  school_small_logo: string;
  academic_year: string;
  bank_account_no: string;
  ifsc_code: string;
  bank_name: string;
}

type Props = {
  show: boolean;
  onHide: () => void;
  school: School;
};

const CreateSchoolDetailModal = ({ show, onHide, school }: Props) => {
  return (
    <Modal
      id="kt_modal_create_app"
      tabIndex={-1}
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered mw-1000px"
      show={show}
      onHide={onHide}
    >
      <div className="modal-header">
        <h2> School Detalis</h2>
        <div
          className="btn btn-sm btn-icon btn-active-color-primary"
          onClick={onHide}
        >
          <KTIcon className="fs-1" iconName="cross" />
        </div>
      </div>
      <div className="modal-body py-lg-10 px-lg-10 border">
        <div className="d-flex justify-content-center justify-content-xl-start flex-row-auto w-100 w-xl-250px">
          <div style={{display:'flex', flexDirection:'column'}}>
            <span> name:{school.name}</span>
            <span> email:{school.email}</span>
            <span> phone:{school.phone}</span>
            <span> address:{school.address}</span>
            <span> country:{school.country}</span>
            <span> state:{school.state}</span>
            <span> type_of_school:{school.type_of_school}</span>
            <span> educational_board:{school.educational_board}</span>
            <span> languages:{school.languages}</span>
            <span> date_format:{school.date_format}</span>
            <span> time_format:{school.time_format}</span>
            <span> currency:{school.currency}</span>
            <span> currency_symbol:{school.currency_symbol}</span>
            <span> start_month:{school.start_month}</span>
            <span> start_month:{school.start_month}</span>
            <span> image:{school.image}</span>
            <span> school_logo:{school.school_logo}</span>
            <span> school_small_logo:{school.school_small_logo}</span>
            <span> academic_year:{school.academic_year}</span>
            <span> bank_account_no:{school.bank_account_no}</span>
            <span> bank_account_no:{school.bank_account_no}</span>
            <span> ifsc_code:{school.ifsc_code}</span>
            <span> bank_name:{school.bank_name}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export { CreateSchoolDetailModal };
