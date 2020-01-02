interface Resource<T> {
    exists:() => boolean;
    get:(nameOfResourceAssignedByUser?:string) => T
}

const resourceManager = (function(){

    let appDataFolder = null;
    let userProps = null;

    function getAppDataFolder() {
        if (appDataFolder == null) {
            appDataFolder = new AppDataFolder();
        }
        return appDataFolder;
    }

    function getUserProps():GoogleAppsScript.Properties.UserProperties {
        if (userProps == null) {
            userProps = PropertiesService.getUserProperties();
        }
        return userProps;
    }
     
    return {
        getAppDataFolder:getAppDataFolder,
        getUserProps:getUserProps
    }

})();