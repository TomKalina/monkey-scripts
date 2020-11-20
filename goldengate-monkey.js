// ==UserScript==
// @name         Goldengate moneky
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  some better goldengate
// @author       Tomas Kalina
// @match        https://moje.goldengate.cz/products*
// @grant        none
// @require https://cdn.rawgit.com/blowsie/Pure-JavaScript-HTML5-Parser/master/htmlparser.js
// @require https://cdn.jsdelivr.net/npm/html2json@1.0.2/src/html2json.js
// ==/UserScript==

(async function() {
    'use strict';
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('product_category_id');
    let url= "https://moje.goldengate.cz/buyout_prices";

    if(id){
url = url + "?product_category_id="+id
       }
const regex = /[^a-zA-Z0-9]/gi;

    let response = await fetch(url)
    let data = await response.text();
    let db = new Map()
    var json = html2json(data);
    var wtfList = json.child[0]["child"][3]["child"][3]["child"][1]["child"][3]["child"][5]["child"];
    Object.keys(wtfList).map(wtfKey=>{
        const wtf = wtfList[wtfKey]
        if(wtf.node==="element"){
            let key = wtf["child"][3]["child"][1]["child"][0]["child"][0]["text"]
            let price = wtf["child"][5]["child"][1]["child"][1]["child"][1]["child"][0]["text"]
            db[HtmlEncode(key).replace(regex,'')] = price;

        }
    })

    const coins = document.querySelectorAll(".product__name");
    coins.forEach((coin) => {
        const key = coin.getElementsByTagName("a")[0].outerText
        var t = document.createTextNode(db[key.replace(regex,'')])
        coin.appendChild(t)
    })

})();

function HtmlEncode(s)
{
  var chars = ["'","©","Û","®","ž","Ü","Ÿ","Ý","$","Þ","%","¡","ß","¢","à","£","á","À","¤","â","Á","¥","ã","Â","¦","ä","Ã","§","å","Ä","¨","æ","Å","©","ç","Æ","ª","è","Ç","«","é","È","¬","ê","É","­","ë","Ê","®","ì","Ë","¯","í","Ì","°","î","Í","±","ï","Î","²","ð","Ï","³","ñ","Ð","´","ò","Ñ","µ","ó","Õ","¶","ô","Ö","·","õ","Ø","¸","ö","Ù","¹","÷","Ú","º","ø","Û","»","ù","Ü","@","¼","ú","Ý","½","û","Þ","€","¾","ü","ß","¿","ý","à","‚","À","þ","á","ƒ","Á","ÿ","å","„","Â","æ","…","Ã","ç","†","Ä","è","‡","Å","é","ˆ","Æ","ê","‰","Ç","ë","Š","È","ì","‹","É","í","Œ","Ê","î","Ë","ï","Ž","Ì","ð","Í","ñ","Î","ò","‘","Ï","ó","’","Ð","ô","“","Ñ","õ","”","Ò","ö","•","Ó","ø","–","Ô","ù","—","Õ","ú","˜","Ö","û","™","×","ý","š","Ø","þ","›","Ù","ÿ","œ","Ú"];
    var codes = ["&#39;","&copy;","&#219;","&reg;","&#158;","&#220;","&#159;","&#221;","&#36;","&#222;","&#37;","&#161;","&#223;","&#162;","&#224;","&#163;","&#225;","&Agrave;","&#164;","&#226;","&Aacute;","&#165;","&#227;","&Acirc;","&#166;","&#228;","&Atilde;","&#167;","&#229;","&Auml;","&#168;","&#230;","&Aring;","&#169;","&#231;","&AElig;","&#170;","&#232;","&Ccedil;","&#171;","&#233;","&Egrave;","&#172;","&#234;","&Eacute;","&#173;","&#235;","&Ecirc;","&#174;","&#236;","&Euml;","&#175;","&#237;","&Igrave;","&#176;","&#238;","&Iacute;","&#177;","&#239;","&Icirc;","&#178;","&#240;","&Iuml;","&#179;","&#241;","&ETH;","&#180;","&#242;","&Ntilde;","&#181;","&#243;","&Otilde;","&#182;","&#244;","&Ouml;","&#183;","&#245;","&Oslash;","&#184;","&#246;","&Ugrave;","&#185;","&#247;","&Uacute;","&#186;","&#248;","&Ucirc;","&#187;","&#249;","&Uuml;","&#64;","&#188;","&#250;","&Yacute;","&#189;","&#251;","&THORN;","&#128;","&#190;","&#252","&szlig;","&#191;","&#253;","&agrave;","&#130;","&#192;","&#254;","&aacute;","&#131;","&#193;","&#255;","&aring;","&#132;","&#194;","&aelig;","&#133;","&#195;","&ccedil;","&#134;","&#196;","&egrave;","&#135;","&#197;","&eacute;","&#136;","&#198;","&ecirc;","&#137;","&#199;","&euml;","&#138;","&#200;","&igrave;","&#139;","&#201;","&iacute;","&#140;","&#202;","&icirc;","&#203;","&iuml;","&#142;","&#204;","&eth;","&#205;","&ntilde;","&#206;","&ograve;","&#145;","&#207;","&oacute;","&#146;","&#208;","&ocirc;","&#147;","&#209;","&otilde;","&#148;","&#210;","&ouml;","&#149;","&#211;","&oslash;","&#150;","&#212;","&ugrave;","&#151;","&#213;","&uacute;","&#152;","&#214;","&ucirc;","&#153;","&#215;","&yacute;","&#154;","&#216;","&thorn;","&#155;","&#217;","&yuml;","&#156;","&#218;"];

    for(let x=0; x<chars.length; x++){
            s = s.replace(codes[x], chars[x]);
    }
    return s;
}
