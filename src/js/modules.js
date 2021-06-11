const $ = {};
$.strToObj = (string, classObj) => {
    let Obj = [];
    let arrTiks = [];
    let arr = string.split('\n'); 
    arr.splice(0, (arr.indexOf("Send:\t2101"))-1);
    let arrClear = arr.filter(function(el){
        
        let c = (el.split(':'))[0];
        if(c == "Receive"){
            if(el.length == 138 || el.length == 264)
            return el;   
        } 
    }).map(function(el){
        return el.split(' ').slice(1)
    });
    for(let i = 0, j=0; j < arrClear.length; i++, j+=2){
        while(arrClear[j].length != 44 && arrClear[j+1].length != 86){
            j++;
        }
        arrTiks[i] = arrClear[j] + arrClear[j+1];
       
    }
    arrTiks.forEach(function(v, i){
        let el = v.split(',');
        if(el.length == 129){
            // console.log(el);
            let od = $.hexToDec(el[18]+el[19]),
                pdz = $.hexToDec(el[20]+el[21])/10,
                uoz = $.hexToDec(el[22]+el[23])/10,
                div = $.hexToDec(el[24]+el[25])/100,
                dav = $.hexToDec(el[28]+el[29]),
                toz = $.hexToDec(el[30])-40,
                tv = $.hexToDec(el[31])-40,
                crt = $.hexToDec(el[32]+el[33])/100,
                prt = $.hexToDec(el[34]+el[35])/10,
                spd = $.hexToDec(el[36]),
                nbs = $.hexToDec(el[37])/10,
                rhh = $.hexToDec(el[39]),
                dk = $.round($.hexToDec(el[41])*0.0048828125),
                vniz = $.hexToDec(el[42])/10,
                ktpdk = $.round($.hexToDec(el[61]+el[62])/10000),
                zprhh = $.hexToDec(el[76]),
                sktpdk = $.round($.hexToDec(el[77]+el[78])/10000),
                ndet = $.round($.hexToDec(el[89]+el[90])*0.0048828125),
                johh = $.hexToDec(el[91]+el[92]);
            Obj[i] = new classObj(od,pdz,uoz,div,dav,toz,tv,crt,prt,spd,nbs,rhh,dk,vniz,ktpdk,zprhh,sktpdk,ndet,johh);
        } 
    });

    return Obj;
}

$.round = (e) => {
    return (Math.round(e*100))/100;
}

$.hexToDec = (hex) => { return parseInt(hex,16); }

$.filtrObj = (arr, par, valMin, valMax=100) => {
    for(let key in arr){
        let p = +(arr[key][par]);
        if(p <= valMin || p >= valMax){
            delete arr[key];
        }
    };
}
$.createFreqThrMatrix = () => {
    let matrix = [];
    for(let i = 0, f = 1000; f <= 6000; i++, f+=100){
        matrix[i] = [];
        for(let j = 0, al = 0; al <= 124; j++, al += 4){
            if(i == 0){
                if(j == 0){
                    matrix[i][j] = "";
                    j++;
                    f-=100;
                }
                matrix[i][j] = al;
            }
            else{
                if(j == 0){
                    matrix[i][j] = f;
                    j++;
                }
                matrix[i][j] = "";
            }
        }
    }
    return matrix;
}

$.createFreqPressMatrix = () => {
    let matrix = [];
    for(let i = 0, f = 900; f <= 6000; i++, f+=100){
        matrix[i] = [];
        for(let j = 0, al = 160; al <= 780; j++, al += 20){
            if(i == 0){
                if(j == 0){
                    matrix[i][j] = "";
                    j++;
                }
                matrix[i][j] = al;
            }
            else{
                if(j == 0){
                    matrix[i][j] = f;
                    j++;
                }
                matrix[i][j] = "";
            }
        }
    }
    return matrix;
}

