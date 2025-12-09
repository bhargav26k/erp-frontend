
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const CheckInAndCheckOutPage: FC = () => {
  return <div>CheckInAndCheckOut</div>;
};

const CheckInAndCheckOut: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.CheckInAndCheckOut" })}
      </PageTitle>
      <CheckInAndCheckOutPage />
    </>
  );
};


export { CheckInAndCheckOut };
