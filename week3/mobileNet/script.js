// // @ts-check
// import * as tf from '@tensorflow/tfjs'
// import * as mobilenet from '@tensorflow-models/mobilenet'

const image = document.querySelector('img#source');
const result_div = document.querySelector('div#result');

async function run() {
    const model = await mobilenet.load();
    const predictions = await model.classify(image);
    console.log(predictions);
    predictions.forEach(prediction => {
        result_div.innerHTML += `${prediction.className} : ${prediction.probability} <br>`
    });
}

run();

// I prefere the async await...

// mobilenet.load().then(model => {
//     model.classify(image).then(predictions => {
//         console.log(predictions);
//         predictions.forEach(prediction => {
//             result_div.innerHTML += `${prediction.className} : ${prediction.probability} <br>`
//         });
//     });
// });

