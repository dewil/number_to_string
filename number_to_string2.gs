var mapNumbers = {
    0 : [2, 1, "ноль"], 
    1 : [0, 2, "один", "одна"], 
    2 : [1, 2, "два", "две"], 
    3 : [1, 1, "три"], 
    4 : [1, 1, "четыре"], 
    5 : [2, 1, "пять"], 
    6 : [2, 1, "шесть"], 
    7 : [2, 1, "семь"], 
    8 : [2, 1, "восемь"], 
    9 : [2, 1, "девять"], 
    10 : [2, 1, "десять"], 
    11 : [2, 1, "одиннадцать"], 
    12 : [2, 1, "двенадцать"], 
    13 : [2, 1, "тринадцать"], 
    14 : [2, 1, "четырнадцать"], 
    15 : [2, 1, "пятнадцать"], 
    16 : [2, 1, "шестнадцать"], 
    17 : [2, 1, "семнадцать"], 
    18 : [2, 1, "восемнадцать"], 
    19 : [2, 1, "девятнадцать"],
    20 : [2, 1, "двадцать"],
    30 : [2, 1, "тридцать"],
    40 : [2, 1, "сорок"],
    50 : [2, 1, "пятьдесят"],
    60 : [2, 1, "шестьдесят"],
    70 : [2, 1, "семьдесят"],
    80 : [2, 1, "восемьдесят"],
    90 : [2, 1, "девяносто"],
    100 : [2, 1, "сто"],
    200 : [2, 1, "двести"],
    300 : [2, 1, "триста"],
    400 : [2, 1, "четыреста"],
    500 : [2, 1, "пятьсот"],
    600 : [2, 1, "шестьсот"],
    700 : [2, 1, "семьсот"],
    800 : [2, 1, "восемьсот"],
    900 : [2, 1, "девятьсот"]
};

var mapOrders = [ 
    { _Gender : true, _arrStates : ["рубль", "рубля", "рублей"] }, 
    { _Gender : false, _arrStates : ["тысяча", "тысячи", "тысяч"] }, 
    { _Gender : true, _arrStates : ["миллион", "миллиона", "миллионов"] }, 
    { _Gender : true, _arrStates : ["миллиард", "миллиарда", "миллиардов"] }, 
    { _Gender : true, _arrStates : ["триллион", "триллиона", "триллионов"] }
];

var objKop = { _Gender : false, _arrStates : ["копейка", "копейки", "копеек"] };

function Value(dVal, bGender) {
    var xVal = mapNumbers[dVal];
    if (xVal[1] == 1) {
        return xVal[2];
    } else {
        return xVal[2 + (bGender ? 0 : 1)];
    }
}

function From0To999(fValue, oObjDesc, fnAddNum, fnAddDesc)
{
    var nCurrState = 2;
    if (Math.floor(fValue/100) > 0) {
        var fCurr = Math.floor(fValue/100)*100;
        fnAddNum(Value(fCurr, oObjDesc._Gender));
        nCurrState = mapNumbers[fCurr][0];
        fValue -= fCurr;
    }

    if (fValue < 20) {
        if (Math.floor(fValue) > 0) {
            fnAddNum(Value(fValue, oObjDesc._Gender));
            nCurrState = mapNumbers[fValue][0];
        }
    } else {
        var fCurr = Math.floor(fValue/10)*10;
        fnAddNum(Value(fCurr, oObjDesc._Gender));
        nCurrState = mapNumbers[fCurr][0];
        fValue -= fCurr;
        
        if (Math.floor(fValue) > 0) {
            fnAddNum(Value(fValue, oObjDesc._Gender));
            nCurrState = mapNumbers[fValue][0];
        }
    }

    fnAddDesc(oObjDesc._arrStates[nCurrState]);
}

function number_to_string2(fAmount, bkt, nds)
{
    var fInt = Math.floor(fAmount + 0.005);
    var fDec = Math.floor(((fAmount - fInt) * 100) + 0.5);

    var arrRet = [];
    var iOrder = 0;
    var arrThousands = [];
    for (; fInt > 0.9999; fInt/=1000) {
        arrThousands.push(Math.floor(fInt % 1000));
    }
    if (arrThousands.length == 0) {
        arrThousands.push(0);
    }

    function PushToRes(strVal) {
        arrRet.push(strVal); 
    }

    for (var iSouth = arrThousands.length-1; iSouth >= 0; --iSouth) {
        if (arrThousands[iSouth] == 0) {
            continue;
        }
        From0To999(arrThousands[iSouth], mapOrders[iSouth], PushToRes, PushToRes);
    }

    if (arrThousands[0] == 0) {
        //  Handle zero amount
        if (arrThousands.length == 1) {
            PushToRes(Value(0, mapOrders[0]._Gender));
        }

        var nCurrState = 2;
        PushToRes(mapOrders[0]._arrStates[nCurrState]);
    }

    if (arrRet.length > 0) {
        // Capitalize first letter
        arrRet[0] = arrRet[0].match(/^(.)/)[1].toLocaleUpperCase() + arrRet[0].match(/^.(.*)$/)[1];
    }

    arrRet.push((fDec < 10) ? ("0" + fDec) : ("" + fDec));
    From0To999(fDec, objKop, function() {}, PushToRes);

    _return = arrRet.join(" ");
    // добавить скобки
    if (bkt) _return = '(' + _return + ')';
    // добавить НДС
    if (nds) _return += ', ' + nds;    

    return _return;
}
