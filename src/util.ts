export type Dict = { [key: string]: any }
export type GeneralDate = Date | GoogleAppsScript.Base.Date;

export function japaneseDateFormat(date: GeneralDate, isFull = false): string {
    /**
     * Change Date to Japanese normaly string format.
     * For example, "2020-06-30"
     */
    const formatString = isFull ? "yyyy-MM-dd HH:mm:ss" : "yyyy-MM-dd";
    return Utilities.formatDate(date, "JST", formatString);
}
