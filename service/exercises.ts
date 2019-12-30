/// <reference path="application.ts" />
/*
    這個模組的責任
    1. 建立訓練項目記錄文件
    2. 記錄訓練項目
    3. 讀取訓練項目（待規劃）

    因此要建立的公開函式
    1. 檢查訓練項目格式是否正確
    2. 記錄訓練項目
    3. 取得訓練項目
*/
const exercise = 
(function(pathOfApplicationData:string){
    function addNotesOfExercises() {

    }

    return {
        addNotesOfExercises:addNotesOfExercises
    }
})(app.getPathOfApplicationData());