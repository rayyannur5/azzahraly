// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDYXD3K0VmU0hhfNIfYTiBr_PPPqbCt10M",
    authDomain: "azzahraly-app.firebaseapp.com",
    projectId: "azzahraly-app",
    storageBucket: "azzahraly-app.appspot.com",
    messagingSenderId: "940842942355",
    appId: "1:940842942355:web:6b13d71b1d7cf1c8243266"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const db = firebase.firestore();

// db.collection("motions").get().then((querySnapshot) => {
//     let table = document.getElementById('motionsTable')
//     querySnapshot.forEach((doc) => {
//         // console.log(doc.data().name)
//         let row = table.insertRow();
//         let cell1 = row.insertCell(0)
//         cell1.innerHTML = doc.data().name;
//         row.insertCell(1).innerHTML = " <button class=\"btn btn-primary\" onclick=\"openMotion(\"" + doc.data().name + "\")\">Open</button>"
//     });
// });

countMotion = 0;

db.collection("motions")
    .onSnapshot((querySnapshot) => {
        let table = document.getElementById('motionsTable')
        for (let i = 0; i < countMotion; i++) {
            table.deleteRow(1)
        }
        countMotion = 0;

        querySnapshot.forEach((doc) => {
            countMotion++;
            let row = table.insertRow();
            let cell1 = row.insertCell(0)
            cell1.innerHTML = doc.data().name;
            // <button class=\"btn btn-danger\" onclick=\"deleteMotion('" + doc.data().name + "')\">Delete</button> 
            row.insertCell(1).innerHTML = " <button class=\"btn btn-primary\" onclick=\"openMotion('" + doc.data().name + "')\">Open</button> <button class=\"btn btn-warning\" onclick=\"duplicateMotion('" + doc.data().name + "')\">Duplicate</button>"
        });
    });

