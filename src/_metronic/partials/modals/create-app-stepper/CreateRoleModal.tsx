import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Modal } from "react-bootstrap";
import { StepperComponent } from "../../../assets/ts/components";
import { KTIcon } from "../../../helpers";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Props = {
  selectDate: (date: Date) => void;
  show: boolean;
  handleClose: () => void;
};

const modalsRoot = document.getElementById("root-modals") || document.body;

const CreateRoleModal = ({ selectDate, show, handleClose }: Props) => {
  const stepperRef = useRef<HTMLDivElement | null>(null);
  const [stepper, setStepper] = useState<StepperComponent | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const loadStepper = () => {
    setStepper(
      StepperComponent.createInsance(stepperRef.current as HTMLDivElement)
    );
  };

  const handleSave = () => {
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
      onEntered={loadStepper}
      backdrop={true}
    >
      <div className="modal-header">
        <h2>Add Role</h2>
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
        <div
          className="modal-body px-lg-10 "
          style={{ display: "block", flexDirection: "column", gap: "10px" }}
        >
          <div>
            <div className="mb-3">
              <label htmlFor="exampleFormControlInput1" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="exampleFormControlInput1"
                placeholder="Role"
              />
            </div>
          </div>
          {/* end::Content */}
        </div>
      </form>

      <div className="modal-footer">
        <button type="button" className="btn btn-primary" onClick={handleSave}>
          Save
        </button>
      </div>
      {/* </div> */}
    </Modal>,
    modalsRoot
  );
};

export { CreateRoleModal };
