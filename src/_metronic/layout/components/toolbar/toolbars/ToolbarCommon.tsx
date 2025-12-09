
import {FC, useEffect, useState} from 'react'
import {KTIcon, toAbsoluteUrl} from '../../../../helpers'

const ToolbarCommon: FC = () => {
  const [progress, setProgress] = useState<string>('1')
  const [search, setSearch] = useState<string>('')

  useEffect(() => {
    document.body.setAttribute('data-kt-app-toolbar-fixed', 'true')
  }, [])

  return (
    <>
      <div className='d-flex align-items-center flex-shrink-0' style={{border:'1px solid'}}>

      </div>
    </>
  )
}

export {ToolbarCommon}
