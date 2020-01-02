interface Resource<T> {
    exists:() => boolean;
    get:(params?:{nameOfResourceAssignedByUser?:string, parentFolder?:GoogleAppsScript.Drive.Folder}) => T
}

interface ResourceFactory {
    getAppDataFolderSource:() => Resource<GoogleAppsScript.Drive.Folder>;
    getUserProps:() => GoogleAppsScript.Properties.UserProperties;
    getAppConfigSource:() => Resource<GoogleAppsScript.Spreadsheet.Spreadsheet>;
    getWorkoutSource:() => Resource<GoogleAppsScript.Spreadsheet.Spreadsheet>;
}

const resourceFactory:ResourceFactory = (function(){

    let appDataFolder = null;
    let userProps = null;
    let appConfig = null;
    let workoutRecord = null;
    const obj:ResourceFactory = {
        getAppDataFolderSource:null,
        getUserProps:null,
        getAppConfigSource:null,
        getWorkoutSource:null
    }

    obj.getAppDataFolderSource = ():Resource<GoogleAppsScript.Drive.Folder> => {
        if (appDataFolder == null) {
            appDataFolder = new AppDataFolderSource(obj.getUserProps());
        }
        return appDataFolder;
    }

    obj.getUserProps = ():GoogleAppsScript.Properties.UserProperties => {
        if (userProps == null) {
            userProps = PropertiesService.getUserProperties();
        }
        return userProps;
    }

    obj.getAppConfigSource = ():Resource<GoogleAppsScript.Spreadsheet.Spreadsheet> => {
        if (appConfig == null) {
            appConfig = new SpreadsheetSource(
                                'id_of_app_configuration_file',
                                '我的重量訓練紀錄─應用程式設定檔',
                                obj.getUserProps());
        }
        return appConfig;
    }

    obj.getWorkoutSource = ():Resource<GoogleAppsScript.Spreadsheet.Spreadsheet> => {
        if (workoutRecord == null) {
            workoutRecord = new SpreadsheetSource(
                                'id_of_workout_record',
                                '我的重量訓練紀錄─訓練活動紀錄',
                                obj.getUserProps());
        }
        return workoutRecord;
    }
     
    return obj;

})();