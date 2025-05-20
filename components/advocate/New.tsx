import { CustomTab } from "./advocate";
import NewRule from './newRule';
import NewDecision from './newDecision';
import { Rule } from "@/database/rulesQueries";
import { Decision } from "@/database/decisionsQueries";

type Props = {
    selectedTab: CustomTab;
    ruleItem?: Rule
    decisionItem?: Decision
  };

const New = ({selectedTab, ruleItem, decisionItem}: Props) => {
    if (selectedTab === 0) {
        return <NewRule item={ruleItem}/>
    } else if (selectedTab === 1) {
        return <NewDecision item={decisionItem}/>
    }
}

export default New;