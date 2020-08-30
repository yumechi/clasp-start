import { qiitaTrend } from "./APIAccess";
import { Dict } from "./util";

function sendQiitaNotification() {
    const trendData: Dict = qiitaTrend({
        // TODO: 設定情報は Property から取るようにする
        page: 1,
        per_page: 20,
        tag: ["TypeScript"],
        stocks: 10,
        created: ((): GoogleAppsScript.Base.Date => {
            const today: GoogleAppsScript.Base.Date = new Date();
            const oneWeekAgo: GoogleAppsScript.Base.Date = new Date(
                today.setDate(today.getDate() - 7)
            );
            return oneWeekAgo;
        })(),
    });
    sendNotificationMailToMySelf(createBody(trendData));
}

function createBody(data: Dict): string {
    return Object.values(data).map(value => value.join("\n")).join("\n");
}

function sendNotificationMailToMySelf(body: string): void {
    MailApp.sendEmail({
        to: Session.getActiveUser().getEmail(),
        subject: "今日のQiitaタグウォッチ！",
        body: body,
    });
}
