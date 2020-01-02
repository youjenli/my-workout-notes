/// <reference path="application.ts" />
/// <reference path="../utils/resourceFactory.ts" />

interface WorkoutRecord {
    serialNo:string;
    name:string;
    startTime:Date;
    endTime:Date | '';
    remark:string;
    exercisesNoteId:string;//todo 取合適的名字
}

interface Workout extends WorkoutRecord {
    addExerciseNotes:() => {}
}

/*
    注意，實驗發現若透過 IIFE 的參數傳遞 resourceFactory 物件，則 Google Apps Script 執行時會讀不到，原因暫時無法理解。
    因此目前先暫時直接存取 resourceFactory 物件，未來再以更理想的方法組織程式碼，使開發者知道此物件依賴 resourceFactory。
*/
let workoutManager = 
(function(){

    const KEY_TO_RETRIEVE_ONGOING_WORKOUT = 'startTime_of_ongoing_workout';

    function wasInitialized():boolean {
        return resourceFactory.getWorkoutSource().exists();
    }

    const tableOfWorkoutRecord = {
        name:'訓練活動',
        columns:[{ name:'活動序號', indexName:'serialNo' },{ name:'活動名稱', indexName:'name'}, { name:'開始時間', indexName:'startTime' },{ name:'結束時間', indexName:'endTime' },
            { name:'備註', indexName:'remark' }]
    };

    /*
        建立訓練活動紀錄的儲存檔

        這邊之所以要以 appDataFolder 為參數，原因是我發現若在同一次請求的生命週期中以 id 取其他函式產生的資料匣物件，
        則該物件執行相關操作會失敗，因此一定要留這個參數給 app 初始化的函式傳遞 appDataFolder 物件
    */
    function initialize():void {
        const spreadSheet = resourceFactory.getWorkoutSource().get({ parentFolder:resourceFactory.getAppDataFolderSource().get() });
        const sheet = spreadSheet.getSheets()[0];
        sheet.setName(tableOfWorkoutRecord.name).setFrozenRows(1);
        for (let col = 1 ; col <= tableOfWorkoutRecord.columns.length ; col ++) {
            sheet.getRange(1, col).setValue(tableOfWorkoutRecord.columns[col - 1].name);
        }
    }

    function getOngoingWorkoutFromProps():WorkoutRecord {
        const userProps = resourceFactory.getUserProps();
        const ongoingWorkoutStr = userProps.getProperty(KEY_TO_RETRIEVE_ONGOING_WORKOUT);
        if (isNotBlank(ongoingWorkoutStr)) {
            const ongoingWorkout = JSON.parse(ongoingWorkoutStr);
            return ongoingWorkout;
        } else {
            return null;
        }
    }

    function getOngoingWorkout():Workout {
        const ongoingWorkout = getOngoingWorkoutFromProps();
        if (ongoingWorkout != null) {
            ongoingWorkout['addExerciseNotes'] = () => {
                /*
                    1. 取得儲存目前 workout 之訓練項目的文件
                    2. 寫入使用者提供的訓練項目
                */
            }
            return <Workout>ongoingWorkout;
        } else {

            return null;//todo 去訓練紀錄中查找沒完成時間的紀錄
        }
    }

    function startWorkout(name:string, remark:string):void {
        const spreadSheet = resourceFactory.getWorkoutSource().get();
        const sheet = spreadSheet.getSheetByName(tableOfWorkoutRecord.name);
        const time = new Date();

        const workout:WorkoutRecord = {
            serialNo:null/* todo */,
            name:isNotBlank(name) ? name : `${time.getFullYear()}${time.getMonth()}${time.getDay()} ${time.getHours()}:${time.getMinutes()} 進行的訓練`,
            startTime:time,
            endTime:'',
            remark:isNotBlank(remark) ? remark : '',
            exercisesNoteId:''//todo
        }
        sheet.appendRow([workout.serialNo, workout.name, workout.startTime, workout.endTime, workout.remark]);
    }

    function searchRowByWorkoutSerialNo(sheet:GoogleAppsScript.Spreadsheet.Sheet):GoogleAppsScript.Spreadsheet.Range {
        for (let row = sheet.getLastRow(), range = sheet.getRange(row,1,1,tableOfWorkoutRecord.columns.length) ;
            row >= 2 ; row --) {
            if (range.getValue()[3] == '') {
                return range;
            }
        }
    }

    function finishOngoingWorkout(time:string):void {
        const userProps = resourceFactory.getUserProps();
        const ongoingWorkout = getOngoingWorkoutFromProps();
        if (ongoingWorkout != null) {
            const spreadSheet = resourceFactory.getWorkoutSource().get();
            if (spreadSheet != null) {
                const sheet = spreadSheet.getSheetByName(tableOfWorkoutRecord.name);
                const range = searchRowByWorkoutSerialNo(sheet);
                const value:WorkoutRecord = ongoingWorkout;
                if (isNotBlank(time)) {
                    value[3] = new Date(time);
                } else {
                    value[3] = new Date();
                }
                range.setValue(value);
                userProps.deleteProperty(KEY_TO_RETRIEVE_ONGOING_WORKOUT);
            }
        }
    }

    return {
        wasInitialized:wasInitialized,
        initialize:initialize,
        getOngoingWorkout:getOngoingWorkout,
        startWorkout:startWorkout,
        finishOngoingWorkout:finishOngoingWorkout
    }
})();