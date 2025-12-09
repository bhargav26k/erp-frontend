import { StepProps } from "../IAppModels";

const Step2 = ({ data, updateData, hasError }: StepProps) => {
  return (
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
              <span className="required">educational_board</span>
            </label>
            <select
              className="form-control form-control-lg form-control-solid border-black"
              name="educational_board"
              value={data.appBasic.educational_board}
              onChange={(e) =>
                updateData({
                  appBasic: {
                    ...data.appBasic,
                    educational_board: e.target.value,
                  },
                })
              }
            >
              <option value="">Select Educational Board</option>
              <option value="CBSE">CBSE</option>
              <option value="State Board">State Board</option>
              <option value="ICSE">ICSE</option>
              {/* Add more options as needed */}
            </select>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "50%",
            }}
          >
            <label className="d-flex align-items-center fs-5 fw-semibold mb-2">
              <span className="required">languages</span>
            </label>
            <input
              type="languages"
              className="form-control form-control-lg form-control-solid border-black"
              name="languages"
              placeholder=""
              value={data.appBasic.languages}
              onChange={(e) =>
                updateData({
                  appBasic: { ...data.appBasic, languages: e.target.value },
                })
              }
            />
          </div>
          {!data.appBasic.languages && hasError && (
            <div className="fv-plugins-message-container">
              <div
                data-field="languages"
                data-validator="notEmpty"
                className="fv-help-block"
              >
                School languages is required
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
              <span className="required">date_format</span>
            </label>
            <input
              type="date_format"
              className="form-control form-control-lg form-control-solid border-black"
              name="date_format"
              placeholder=""
              value={data.appBasic.date_format}
              onChange={(e) =>
                updateData({
                  appBasic: { ...data.appBasic, date_format: e.target.value },
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
              <span className="required">time_format</span>
            </label>
            <input
              type="time_format"
              className="form-control form-control-lg form-control-solid border-black"
              name="time_format"
              placeholder=""
              value={data.appBasic.time_format}
              onChange={(e) =>
                updateData({
                  appBasic: { ...data.appBasic, time_format: e.target.value },
                })
              }
            />
          </div>
          {!data.appBasic.time_format && hasError && (
            <div className="fv-plugins-message-container">
              <div
                data-field="time_format"
                data-validator="notEmpty"
                className="fv-help-block"
              >
                School time_format is required
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
              <span className="required">currency</span>
            </label>
            <input
              type="currency"
              className="form-control form-control-lg form-control-solid border-black"
              name="currency"
              placeholder=""
              value={data.appBasic.currency}
              onChange={(e) =>
                updateData({
                  appBasic: { ...data.appBasic, currency: e.target.value },
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
              <span className="required">currency_symbol</span>
            </label>
            <input
              type="currency_symbol"
              className="form-control form-control-lg form-control-solid border-black"
              name="currency_symbol"
              placeholder=""
              value={data.appBasic.currency_symbol}
              onChange={(e) =>
                updateData({
                  appBasic: { ...data.appBasic, currency_symbol: e.target.value },
                })
              }
            />
          </div>
          {!data.appBasic.currency_symbol && hasError && (
            <div className="fv-plugins-message-container">
              <div
                data-field="currency_symbol"
                data-validator="notEmpty"
                className="fv-help-block"
              >
                School currency_symbol is required
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
              <span className="required">start_month</span>
            </label>
            <input
              type="start_month"
              className="form-control form-control-lg form-control-solid border-black"
              name="start_month"
              placeholder=""
              value={data.appBasic.start_month}
              onChange={(e) =>
                updateData({
                  appBasic: { ...data.appBasic, start_month: e.target.value },
                })
              }
            />
          </div>
          {!data.appBasic.start_month && hasError && (
            <div className="fv-plugins-message-container">
              <div
                data-field="start_month"
                data-validator="notEmpty"
                className="fv-help-block"
              >
                School start_month is required
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export { Step2 };
