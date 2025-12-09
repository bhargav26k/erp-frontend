/* eslint-disable @typescript-eslint/no-explicit-any */
// import { AddStaffModels } from "../AddStaffModels";

const Step3 = ({ data, updateData, hasError }:any) => (
  <div className="pb-5" data-kt-stepper-element="content">
    <div className="w-100">
      <div className="fv-row mb-10" style={{ display: "flex", gap: "10px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "50%",
            // border:'1px solid'
          }}
        >
          <label className="d-flex align-items-center fs-5 fw-semibold mb-2">
            <span className="required">image</span>
          </label>
          <input
            type="text"
            className="form-control form-control-lg form-control-solid border-black"
            name="image"
            placeholder=""
            value={data.appBasic.image}
            onChange={(e) =>
              updateData({
                appBasic: { ...data.appBasic, image: e.target.value },
              })
            }
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "50%",
          }}
        >
          <label className="d-flex align-items-center fs-5 fw-semibold mb-2">
            <span className="required">school_logo</span>
          </label>
          <input
            type="school_logo"
            className="form-control form-control-lg form-control-solid border-black"
            name="school_logo"
            placeholder=""
            value={data.appBasic.school_logo}
            onChange={(e) =>
              updateData({
                appBasic: { ...data.appBasic, school_logo: e.target.value },
              })
            }
          />
        </div>
        {!data.appBasic.school_logo && hasError && (
          <div className="fv-plugins-message-container">
            <div
              data-field="school_logo"
              data-validator="notEmpty"
              className="fv-help-block"
            >
              School school_logo is required
            </div>
          </div>
        )}
      </div>

      <div className="fv-row mb-10" style={{ display: "flex", gap: "10px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "50%",
            // border:'1px solid'
          }}
        >
          <label className="d-flex align-items-center fs-5 fw-semibold mb-2">
            <span className="required">school_small_logo</span>
          </label>
          <input
            type="text"
            className="form-control form-control-lg form-control-solid border-black"
            name="school_small_logo"
            placeholder=""
            value={data.appBasic.school_small_logo}
            onChange={(e) =>
              updateData({
                appBasic: { ...data.appBasic, school_small_logo: e.target.value },
              })
            }
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "50%",
          }}
        >
          <label className="d-flex align-items-center fs-5 fw-semibold mb-2">
            <span className="required">academic_year</span>
          </label>
          <input
            type="academic_year"
            className="form-control form-control-lg form-control-solid border-black"
            name="academic_year"
            placeholder=""
            value={data.appBasic.academic_year}
            onChange={(e) =>
              updateData({
                appBasic: { ...data.appBasic, academic_year: e.target.value },
              })
            }
          />
        </div>
        {!data.appBasic.academic_year && hasError && (
          <div className="fv-plugins-message-container">
            <div
              data-field="academic_year"
              data-validator="notEmpty"
              className="fv-help-block"
            >
              School academic_year is required
            </div>
          </div>
        )}
      </div>

      <div className="fv-row mb-10" style={{ display: "flex", gap: "10px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "50%",
            // border:'1px solid'
          }}
        >
          <label className="d-flex align-items-center fs-5 fw-semibold mb-2">
            <span className="required">bank_account_no</span>
          </label>
          <input
            type="number"
            className="form-control form-control-lg form-control-solid border-black"
            name="bank_account_no"
            placeholder=""
            value={data.appBasic.bank_account_no}
            onChange={(e) =>
              updateData({
                appBasic: { ...data.appBasic, bank_account_no:parseInt(e.target.value) },
              })
            }
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "50%",
          }}
        >
          <label className="d-flex align-items-center fs-5 fw-semibold mb-2">
            <span className="required">ifsc_code</span>
          </label>
          <input
            type="ifsc_code"
            className="form-control form-control-lg form-control-solid border-black"
            name="ifsc_code"
            placeholder=""
            value={data.appBasic.ifsc_code}
            onChange={(e) =>
              updateData({
                appBasic: { ...data.appBasic, ifsc_code: e.target.value },
              })
            }
          />
        </div>
        {!data.appBasic.ifsc_code && hasError && (
          <div className="fv-plugins-message-container">
            <div
              data-field="ifsc_code"
              data-validator="notEmpty"
              className="fv-help-block"
            >
              School ifsc_code is required
            </div>
          </div>
        )}
      </div>

      <div className="fv-row mb-10" style={{ display: "flex", gap: "10px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "50%",
            // border:'1px solid'
          }}
        >
          <label className="d-flex align-items-center fs-5 fw-semibold mb-2">
            <span className="required">bank_name</span>
          </label>
          <input
            type="text"
            className="form-control form-control-lg form-control-solid border-black"
            name="bank_name"
            placeholder=""
            value={data.appBasic.bank_name}
            onChange={(e) =>
              updateData({
                appBasic: { ...data.appBasic, bank_name:e.target.value },
              })
            }
          />
        </div>
        {!data.appBasic.bank_name && hasError && (
          <div className="fv-plugins-message-container">
            <div
              data-field="bank_name"
              data-validator="notEmpty"
              className="fv-help-block"
            >
              School bank_name is required
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

export { Step3 };
