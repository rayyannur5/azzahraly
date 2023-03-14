function read() {
    sendCommand('R');
}


let isOpenRead = false;
let isOpenStep = false;
let stepp = 7;

function openRead(dataDiterima) {

    for (i in dataDiterima) {
        document.getElementById('val-xl-' + (Number(i) + Number(1))).innerHTML = dataDiterima[i];
    }
    isOpenRead = true;
}

function checkAll() {
    for (let i = 0; i < 13; i++) {
        let id = "check-xl-" + (Number(1) + Number(i));
        document.getElementById(id).checked = true;
    }
}

function uncheck() {
    for (let i = 0; i < 13; i++) {
        let id = "check-xl-" + (Number(1) + Number(i));
        document.getElementById(id).checked = false;
    }
}
function checkRight() {
    for (let i = 0; i < 13; i++) {
        let id = "check-xl-" + (Number(1) + Number(i));
        document.getElementById(id).checked = false;
    }

    document.getElementById('check-xl-1').checked = true;
    document.getElementById('check-xl-3').checked = true;
    document.getElementById('check-xl-5').checked = true;
    document.getElementById('check-xl-7').checked = true;
    document.getElementById('check-xl-9').checked = true;

}
function checkLeft() {
    for (let i = 0; i < 13; i++) {
        let id = "check-xl-" + (Number(1) + Number(i));
        document.getElementById(id).checked = false;
    }

    document.getElementById('check-xl-2').checked = true;
    document.getElementById('check-xl-4').checked = true;
    document.getElementById('check-xl-6').checked = true;
    document.getElementById('check-xl-8').checked = true;
    document.getElementById('check-xl-10').checked = true;
}
function checkHead() {
    for (let i = 0; i < 13; i++) {
        let id = "check-xl-" + (Number(1) + Number(i));
        document.getElementById(id).checked = false;
    }

    document.getElementById('check-xl-11').checked = true;
    document.getElementById('check-xl-12').checked = true;
    document.getElementById('check-xl-13').checked = true;
}

function off() {
    let isOff = ""
    if (isOpenRead) {
        for (let i = 0; i < 13; i++) {
            let id = "check-xl-" + (Number(1) + Number(i));
            if (document.getElementById(id).checked) {
                isOff += Number(1) + Number(i) + ","
            }
        }
        console.log(isOff)
        sendCommand('F' + isOff)
    }
    else {
        sendCommand('OF');
    }
}

function ambilDasar() {
    for (let i = 1; i <= 13; i++) {
        document.getElementById('val-xl-' + i).innerHTML = dasar[Number(i) - Number(1)];
    }
}

function play() {
    let banyakStep = Object.keys(dataTerbuka)

    let sendData = 'Y'
    for (let i in banyakStep) {
        let banyakData = Object.keys(dataTerbuka[i])
        for (let j = 0; j < 13; j++) {
            sendData += dataTerbuka[i][banyakData[j]] + ','
        }
        sendData += dataTerbuka[i]['time'] + ','
        sendData += dataTerbuka[i]['pause'] + ','
        sendData += ':'
    }
    console.log(sendData);
    sendCommand(sendData)
}