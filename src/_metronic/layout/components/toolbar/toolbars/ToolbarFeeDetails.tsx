
import clsx from 'clsx'
import {useState} from 'react'
import {KTIcon} from '../../../../helpers'
import {CreateAppModal, Dropdown4} from '../../../../partials'
import {useLayout} from '../../../core'

const ToolbarFeeDetails = () => {
  const {config} = useLayout()
  const [showCreateAppModal, setShowCreateAppModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handlePrimaryButtonClick = () => {
    setShowCreateAppModal(true);
    
  };

  const handleDateChange = (date : Date) => {
    setSelectedDate(date);
  };  

  const handleModalClose = () => {
    setShowCreateAppModal(false);
  };

  const settingsButtonClass = config.app?.toolbar?.fixed?.desktop
    ? 'btn-light'
    : 'bg-body btn-color-gray-700 btn-active-color-primary'

  return (
    <div className='d-flex align-items-center gap-2 gap-lg-3'>
      <div className='d-flex align-items-center flex-shrink-0'>
        {/* begin::Label */}
        <span className='fs-7 fw-bold text-gray-700 flex-shrink-0 pe-4 d-none d-md-block'>
          Filter By:
        </span>
        {/* end::Label */}

        <div className='flex-shrink-0 '>
          <ul className='nav'>
            <li className='nav-item'>
              <a
                className='nav-link btn btn-sm btn-color-muted btn-active-color-primary btn-active-light active fw-semibold fs-7 px-4 me-1'
                data-bs-toggle='tab'
                href='#'
              >
                3M
              </a>
            </li>

            <li className='nav-item'>
              <a
                className='nav-link btn btn-sm btn-color-muted btn-active-color-primary btn-active-light fw-semibold fs-7 px-4 me-1'
                data-bs-toggle='tab'
                href=''
              >
                6M
              </a>
            </li>

            <li className='nav-item'>
              <a
                className='nav-link btn btn-sm btn-color-muted btn-active-color-primary btn-active-light fw-semibold fs-7 px-4'
                data-bs-toggle='tab'
                href='#'
              >
                YTD
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className='bullet bg-secondary h-35px w-1px mx-5'></div>


      {config.app?.toolbar?.primaryButton && (
        <a
          href='#'
          onClick={handlePrimaryButtonClick}
          className='btn btn-sm fw-bold btn-primary'
        >
          {selectedDate.toLocaleDateString()}{' '}<KTIcon iconName='calendar-8' className='fs-1 ms-2 me-0' />
        </a>
      )}
      <CreateAppModal show={showCreateAppModal} handleClose={handleModalClose} selectDate={handleDateChange}/>
      {config.app?.toolbar?.filterButton && (
        <div className='m-0'>
          <a
            href='#'
            className={clsx('btn btn-sm  fw-bold', settingsButtonClass)}
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
            
          >
            <KTIcon iconName='setting' className='fs-1' />
          </a>
          <Dropdown4 />
        </div>
      )}

      {/* {config.app?.toolbar?.daterangepickerButton && (
        <div
          data-kt-daterangepicker='true'
          data-kt-daterangepicker-opens='left'
          className='btn btn-sm fw-bold  d-flex align-items-center px-4'
        >
          <div className='text-gray-600 fw-bold'>Loading date range...</div>
          <KTIcon iconName='calendar-8' className='fs-1 ms-2 me-0' />
        </div>
      )} */}

      {/* {config.app?.toolbar?.secondaryButton && (
        <a href='#' className='btn btn-sm btn-flex btn-light fw-bold'>
          Settings
        </a>
      )} */}

      
    </div>
  )
}

export {ToolbarFeeDetails}
