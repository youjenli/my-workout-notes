/// <reference path="dao/appSettingsDAO.ts" />
/// <reference path="utils/pageFragmentCreator.ts" />
/*
    要做的事
    1. 檢查使用者有沒有訓練項目設定？
        有 => 執行 2
        沒有 => 回傳頁面告訴使用者要為其建立訓練紀錄文件，令其提供文件位置與名稱，然後回報資訊以產生訓練紀錄文件，
                接著再執行 2

    2. 回傳包含各訓練項目的頁面給使用者以便提交紀錄
        此頁面的樣板要做的事
        a. 調出訓練項目
            成功 => 執行 2
            失敗 => 輸出錯誤訊息頁面
        b. 輸出頁面內容
*/
function doGet (e) {
    let application = {
        wasSetup:false
    };

    if (didAppSetup()) {
        application.wasSetup = true;
        application['settings'] = loadGroupedSettings(SettingsGroup.APPLICATION);
        application['exercises'] = loadGroupedSettings(SettingsGroup.EXCERCISES);
    }
    try {
        return getHtmlOutputFromFile('view/html/index.html')
                    .setTitle('我的訓練紀錄')
                    .append(createScriptTagAsString(`application = ${JSON.stringify(application)};`))
                    .append(getHtmlAsStringFromTemplate('view/script/script.html'));
    } catch(e) {
        Logger.log(e);
        return getHtmlOutputFromFile('view/html/internal-server-error.html');
    }
}

function setup(params:{ rootPath:string }) {
    if (isObjectLike(params) && isString(params.rootPath) && isNotBlank(params.rootPath.trim())) {
        try {
            const url = initialize(params.rootPath);
            return {
                isSuccessful:true,
                url:url
            }
        } catch(e) {
            Logger.log(e);
            return {
                isSuccessful:false
            }
        }
    } else {
        return {
            isSuccessful:false
        }
    }
}

/*
    要做的事
    1. 搜集請求中的訓練項目
        搜集成功 => 執行 2
        搜集失敗 => 報錯，令其重新填寫
    2. 檢查訓練項目資料是否有缺漏
        搜集成功 => 執行 3
        搜集失敗 => 報錯，令其補上
    3. 儲存訓練項目到訓練項目文件
        搜集成功 => 執行 4
        搜集失敗 => 報錯，令使用者查看錯誤訊息
    4. 回報執行成功
*/
function writeWorkoutRecord() {
    
}