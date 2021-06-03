import Tik from './Tik.js';
import $ from './modules.js';


let files = [];
let fileO = document.querySelector("#fileInput");
let startBtn = document.querySelector(".wrapper_startBtn");
startBtn.addEventListener('click', showFileInput);
fileO.addEventListener('change', processFile);
let str = "";
start();

function showFileInput(){
    var fileInput = document.getElementById("fileInput");
    fileInput.click();
}

function processFile(){
    var file = this.files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
        if(!(files.includes(file.name, 0))){
            str += e.target.result;
            files.push(file.name);
        }else{
            alert(`Файл ${file.name} был внесен в таблицу ранее`);
        }
        
        start();
    };
    reader.readAsText(file);
}

function start(){
    let TIKS = $.strToObj(str, Tik);
    $.filtrObj(TIKS, 'toz', 80);
    $.filtrObj(TIKS, 'pdz', 2);
    let matrix = $.createFreqThrMatrix(); // Создание матрицы зависимости от оборотов и дросселя
    let matrix_counts = $.createFreqThrMatrix();
    $.fillingTheMatrixFromObj_ft(matrix, matrix_counts, TIKS, "ktpdk"); //Заполнение матрицы зависимости от оборотов и дросселя
    
    $.createTable(matrix, 'ft', matrix_counts); //Вывод таблицы матрицы зависимости от оборотов и дросселя
    let matrix_FP = $.createFreqPressMatrix();// Создание матрицы зависимости от оборотов и давления
    let matrix_FP_counts = $.createFreqPressMatrix();
    $.fillingTheMatrixFromObj_fp(matrix_FP, matrix_FP_counts, TIKS, "ktpdk"); //Заполнение матрицы зависимости от оборотов и давления
    $.createTable(matrix_FP, 'fp', matrix_FP_counts);//Вывод таблицы матрицы зависимости от оборотов и давления
}



