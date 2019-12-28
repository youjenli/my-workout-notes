/*
    這個模組的責任
    1. 檢查應用程式設定是否存在
    2. 初始化應用程式設定
    3. 讀取應用程式設定
    4. 調整應用程式設定（待規劃）
*/
const DEFAULT_NAME_OF_APP_SETTINGS_FILE = 'configuration of my workout notes';
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

const defaultSettingsOfApp = {
    name:'application',
    properties:[{ name:'參數名稱', indexName:'name' }, { name:'參數值', indexName:'value' },
                { name:'說明', indexName:'description'}],
    items:[
        {
            name:'預設單位',
            value:'kg',
            description:'介面預設使用的單位'
        }
    ]
}

const defaultSettingsOfExercises = {
    name:'exercises',
    properties:[{ name:'訓練項目', indexName:'exercise' }],
    items:[
        { exercise:'啞鈴聳肩' }, { exercise:'坐姿肩推機' }, { exercise:'固定式側平舉' }, { exercise:'啞鈴側平舉' },
        { exercise:'坐姿推胸機' },{ exercise:'蝴蝶機' },{ exercise:'臥推' },{ exercise:'啞鈴二頭肌' },
        { exercise:'三頭肌訓練機' },{ exercise:'坐姿划船機' },{ exercise:'高拉訓練機' },{ exercise:'闊背引體向上' },
        { exercise:'腰部旋轉機' },{ exercise:'深蹲' },{ exercise:'腿部推蹬機' },{ exercise:'曲腿訓練機' },
        { exercise:'腿部伸展機' }
    ]
}

function setupSpreadSheet(spreadSheet:GoogleAppsScript.Spreadsheet.Spreadsheet) {
    const sheets = spreadSheet.getSheets();
    const sheetOfAppSettings = sheets[0] || spreadSheet.insertSheet(0);
    sheetOfAppSettings.setName(defaultSettingsOfApp.name);
    for (let col = 1 ; col <= defaultSettingsOfApp.properties.length ; col ++) {
        sheetOfAppSettings.getRange(1, col).setValue(defaultSettingsOfApp.properties[col - 1].name);
    }
    for (let row = 2 ; row <= defaultSettingsOfApp.items.length + 1 ; row ++) {
        const item = defaultSettingsOfApp.items[row - 2]
        defaultSettingsOfApp.properties.forEach( (prop, idx) => {
            sheetOfAppSettings.getRange(row, idx + 1)
                .setValue(item[prop.indexName]);
        });
    }

    const sheetOfExercises = sheets[1] || spreadSheet.insertSheet(1);
    sheetOfExercises.setName(defaultSettingsOfExercises.name);
    for (let col = 1 ; col <= defaultSettingsOfExercises.properties.length ; col ++) {
        sheetOfExercises.getRange(1, col).setValue(defaultSettingsOfExercises.properties[col - 1].name);
    }
    for (let row = 2 ; row <= defaultSettingsOfExercises.items.length + 1 ; row ++) {
        const item = defaultSettingsOfExercises.items[row - 2]
        defaultSettingsOfExercises.properties.forEach( (prop, idx) => {
            sheetOfExercises.getRange(row, idx + 1)
                .setValue(item[prop.indexName]);
        });
    }
    
    /*
        註：google apps script 不允許開發者一開始就刪除所有試算表
        因此只能直接使用原有的空白分頁
    */
    for (let i = 2 ; i < sheets.length ; i ++) {
        spreadSheet.deleteSheet(sheets[i]);
    }
}

/*
    根據參數使用這模組附帶的範本建立應用程式範本
*/
function initialize(rootPath:string) {
    const spreadSheet = SpreadsheetApp.create(DEFAULT_NAME_OF_APP_SETTINGS_FILE);
    setupSpreadSheet(spreadSheet);

    const spreadSheetId = spreadSheet.getId();
    const spreadSheetFile = DriveApp.getFileById(spreadSheetId);
    DriveApp.createFolder(rootPath).addFile(spreadSheetFile);
    DriveApp.getRootFolder().removeFile(spreadSheetFile);
    
    const userProps = PropertiesService.getUserProperties();
    userProps.setProperty(KEY_TO_RETRIEVE_APP_CONFIGURATION_FILE, spreadSheetId);
    userProps.setProperty(KEY_TO_RETRIEVE_PATH_OF_WORKOUT_RECORDS, rootPath);
    return spreadSheet.getUrl();
}

/*
    讀取應用程式設定
    1. 檢查快取中有無訓練項目紀錄。
        有 => 直接調用
        無 => 讀取應用程式設定檔，然後將設定寫入快取
*/
function read(groupNameOfSettings:string) {
    const userProps = PropertiesService.getUserProperties();
    const spreadSheetId = userProps.getProperty(KEY_TO_RETRIEVE_APP_CONFIGURATION_FILE);
    if (spreadSheetId != null) {
        const sheet = SpreadsheetApp.openById(spreadSheetId)
                        .getSheetByName(defaultSettingsOfApp.name);
        /*switch (groupNameOfSettings) {
            case defaultSettingsOfApp.name:
                const dataOfAppSettings = sheet.getRange(2, 1, sheet.getLastRow(), 3).getValues();
                const appSettings = {};
                for ( let row = 0 ; row < dataOfAppSettings.length ; row ++) {
                    appSettings[dataOfAppSettings[row][0]] = {
                        value:dataOfAppSettings[row][1],
                        description:dataOfAppSettings[row][2]
                    }
                }
                return appSettings;
            case defaultSettingsOfExercises.name:
                const dataOfExercises = sheet.getRange(1, 1, sheet.getLastRow(), 1).getValues();
                const exercises = [];
                for ( let row = 0 ; row < dataOfExercises.length ; row ++) {//todo
                    exercises.push(dataOfExercises[row][0]);
                }
                return exercises;
            default:
                return null;//todo
        }*/
    } else {
        return null;//todo 更嚴謹的報告狀況
    }
}