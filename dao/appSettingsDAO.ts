/*
    這個模組的責任
    1. 檢查應用程式設定是否存在
    2. 初始化應用程式設定
    3. 讀取應用程式設定
    4. 調整應用程式設定（待規劃）
*/
const DEFAULT_NAME_OF_APP_SETTINGS = 'configuration of my workout notes';
const TRAINING_RECORD_PROPERTY_KEY = 'my_workout_config_key';

/*
    檢查應用程式設定是否存在
*/
function didAppSetup():boolean {
    const userProperties = PropertiesService.getUserProperties();
    if (isObjectLike(userProperties) && isNotBlank(userProperties.getProperty(TRAINING_RECORD_PROPERTY_KEY))) {
            return true;
    } else {
        return false;
    }
}

/*
    根據參數使用這模組附帶的範本建立應用程式範本
*/
function initialize() {

}

/*
    讀取應用程式設定
    1. 檢查快取中有無訓練項目紀錄。
        有 => 直接調用
        無 => 讀取應用程式設定檔，然後將設定寫入快取
*/
function read() {

}