$.createTable = (arr, e, arr2) => {
    let c = document.getElementById(e),
        strInset = "";
    for(let el in arr){
        strInset += (el == 0) ? '<tr class="first">': '<tr>';
        for(let v in arr[el]){
            let tdBgColor = $.valToColorKtpDk(arr[el][v], 1);
            strInset += (v == 0 || el == 0) ? `<td class="first">${arr[el][v]}</td>` : `<td style = "background-color: ${tdBgColor}">${arr[el][v]}<div class="count">${arr2[el][v]}</div></td>`;
        };
        strInset += '</tr>';
    };
    // debugger;
    c.innerHTML = strInset;
}
$.valToColorDk = (val, nom) => {
    let color = {h : 100, s : 100, b : 100};
    if(val != nom && val < 0.9 && val > 0){
        color.b = 50;
        color.h += (val < nom) ? (nom-val)*500 : -(val-nom)*500;
        color.h = (color.h < 0) ? 0 : color.h;
        color.h = (color.h > 250) ? 250 : color.h;
    }else if(val == nom) color.b = 50;
    return `hsl(${color.h},${color.s}%,${color.b}%)`;
}
$.valToColorKtpDk = (val, nom) => {
    let color = {h : 100, s : 100, b : 100};
    if(val != nom && val > 0.8 && val < 1.2){
        color.b = 50;
        color.h += (val < nom) ? -(nom-val)*1000 : (val-nom)*1200;
        color.h = (color.h < 0) ? 0 : color.h;
    }else if(val == nom) color.b = 50;
    return `hsl(${color.h},${color.s}%,${color.b}%)`;
}
$.fillingTheMatrixFromObj_fp = (m, mi, o, par) => {
    for(let el in o){
        
        let y = +o[el]['od'];
        let x = +o[el]['dav'];
        let trim = +o[el][par];
        if(isNaN(y) || isNaN(x) || isNaN(trim) || y < 1000) continue;
        let f = (y%200 > 100) ? (y - y%200)+200 : y - y%200;
        let p = (x%20 > 10) ? (x - x%20)+20 : x - x%20;
        let i = (f/100)-9;
        let j = p/20-7;
        if(i>52){
            continue;
        }
        let m_t = m[i][j];
        if(m_t == ""){
            m[i][j] = [];
            m[i][j].push(trim);
        }
        else{
            // m[i][j] = $.round((m_t + trim)/2);
            m[i][j].push(trim);
        }
        // m[i][j] = (m[i][j] == 0) ? 0.01 : m[i][j];
        mi[i][j] = +mi[i][j] + 1;  
    }
        for(let i = 1; i < m.length; i++){
            for(let j = 1; j < m[i].length; j++) {
                if(Array.isArray(m[i][j])){
                    // debugger;
                    let sum = m[i][j].reduce((a, b) => a + b, 0);
                    let result = sum / m[i][j].length;
                    m[i][j] = $.round(result);
                }
            }
        }
        m.forEach(function(it, i, arr){
            if(it[0]%200 != 0){
                m.splice(i, 1);
            }
        });
        mi.forEach(function(it, i, arr){
            if(it[0]%200 != 0){
                mi.splice(i, 1);
            }
        });
}

$.fillingTheMatrixFromObj_ft = (m, mi, o, par) => {
    for(let el in o){
        
        let y = +o[el]['od'];
        let x = +o[el]['pdz'];
        let trim = +o[el][par];
        if(isNaN(y) || isNaN(x) || isNaN(trim) || y < 1000) continue;
        // let f = Math.round(freq/100)*100;
        let f = (y%200 > 100) ? (y - y%200)+200 : y - y%200;
        let d = (x%4 > 2) ? (x - x%4)+4 : x - x%4;
        let i = (f/100)-9;
        let j = d/4+1;

        if(i>52){
            continue;
        }
        let m_t = m[i][j];
        if(m_t == ""){
            m[i][j] = [];
            m[i][j].push(trim);
        }
        else{
            // m[i][j] = $.round((m_t + trim)/2);
            m[i][j].push(trim);
        }
        mi[i][j] = +mi[i][j] + 1; 
    }
        for(let i = 1; i < m.length; i++){
            for(let j = 1; j < m[i].length; j++) {
                if(Array.isArray(m[i][j])){
                    
                    let sum = m[i][j].reduce((a, b) => a + b, 0);
                    let result = sum / m[i][j].length;
                    m[i][j] = $.round(result);
                }
            }
        }
        m.forEach(function(it, i, arr){
            if(it[0]%200 != 0){
                m.splice(i, 1);
            }
        });
        mi.forEach(function(it, i, arr){
            if(it[0]%200 != 0){
                mi.splice(i, 1);
            }
        });

}
export default $;