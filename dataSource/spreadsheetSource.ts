/*
    此類別存在的意義：
    實驗發現若重覆從 DriveApp 取得檔案或資料匣，則透過較晚取得的資料匣之檔案操作可能會失敗。
    為以防 SpreadSheet 也有這個問題，我決定透過此類別統籌管理應用程式設定檔的建立與提取，以免其他功能未來拿到有問題的表單。

    使用 JavaScript 類別的原因：
    這樣可以比較清楚向 typescript compiler 表明它依賴的物件之傳遞路徑，將來若要重構會比較省力。
*/
class SpreadsheetSource implements Resource<GoogleAppsScript.Spreadsheet.Spreadsheet> {
    
    propKeyOfSpreadsheetId = null;
    defaultFileName = null;
    userProps:GoogleAppsScript.Properties.UserProperties = null;
    spreadsheetFile:GoogleAppsScript.Drive.File = null;

    constructor(
            propKeyOfSpreadsheetId:string,
            defaultFileName:string,
            userProps:GoogleAppsScript.Properties.UserProperties) {
        this.propKeyOfSpreadsheetId = propKeyOfSpreadsheetId;
        this.defaultFileName = defaultFileName;
        this.userProps = userProps;
    }

    exists():boolean {
        const id = this.userProps.getProperty(this.propKeyOfSpreadsheetId);
        if (isNotBlank(id)) {
            this.spreadsheetFile = DriveApp.getFileById(id);
            if (this.spreadsheetFile.isTrashed()) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    };

    get(params?:{nameOfResourceAssignedByUser?:string, parentFolder?:GoogleAppsScript.Drive.Folder}):GoogleAppsScript.Spreadsheet.Spreadsheet {
        let spreadSheet = null;
        if (!this.exists()) {
            let parent = DriveApp.getRootFolder();
            let nameOfAppSettingsSpreadsheet = this.defaultFileName;
            if (isObjectLike(params)) {
                if (isNotBlank(params.nameOfResourceAssignedByUser)) {
                    nameOfAppSettingsSpreadsheet = params.nameOfResourceAssignedByUser;
                }
                if (params.parentFolder != undefined) {
                    parent = params.parentFolder;
                }
            }
            spreadSheet = SpreadsheetApp.create(nameOfAppSettingsSpreadsheet);
            const spreadSheetId = spreadSheet.getId();
            this.spreadsheetFile = DriveApp.getFileById(spreadSheetId);
            parent.addFile(this.spreadsheetFile);
            this.userProps.setProperty(this.propKeyOfSpreadsheetId, spreadSheetId);
        } else {
            //未來若透過這個函式重覆取得 spreadsheet，要留意 spreadsheet 有沒有像第二個 DriveApp Folder 參考的操作不會成功的問題。
            spreadSheet = SpreadsheetApp.open(this.spreadsheetFile);
        }
        return spreadSheet;
    }
}