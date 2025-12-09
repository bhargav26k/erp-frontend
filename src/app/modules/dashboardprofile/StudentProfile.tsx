import { Content } from '../../../_metronic/layout/components/content'
import {
  FeedsWidget2,
 
} from '../../../_metronic/partials/widgets'

export function StudentProfile() {
  return (
    <Content>
      <div className='row g-5 g-xxl-8'>
        <div className='col-xl-12'>
          <FeedsWidget2 className='mb-5 mb-xxl-8' title={''} date={''} message={''} created_by={''} />
        </div>
      </div>
    </Content>
  )
}
