
/*
    要做的事
    1. 調出訓練項目
        1. 檢查使用者是否有訓練項目文件？ 若無，則從範本產生訓練文件
        2. 從暨有訓練項目文件或範本讀取訓練項目
    2. 回傳包含各訓練項目供提交的頁面給使用者
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
    2. 儲存訓練項目到訓練項目文件
        1. 檢查使用者是否有訓練項目文件？ 若無，則從範本產生訓練文件
    3. 將訓練項目儲存至暨有訓練項目文件或範本
    4. 回報執行結果
*/
function updateRecord() {
    
}