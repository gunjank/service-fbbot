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
    genericMapTemplate: function () {
        let lat = 40.804213;
        let long = -73.96699104;
        let genericMapTemplate = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": {
                        "element": {
                            "title": "Your current location",
                            "image_url": "https:\/\/maps.googleapis.com\/maps\/api\/staticmap?size=764x400&center=" + lat + "," + long + "&zoom=25&markers=" + lat + "," + long,
                            "item_url": "http:\/\/maps.apple.com\/maps?q=" + lat + "," + long + "&z=16"
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