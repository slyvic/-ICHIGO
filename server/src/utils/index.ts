/**
 * delayTimesミリ秒の間、プロセスを遅延させる
 * @param {Number} delayTimes - 遅延時間の期間
 * @returns {Promise} - 遅延後に解決するPromiseオブジェクト
 */
export const delay = (delayTimes: number) => {
	return new Promise((resolve: any) => {
	  setTimeout(() => {
		resolve(2);
	  }, delayTimes);
	});
  };
  
  /**
   * データが文字列かどうかをチェックする
   * @param {any} data - チェックするデータ
   * @returns {boolean} - データが文字列であるかどうかを示す真偽値
   */
  export const checkIfString = (data: any) => {
	return typeof data === 'string' || data instanceof String;
  };
  
  /**
   * データが数値かどうかをチェックする
   * @param {any} data - チェックするデータ
   * @returns {boolean} - データが数値であるかどうかを示す真偽値
   */
  export const checkIfNumber = (data: any) => {
	return typeof data === 'number';
  };
  
  /**
   * 現在の年または指定された日付の年を取得する
   * @param {string} date - 年を取得する日付（省略可）
   * @returns {number} - 現在の年または指定された日付の年を表す数値
   */
  export const getThisYear = (date: string = null) => {
	var now = new Date();
	if (date) now = new Date(date);
	return now.getUTCFullYear();
  };
  
  /**
   * 指定された年の開始日を取得する
   * @param {number} year - 開始日を取得する年
   * @returns {string} - 指定された年の開始日をUTC形式の文字列で表す
   */
  export const getStartDateOfYear = (year: number) => {
	return new Date(Date.UTC(year, 0, 1)).toUTCString();
  };