//Order オブジェクトのインターフェースを定義する
interface Order {
    orderId: string, // 注文IDを表す文字列
    customerId: number, // 注文を行った顧客のIDを表す数値
    customerName: string, // 注文を行った顧客の名前を表す文字列
    totalInCents: number, // 注文の合計金額（セント単位）を表す数値
    date: string, // 注文の日付を表す文字列
    year: Number // 注文の年を表す数値
}

//Tier オブジェクトのインターフェースを定義する
interface Tier {
    tierId: number, // ティアのIDを表す数値
    totalSpent: number, // ティア内の顧客の総支出額を表す数値
    tierName: string // ティアの名前を表す文字列
}

//Customer オブジェクトのインターフェースを定義する
interface Customer {
    customerId: number, // 顧客のIDを表す数値
    name: string, // 顧客の名前を表す文字列
    totalSpent?: number, // 顧客の総支出額を表す数値（オプション）
    thisYearSpent?: number // 顧客の今年の支出額を表す数値（オプション）
}

//CustomerInfo オブジェクトのインターフェースを定義する
interface CustomerInfo {
    customerId: number, // 顧客のIDを表す数値
    customerName: string, // 顧客の名前を表す文字列
    tierName: string, // 顧客の所属するティアの名前を表す文字列
    startDate: string, // ティアの開始日を表す文字列
    totalSpent: number, // 顧客の総支出額を表す数値
    thisYearSpent: number, // 顧客の今年の支出額を表す数値
    amountForNextTier: number, // 次のティアに到達するために必要な金額を表す数値
    nextYearTier: string, // 来年の顧客の所属するティアの名前を表す文字列
    endDate: string, // ティアの終了日を表す文字列
    amountForKeepTier: number // 現在のティアを維持するために必要な金額を表す数値
}

//Tiers オブジェクトのインターフェースを定義する
interface Tiers {
    currentTier: Tier, // 顧客の現在のティアを表すTierオブジェクト
    nextTier: Tier, // 顧客が次に到達できるティアを表すTierオブジェクト
    isMaxTier: boolean // 顧客が最大のティアに到達しているかどうかを表すブール値
}