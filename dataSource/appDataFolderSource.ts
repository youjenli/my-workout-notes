/*
    此類別存在的意義：
    因為實驗發現若重覆從 DriveApp 取得檔案或資料匣，則透過較晚取得的資料匣之檔案操作可能會失敗，
    所以我決定透過此類別統籌提供應用程式資料匣的建立與提取服務，以免其他功能未來拿到有問題的資料匣。

    使用 JavaScript 類別的原因：
    這樣可以比較清楚向 typescript compiler 表明它依賴的物件之傳遞路徑，將來若要重構會比較省力。
*/
class AppDataFolderSource implements Resource<GoogleAppsScript.Drive.Folder> {
    KEY_TO_RETRIEVE_ID_OF_APPLICATION_DATA_FOLDER = 'path_of_application_data';
    DEFAULT_PATH_OF_APPLICATION_DATA = '我的重量訓練紀錄';
    appDataFolder = null;
    userProps:GoogleAppsScript.Properties.UserProperties = null;

    constructor(userProps:GoogleAppsScript.Properties.UserProperties){
        this.userProps = userProps;
    }

    exists():boolean {
        const id = this.userProps.getProperty(this.KEY_TO_RETRIEVE_ID_OF_APPLICATION_DATA_FOLDER);
        if (isNotBlank(id)) {
            this.appDataFolder = DriveApp.getFolderById(id);
            if (this.appDataFolder.isTrashed()) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    };

    get(params?:{nameOfResourceAssignedByUser?:string, parentFolder?:GoogleAppsScript.Drive.Folder}):GoogleAppsScript.Drive.Folder {
        if (!this.exists()) {
            let parent = DriveApp.getRootFolder();
            let appDataFolderName = this.DEFAULT_PATH_OF_APPLICATION_DATA;
            if (isObjectLike(params)) {
                if (params.parentFolder != undefined) {
                    parent = params.parentFolder;
                }
                if (isNotBlank(params.nameOfResourceAssignedByUser)) {
                    appDataFolderName = params.nameOfResourceAssignedByUser;
                }
            }
            this.appDataFolder = parent.createFolder(appDataFolderName);
            this.userProps.setProperty(this.KEY_TO_RETRIEVE_ID_OF_APPLICATION_DATA_FOLDER, this.appDataFolder.getId());
        }
        return this.appDataFolder;
    }
}