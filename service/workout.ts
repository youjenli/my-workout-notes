/// <reference path="application.ts" />

let workout = 
(function(){

    const KEY_TO_RETRIEVE_ID_OF_WORKOUT_RECORD = 'id_of_workout_record';
    const DEFAULT_FILE_NAME_OF_WORKOUT_RECORD = '我的重量訓練紀錄─訓練活動紀錄';

    function wasInitialized():boolean {
        const userProps = PropertiesService.getUserProperties();
        const key = userProps.getProperty(KEY_TO_RETRIEVE_ID_OF_WORKOUT_RECORD);
        if (isNotBlank(key)) {
            try {
                const file = DriveApp.getFileById(key);
                if (!file.isTrashed()) {
                    return true;
                }
            } catch (e) {
                Logger.log(e);
                /* 既然此使用者參數無助我讀到設定檔，那就刪掉它。 */
                userProps.deleteProperty(KEY_TO_RETRIEVE_ID_OF_WORKOUT_RECORD);
                return false;
            }
            return false;
        } else {
            return false;
        }
    }

    const columnsOfWorkout = {
        name:'訓練活動',
        properties:[{ name:'活動序號', indexName:'serialNo' },{ name:'開始時間', indexName:'startTime' },{ name:'結束時間', indexName:'endTime' },
            { name:'備註', indexName:'remark' }]
    };

    /*
        建立訓練活動紀錄的儲存檔

        這邊之所以要以 appDataFolder 為參數，原因是我發現若在同一次請求的生命週期中以 id 取其他函式產生的資料匣物件，
        則該物件執行相關操作會失敗，因此一定要留這個參數給 app 初始化的函式傳遞 appDataFolder 物件
    */
    function initialize(appDataFolder?:GoogleAppsScript.Drive.Folder):void {
        const spreadSheet = SpreadsheetApp.create(DEFAULT_FILE_NAME_OF_WORKOUT_RECORD);
        const sheet = spreadSheet.getSheets()[0];
        sheet.setName(columnsOfWorkout.name).setFrozenRows(1);
        for (let col = 1 ; col <= columnsOfWorkout.properties.length ; col ++) {
            sheet.getRange(1, col).setValue(columnsOfWorkout.properties[col - 1].name);
        }

        const spreadSheetId = spreadSheet.getId();
        const spreadSheetFile = DriveApp.getFileById(spreadSheetId);
        if (appDataFolder != undefined) {
            appDataFolder.addFile(spreadSheetFile);
        }

        const userProps = PropertiesService.getUserProperties();
        userProps.setProperty(KEY_TO_RETRIEVE_ID_OF_WORKOUT_RECORD, spreadSheetId);
    }

    function getLastWorkout() {

    }

    return {
        wasInitialized:wasInitialized,
        initialize:initialize,
        getLastWorkout:getLastWorkout
    }
})();