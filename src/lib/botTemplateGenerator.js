'use strict';

let alphabet = "ABCDEFGHIJKL" //max 5 only 
let staticButtonTemplate = function () {
    return {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": "Below are the nearest stations",
                "buttons": []
            }
        }
    };
}
let staticButton = function () {
    // return {
    //     "type": "postback",
    //     "title": "Station 78, bikes 5 av",
    //     "payload": "USER_DEFINED_PAYLOAD"
    // };
    return {
        "type": "web_url",
        "url": `https://maps.google.com/?q=@`,
        "title": "View Item",
        "webview_height_ratio": "full"
    }
}
let staticMapUrlGenerator = function (data) {
    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap`;
    const mapProperty = `?size=360x360`;
    //&zoom=13&center=` + data.payload.lat + `,` + data.payload.lon;//with markers no need to specify center and zoom

    let items = data.data;
    let markers = `&markers=icon:https://chart.googleapis.com/chart?chst=d_bubble_text_small%26chld=bb%257C`;

    //const label = stName; //text to show
    let colorCode = `%257CFFF%257C000`;
    // let addressLoc = `|` + lat + `,` + lon;
    //let markersStr = `&markers=color:red%7C`+data.payload.lat+`,`+data.payload.lon;//show searched address 
    let markersStr = "";

    let idx = 0;
    for (let item of items) {

        //let labelText = "ST-" + item.station_id + ",BA-" + item.num_bikes_available + ",DA-" + item.num_docks_available;
        let labelText = alphabet[idx] + "-" + item.num_bikes_available;
        let addressLoc = `|` + item.lat + `,` + item.lon;

        markersStr += markers + labelText + colorCode + addressLoc;
        idx++;
    }
    return mapUrl + mapProperty + markersStr;
}

//exports
let generator = {
    buttonTemplate: function (headerText, data) {
        let template = staticButtonTemplate();
        template.attachment.payload.text = headerText;
        let items = data.data;
        let idx = 0;
        for (let item of items) {
            if (idx > 2) break; //chat bot button count limited to 3
            let b = staticButton();
            b.title = alphabet[idx] + "-ST " + item.station_id + ",BA-" + item.num_bikes_available + ",DA-" + item.num_docks_available;
            b.url = b.url + item.lat + ',' + item.lon;
            template.attachment.payload.buttons.push(b);
            idx++;
        }
        return template;
    },
    genericTemplate: function (data) {
        //"image_url": "https:\/\/maps.googleapis.com\/maps\/api\/staticmap?size=764x400&center=" + lat + "," + long + "&zoom=25&markers=" + lat + "," + long,     

        //let staticImageUrl = staticMapUrlGenerator(data);

        console.log(" url for map --  " + staticImageUrl);
        let template = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": {
                        "element": {
                            "title": "Stations near by",
                            "image_url": "http://",
                            "item_url": "http://"
                        }
                    }
                }
            }
        }

        return template;

    },
    imageTemplate: function (data) {
        let staticImageUrl = staticMapUrlGenerator(data);
        console.log(" url for map --  " + staticImageUrl);
        let template = {
            "attachment": {
                "type": "image",
                "payload": {
                    "url": staticImageUrl
                }
            }
        }
        return template;
    }
}
module.exports = generator;