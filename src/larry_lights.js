var irsdk = require('node-irsdk')
var request = require('request')

const noderedUri = 'http://redpi:1880/iRacing'
var flagState = []

function changeFlagState(flags) {
    flagState = flags
    console.log(`Sending flags: ${flags}`)
    request.post(noderedUri).json({
        'flags': flags
    })
}

function handleFlags(telemetry) {
    flags = telemetry.SessionFlags

    if(flagState.toString() != flags.toString()){
        changeFlagState(flagState = flags)
    }
}

// look for telemetry updates only once per 100 ms
var iracing = irsdk.init({ telemetryUpdateInterval: 500 })

// var irsdk = require('node-irsdk')
// var iracing = irsdk.getInstance()

iracing.on('Connected', function (evt) {
    console.log("Connected to iRacing")
})

iracing.on('Disconnected', function (evt) {
    changeFlagState([])
})


// iracing.on('TelemetryDescription', function (data) {
//     console.log(data)
// })

iracing.on('Telemetry', function (evt) {
    handleFlags(evt.values)
})

// iracing.on('SessionInfo', function (evt) {
//     console.log(evt.SessionInfo)
// })