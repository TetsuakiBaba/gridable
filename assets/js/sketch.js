/* <div class="col-sm-6 col-lg-4 mb-4">
                <div class="card">
                    <img src="./assets/images/pexels-abdullah-ghatasheh-1631677.jpg">
                </div>
            </div> */

document.addEventListener('DOMContentLoaded', function () {
    for (let i = 0; i < 4; i++) {
        var filename = [
            choose_at_random(sample_images)
        ];
        createThumbs('', filename);

    }
});

function saveImage() {
    //ボタンを押下した際にダウンロードする画像を作る
    html2canvas(document.querySelector("#capture"), {
        onrendered: function (canvas) {
            //aタグのhrefにキャプチャ画像のURLを設定
            var imgData = canvas.toDataURL();
            Canvas2Image.saveAsPNG(canvas);
        }
    });


}
var thumbs = [];

var msnry;
var elem = document.querySelector('.grid');
msnry = new Masonry(elem, {
    // options
    columnWidth: '.grid-sizer',
    itemSelector: '.grid-item',
    percentPosition: true
});

function manualLayout() {
    msnry.layout();
}

document.getElementById('row_thumbs').addEventListener('drop', function (event) {
    event.stopPropagation();
    event.preventDefault();
    this.style.backgroundColor = '';
    this.style.border = '';

    console.log("dropped:", event);
    createThumbs(event, '');
    // var filenames = [];
    // for (const f of event.target.result) {
    //     filenames.push(f.name);
    // }




});
document.getElementById('row_thumbs').addEventListener('dragover', function (event) {
    event.preventDefault();
    this.style.backgroundColor = '#DDDDDD';
    this.style.border = '5px dashed gray';

});
document.getElementById('row_thumbs').addEventListener('dragleave', function (event) {
    event.preventDefault();
    this.style.backgroundColor = '';
    this.style.border = '';
});


function choose_at_random(arrayData) {
    var arrayIndex = Math.floor(Math.random() * arrayData.length);
    return arrayData[arrayIndex];
}

function createThumbs(my_event, filename) {
    var number_of_columns = document.getElementById("number_of_columns").value;
    const num = parseInt(12 / number_of_columns);
    console.log('my_event:', my_event);
    thumbs.push(document.createElement('div'));
    var i = thumbs.length - 1;
    thumbs[i].classList.add('col-sm-' + num);
    thumbs[i].classList.add('col-lg-' + num);
    thumbs[i].classList.add('mb-0');
    thumbs[i].classList.add('thumb');
    var card_element = document.createElement('div');
    card_element.classList.add('card');
    var image_element = document.createElement('img');
    console.log(Math.random(sample_images.length));
    card_element.append(image_element);
    thumbs[i].append(card_element);
    thumbs[i].classList.add('grid-item');
    document.getElementById("row_thumbs").append(thumbs[i]);
    msnry.appended(thumbs[i]);

    image_element.addEventListener('drop', function (event) {
        event.stopPropagation();
        event.preventDefault();
        this.style.backgroundColor = '';
        this.style.border = '';
        document.getElementById('row_thumbs').style.backgroundColor = '';
        document.getElementById('row_thumbs').style.border = '';
        var reader;
        new Promise((resolve, reject) => {
            reader = new FileReader();
            reader.onload = function (event) {
                image_element.src = event.target.result;
                resolve(event.target.result);
            }
            reader.readAsDataURL(event.dataTransfer.files[0]);
        }).then((result) => {
            console.log("loaded");
            msnry.layout();
        });

    });
    image_element.addEventListener('dragover', function (event) {
        event.preventDefault();
        this.style.backgroundColor = '#DDDDDD';
        this.style.border = '5px dashed gray';
    });
    image_element.addEventListener('dragleave', function (event) {
        event.preventDefault();
        this.style.backgroundColor = '';
        this.style.border = '';
    });


    if (my_event != '') {
        new Promise((resolve, reject) => {
            reader = new FileReader();
            reader.onload = function (my_event) {
                image_element.src = my_event.target.result;
                resolve(my_event.target.result);
            }
            reader.readAsDataURL(my_event.dataTransfer.files[0]);
        }).then((result) => {
            console.log("loaded");
            msnry.layout();
        });
    }
    else {
        new Promise((resolve, reject) => {
            //const img = new Image();
            image_element.onload = () => resolve(image_element);
            image_element.onerror = (e) => reject(e);
            image_element.src = filename

        }).then((result) => {
            msnry.layout();
        });


    }
    msnry.layout();
    document.getElementById('number_of_thumbs').value = thumbs.length;
}

document.getElementById("number_of_thumbs").addEventListener('change', function (event) {

    if (event.target.value > thumbs.length) {
        var filename = [
            choose_at_random(sample_images)
        ];
        createThumbs('', filename);
    }
    else if (event.target.value < thumbs.length) {
        msnry.remove(thumbs[thumbs.length - 1]);
        thumbs[thumbs.length - 1].remove();
        thumbs.pop();
    }
    msnry.layout();
});


var value_previous = 1;
function setColumns(value) {
    var elements = document.querySelectorAll('div.thumb');
    var increment = value - value_previous;
    if (value == 5) {
        if (increment > 0) {
            value = 6;
        }
        else {
            value = 4;
        }
    }
    if (value >= 7) {
        if (increment > 0) {
            value = 12;
        }
        else {
            value = 6;
        }
    }
    document.getElementById('number_of_columns').value = value;
    const num = parseInt(12 / value);
    elements.forEach(function (element) {
        element.setAttribute("class", "");
        element.classList.add('col-sm-' + num);
        element.classList.add('col-lg-' + num);
        element.classList.add('mb-0');
        element.classList.add('thumb');
    });
    msnry.layout();

    value_previous = value;
}
