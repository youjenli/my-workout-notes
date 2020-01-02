/*
    實驗發現若重覆從 DriveApp 取得檔案或資料匣，則透過較晚取得的資料匣之檔案操作可能會失敗。
    為以防 SpreadSheet 也有這個問題，我決定透過此類別統籌管理應用程式設定檔的建立與提取，以免其他功能未來拿到有問題的表單。
*/
class AppSettings implements Resource<GoogleAppsScript.Spreadsheet.Spreadsheet> {
    KEY_TO_RETRIEVE_ID_OF_APP_CONFIGURATION_FILE = 'id_of_app_configuration_file';
    DEFAULT_FILE_NAME_OF_APP_SETTINGS = '我的重量訓練紀錄─應用程式設定檔';
    appConfigFile:GoogleAppsScript.Drive.File = null;
    resourceFactory:ResourceFactory = null;

    constructor(resourceFactory:ResourceFactory) {
        this.resourceFactory = resourceFactory;
    }

    exists():boolean {
        const userProps = this.resourceFactory.getUserProps();
        const id = userProps.getProperty(this.KEY_TO_RETRIEVE_ID_OF_APP_CONFIGURATION_FILE);
        if (isNotBlank(id)) {
            this.appConfigFile = DriveApp.getFileById(id);
            if (this.appConfigFile.isTrashed()) {
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
            let nameOfAppSettingsSpreadsheet = this.DEFAULT_FILE_NAME_OF_APP_SETTINGS;
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
            this.appConfigFile = DriveApp.getFileById(spreadSheetId);
            parent.addFile(this.appConfigFile);
            const userProps = this.resourceFactory.getUserProps();
            userProps.setProperty(this.KEY_TO_RETRIEVE_ID_OF_APP_CONFIGURATION_FILE, spreadSheetId);
        } else {
            //todo 未來要留意若透過這個函式重覆取得 spreadsheet，則該 spreadsheet 有無 DriveApp Folder 第二個參考的操作會失敗的問題。
            spreadSheet = SpreadsheetApp.open(this.appConfigFile);
        }
        return spreadSheet;
    }
}