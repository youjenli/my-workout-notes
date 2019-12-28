/*
    這個模組的責任
    1. 檢查應用程式設定是否存在
    2. 初始化應用程式設定
    3. 讀取應用程式設定
    4. 調整應用程式設定（待規劃）
*/
const DEFAULT_NAME_OF_APP_SETTINGS = 'configuration of my workout notes';
const KEY_TO_RETRIEVE_APP_CONFIGURATION_FILE = 'id_of_app_configuration_file';
const KEY_TO_RETRIEVE_PATH_OF_WORKOUT_RECORDS = 'root_path_of_workout_records';

/*
    檢查應用程式設定是否存在
*/
function didAppSetup():boolean {
    const userProps = PropertiesService.getUserProperties();
    const key = userProps.getProperty(KEY_TO_RETRIEVE_APP_CONFIGURATION_FILE);
    if (isNotBlank(key)) {
        try {
            const file = DriveApp.getFileById(key);
            if (!file.isTrashed()) {
                return true;
            }
        } catch (e) {
            Logger.log(e);
            /* 既然此使用者參數無助我讀到設定檔，那就刪掉它。 */
            userProps.deleteProperty(KEY_TO_RETRIEVE_APP_CONFIGURATION_FILE);
            return false;
        }
        return false;
    } else {
        return false;
    }
}

/*
    根據參數使用這模組附帶的範本建立應用程式範本
*/
function initialize(rootPath:string) {
    const sheet = SpreadsheetApp.create(DEFAULT_NAME_OF_APP_SETTINGS);
    const sheetId = sheet.getId();
    const sheetFile = DriveApp.getFileById(sheetId);
    DriveApp.createFolder(rootPath).addFile(sheetFile);
    DriveApp.getRootFolder().removeFile(sheetFile);
    
    const userProps = PropertiesService.getUserProperties();
    userProps.setProperty(KEY_TO_RETRIEVE_APP_CONFIGURATION_FILE, sheetId);
    userProps.setProperty(KEY_TO_RETRIEVE_PATH_OF_WORKOUT_RECORDS, rootPath);
    return sheet.getUrl();
}

/*
    讀取應用程式設定
    1. 檢查快取中有無訓練項目紀錄。
        有 => 直接調用
        無 => 讀取應用程式設定檔，然後將設定寫入快取
*/
function read() {
    
}