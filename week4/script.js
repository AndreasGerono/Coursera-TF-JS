// // @ts-check

import {Webcam} from './webcam.js';
import {RPSDataset} from './rps-dataset.js';

// import * as tf from '@tensorflow/tfjs'
// import * as mobilenet from '@tensorflow-models/mobilenet'



let mobilenet;
let model;

const dataset = new RPSDataset();
const webcam = new Webcam(document.querySelector('#wc'));

let rockSamples = 0
let paperSamples = 0
let scissorsSamples = 0

let btnStartPrediction = document.getElementById("startPrediction");
let btnStopPrediction= document.getElementById("StopPrediction");

let isPredicting = false;

function handleButton() {
    console.log(this.id)
    switch(this.id) {
        case "0":
            rockSamples++;
            document.getElementById("rocksamples").innerText = "Rock samples:" + rockSamples;
            break
        case "1":
            paperSamples++;
            document.getElementById("papersamples").innerText = "Paper samples:" + paperSamples;
            break
        case "2":
            scissorsSamples++;
            document.getElementById("scissorssamples").innerText = "Scissor samples:" + scissorsSamples;
            break
    }
    const label = parseInt(this.id);
    const img = webcam.capture();
    dataset.addExample(mobilenet.predict(img), label);
}


async function train() {
    dataset.ys = null;
    dataset.encodeLabels(3);
    model = tf.sequential({
      layers: [
        tf.layers.flatten({inputShape: mobilenet.outputs[0].shape.slice(1)}),
        tf.layers.dense({ units: 100, activation: 'relu'}),
        tf.layers.dense({ units: 3, activation: 'softmax'})
      ]
    });
    const optimizer = tf.train.adam(0.0001);
    model.compile({optimizer: optimizer, loss: 'categoricalCrossentropy'});
    let loss = 0;
    model.fit(dataset.xs, dataset.ys, {
      epochs: 10,
      callbacks: {
        onBatchEnd: async (batch, logs) => {
          loss = logs.loss.toFixed(5);
          console.log('LOSS: ' + loss);
          },
        onTrainEnd: async () => {
            btnStartPrediction.disabled  = false;
            btnStopPrediction.disabled  = false;
        }
        }
     });
  }

function startPredicting() {
    isPredicting = true;
    predict();
}

function stopPredicting() {
    isPredicting = false;
    predict();
}

async function predict() {
    while (isPredicting) {
        console.log("running??");
        // Step 1: Get Prediction
        const predictedClass = tf.tidy(() => {
            const img = webcam.capture();
            const activation = mobilenet.predict(img);
            const predictions = model.predict(activation);
            console.log(predictions.as1D());
            return predictions.as1D().argMax();
        });
        
        // Step 2: evaluate: Get Prediction
        console.log(predictedClass.data());
        const classID = (await predictedClass.data())[0];
        var predictionText = "";
        switch(classID) {
            case 0:
                predictionText = "I see Rock";
            case 1:
                predictionText = "I see Paper";
            case 2:
                predictionText = "I see Scissors";
        }
        document.getElementById("prediction").innerText = predictionText;
        // Step 3: Cleanup and update ui
        predictedClass.dispose();   // dispose of class?
        await tf.nextFrame(); // prevents locking the ui?
    }
}


async function init() {
    document.getElementById("0").onclick = handleButton;
    document.getElementById("1").onclick = handleButton;
    document.getElementById("2").onclick = handleButton;
    document.getElementById("2").onclick = handleButton;
    document.getElementById("train").onclick = train;

    btnStartPrediction.disabled  = true;
    btnStopPrediction.disabled  = true;
    btnStopPrediction.onclick = stopPredicting;
    btnStartPrediction.onclick = startPredicting;
    await webcam.setup();
    mobilenet = await loadMobilenet();
    tf.tidy(() => mobilenet.predict(webcam.capture()));
}

async function loadMobilenet() {
    const mobilenet = await tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');
    const layer = mobilenet.getLayer('conv_pw_13_relu');
    return tf.model({inputs: mobilenet.inputs, outputs: layer.output});
}

async function run() {


}

init();
run();

