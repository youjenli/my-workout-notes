/// <reference path="../utils/resourceManager.ts" />
/*
    這個模組的責任
    1. 檢查應用程式設定是否存在
    2. 初始化應用程式設定
    3. 讀取應用程式設定
    4. 調整應用程式設定（待規劃）

    注意，實驗發現若透過 IIFE 的參數傳遞 resourceManager 物件，則 Google Apps Script 執行時會讀不到，原因暫時無法理解。
    因此目前先暫時直接存取 resourceManager 物件，未來再以更理想的方法組織程式碼，使開發者知道此物件依賴 resourceManager。
*/
let app = 
(function() {

    const KEY_TO_RETRIEVE_ID_OF_APP_CONFIGURATION_FILE = 'id_of_app_configuration_file';
    const DEFAULT_FILE_NAME_OF_APP_SETTINGS = '我的重量訓練紀錄─應用程式設定檔';

    enum SettingsGroup {
        APPLICATION = 'application',
        EXCERCISES = 'exercises',
        UNITS_OF_MEASUREMENT = 'units of measurement'
    }

    /*
        檢查應用程式設定是否存在
    */
    function wasSetup():boolean {
        const userProps = resourceManager.getUserProps();
        const key = userProps.getProperty(KEY_TO_RETRIEVE_ID_OF_APP_CONFIGURATION_FILE);
        if (isNotBlank(key)) {
            try {
                const file = DriveApp.getFileById(key);
                if (!file.isTrashed()) {
                    return true;
                }
            } catch (e) {
                Logger.log(e);
                /* 既然此使用者參數無助我讀到設定檔，那就刪掉它。 */
                userProps.deleteProperty(KEY_TO_RETRIEVE_ID_OF_APP_CONFIGURATION_FILE);
                return false;
            }
            return false;
        } else {
            return false;
        }
    }

    const unitsOfMeasurement = {
        kg:{
            functionOfConversion:{
                lb:function(weight) {
                    return weight * 2.20462; 
                }
            }
        },
        lb:{
            functionOfConversion:{
                kg:function(weight) {
                    return weight * 0.453592; 
                }
            }
        }
    }
    
    const defaultSettingsOfApp = {
        name:SettingsGroup.APPLICATION,
        properties:[{ name:'參數名稱', indexName:'name' }, { name:'參數值', indexName:'value' },
                    { name:'說明', indexName:'description'}],
        items:[
            {
                name:'defaultUnitOfMeasurement',
                value:'kg',
                description:'介面預設使用的單位'
            }
        ]
    }
    
    const defaultSettingsOfExercises = {
        name:SettingsGroup.EXCERCISES,
        properties:[{ name:'訓練項目', indexName:'name' }],
        items:[
            { name:'啞鈴聳肩' }, { name:'坐姿肩推機' }, { name:'固定式側平舉' }, { name:'啞鈴側平舉' },
            { name:'坐姿推胸機' },{ name:'蝴蝶機' },{ name:'臥推' },{ name:'啞鈴二頭肌' },
            { name:'三頭肌訓練機' },{ name:'坐姿划船機' },{ name:'高拉訓練機' },{ name:'闊背引體向上' },
            { name:'腰部旋轉機' },{ name:'深蹲' },{ name:'腿部推蹬機' },{ name:'曲腿訓練機' },
            { name:'腿部伸展機' }
        ]
    }
    
    function setupSpreadSheet(spreadSheet:GoogleAppsScript.Spreadsheet.Spreadsheet) {
        const sheets = spreadSheet.getSheets();
        const sheetOfAppSettings = sheets[0] || spreadSheet.insertSheet(0);
        sheetOfAppSettings.setName(defaultSettingsOfApp.name).setFrozenRows(1);
        for (let col = 1 ; col <= defaultSettingsOfApp.properties.length ; col ++) {
            sheetOfAppSettings.getRange(1, col).setValue(defaultSettingsOfApp.properties[col - 1].name);
        }
        for (let row = 2 ; row <= defaultSettingsOfApp.items.length + 1 ; row ++) {
            const item = defaultSettingsOfApp.items[row - 2];
            defaultSettingsOfApp.properties.forEach( (prop, idx) => {
                sheetOfAppSettings.getRange(row, idx + 1)
                    .setValue(item[prop.indexName]);
            });
        }
    
        const sheetOfExercises = sheets[1] || spreadSheet.insertSheet(1);
        sheetOfExercises.setName(defaultSettingsOfExercises.name).setFrozenRows(1);
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
    function setup(pathOfAppDataGivenByUser?:string):string {
        const spreadSheet = SpreadsheetApp.create(DEFAULT_FILE_NAME_OF_APP_SETTINGS);
        setupSpreadSheet(spreadSheet);  

        const spreadSheetId = spreadSheet.getId();
        const spreadSheetFile = DriveApp.getFileById(spreadSheetId);
        const appDataFolder = resourceManager.getAppDataFolder().get(pathOfAppDataGivenByUser);
        appDataFolder.addFile(spreadSheetFile);

        const userProps = resourceManager.getUserProps();
        userProps.setProperty(KEY_TO_RETRIEVE_ID_OF_APP_CONFIGURATION_FILE, spreadSheetId);
        return appDataFolder.getUrl();
    }

    /*
    讀取應用程式設定
        1. 檢查快取中有無訓練項目紀錄。
            有 => 直接調用
            無 => 讀取應用程式設定檔，然後將設定寫入快取
    */
    function loadGroupedSettings(groupOfSettings:SettingsGroup) {
        const userProps = resourceManager.getUserProps();
        const spreadSheetId = userProps.getProperty(KEY_TO_RETRIEVE_ID_OF_APP_CONFIGURATION_FILE);
        if (spreadSheetId != null) {
            const spreadSheet = SpreadsheetApp.openById(spreadSheetId);
            switch (groupOfSettings) {
                case SettingsGroup.APPLICATION:
                    const sheetOfAppSettings = spreadSheet.getSheetByName(defaultSettingsOfApp.name);
                    const appSettings = {};
                    const listOfSettings = sheetOfAppSettings.getRange(2, 1, sheetOfAppSettings.getLastRow() - 1, 1).getValues();
                    listOfSettings.forEach(row => {
                        appSettings[row[0]] = {};
                    })

                    const dataOfAppSettings = sheetOfAppSettings.getRange(2, 1, sheetOfAppSettings.getLastRow() - 1, defaultSettingsOfApp.properties.length).getValues();
                    dataOfAppSettings.forEach(dataOfAppSetting => {
                        for ( let col = 1 ; col < dataOfAppSetting.length ; col ++ ) {
                            appSettings[dataOfAppSetting[0]][defaultSettingsOfApp.properties[col].indexName] = dataOfAppSetting[col];
                        }
                    })

                    appSettings['unitsOfMeasurement'] = Object.getOwnPropertyNames(unitsOfMeasurement);

                    return appSettings;
                case SettingsGroup.EXCERCISES:
                    const sheetOfExercises = spreadSheet.getSheetByName(defaultSettingsOfExercises.name);
                    const exercises = [];
                    const dataOfExercises = sheetOfExercises.getRange(2, 1, sheetOfExercises.getLastRow() - 1, defaultSettingsOfExercises.properties.length).getValues();
                    dataOfExercises.forEach(dataOfExercise => {
                        const exercise = {};
                        for (let col = 0 ; col < dataOfExercise.length ; col ++) {
                            exercise[defaultSettingsOfExercises.properties[col].indexName] = dataOfExercise[col];
                        }
                        exercises.push(exercise);
                    })
                    return exercises;
                default:
                    return null;
            }
        } else {
            return null;//todo 更嚴謹的報告狀況
        }
    }

    return {
        wasSetup:wasSetup,
        setup:setup,
        SettingsGroup:SettingsGroup,
        loadGroupedSettings:loadGroupedSettings
    }
})();