import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Modal } from "react-bootstrap";
import { KTIcon } from "../../../helpers";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Props = {
  selectDate: (date: Date) => void;
  show: boolean;
  handleClose: () => void;
};

const modalsRoot = document.getElementById("root-modals") || document.body;

const CreateDateModal = ({ selectDate, show, handleClose }: Props) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleSave = () => {
    selectDate(selectedDate);
    handleClose();
  };

  return createPortal(
    <Modal
      id="kt_modal_create_app"
      tabIndex={-1}
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered mw-500px"
      show={show}
      onHide={handleClose}
      backdrop={true}
    >
      <div className="modal-header">
        <h2>Select Date</h2>
        {/* begin::Close */}
        <div
          className="btn btn-sm btn-icon btn-active-color-primary"
          onClick={handleClose}
        >
          <KTIcon className="fs-1" iconName="cross" />
        </div>
        {/* end::Close */}
      </div>
      <form>
        <div className="modal-body px-lg-10" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="dd/MM/yyyy"
          />
        </div>
      </form>
      <div className="modal-footer">
        <button className="btn btn-primary" onClick={handleSave}>
          Save
        </button>
      </div>
    </Modal>,
    modalsRoot
  );
};

export { CreateDateModal };
