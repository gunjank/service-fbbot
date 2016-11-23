'use strict';

const log = require('../config/logger'),
    settings = require('../config/settings');

const alphabet = "ABCDEFGHIJKL" //max 5 only 
const staticButtonTemplateBase = function () {
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
const genericTemplateBase = function () {
    return {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": []
            }
        }
    }

};
const element = function () {
    return {
        "title": "title for element ",
        "item_url": "URL that is opened when bubble is tapped",
        "image_url": "Bubble image",
        "subtitle": "",
        "buttons": []
    }
}
const staticButton = function () {
    // return {
    //     "type": "postback",
    //     "title": "Station 78, bikes 5 av",
    //     "payload": "USER_DEFINED_PAYLOAD"
    // };
    return {
        "type": "web_url",
        "url": `https://maps.google.com?q=@`,
        "title": "View Item",
        "webview_height_ratio": "full"
    }
}
const staticMapUrlGenerator = function (data) {
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
const staticMapUrlGeneratorForCarousel = function (item) {
    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap`;
    const mapProperty = `?size=240x240&zoom=15`;
    let markers = `&markers=icon:https://goo.gl/chTNEI`;
    let addressLoc = `|` + item.lat + `,` + item.lon;
    return mapUrl + mapProperty + markers + addressLoc;
}
const videoTemplate = function () {
    return {
        "attachment": {
            "type": "video",
            "payload": {
                "url": "https://vimeo.com/180056981"
            }
        }
    }
};

//exports
const generator = {
    buttonTemplate: function (headerText, data) {
        let template = staticButtonTemplateBase();
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
        let template = genericTemplateBase();
        let items = data.data;
        for (let item of items) {
            let e = element();
            e.title = item.name;
            e.subtitle = "Bikes Available:" + item.num_bikes_available + ", Docks Available:" + item.num_docks_available;
            e.image_url = staticMapUrlGeneratorForCarousel(item);

            let b = staticButton();
            b.title = "View Map";
            b.url = b.url + item.lat + ',' + item.lon;
            e.item_url = b.url;
            e.buttons.push(b);
            template.attachment.payload.elements.push(e);
        }
        return template;

    },
    imageTemplate: function (data) {
        let staticImageUrl = staticMapUrlGenerator(data);
        let template = {
            "attachment": {
                "type": "image",
                "payload": {
                    "url": staticImageUrl
                }
            }
        }
        return template;
    },
    getVideoTemplate: function () {
        let template = videoTemplate();
        return template;
    },
    citiLoginTemplate: function (userId) {
        let loginUrl = settings.citiAuthLoginUrl;
        const re = new RegExp('@@@@@', 'i');
        loginUrl = loginUrl.replace(re, userId);
        const template = staticButtonTemplateBase();
        template.attachment.payload.text = settings.citiLoginHeaderText;
        const b = staticButton();
        b.title = "Log In";
        b.url = loginUrl;
        template.attachment.payload.buttons.push(b);
        return template;
    }

}; //end of exports

module.exports = generator;