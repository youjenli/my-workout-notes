interface Resource<T> {
    exists:() => boolean;
    get:(params?:{nameOfResourceAssignedByUser?:string, parentFolder?:GoogleAppsScript.Drive.Folder}) => T
}

interface ResourceFactory {
    getAppDataFolder:() => Resource<GoogleAppsScript.Drive.Folder>;
    getUserProps:() => GoogleAppsScript.Properties.UserProperties;
    getAppConfig:() => Resource<GoogleAppsScript.Spreadsheet.Spreadsheet>;
}

const resourceFactory:ResourceFactory = (function(){

    let appDataFolder = null;
    let userProps = null;
    let appConfig = null;
    const obj = {
        getAppDataFolder:null,
        getUserProps:null,
        getAppConfig:null
    }

    obj.getAppDataFolder = ():Resource<GoogleAppsScript.Drive.Folder> => {
        if (appDataFolder == null) {
            appDataFolder = new AppDataFolder(obj);
        }
        return appDataFolder;
    }

    obj.getUserProps = ():GoogleAppsScript.Properties.UserProperties => {
        if (userProps == null) {
            userProps = PropertiesService.getUserProperties();
        }
        return userProps;
    }

    obj.getAppConfig = ():Resource<GoogleAppsScript.Spreadsheet.Spreadsheet> => {
        if (appConfig == null) {
            appConfig = new AppSettings(obj);
        }
        return appConfig;
    }
     
    return obj;

})();