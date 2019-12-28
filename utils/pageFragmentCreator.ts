function getHtmlOutputFromFile(absolutePathOfFile:string):GoogleAppsScript.HTML.HtmlOutput {
    return  HtmlService.createHtmlOutputFromFile(absolutePathOfFile);
}

function getHtmlAsStringFromFile(absolutePathOfFile:string):string {
    return  HtmlService.createHtmlOutputFromFile(absolutePathOfFile).getContent();
}

function createScriptTagAsString(script:string):string {
    return `<script>${script}</script>`;
}

function getHtmlAsStringFromTemplate(absolutePathOfFile:string) {
    return HtmlService.createTemplateFromFile(absolutePathOfFile).evaluate().getContent();
}