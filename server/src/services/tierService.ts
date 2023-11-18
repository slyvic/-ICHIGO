import { getStartDateOfYear, getThisYear } from "../utils";

const TierDatas: Tier[] = [
    { tierId: 0, tierName: "Bronze", totalSpent: 0 },
    { tierId: 1, tierName: "Silver", totalSpent: 100 },
    { tierId: 2, tierName: "Gold", totalSpent: 500 },
]

export const tierService = {
    /**
     * 現在のティアと次のレベルのティア情報を計算します
     * @param totalSpent : 累計支出額
     * @returns {currentTier, nextTier, isMaxTier}: 現在のティア、次のティア、最大のティアかどうか
     */
    getTier: (totalSpent: number): Tiers => {
        let currentTier = TierDatas[0];
        for (var i = 2; i >= 0; i--) {
           // ゴールド層から開始
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
