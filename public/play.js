function read() {
    sendCommand('R');
}

let isOpenRead = false;
let isOpenStep = false;
let stepp = 7;

function openRead(ar) {

    for (i in ar) {
        document.getElementById(Number(9) + Number(i)).innerHTML = ar[i];
    }
    isOpenRead = true;
}


function openStep(no) {
    let walk = document.getElementById('walk-select').value
    stepp = no;
    document.getElementById('step').innerHTML = "Step Openned : " + stepp;
    if (walk == "right-selected") {
        console.log(right[no])
        for (let i in right[no]) {
            document.getElementById('open-' + (Number(i) + Number(9))).value = right[no][i];
        }
    } else {
        console.log(left[no])
        for (let i in left[no]) {
            document.getElementById('open-' + (Number(i) + Number(9))).value = left[no][i];
        }

    }
    isOpenStep = true;
}

function playStep(no) {
    let walk = document.getElementById('walk-select').value
    stepp = no;
    document.getElementById('step').innerHTML = "Step Openned : " + stepp;
    openStep(no)
    if (walk == "right-selected") {
        openRead(right[no])
        sendCommand('PR' + no);
    } else {
        openRead(left[no])
        sendCommand('PL' + no);
    }
}

function play() {
    let walk = document.getElementById('walk-select').value
    if (walk == "right-selected") {
        sendCommand('PR');
    } else {
        sendCommand('PL');
    }
}

function save() {
    let temp = [];
    for (let i in right[stepp]) {
        temp.push(document.getElementById(Number(9) + Number(i)).innerHTML);
    }
    if (stepp == 7) {
        console.log('Open step first')
    } else {
        let walk = document.getElementById('walk-select').value
        if (walk == "right-selected") {
            let isSave = "SR" + stepp
            for (let i = 0; i < 14; i++) {
                let id = "check-" + (Number(9) + Number(i));
                if (document.getElementById(id).checked) {
                    right[stepp][i] = temp[i];
                    isSave += Number(9) + Number(i) + ","
                }
            }
            console.log(isSave)
            sendCommand(isSave)

        } else {
            let isSave = "SL" + stepp
            for (let i = 0; i < 14; i++) {
                let id = "check-" + (Number(9) + Number(i));
                if (document.getElementById(id).checked) {
                    left[stepp][i] = temp[i];
                    isSave += Number(9) + Number(i) + ","
                }
            }
            sendCommand(isSave)
        }
    }
}

function check() {
    for (let i = 0; i < 14; i++) {
        let id = "check-" + (Number(9) + Number(i));
        document.getElementById(id).checked = true;
    }
}

function uncheck() {
    for (let i = 0; i < 14; i++) {
        let id = "check-" + (Number(9) + Number(i));
        document.getElementById(id).checked = false;
    }
}

function off() {
    let isOff = ""
    if (isOpenRead) {
        for (let i = 0; i < 14; i++) {
            let id = "check-" + (Number(9) + Number(i));
            if (document.getElementById(id).checked) {
                isOff += Number(9) + Number(i) + ","
            }
        }

        sendCommand('F' + isOff)
    }
    else {
        sendCommand('OF');
    }
    console.log(isOff)
}

function generate() {
    let code = "short right_step[7][NUM_ACTUATOR] = {";
    code = code + "\n//    9    10   11    12    13    14    15    16    17    18    19    20    21   22";
    for (let i = 0; i < 7; i++) {
        code = code + "\n\t{"
        for (let j = 0; j < 14; j++) {
            code += right[i][j] + ", "
        }
        code += "}, // step " + i;
    }
    code += "\n};\n\n";
    code += "short left_step[7][NUM_ACTUATOR] = {";
    code = code + "\n//    9    10   11    12    13    14    15    16    17    18    19    20    21   22";
    for (let i = 0; i < 7; i++) {
        code = code + "\n\t{"
        for (let j = 0; j < 14; j++) {
            code += left[i][j] + ", "
        }
        code += "}, // step " + i;
    }
    code += "\n};";
    console.log(code);
    navigator.clipboard
        .writeText(code)
        .then(() => {
            alert("successfully copied");
        })
        .catch(() => {
            alert("something went wrong");
        });
}


function newWalk() {
    let walk = document.getElementById('walk-select').value
    if (walk == "right-selected") {
        sendCommand('NR');
        right[1] = right[0]
        for (let i = 0; i < 14; i++) {
            right[2][i] = Math.round(Number(right[1][i]) + Number((Number(right[6][i]) - Number(right[0][i])) / Number(5)))
        }
        for (let i = 0; i < 14; i++) {
            right[3][i] = Math.round(Number(right[2][i]) + Number((Number(right[6][i]) - Number(right[0][i])) / Number(5)))
        }
        for (let i = 0; i < 14; i++) {
            right[4][i] = Math.round(Number(right[3][i]) + Number((Number(right[6][i]) - Number(right[0][i])) / Number(5)))
        }
        for (let i = 0; i < 14; i++) {
            right[5][i] = Math.round(Number(right[4][i]) + Number((Number(right[6][i]) - Number(right[0][i])) / Number(5)))
        }
    } else {
        sendCommand('NL');
        left[1] = left[0]
        for (let i = 0; i < 14; i++) {
            left[2][i] = Math.round(Number(left[1][i]) + Number((Number(left[6][i]) - Number(left[0][i])) / Number(5)))
        }
        for (let i = 0; i < 14; i++) {
            left[3][i] = Math.round(Number(left[2][i]) + Number((Number(left[6][i]) - Number(left[0][i])) / Number(5)))
        }
        for (let i = 0; i < 14; i++) {
            left[4][i] = Math.round(Number(left[3][i]) + Number((Number(left[6][i]) - Number(left[0][i])) / Number(5)))
        }
        for (let i = 0; i < 14; i++) {
            left[5][i] = Math.round(Number(left[4][i]) + Number((Number(left[6][i]) - Number(left[0][i])) / Number(5)))
        }
    }
}

// function generate() {
//     console.log(type.value);
//     let code = "short " + (type.value == "left" ? "left_step" : "right_step") + "[7][NUM_ACTUATOR] = {";
//     code = code + "\n//    9    10   11    12    13    14    15    16    17    18    19    20    21   22";
//     code = code + "\n\t{" + step0.value.replaceAll("\n", ", ") + "}, // step 0";
//     code = code + "\n\t{" + step1.value.replaceAll("\n", ", ") + "}, // step 1";
//     code = code + "\n\t{" + step2.value.replaceAll("\n", ", ") + "}, // step 2";
//     code = code + "\n\t{" + step3.value.replaceAll("\n", ", ") + "}, // step 3";
//     code = code + "\n\t{" + step4.value.replaceAll("\n", ", ") + "}, // step 4";
//     code = code + "\n\t{" + step5.value.replaceAll("\n", ", ") + "}, // step 5";
//     code = code + "\n\t{" + step6.value.replaceAll("\n", ", ") + "}  // step 6";
//     code = code + "\n};";
//     document.getElementById("result").value = code;
// }

function saveStep(id) {
    if (stepp == 7) {
        console.log("Open Step first")
    } else {
        let walk = document.getElementById('walk-select').value
        let val = document.getElementById('open-' + id).value;
        if (id == 9) id = '09';
        if (walk == "right-selected") {
            right[stepp][id] = val;
            let command = "VR" + stepp + id + val;
            sendCommand(command);
        } else {
            left[stepp][id] = val;
            let command = "VL" + stepp + id + val;
            sendCommand(command);
        }
    }
}