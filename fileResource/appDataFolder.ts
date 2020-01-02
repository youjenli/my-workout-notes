/*
    因為實驗發現若重覆從 DriveApp 取得檔案或資料匣，則較晚取得的資料匣之檔案操作可能會失敗，
    所以我決定透過此類別統籌提供應用程式資料匣的建立與提取服務，以免其他功能未來拿到的資料匣是有問題的。
*/
const AppDataFolder = function() {
    this.KEY_TO_RETRIEVE_ID_OF_APPLICATION_DATA_FOLDER = 'path_of_application_data';
    this.DEFAULT_PATH_OF_APPLICATION_DATA = '我的重量訓練紀錄';
    this.appDataFolder = null;

    this.exists = ():boolean => {
        const userProps = resourceManager.getUserProps();
        const id = userProps.getProperty(this.KEY_TO_RETRIEVE_ID_OF_APPLICATION_DATA_FOLDER);
        if (isNotBlank(id)) {
            this.appDataFolder = DriveApp.getFolderById(id);
            if (!this.appDataFolder.isTrashed()) {
                return true;
            }
            return false;
        } else {
            return false;
        }
    };

    this.get = (nameOfAppDataFolderAssignedByUser?:string):GoogleAppsScript.Drive.Folder => {
        if (this.appDataFolder === null) {
            if (isNotBlank(nameOfAppDataFolderAssignedByUser)) {
                this.appDataFolder = DriveApp.getRootFolder().createFolder(nameOfAppDataFolderAssignedByUser);
            } else {
                this.appDataFolder = DriveApp.getRootFolder().createFolder(this.DEFAULT_PATH_OF_APPLICATION_DATA);
            }
            const userProps = resourceManager.getUserProps();
            userProps.setProperty(this.KEY_TO_RETRIEVE_ID_OF_APPLICATION_DATA_FOLDER, this.appDataFolder.getId());
        }
        return this.appDataFolder;
    }
}