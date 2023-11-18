import { getStartDateOfYear, getThisYear } from "../utils";

const TierDatas: Tier[] = [
    { tierId: 0, tierName: "Bronze", totalSpent: 0 },
    { tierId: 1, tierName: "Silver", totalSpent: 100 },
    { tierId: 2, tierName: "Gold", totalSpent: 500 },
]

export const tierService = {
    /**
     * calculate current tier and next level Tier info
     * @param totalSpent 
     * @returns {currentTier, nextTier, isMaxTier}
     */
    getTier: (totalSpent: number): Tiers => {
        let currentTier = TierDatas[0];
        for (var i = 2; i >= 0; i--) {
            // start from Gold tier
            if (TierDatas[i].totalSpent <= totalSpent) {
                currentTier = TierDatas[i];
                break;
            }
        }
        const isMaxTier = currentTier.tierId == 2
        let nextTier = isMaxTier ? TierDatas[2] : TierDatas[currentTier.tierId + 1]
        return { currentTier, nextTier, isMaxTier }
    }
}
