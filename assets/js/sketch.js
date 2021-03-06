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
    var aspect = document.getElementById("select_aspect").value;
    var elements = document.querySelectorAll('.image-wrap');
    console.log(elements);
    if (elements.length == 0) {
        html2canvas(document.querySelector("#capture"), {
            onrendered: function (canvas) {
                //aタグのhrefにキャプチャ画像のURLを設定
                var imgData = canvas.toDataURL();
                Canvas2Image.saveAsPNG(canvas);
            }
        });
    }
    else {
        alert('Unfortunately, the image download function is only available when all image aspect ratios are original. Please do a screen capture manually.');
    }


}
var thumbs = [];

var msnry;
var elem = document.querySelector('.grid');
msnry = new Masonry(elem, {
    // options
    columnWidth: '.grid-sizer',
    itemSelector: '.grid-item',
    percentPosition: true,
    gutter: 0,
    originLeft: true,
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
    thumbs.push(
        {
            id: Math.random().toString(32).substring(2),
            element: document.createElement('div')
        }
    );
    var i = thumbs.length - 1;


    thumbs[i].element.classList.add('col-sm-' + num);
    thumbs[i].element.classList.add('col-lg-' + num);
    thumbs[i].element.classList.add('mb-0');
    thumbs[i].element.classList.add('thumb');
    var card_element = document.createElement('div');
    card_element.classList.add('card');
    var wrap_element = document.createElement('div');

    var aspect = document.getElementById('select_aspect').value;
    if (aspect === 'original') {
        wrap_element.classList.remove('image-wrap');
    }
    else {
        wrap_element.classList.add('image-wrap');
        wrap_element.style.paddingTop = parseInt(100 * (parseFloat(aspect))).toString() + '%';
    }


    var image_element = document.createElement('img');
    image_element.classList.add('card-img-top');
    image_element.classList.add('overlay');

    image_element.classList.add('rounded-0');
    wrap_element.append(image_element);
    card_element.append(wrap_element);
    thumbs[i].element.append(card_element);
    thumbs[i].element.classList.add('grid-item');
    thumbs[i].element.id = thumbs[i].id;
    image_element.id = thumbs[i].id;


    document.getElementById("row_thumbs").append(thumbs[i].element);
    msnry.appended(thumbs[i].element);

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
    image_element.addEventListener('mousedown', function (event) {
        event.preventDefault();
        this.classList.toggle('selected');
        // event.target.id と 一致するサムネイルを削除する
        const element_remove = thumbs.filter(x => x.id == event.target.id)
        msnry.remove(element_remove[0].element);
        msnry.layout();

        thumbs = thumbs.filter(x => x.id != event.target.id)
        document.getElementById('number_of_thumbs').value = thumbs.length;
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
        let loop = event.target.value - thumbs.length;
        for (let i = 0; i < loop; i++) {
            var filename = [
                choose_at_random(sample_images)
            ];
            createThumbs('', filename);
        }
    }
    else if (event.target.value < thumbs.length) {
        let loop = thumbs.length - event.target.value;
        for (let i = 0; i < loop; i++) {
            msnry.remove(thumbs[thumbs.length - 1].element);
            thumbs.pop();
        }
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

function setAspect(value) {
    // var elements = document.querySelectorAll('img.card-img-top');
    // console.log(elements);
    // for (element of elements) {

    // }
}
