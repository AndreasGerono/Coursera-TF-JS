// // @ts-check
// import * as tf from '@tensorflow/tfjs'

async function run() {
    const MODEL_URL = '/models/model.json'
    const model = await tf.loadLayersModel(MODEL_URL);
    console.log(model.summary());
    const input = tf.tensor2d([10.0], [1,1]);
    const result = model.predict(input);
    alert(result);
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

