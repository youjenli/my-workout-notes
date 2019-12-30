/// <reference path="application.ts" />

let workout = 
(function(pathOfApplicationData:string){

    const KEY_TO_RETRIEVE_ID_OF_WORKOUT_RECORD = 'id_of_workout_record';

    function initialize() {
        
    }

    return {
        initialize:initialize
    }
})(app.getPathOfApplicationData());