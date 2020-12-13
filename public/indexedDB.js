
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

request.onupgradeneeded = ({
    target
}) => {
    db = target.result;
    db.createObjectStore("pending", {
        autoIncrement: true
    })
}

// request on success
// listen to when back online and send records 
request.onsuccess = ({
    target
}) => {
    db = target.result;
    if (navigator.onLine) {
        checkDatabase();
    }
}

request.onerror = function (event) {
    console.log("Request Error")
}

// saveRecord -> save to indexedBD
function saveRecord(entry) {
    const transaction = db.transaction(["pending"], "readwrite");

    const storeData = transaction.objectStore('pending')

    storeData.add(entry)
}

function checkDatabase() {
    const transaction = db.transaction(["pending"], "readwrite");

    const storeData = transaction.objectStore('pending')

    const AllStored = storeData.getAll();

    AllStored.onsuccess = function () {
        if (AllStored.result.length > 0) {
            fetch("/api/transaction/bulk", {
                    method: "POST",
                    body: JSON.stringify(AllStored.result),
                    headers: {
                        Accept: "application/json, text/plain, */*",
                        "Content-Type": "application/json"
                    }
                }).then(response => response.json())
                .then(() => {
                    const transation = db.transation(['pending'], "readwrite");

                    const storeData = transation.objectStore('pending')

                    storeData.clear();
                })
        }
    }
}

window.addEventListener("online", checkDatabase);