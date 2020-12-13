const indexedDB = 
window.indexedDB ||
window.mozIndexedDB ||
window.webkitIndexedDB ||
window.msIndexedDB ||
window.shimIndexedDB;

    // create budet db

let db;

// request
const request = indexedDB.open('budget', 1);

// request on upgrade 
// Install -> create bulk (pending) collection 

request.onupgradeneeded = ({target}) => {
    db = target.result;
    db.createObjectStore("pending", {autoIncrement : true})
}

// request on success
// listen to when back online and send records 
request.onsuccess = ({target}) => {
    db = target.result;
    if (navigator.onLine){
        checkDatabase();
    }
}

request.onerror = function(event){
    console.log("Request Error")
}

 // saveRecord -> save to indexedBD
function saveRecord(entry){
    const transation = db.transation(['pending'], "readwrite");

    const storeData = transation.objectStore('pending')

    storeData.add(entry)
}

        function checkDatabase(){

        }
