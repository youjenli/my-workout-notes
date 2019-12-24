
/*
    要做的事
    1. 回傳包含各訓練項目供提交的頁面給使用者
        樣板要做的事
        1. 調出訓練項目
            成功 => 執行 2
            失敗 => 輸出錯誤訊息頁面
        2. 輸出頁面內容
*/
function doGet (e) {
    
    try {
        return HtmlService.createTemplateFromFile('html/index.html').evaluate();
    } catch(e) {
        Logger.log(e);
    }
    
}

/*
    要做的事
    1. 搜集請求中的訓練項目
        搜集成功 => 執行 2
        搜集失敗 => 報錯
    2. 驗證訓練項目資料是否有誤，格式是否正確
        搜集成功 => 執行 3
        搜集失敗 => 報錯
    3. 儲存訓練項目到訓練項目文件
        搜集成功 => 執行 4
        搜集失敗 => 報錯
    4. 回報執行成功
*/
function updateRecord() {
    
}