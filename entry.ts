function doGet (e) {
    try {
        return HtmlService.createTemplateFromFile('html/index.html').evaluate();
    } catch(e) {
        Logger.log(e);
    }
    
}

function include(fileName:string) {
    try {
        return HtmlService.createHtmlOutputFromFile(fileName).getContent();
    } catch(e) {
        Logger.log(e);
    }
}