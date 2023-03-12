var port,
    textEncoder,
    writableStreamClosed,
    writer,
    historyIndex = -1;

async function connectSerial() {
    try {
        // Prompt user to select any serial port.
        port = await navigator.serial.requestPort();

        await port.open({ baudRate: 115200 });
        let settings = {};

        if (localStorage.dtrOn == "true") settings.dataTerminalReady = true;
        if (localStorage.rtsOn == "true") settings.requestToSend = true;
        if (Object.keys(settings).length > 0) await port.setSignals(settings);

        textEncoder = new TextEncoderStream();
        writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
        writer = textEncoder.writable.getWriter();
        await writer.write("aaaaa*C#");

        await listenToPort();
    } catch (e) {
        alert("Serial Connection Failed" + e);
    }
}


let right = []
let left = []
let isRight = true;
let startt = false;
let data = ""
let end = false;
let step = 0;
var connect = false;
var readd = false;
async function listenToPort() {
    const textDecoder = new TextDecoderStream();

    const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
    const reader = textDecoder.readable.getReader();

    // Listen to data coming from the serial device.
    while (true) {
        const { value, done } = await reader.read();
        if (done) {
            // Allow the serial port to be closed later.
            console.log("[readLoop] DONE", done);
            reader.releaseLock();
            break;
        }
        // value is a string.
        console.log("From Arduino : " + value)
        if (value.startsWith('*')) {
            connect = true;
        }
        if (value.startsWith('R')) {
            readd = true;
        }

        if (connect) {

            for (let i = 0; i < value.length; i++) {
                // console.log(i);
                data += value[i];
                if (value[i] == "#") {
                    if (step == 0) data = data.substring(1);
                    data = data.slice(0, data.length - 2);
                    const nilai = data.split(",")
                    if (isRight) {
                        right.push(nilai);
                    } else {
                        left.push(nilai);

                    }
                    data = "";
                    step++;
                    if (step == 7) {
                        if (!isRight) {
                            console.log(right);
                            console.log(left);
                            connect = false;
                            data = ""
                        }
                        step = 0;
                        isRight = false;
                    }
                }
            }
        }

        if (readd) {
            for (let i = 0; i < value.length; i++) {
                data += value[i];
                if (value[i] == "#") {
                    data = data.slice(1, data.length - 2)
                    const ar = data.split(',')
                    openRead(ar);
                    data = ""
                }
            }
        }
    }
}

async function sendCommand(command) {
    // let command = document.getElementById("command").value;
    await writer.write("aaaaa*" + command + "#");
}
