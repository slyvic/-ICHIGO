function Tier(customer: any) {
    switch (customer.tier) {
        case 'Gold': { return (<>🥇</>) }
        case 'Silver': { return (<>🥈 </>) }
        case 'Bronze': { return (<>🥉 </>) }
        default: { return (<></>) }
    }
}
export default Tier;