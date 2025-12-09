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

const CreateAssignPermissionModal = ({
  selectDate,
  show,
  handleClose,
}: Props) => {
  const stepperRef = useRef<HTMLDivElement | null>(null);
  const [stepper, setStepper] = useState<StepperComponent | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const loadStepper = () => {
    setStepper(
      StepperComponent.createInsance(stepperRef.current as HTMLDivElement)
    );
  };
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    selectDate(date);
  };
  const handleSave = () => {
    handleClose();
  };



  return createPortal(
    <Modal
      id="kt_modal_create_app"
      tabIndex={-1}
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered mw-1000px"
      show={show}
      onHide={handleClose}
      onEntered={loadStepper}
      backdrop={true}
    >
      <div className="modal-header">
        <h2>Assign Permission {"Username"}</h2>
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
          style={{ display: "flex", flexDirection: "column", gap: "10px" }}
        >
          <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
            {/* begin::Table head */}
            <thead>
              <tr className="fw-bold text-muted">
                <th className="max-w-80px   ">Module</th>
                <th className="min-w-100 ">Feature</th>
                <th className="min-w-20  0px">View</th>
                <th className="min-w-20  0px">Add</th>
                <th className="min-w-20  0px">Edit</th>
                <th className="min-w-20 0px">Delete</th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              <tr>
                <td>
                  <div className="d-flex align-items-center ms-2">
                    Student Information
                  </div>
                </td>
                <td className="d-flex flex-column gap-5">
                  <div className="d-flex">Student</div>
                  <div className="d-flex  ">Import Student</div>
                  <div className="d-flex align-items-start ">
                    Student Categories{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                    Disable Student{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                    Student Houses{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                    Student Timeline{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                    Disable Reason{" "}
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckIndeterminateDisabled"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckIndeterminateDisabled"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="d-flex align-items-center ms-2">
                    Fees Collection
                  </div>
                </td>
                <td className="d-flex flex-column gap-5">
                  <div className="d-flex">Collect Fees</div>
                  <div className="d-flex">Fees Carry Forward</div>
                  <div className="d-flex align-items-start ">Fees Master </div>
                  <div className="d-flex align-items-start ">Fees Group </div>
                  <div className="d-flex align-items-start ">
                    Fees Group Assign{" "}
                  </div>
                  <div className="d-flex align-items-start ">Fees Type </div>
                  <div className="d-flex align-items-start ">
                    Fees Discount{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                    Fees Discount Assign{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                    Search Fees Payment{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                    Search Due Fees{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                    Fees Reminder{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                    Update Balance{" "}
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="d-flex align-items-center ms-2">Income</div>
                </td>
                <td className="d-flex flex-column gap-5">
                  <div className="d-flex">Income</div>
                  <div className="d-flex  ">Income Head</div>
                  <div className="d-flex align-items-start ">
                    Search Income{" "}
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                    <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>

                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="d-flex align-items-center ms-2">
                  Expense
                  </div>
                </td>
                <td className="d-flex flex-column gap-5">
                  <div className="d-flex">Expense</div>
                  <div className="d-flex  ">Expense Head</div>
                  <div className="d-flex align-items-start ">
                  Search Expense{" "}
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="d-flex align-items-center ms-2">
                  Student Attendance
                  </div>
                </td>
                <td className="d-flex flex-column gap-5">
                  <div className="d-flex">Student / Period Attendance</div>
                  <div className="d-flex  ">Attendance By Date</div>
                  <div className="d-flex align-items-start ">
                  Approve Leave{" "}
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="d-flex align-items-center ms-2">
                  Examination
                  </div>
                </td>
                <td className="d-flex flex-column gap-5">
                  <div className="d-flex">Marks Grade</div>
                  <div className="d-flex  ">Exam Group</div>
                  <div className="d-flex align-items-start ">
                  Design Admit Card{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Print Admit Card{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Design Marksheet{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Print Marksheet{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Exam Result{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Marks Import{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Exam{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Exam Publish{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Link Exam{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Assign / View student{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Exam Subject{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Exam Marks{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Report Card{" "}
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                        <div className="d-flex align-items-start ">
                        <div className="form-check">
                            <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="flexCheckDefault"
                            disabled
                            />
                        </div>
                        </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                  </div>
                </td>
                
                
              </tr>
              <tr>
                <td>
                  <div className="d-flex align-items-center ms-2">
                  Academics
                  </div>
                </td>
                <td className="d-flex flex-column gap-5">
                  <div className="d-flex">Class Timetable</div>
                  <div className="d-flex  ">Subject</div>
                  <div className="d-flex align-items-start ">
                  Class{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Section{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Promote Student{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Assign Class Teacher{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Teachers Timetable{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Subject Group{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  SOLP Report{" "}
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                  </div>
                </td>
                
              </tr>
              <tr>
                <td>
                  <div className="d-flex align-items-center ms-2">
                  Download Center
                  </div>
                </td>
                <td className="d-flex flex-column gap-5">
                  <div className="d-flex">Upload Content</div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                  </div>
                </td>
                
              </tr>
              <tr>
                <td>
                  <div className="d-flex align-items-center ms-2">
                  Library
                  </div>
                </td>
                <td className="d-flex flex-column gap-5">   
                  <div className="d-flex">Books List</div>
                  <div className="d-flex  ">Issue Return</div>
                  <div className="d-flex align-items-start ">
                  Add Staff Members{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Add Students{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Import Book{" "}
                  </div>

                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="d-flex align-items-center ms-2">
                  Inventory
                  </div>
                </td>
                <td className="d-flex flex-column gap-5">
                  <div className="d-flex">Issue Item</div>
                  <div className="d-flex  ">Add Item Stock</div>
                  <div className="d-flex align-items-start ">
                  Add Item{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Item Store{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Item Supplier{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Item Category{" "}
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="d-flex align-items-center ms-2">
                  Transport
                  </div>
                </td>
                <td className="d-flex flex-column gap-5">
                  <div className="d-flex">Routes</div>
                  <div className="d-flex  ">Vehicle</div>
                  <div className="d-flex align-items-start ">
                  Assign Vehicle{" "}
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="d-flex align-items-center ms-2">
                  Hostel
                  </div>
                </td>
                <td className="d-flex flex-column gap-5">
                  <div className="d-flex">Hostel</div>
                  <div className="d-flex  ">Room Type</div>
                  <div className="d-flex align-items-start ">
                  Hostel Rooms{" "}
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                  </div>
                </td>
                
              </tr>
              <tr>
                <td>
                  <div className="d-flex align-items-center ms-2">
                  Communicate
                  </div>
                </td>
                <td className="d-flex flex-column gap-5">
                  <div className="d-flex">Notice Board</div>
                  <div className="d-flex  ">Email</div>
                  <div className="d-flex align-items-start ">
                  Email / SMS Log{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  SMS{" "}
                  </div>
                  
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>  
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>  
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>  
                  </div>
                </td>
                
              </tr>
              <tr>
                <td>
                  <div className="d-flex align-items-center ms-2">
                  Reports
                  </div>
                </td>
                <td className="d-flex flex-column gap-5">
                  <div className="d-flex">Student Report</div>
                  <div className="d-flex  ">Guardian Report</div>
                  <div className="d-flex align-items-start ">
                  Student History{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Student Login Credential Report{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Class Subject Report{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Admission Report{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Sibling Report{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Homework Evaluation Report{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Student Profile{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Fees Statement{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Balance Fees Report{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Fees Collection Report{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Online Fees Collection Report{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Income Report{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Expense Report{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  PayRoll Report{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Income Group Report{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Expense Group Report{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Attendance Report{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Staff Attendance Report{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Transport Report{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Hostel Report{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Audit Trail Report{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  User Log{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Book Issue Report{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Book Due Report{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Book Inventory Report{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Stock Report{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Add Item Report{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Issue Item Report{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Student Attendance Type Report{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Exam Marks Report{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Online Exam Wise Report{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Online Exams Report{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Online Exams Attempt Report{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Online Exams Rank Report{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Staff Report{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Student / Period Attendance Report{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Biometric Attendance Log{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Book Issue Return Report{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Rank Report{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Syllabus Status Report{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Teacher Syllabus Status Report{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Alumni Report{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Student Gender Ratio Report{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Student Teacher Ratio Report{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Daily Attendance Report{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Activity Logs{" "}
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </td>
                
              </tr>
              <tr>
                <td>
                  <div className="d-flex align-items-center ms-2">
                  System Settings
                  </div>
                </td>
                <td className="d-flex flex-column gap-5">
                  <div className="d-flex">Languages</div>
                  <div className="d-flex  ">	General Setting</div>
                  <div className="d-flex align-items-start ">
                  Session Setting{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Notification Setting{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  SMS Setting{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Email Setting{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Front CMS Setting{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Payment Methods{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  User Status{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Backup{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Restore{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Language Switcher{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Custom Fields{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  System Fields{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Print Header Footer{" "}
                  </div>
                  <div className="d-flex align-items-start ">
                  Student Profile Update{" "}
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="m-0">
                  <div className="d-flex flex-column gap-4 my-0">
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-start ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </div>
                  </div>
                </td>
                
              </tr>
              
            </tbody>
            {/* end::Table body */}
          </table>

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

export { CreateAssignPermissionModal };



// this is the code for mapping the json file for the table
// import React from 'react';

// const CheckboxTable = ({ data }) => {
//   return (
//     <tr>
//       <td>
//         <div className="d-flex align-items-center ms-2">
//           {data.moduleName}
//         </div>
//       </td>
//       <td className="d-flex flex-column gap-5">
//         {data.features.map((feature, index) => (
//           <div key={index} className="d-flex">
//             {feature}
//           </div>
//         ))}
//       </td>
//       {Array.from({ length: 4 }).map((_, columnIndex) => (
//         <td key={columnIndex} className="m-0">
//           <div className="d-flex flex-column gap-4 my-0">
//             {data.features.map((feature, index) => (
//               <div key={index} className="d-flex align-items-start">
//                 <div className="form-check">
//                   <input
//                     className="form-check-input"
//                     type="checkbox"
//                     value=""
//                     id={`flexCheckDefault-${columnIndex}-${index}`}
//                     disabled={data.columnChecks[columnIndex][index] === 0}
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </td>
//       ))}
//     </tr>
//   );
// };

// export default CheckboxTable;
