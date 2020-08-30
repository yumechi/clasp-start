import { Dict, japaneseDateFormat } from "./util";

export function qiitaTrend(options: Dict): Dict {
    const baseUrl: string = "https://qiita.com/api/v2/items";
    const query: Dict = createQuery(options);
    const requestUrl: string = baseUrl + "?" + Object.entries(query).map(([key, value]) => `${key}=${value}`).join("&").replace(":", "%3A");
    console.log(requestUrl);
    const response: GoogleAppsScript.URL_Fetch.HTTPResponse = UrlFetchApp.fetch(requestUrl);
    const responseJson: Dict = JSON.parse(response.getContentText("UTF-8"));
    return Object.values(responseJson).map(value => [`${value["title"]}`, `${value["url"]}`]);
}

function createQuery(options: Dict): Dict {
    const page: string = String(options["page"] ?? 1);
    const perPage: string = String(options["per_page"] ?? 20);
    const tags: string = encodeURIComponent(Object.values(options["tag"] ?? ["Python"]).map((value) => `tag:${value}`).join(" "));
    const stocks: string = encodeURIComponent("stocks:>" + String(options["stocks"] ?? 10));
    const created: string = encodeURIComponent("created:>" + japaneseDateFormat(options["created"] ??
        ((): GoogleAppsScript.Base.Date => {
            const today: GoogleAppsScript.Base.Date = new Date();
            const threeDaysAgo: GoogleAppsScript.Base.Date = new Date(today.setDate(today.getDate() - 3));
            return threeDaysAgo;
        })()
    ));

    return {
        "page": page,
        "per_page": perPage,
        "query": `${tags}+${stocks}+${created}`
    };
}

function test(): void {
    qiitaTrend({});
}
