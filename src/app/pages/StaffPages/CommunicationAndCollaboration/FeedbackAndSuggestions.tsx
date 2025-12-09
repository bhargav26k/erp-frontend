
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const FeedbackAndSuggestionsPage: FC = () => {
  return <div>FeedbackAndSuggestions</div>;
};

const FeedbackAndSuggestions: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.FeedbackAndSuggestions" })}
      </PageTitle>
      <FeedbackAndSuggestionsPage />
    </>
  );
};


export { FeedbackAndSuggestions };
