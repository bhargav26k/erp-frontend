import { StepProps } from "../IAppModels";
const stateData = {
  India: ["Maharashtra", "Karnataka", "Tamil Nadu"], // Example states for India
  USA: ["California", "New York", "Texas"], // Example states for USA
  // Add more countries and their corresponding states as needed
};
const Step1 = ({ data, updateData, hasError }: StepProps) => (
  <div className="current" data-kt-stepper-element="content">
    <div className="w-500" style={{ minWidth: "650px" }}>
      {/*begin::Form Group */}
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
            <span className="required">School Name</span>
          </label>
          <input
            type="text"
            className="form-control form-control-lg form-control-solid border-black"
            name="name"
            placeholder=""
            value={data.appBasic.name}
            onChange={(e) =>
              updateData({
                appBasic: { ...data.appBasic, name: e.target.value },
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
            <span className="required">School Email</span>
          </label>
          <input
            type="email"
            className="form-control form-control-lg form-control-solid border-black"
            name="email"
            placeholder=""
            value={data.appBasic.email}
            onChange={(e) =>
              updateData({
                appBasic: { ...data.appBasic, email: e.target.value },
              })
            }
          />
        </div>
        {!data.appBasic.email && hasError && (
          <div className="fv-plugins-message-container">
            <div
              data-field="email"
              data-validator="notEmpty"
              className="fv-help-block"
            >
              School Email is required
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
          <label className="d-flex align-items-center fs-5 fw-semibold mb-2 ">
            <span className="required">School Phone</span>
          </label>
          <input
            type="tel"
            className="form-control form-control-lg form-control-solid border-black"
            name="phone"
            placeholder=""
            value={data.appBasic.phone}
            onChange={(e) =>
              updateData({
                appBasic: { ...data.appBasic, phone: e.target.value },
              })
            }
          />
        </div>
        {!data.appBasic.phone && hasError && (
          <div className="fv-plugins-message-container">
            <div
              data-field="phone"
              data-validator="notEmpty"
              className="fv-help-block"
            >
              phone is required
            </div>
          </div>
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "50%",
            // border:'1px solid'
          }}
        >
          <label className="d-flex align-items-center fs-5 fw-semibold mb-2">
            <span className="required">School Address</span>
          </label>
          <input
            type="text"
            className="form-control form-control-lg form-control-solid border-black"
            name="address"
            placeholder=""
            value={data.appBasic.address}
            onChange={(e) =>
              updateData({
                appBasic: { ...data.appBasic, address: e.target.value },
              })
            }
          />
        </div>
        {!data.appBasic.address && hasError && (
          <div className="fv-plugins-message-container">
            <div
              data-field="address"
              data-validator="notEmpty"
              className="fv-help-block"
            >
              address is required
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
          <label className="d-flex align-items-center fs-5 fw-semibold mb-2 ">
            <span className="required"> country</span>
          </label>
          <select
            className="form-control form-control-lg form-control-solid border-black"
            name="country"
            value={data.appBasic.country}
            onChange={(e) =>
              updateData({
                appBasic: {
                  ...data.appBasic,
                  country: e.target.value,
                },
              })
            }
          >
            <option value="">Select Country</option>
            <option value="India">India</option>
            <option value="USA">USA</option>
            <option value="UK">UK</option>
            {/* Add more options as needed */}
          </select>
        </div>
        {!data.appBasic.country && hasError && (
          <div className="fv-plugins-message-container">
            <div
              data-field="country"
              data-validator="notEmpty"
              className="fv-help-block"
            >
              country is required
            </div>
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "50%",
            // border:'1px solid'
          }}
        >
          <label className="d-flex align-items-center fs-5 fw-semibold mb-2">
            <span className="required">state </span>
          </label>
          <select
            className="form-control form-control-lg form-control-solid border-black"
            name="state"
            value={data.appBasic.state}
            onChange={(e) =>
              updateData({
                appBasic: {
                  ...data.appBasic,
                  state: e.target.value,
                },
              })
            }
          >
            <option value="">Select State</option>
            {/* Populate states based on selected country */}
            
            {
             /* @ts-ignore */
            stateData[data.appBasic.country] &&
             /* @ts-ignore */
              stateData[data.appBasic.country].map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
          </select>
        </div>
        {!data.appBasic.state && hasError && (
          <div className="fv-plugins-message-container">
            <div
              data-field="state"
              data-validator="notEmpty"
              className="fv-help-block"
            >
              state is required
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
          <label className="d-flex align-items-center fs-5 fw-semibold mb-2 ">
            <span className="required">type_of_school</span>
          </label>
          <select
            className="form-control form-control-lg form-control-solid border-black"
            name="type_of_school"
            value={data.appBasic.type_of_school}
            onChange={(e) =>
              updateData({
                appBasic: {
                  ...data.appBasic,
                  type_of_school: e.target.value,
                },
              })
            }
          >
            <option value="">Select type_of_school</option>
            <option value="Primary">Primary</option>
            <option value="Secondary">Secondary</option>
            <option value="Higher">Higher</option>
            {/* Add more options as needed */}
          </select>
          {!data.appBasic.type_of_school && hasError && (
            <div className="fv-plugins-message-container">
              <div
                data-field="type_of_school"
                data-validator="notEmpty"
                className="fv-help-block"
              >
                type_of_school App name is required
              </div>
            </div>
          )}
        </div>
        
    </div>
  </div>
  </div>
);

export { Step1 };

{
  /* <div>
          <label className='d-flex align-items-center justify-content-between mb-6 cursor-pointer'>
            <span className='d-flex align-items-center me-2'>
              <span className='symbol symbol-50px me-6'>
                <span className='symbol-label bg-light-primary'>
                  <KTIcon iconName='compass' className='fs-1 text-primary' />
                </span>
              </span>

              <span className='d-flex flex-column'>
                <span className='fw-bolder fs-6'>Quick Online Courses</span>
                <span className='fs-7 text-muted'>
                  Creating a clear text structure is just one SEO
                </span>
              </span>
            </span>

            <span className='form-check form-check-custom form-check-solid'>
              <input
                className='form-check-input'
                type='radio'
                name='appType'
                value='Quick Online Courses'
                checked={data.appBasic.appType === 'Quick Online Courses'}
                onChange={() =>
                  updateData({
                    appBasic: {
                      appName: data.appBasic.appName,
                      appType: 'Quick Online Courses',
                    },
                  })
                }
              />
            </span>
          </label>
          <label className='d-flex align-items-center justify-content-between mb-6 cursor-pointer'>
            <span className='d-flex align-items-center me-2'>
              <span className='symbol symbol-50px me-6'>
                <span className='symbol-label bg-light-danger'>
                  <KTIcon iconName='category' className='fs-1 text-danger' />
                </span>
              </span>

              <span className='d-flex flex-column'>
                <span className='fw-bolder fs-6'>Face to Face Discussions</span>
                <span className='fs-7 text-muted'>
                  Creating a clear text structure is just one aspect
                </span>
              </span>
            </span>

            <span className='form-check form-check-custom form-check-solid'>
              <input
                className='form-check-input'
                type='radio'
                name='appType'
                value='Face to Face Discussions'
                checked={data.appBasic.appType === 'Face to Face Discussions'}
                onChange={() =>
                  updateData({
                    appBasic: {
                      appName: data.appBasic.appName,
                      appType: 'Face to Face Discussions',
                    },
                  })
                }
              />
            </span>
          </label>
          <label className='d-flex align-items-center justify-content-between mb-6 cursor-pointer'>
            <span className='d-flex align-items-center me-2'>
              <span className='symbol symbol-50px me-6'>
                <span className='symbol-label bg-light-success'>
                  <KTIcon iconName='timer' className='fs-1 text-success' />
                </span>
              </span>

              <span className='d-flex flex-column'>
                <span className='fw-bolder fs-6'>Full Intro Training</span>
                <span className='fs-7 text-muted'>
                  Creating a clear text structure copywriting
                </span>
              </span>
            </span>

            <span className='form-check form-check-custom form-check-solid'>
              <input
                className='form-check-input'
                type='radio'
                name='appType'
                value='Full Intro Training'
                checked={data.appBasic.appType === 'Full Intro Training'}
                onChange={() =>
                  updateData({
                    appBasic: {
                      appName: data.appBasic.appName,
                      appType: 'Full Intro Training',
                    },
                  })
                }
              />
            </span>
          </label>
        </div> */
}
