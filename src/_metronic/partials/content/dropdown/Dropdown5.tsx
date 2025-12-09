import { Link } from "react-router-dom";
export function Dropdown5() {
  return (
    <div
      className="menu menu-sub menu-sub-dropdown w-250px w-md-300px"
      data-kt-menu="true"
    >
      <div className="btn btn-outline-dark btn-sm btn-flex fs-6">
        <Link
          to="/fee-details/view-fee-master"
          className="text-decoration-none"
        >
          <a
            href="#"
            data-kt-menu-trigger="click"
            data-kt-menu-placement="bottom-end"
            style={{color:"gray-800",  transition: 'color 0.3s',
            WebkitTransition: 'color 0.3s',}}
          >
            View Income List
          </a>
        </Link>
      </div>

      <a
        href="#"
        className="btn btn-outline-dark btn-sm btn-flex fs-6 "
        data-kt-menu-trigger="click"
        data-kt-menu-placement="bottom-end"
      >
        Add Income
      </a>
      <div className="bullet bg-secondary w-275px h-1px mx-4"></div>

      <a
        href="#"
        className="btn btn-outline-dark btn-sm btn-flex fs-6 "
        data-kt-menu-trigger="click"
        data-kt-menu-placement="bottom-end"
      >
        View Income Head List
      </a>

      <a
        href="#"
        className="btn btn-outline-dark btn-sm btn-flex fs-6 "
        data-kt-menu-trigger="click"
        data-kt-menu-placement="bottom-end"
      >
        Add Income head
      </a>
      <div className="bullet bg-secondary w-275px h-1px mx-4"></div>

      <a
        href="#"
        className="btn btn-outline-dark btn-sm btn-flex fs-6 "
        data-kt-menu-trigger="click"
        data-kt-menu-placement="bottom-end"
      >
        View Expense List{" "}
      </a>

      <a
        href="#"
        className="btn btn-outline-dark btn-sm btn-flex fs-6 "
        data-kt-menu-trigger="click"
        data-kt-menu-placement="bottom-end"
      >
        Add Expense
      </a>
      <div className="bullet bg-secondary w-275px h-1px mx-4"></div>

      <a
        href="#"
        className="btn btn-outline-dark btn-sm btn-flex fs-6 "
        data-kt-menu-trigger="click"
        data-kt-menu-placement="bottom-end"
      >
        View Expense Head List{" "}
      </a>

      <a
        href="#"
        className="btn btn-outline-dark btn-sm btn-flex fs-6 "
        data-kt-menu-trigger="click"
        data-kt-menu-placement="bottom-end"
      >
        Add Expense Head
      </a>
      
      {/* <div className='separator border-gray-200'></div>
  
        <div className='px-7 py-5'>
          <div className='mb-10'>
            <label className='form-label fw-bold'>Status:</label>
  
            <div>
              <select
                className='form-select form-select-solid'
                data-kt-select2='true'
                data-placeholder='Select option'
                data-allow-clear='true'
                defaultValue={'1'}
              >
                <option></option>
                <option value='1'>Approved</option>
                <option value='2'>Pending</option>
                <option value='3'>In Process</option>
                <option value='4'>Rejected</option>
              </select>
            </div>
          </div>
  
          <div className='mb-10'>
            <label className='form-label fw-bold'>Member Type:</label>
  
            <div className='d-flex'>
              <label className='form-check form-check-sm form-check-custom form-check-solid me-5'>
                <input className='form-check-input' type='checkbox' value='1' />
                <span className='form-check-label'>Author</span>
              </label>
  
              <label className='form-check form-check-sm form-check-custom form-check-solid'>
                <input className='form-check-input' type='checkbox' value='2' defaultChecked={true} />
                <span className='form-check-label'>Customer</span>
              </label>
            </div>
          </div>
  
          <div className='mb-10'>
            <label className='form-label fw-bold'>Notifications:</label>
  
            <div className='form-check form-switch form-switch-sm form-check-custom form-check-solid'>
              <input
                className='form-check-input'
                type='checkbox'
                value=''
                name='notifications'
                defaultChecked={true}
              />
              <label className='form-check-label'>Enabled</label>
            </div>
          </div>
  
          <div className='d-flex justify-content-end'>
            <button
              type='reset'
              className='btn btn-sm btn-light btn-active-light-primary me-2'
              data-kt-menu-dismiss='true'
            >
              Reset
            </button>
  
            <button type='submit' className='btn btn-sm btn-primary' data-kt-menu-dismiss='true'>
              Apply
            </button>
          </div>
        </div> */}
    </div>
  );
}
