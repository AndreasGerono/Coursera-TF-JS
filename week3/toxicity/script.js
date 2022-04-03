// @ts-check
// import * as tf from '@tensorflow/tfjs'
// import * as tfvis from '@tensorflow/tfjs-vis'
// import * as toxicity from '@tensorflow-models/toxicity'

let text_field = document.querySelector('textarea#text');
let result_field = document.querySelector('p#result');

function preLoad() {
    text_field.backgroundColor = "grey";
    text_field.disabled = true;
}

function init() {
    text_field.backgroundColor = "white";
    text_field.disabled = false;
}


async function run() {

    preLoad();
    const threshold = 0.8;

    const model = toxicity.load(threshold).then(model => {
        init();

        text_field.oninput = () => {
            let timer;
            clearTimeout(timer);
            timer = setTimeout(() => {
                const sentence = [text_field.value];
                model.classify(sentence).then(prediction => {
                    let result = "";
                    console.log(prediction)
                    prediction.forEach(element => {
                        if (element.results[0].match) {
                            result += `- ${element.label} with probalility: ${element.results[0].probabilities[1]}\n`
                        }
                    });
                    if (result === "") {
                        result += "no harm"
                    }
                    result_field.textContent = result;
                    console.log(result)
                });
            }, 300);
        }

    });

}

run();
