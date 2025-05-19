import { CustomTab } from "./advocate";
import NewRule from './newRule';
import NewDecision from './newDecision';

type Props = {
    selectedTab: CustomTab;
  };

const New = ({selectedTab}: Props) => {
    if (selectedTab === 0) {
        return <NewRule />
    } else {
        return <NewDecision />
    }
}

export default New;