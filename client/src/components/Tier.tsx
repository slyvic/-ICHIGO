// 顧客データを使用してメダルアイコンを取得
function Tier(customer: any) {
    switch (customer.tier) {
        case 'Gold': { return (<>🥇</>) } // 'Gold'の場合、金メダルのアイコンを返す
        case 'Silver': { return (<>🥈 </>) } // 'Silver'の場合、銀メダルのアイコンを返す
        case 'Bronze': { return (<>🥉 </>) } // 'Bronze'の場合、銅メダルのアイコンを返す
        default: { return (<></>) } // それ以外の場合、何も返さない
    }
}

export default Tier;