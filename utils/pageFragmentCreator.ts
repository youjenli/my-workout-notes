function getHtmlFromFile(absolutePathOfFile:string):GoogleAppsScript.HTML.HtmlOutput {
    return  HtmlService.createHtmlOutputFromFile(absolutePathOfFile);
}

function getTemplateFromFile(absolutePathOfFile:string) {
    return HtmlService.createTemplateFromFile(absolutePathOfFile);
}