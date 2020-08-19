export type Dict = { [key: string]: any }

type GeneralDate = Date | GoogleAppsScript.Base.Date;
function japaneseDateFormat(date: GeneralDate, isFull = false): string {
    /**
     * Change Date to Japanese normaly string format.
     * For example, "2020-06-30"
     */
    const formatString = isFull ? "yyyy-MM-dd HH:mm:ss" : "yyyy-MM-dd";
    return Utilities.formatDate(date, "JST", formatString);
}

export function qiitaTrend(options: Dict): Dict {
    const baseUrl: string = "https://qiita.com/api/v2/items";
    const query: Dict = createQuery(options);
    const requestUrl: string = baseUrl + "?" + (() => {
        var requestQuery = []
        Object.keys(query).forEach(key => {
            const value: any = query[key];
            requestQuery.push(`${key}=${value}`);
        });
        return requestQuery.join("&").replace(":", "%3A");
    })();
    console.log(requestUrl);
    const response: GoogleAppsScript.URL_Fetch.HTTPResponse = UrlFetchApp.fetch(requestUrl);
    const responseJson: Dict = JSON.parse(response.getContentText("UTF-8"));

    const result = (() => {
        var dataset = []
        Object.keys(responseJson).forEach(index => {
            const value = responseJson[index];
            dataset.push([`${value["title"]}`, `${value["url"]}`]);
        });
        return dataset;
    })()
    console.log(result);
    return result;
}

function createQuery(options: Dict): Dict {
    const page: string = String(options["page"] ?? 1);
    const perPage: string = String(options["per_page"] ?? 20);
    const tags: string = encodeURIComponent(((): string => {
        const _tags: [string] = options["tag"] ?? ["Python"]
        for (let index = 0; index < _tags.length; index++) {
            const element = _tags[index];
            _tags[index] = `tag:${element}`;
        }
        return _tags.join(" ")
    })());
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