let motionOpened;
let stepOpened;
let dataTerbuka;
function openMotion(id) {
    stepOpened = 0;
    let table = document.getElementById('tb')
    db.collection("motions").doc(id).get().then((doc) => {
        if (doc.data().value != null) {
            var tb = document.getElementById('tb');

            // while tb has children, remove the first one
            while (tb.childNodes.length) {
                tb.removeChild(tb.childNodes[0]);
            }
            // 
            let banyakData = Object.keys(doc.data().value).length;
            console.log(doc.data().value)
            dataTerbuka = doc.data().value
            for (let i = 0; i < banyakData; i++) {
                let row = table.insertRow()
                row.insertCell(0).innerHTML = Object.keys(doc.data().value)[i]
                row.insertCell(1).innerHTML = '<input type="text" style="width: 80px;" name="" id="time-' + i + '">'
                row.insertCell(2).innerHTML = '<input type="text" style="width: 80px;" name="" id="pause-' + i + '">'
                row.insertCell(3).innerHTML = " <button class=\"btn btn-primary\" onclick=\"openStep(" + i + ")\">Open</button>" +
                    " <button class=\"btn btn-warning\" onclick=\"saveTime(" + i + ")\">Time</button>" +
                    " <button class=\"btn btn-success\" onclick=\"savePause(" + i + ")\">Pause</button>" +
                    " <button class=\"btn btn-success\" onclick=\"sendStep(" + i + ")\">Send</button>"

                document.getElementById('time-' + i).value = doc.data().value[i]['time'];
                document.getElementById('pause-' + i).value = doc.data().value[i]['pause'];
            }
            motionOpened = id;
            document.getElementById('current-motion').innerHTML = 'Currently Open Motion : ' + motionOpened

        } else {
            if (motionOpened != null) {
                var tb = document.getElementById('tb');

                // while tb has children, remove the first one
                while (tb.childNodes.length) {
                    tb.removeChild(tb.childNodes[0]);
                }
            }
            motionOpened = id;
            document.getElementById('current-motion').innerHTML = 'Currently Open Motion : ' + motionOpened
            // doc.data() will be undefined in this case
            tempAlert("No such document!", 1000);
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}


function duplicateMotion(motion) {
    db.collection('motions').doc(motion).get().then((doc) => {
        let datalama = doc.data().value;
        let namaMotionBaru = motion + ' Copy';
        db.collection('motions').doc(namaMotionBaru).set({
            name: namaMotionBaru,
            value: datalama,
        }).then(() => {
            tempAlert('Copied!', 2000)
        })
    })
}


function openStep(step) {
    stepOpened = step;
    document.getElementById('current-step').innerHTML = 'Currently Open Step : ' + step;
    tempAlert(step, 1000);
    for (let i = 1; i <= 13; i++) {
        document.getElementById('input-servo-' + i).value = dataTerbuka[step][i]
    }
}

function sendStep(step) {
    openStep(step)
    let send = 'P'
    for (let i = 1; i <= 13; i++) {
        send += dataTerbuka[step][i] + ','
    }
    sendCommand(send);

}

function saveStep() {
    try {
        for (let i = 1; i <= 13; i++) {
            dataTerbuka[stepOpened][i] = document.getElementById('val-xl-' + i).innerHTML
        }
    } catch (e) {
        tempAlert('Gagal save pada saveStep()', 1000);
    }

    console.log(dataTerbuka);
    db.collection('motions').doc(motionOpened).update({
        value: dataTerbuka
    }).then(() => {
        for (let i = 1; i <= 13; i++) {
            document.getElementById('input-servo-' + i).value = dataTerbuka[stepOpened][i]
        }
        tempAlert('saved!', 1000);
    })
}

function saveTime(step) {
    dataTerbuka[step]['time'] = document.getElementById('time-' + step).value;
    console.log(dataTerbuka)
    db.collection('motions').doc(motionOpened).update({
        value: dataTerbuka
    }).then(() => {
        tempAlert('saved!', 1000);
    })

}
function savePause(step) {
    dataTerbuka[step]['pause'] = document.getElementById('pause-' + step).value;
    console.log(dataTerbuka)
    db.collection('motions').doc(motionOpened).update({
        value: dataTerbuka
    }).then(() => {
        tempAlert('saved!', 1000);
    })

}


function addStep() {
    if (motionOpened == null) {
        tempAlert('Open Motion First', 1000)
        return
    }
    db.collection("motions").doc(motionOpened).get().then((doc) => {
        if (doc.data().value != null) {
            // console.log("Document data:", doc.data());
            let dataSebelum = Object.keys(doc.data().value);

            let banyakStep = dataSebelum.length

            console.log(doc.data().value)

            let data = doc.data().value;

            data[banyakStep] = {
                1: 512,
                2: 512,
                3: 512,
                4: 512,
                5: 512,
                6: 512,
                7: 512,
                8: 512,
                9: 512,
                10: 512,
                11: 512,
                12: 512,
                13: 512,
                time: 1000,
                pause: 0,
            }

            console.log(data)

            db.collection('motions').doc(motionOpened).update({
                value: data
            })
            let table = document.getElementById('stepTable')
            let row = table.insertRow()
            row.insertCell(0).innerHTML = banyakStep
            row.insertCell(1).innerHTML = '<input type="text" style="width: 80px;" name="" id="time-' + banyakStep + '">'
            row.insertCell(2).innerHTML = '<input type="text" style="width: 80px;" name="" id="pause-' + banyakStep + '">'
            row.insertCell(3).innerHTML = " <button class=\"btn btn-primary\" onclick=\"openStep(" + banyakStep + ")\">Open</button>" +
                " <button class=\"btn btn-warning\" onclick=\"saveTime(" + banyakStep + ")\">Time</button>" +
                " <button class=\"btn btn-success\" onclick=\"savePause(" + banyakStep + ")\">Pause</button>" +
                " <button class=\"btn btn-success\" onclick=\"sendStep(" + banyakStep + ")\">Send</button>"
            document.getElementById('time-' + banyakStep).value = 1000;
            document.getElementById('pause-' + banyakStep).value = 0;
            dataTerbuka = data;
        } else {
            // doc.data() will be undefined in this case
            dataTerbuka = {
                0: {
                    1: 512,
                    2: 512,
                    3: 512,
                    4: 512,
                    5: 512,
                    6: 512,
                    7: 512,
                    8: 512,
                    9: 512,
                    10: 512,
                    11: 512,
                    12: 512,
                    13: 512,
                    time: 1000,
                    pause: 0
                }
            }
            db.collection('motions').doc(motionOpened).update({
                value: dataTerbuka
            })

            let table = document.getElementById('stepTable')
            let row = table.insertRow()
            row.insertCell(0).innerHTML = 0
            row.insertCell(1).innerHTML = '<input type="text" style="width: 80px;" name="" id="time-' + 0 + '">'
            row.insertCell(2).innerHTML = '<input type="text" style="width: 80px;" name="" id="pause-' + 0 + '">'
            row.insertCell(3).innerHTML = " <button class=\"btn btn-primary\" onclick=\"openStep(" + 0 + ")\">Open</button>" +
                " <button class=\"btn btn-warning\" onclick=\"saveTime(" + 0 + ")\">Time</button>" +
                " <button class=\"btn btn-success\" onclick=\"savePause(" + 0 + ")\">Pause</button>" +
                " <button class=\"btn btn-success\" onclick=\"sendStep(" + 0 + ")\">Send</button>"
            document.getElementById('time-' + 0).value = 1000;
            document.getElementById('pause-' + 0).value = 0;
        }
    })
}

function deleteMotion(id) {
    motionOpened = null
    document.getElementById('current-motion').innerHTML = 'Currently Open Motion : Not Yet'
    db.collection("motions").doc(id).delete().then(() => {
        tempAlert("Document successfully deleted!", 1000);
    }).catch((error) => {
        tempAlert("Error removing document: ", error, 1000);
    });
}

function tambahMotion() {
    let nameMotion = document.getElementById('newMotionName').value
    db.collection("motions").doc(nameMotion).set({
        name: nameMotion,
    })
        .then(() => {
            tempAlert("Document successfully written!", 1000);
        })
        .catch((error) => {
            tempAlert("Error writing document: " + error, 1000);
        });
}

function generate() {
    let namafungsi = motionOpened.replaceAll(' ', '')
    let result = 'void ' + namafungsi + ' () {\n' +
        '\tdigitalWrite(BL, HIGH);\n';

    let banyakData = Object.keys(dataTerbuka);
    for (let i = 0; i < banyakData.length; i++) {
        result += '\t// STEP ' + i + '\n';
        result += '\tsetBase(';
        for (let j = 1; j <= 13; j++) {
            result += dataTerbuka[i][j] + (j == 13 ? '' : ',')
        }
        result += ');\n';
        result += '\tMotionPagePlay(base, ' + dataTerbuka[i]['time'] + ', ' + dataTerbuka[i]['pause'] + ');\n'
        if (i == 0) {
            result += '\tdigitalWrite(BL, LOW);\n';
        }
    }
    result += '}'
    console.log(result);
    navigator.clipboard
        .writeText(result)
        .then(() => {
            alert("successfully copied");
        })
        .catch(() => {
            alert("something went wrong");
        });
}

function saveIDservo(id) {
    if (motionOpened == undefined) {
        tempAlert('Open Motion First!', 2000);
        return;
    }
    if (stepOpened == undefined) {
        tempAlert('Open Step First!', 2000);
        return;
    }
    dataTerbuka[stepOpened][id] = document.getElementById('input-servo-' + id).value
    db.collection('motions').doc(motionOpened).update({
        value: dataTerbuka
    }).then(() => {
        tempAlert('Saved!', 2000)
    })
}