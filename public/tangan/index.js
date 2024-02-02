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
        document.getElementById('connected').innerHTML = 'Connected, Ctrl+Shift+J to open console'
        await listenToPort();
    } catch (e) {
        alert("Serial Connection Failed" + e);
    }
}


let dasar = []
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
        // if (value.startsWith('*')) {
        //     connect = true;
        // }
        if (value.startsWith('R')) {
            readd = true;
        }

        if (value.startsWith('*')) {
            connect = true;
        }
        if (connect) {
            for (let i = 0; i < value.length; i++) {
                data += value[i];
                if (value[i] == "#") {
                    data = data.slice(1, data.length - 2)
                    const ar = data.split(',')
                    dasar = ar;
                    console.log(dasar);
                    data = ""
                    connect = false;
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
                    readd = false;
                }
            }
        }
    }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function sendCommand(command) {
    // let command = document.getElementById("command").value;
    await writer.write("aaaaa*");
    for (let i = 0; i < Math.ceil(command.length/50); i++) {
        const element = command.substr((i * 50), 50);
        console.log(element);
        await writer.write(element);
        await sleep(100);
    }
    await writer.write('#');
    // await writer.write("aaaaa*" + command + "#");
}

function tempAlert(msg, duration) {
    var el = document.createElement("div");
    el.setAttribute("style", "position:absolute;bottom:10%;left:50%;background-color:white; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); padding: 20px;");
    el.innerHTML = msg;
    setTimeout(function () {
        el.parentNode.removeChild(el);
    }, duration);
    document.body.appendChild(el);
}
