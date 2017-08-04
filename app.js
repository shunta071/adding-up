'use strict';
const fs = require('fs'); // File Systemモジュールの取り出し
const readline = require('readline'); // ファイルを1行ずつ読み込むモジュールの取り出し
const rs = fs.ReadStream('./popu-pref.csv');
const rl = readline.createInterface({'input': rs, 'output' : {} });
const map = new Map(); //key: 都道府県 value: 集計データのオブジェクト
rl.on('line', (lineString) => {
    const columns = lineString.split(',');　// lineString.sprit()　は読み込んだ文字列を分割
    const year = parseInt(columns[0]); //parseInt は文字列を整数値に直す
    const prefecture = columns[2];
    const popu = parseInt(columns[7]);　//parseInt は文字列を整数値に直す
    if (year === 2010 || year === 2015) {
       let value = map.get(prefecture);
        if (!value) {
         value = {
             p10: 0,
             p15: 0,
            change: null
         };
       }
    if (year === 2010){
        value.p10 += popu;
    }
    if (year === 2015){
        value.p15 += popu;
    }
    map.set(prefecture, value);
}

});

rl.resume();
rl.on('close', () => {
    for (let pair of map) {
        const value = pair[1];
        value.change = value.p15 / value.p10;
    }
    const rankingArray = Array.from(map).sort((p1, p2) => {
        return p2[1].change - p1[1].change;
    });
    const rankingStrings = rankingArray.map((p) => {
        return p[0] + ': ' + p[1].p10 + '=>' + p[1].p15 + ' 変化率:' + p[1].change;
    });

    console.log(rankingStrings);
});