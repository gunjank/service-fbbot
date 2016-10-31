'use strict';




let staticButtonTemplate = {
    "attachment": {
        "type": "template",
        "payload": {
            "template_type": "button",
            "text": "Below are the nearest stations",
            "buttons": []
        }
    }
};
let staticButton = {
    "type": "postback",
    "title": "Station 78, bikes 5 av",
    "payload": "USER_DEFINED_PAYLOAD"
};
let staticMapUrlGenerator = function (data) {
    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?size=480x480`;
    const mapProperty = `?size=200x200&zoom=13&center=` + data.payload.lat + `,` + data.payload.lon;

    let items = data.data;
    let markers = `&markers=icon:https://chart.googleapis.com/chart?chst=d_bubble_text_small%26chld=bb%257C`;
    //const label = stName; //text to show
    let colorCode = `%257CFFF%257C000`;
    // let addressLoc = `|` + lat + `,` + lon;
    let fullMarkerStr = "";
    for (let item of items) {

        //let labelText = "ST-" + item.station_id + ",BA-" + item.num_bikes_available + ",DA-" + item.num_docks_available;
        let labelText = "BA-" + item.num_bikes_available;
        let addressLoc = `|` + item.lat + `,` + item.lon;
        fullMarkerStr += markers + labelText + colorCode + addressLoc
    }
    return mapUrl + mapProperty + fullMarkerStr;
}

//exports
let generator = {
    buttonTemplate: function (headerText, data) {

        staticButtonTemplate.attachment.payload.text = headerText;
        let items = data.data;
        let idx = 0;
        for (let item of items) {
            if (idx > 2) break; //chat bot button count limited to 3
            let b = staticButton;
            b.title = "ST-" + item.station_id + ",BA-" + item.num_bikes_available + ",DA-" + item.num_docks_available;
            staticButtonTemplate.attachment.payload.buttons.push(b);

            idx++;
        }
        return staticButtonTemplate;
    },
    genericMapTemplate: function (data) {
        //"image_url": "https:\/\/maps.googleapis.com\/maps\/api\/staticmap?size=764x400&center=" + lat + "," + long + "&zoom=25&markers=" + lat + "," + long,     

        let staticImageUrl = staticMapUrlGenerator(data);
        console.log("test url for map " + staticImageUrl);
        let genericMapTemplate = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": {
                        "element": {
                            "title": "Stations near by",
                            "image_url": staticImageUrl,
                            "item_url": ""
                        }
                    }
                }
            }
        }
        return genericMapTemplate;


        //
    }
}
module.exports = generator;