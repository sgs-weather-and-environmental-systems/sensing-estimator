/*
 * Copyright (c) 2017, Texas Instruments Incorporated
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * *  Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *
 * *  Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * *  Neither the name of Texas Instruments Incorporated nor the names of
 *    its contributors may be used to endorse or promote products derived
 *    from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
 * OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
 * EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
 
/*
 * gc global variable provides access to GUI Composer infrastructure components and project information.
 * For more information, please see the Working with Javascript guide in the online help.
 */
var gc = gc || {};
gc.services = gc.services || {};

var loadedFromURL = false;
/*
*  Boilerplate code for creating computed data bindings
*/
document.addEventListener('gc-databind-ready', function() 
{
    /* 
	*   Add custom computed value databindings here, using the following method:
	*
    *   function gc.databind.registry.bind(targetBinding, modelBinding, [getter], [setter]);
	*
	*   param targetBinding - single binding string or expression, or array of binding strings for multi-way binding.
	*   param modelBinding - single binding string or expression, or array of binding strings for multi-way binding.
	*   param getter - (optional) - custom getter function for computing the targetBinding value(s) based on modelBinding value(s).
	*   param setter - (optional) - custom setter function for computing the modelBinding value(s) based on targetBinding value(s).
    */
	
	// For example, a simple computed values based on simple expression
	// gc.databind.registry.bind('widget.id.propertyName', "targetVariable == 1 ? 'binding is one' : 'binding is not one'");
	
	// Or a custom two-way binding with custome getter and setter functions.  (setter is optional)  (getter only indicates one-way binding)
	// gc.databind.registry.bind('widget.id.propertyName', "targetVariable", function(value) { return value*5/9 + 32; }, function(value) { (return value-32)*9/5; });
	
	// Event 1 to n bindings
	/* 
    gc.databind.registry.bind('widget.date.value', 
        // dependant bindings needed in order to compute the date, in name/value pairs.
        {
            weekday: 'widget.dayOfWeek.selectedText',
            day: 'widget.dayOfMonth.value',
            month: 'widget.month.selectedText',
            year: 'widget.year.value'
        }, 
        // getter for date computation
        function(values) 
        {
            // compute and return the string value to bind to the widget with id 'date'
            return values.weekday + ', ' + values.month + ' ' + values.day + ', ' + values.year;
        }
    ); 
	*/
});

/*
*  Boilerplate code for creating custom actions
*/
document.addEventListener('gc-nav-ready', function() 
{
    /* 
	*   Add custom actions for menu items using the following api:
	*
    *   function gc.nav.registryAction(id, runable, [isAvailable], [isVisible]);
	*
	*   param id - uniquely identifies the action, and should correspond to the action property of the menuaction widget.
	*   param runable - function that performs the custom action.
	*   param isAvailable - (optional) - function called when the menu action is about to appear.  Return false to disable the action, or true to enable it.
	*   param isVisible - (optional) - function called when the menu action is about to appear.  Return false to hide the action, or true to make it visible.
    */
	
	// For example,
	// gc.nav.registerAction('myCustomCloseAction', function() { window.close(); }, function() { return true; }, function() { return true; });
	
	// Alternatively, to programmatically disable a menu action at any time use:
	// gc.nav.disableAction('myCustomCloseAction);    then enable it again using:  gc.nav.enableAction('myCustomCloseAction'); 
	gc.nav.registerAction('HelpAbout', {
	    run: function() {
	        templateObj.$.dialog_help_about.open();
	    },
	    isAvailable: function() {
	        return true;
	    },
	    isVisible: function() {
	        return true;
	    }
	});
	gc.nav.registerAction('ti_widget_menuaction_userguide', {
	    run: function() {
	        templateObj.$.userguideViewer.open();
	    },
	    isAvailable: function() {
	        return true;
	    },
	    isVisible: function() {
	        return true;
	    }
	});
	gc.nav.registerAction('ti_widget_menuaction_download', {
	    run: function() {
	        window.open('https://dev.ti.com/gallery/info/1792614/mmWaveSensingEstimator/', '_blank');
	    },
	    isAvailable: function() {
	        return true;
	    },
	    isVisible: function() {
	        return true;
	    }
	});
});

/*
*  Boilerplate code for working with components in the application gist
*/
var initComplete = false;
var templateObj;

// Wait for DOMContentLoaded event before trying to access the application template
var init = function() {
    templateObj = document.querySelector('#template_obj');

    // Wait for the template to fire a dom-change event to indicate that it has been 'stamped'
    // before trying to access components in the application.
	templateObj.addEventListener('dom-change',function(){
	    if (initComplete) return;
	    this.async(function(){
    	    initComplete = true;
    	    console.log("Application template has been stamped.");
  	        // Now that the template has been stamped, you can use 'automatic node finding' $ syntax to access widgets.
  	        // e.g. to access a widget with an id of 'widget_id' you can use templateObj.$.widgetId
  	        templateObj.$.ti_widget_statusbar.iconName = '';
  	        onDefaultCfg();
        },1);

	});
};

templateObj = document.querySelector('#template_obj');
if (templateObj) {
    init();
} else {
    document.addEventListener('DOMContentLoaded',init.bind(this));
}
//Assumptions and Inputs
// Device Specific Parameters
//  mmWaveSensor droplist  E8
//  # Rx droplist   E9
//  # Tx droplist   E10

// Board SPecific Paramters
//  Transmit Antenna Gain (dB)  E13
//  Receive Antenna Gain (dB)  E14

// Regulatory Restrictions
//  Freqency Range droplist (GHz)  E17
//  Maximum Bandwidth (MHz)  E18
//  Transmit Power (dBm)  E19

// Scene Parametrs
//   Ambient Temperature (deg Celcius)  E22
//   Maximum Detectable Range (m)  E23
//   Range Resolution (cm)  E24
//   Maximum Velocity (km/h)  E25
//   Velocity Resolution (km/h)  E26
//   Measurement Rate (Hz)  E27
//   Typical Detectable Object droplist + edit box (m^2)  E28

// Additional Parameters
//   Detection Loss (dB)  E32
//   System Loss (e.g. bumper, radome, etc.) (dB)  E33
//   Implementation Margin (dB)  E34
//   Detection SNR (dB)  E35

//Outputs and Chirp Design
// Detectable Object Range 
//  Max Range for Typical Detectable Object (m)
//  Min RCS Detectable at Max Range (m^2)

// Chrip Design Parameters
//  Valid Sweep Bandwidth (MHz)
//  Inter-chirp Time (us)
//  Chirp time, Tc (us)
//  Ramp Slope Init (MHz/us)
//  Ramp Slope Parameter
//  Ramp Slope  (MHz/us)
//  Maximum Beat Freqeuncy (MHz)
//  Sampling Frequency Msps
//  Number of Samples per Chirp
//  Total Sweep Bandwidth (MHz)
//  Idle Time Minimum (us)
//  Ramp End Time
//  Carrier Frequency (GHz)
//  ADC Valid Start Time (us)
//  Lambda (mm)
//  Max Chirp Repetition Period (us)
//  Chirp Repetition Period (us)
//  # of Range FFT Bins
//  Min # of Chirp Loops
//  # of Doppler FFT Bins
//  Active Frame Time (ms)
//  Range Interbin Resolution (cm)
//  Velocity Interbin Resolution (m/s)
//  Radar Cube Size (KB)

var allowed_params = ["platform",
                        "num_rx",
                        "num_tx",
                        "tx_gain",
                        "rx_gain",
                        "freq_range",
                        "bandwidth",
                        "tx_power",
                        "temp",
                        "range",
                        "range_resolution",
                        "velocity",
                        "velocity_resolution",
                        "fps",
                        "rcs"];
                        
var loadFromURL = function () {
    var url = window.location.search;

    var request = {};
    var pairs = url.substring(url.indexOf('?') + 1).split('&');
    for (var i = 0; i < pairs.length; i++) {
        if(!pairs[i])
            continue;
        var pair = pairs[i].split('=');
        console.log(allowed_params.indexOf(pair[0]));
        if (allowed_params.indexOf(pair[0]) > -1) {
            request[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        }
     }
     
    console.log(request);
     
    if (request['platform'] !== undefined) {
        var tmp = Object.keys(mmwInput.Platform).map(function (key) { return mmwInput.Platform[key]; });
        
        if (tmp.indexOf(request['platform']) > -1) {
            mmwInput.Input.platform = request['platform'];
        }
        //mmwInput.Input.maximum_detectable_range = request['range'];
    }
    
    if (request['num_rx'] !== undefined) {
        var rx_list = mmwInput.get_allowed_Rx(mmwInput.Input.platform);
        var num_rx = parseFloat(request['num_rx']);
        // Is it a good idea to patch for user?
        if (rx_list.indexOf(num_rx) < 0) {
            reflectDroplist(templateObj.$.ti_widget_droplist_num_rx, rx_list[0]);
            mmwInput.Input.num_rx = rx_list[0];
        } else {
            reflectDroplist(templateObj.$.ti_widget_droplist_num_rx, num_rx);
            mmwInput.Input.num_rx = num_rx;
        }
    }
    
    if (request['num_tx'] !== undefined) {
        var tx_list = mmwInput.get_allowed_Tx(mmwInput.Input.platform);
        var num_tx = parseFloat(request['num_tx']);
        // Is it a good idea to patch for user?
        if (tx_list.indexOf(num_tx) < 0) {
            reflectDroplist(templateObj.$.ti_widget_droplist_num_tx, tx_list[0]);
            mmwInput.Input.num_tx = tx_list[0];
        } else {
            reflectDroplist(templateObj.$.ti_widget_droplist_num_tx, num_tx);
            mmwInput.Input.num_tx = num_tx;
        }
    }
    
    if (request['tx_gain'] !== undefined) {
        mmwInput.Input.tx_gain = parseFloat(request['tx_gain']);
    }
    
    if (request['rx_gain'] !== undefined) {
        mmwInput.Input.rx_gain = parseFloat(request['rx_gain']);
    }
    
    if (request['freq_range'] !== undefined) {
        if (request['freq_range'] == "76") {
            console.log(mmwInput);
            mmwInput.Input.frequency_range = mmwInput.Frequency_Range.f76to77;
        } else if ( request['freq_range'] == "77" ) {
            mmwInput.Input.frequency_range = mmwInput.Frequency_Range.f77to81;
        }
    }
    
    if (request['bandwidth'] !== undefined) {
        mmwInput.Input.maximum_bandwidth = parseFloat(request['bandwidth']);
    }
    
    if (request['tx_power'] !== undefined) {
        mmwInput.Input.tx_power = parseFloat(request['tx_power']);
    }
    
    if (request['temp'] !== undefined) {
        mmwInput.Input.ambient_temperature_degC = parseFloat(request['temp']);
    }
    
    if (request['range'] !== undefined) {
        mmwInput.Input.maximum_detectable_range = parseFloat(request['range']);
    }
    
    if (request['range_resolution'] !== undefined) {
        mmwInput.Input.range_resolution = parseFloat(request['range_resolution']);
    }
    
    if (request['velocity'] !== undefined) {
        mmwInput.Input.maximum_velocity_kmph = parseFloat(request['velocity']);
    }
    
    if (request['velocity_resolution'] !== undefined) {
        mmwInput.Input.velocity_resolution_kmph = parseFloat(request['velocity_resolution']);
    }
    
    if (request['fps'] !== undefined) {
        mmwInput.Input.measurement_rate = parseFloat(request['fps']);
    }
    
    if (request['rcs'] !== undefined) {
        mmwInput.Input.typical_detected_object = parseFloat(request['rcs']);
    }

}

var mmwInput = new mmWaveInput();
var on_sensor = function() {
    var tmp = templateObj.$.ti_widget_droplist_sensor.selectedValue;
    var change = {platform: tmp};
    var rx_list = mmwInput.get_allowed_Rx(tmp);
    var tx_list = mmwInput.get_allowed_Tx(tmp);
    
    var rx0 = parseInt( templateObj.$.ti_widget_droplist_num_rx.selectedValue );
    var tx0 = parseInt( templateObj.$.ti_widget_droplist_num_tx.selectedValue );
    
    updateDroplistChoice(templateObj.$.ti_widget_droplist_num_rx, rx_list);
    updateDroplistChoice(templateObj.$.ti_widget_droplist_num_tx, tx_list);
    
    // Is it a good idea to patch for user?
    if (rx_list.indexOf(rx0) < 0) {
        reflectDroplist(templateObj.$.ti_widget_droplist_num_rx, rx_list[rx_list.length-1]);
        change.num_rx = rx_list[rx_list.length-1];
    }
    if (tx_list.indexOf(tx0) < 0) {
        reflectDroplist(templateObj.$.ti_widget_droplist_num_tx, tx_list[tx_list.length-1]);
        change.num_tx = tx_list[tx_list.length-1];
    }

    mmwInput.update_input(change);
    reflectWidgets();
};
var on_num_rx = function() {
    var tmp = parseInt( templateObj.$.ti_widget_droplist_num_rx.selectedValue );
    if (isNaN(tmp) === false) {
        mmwInput.update_input({num_rx: tmp});
        reflectWidgets();
    }
};
var on_num_tx = function() {
    var tmp = parseInt( templateObj.$.ti_widget_droplist_num_tx.selectedValue );
    if (isNaN(tmp) === false) {
        mmwInput.update_input({num_tx: tmp});
        reflectWidgets();
    }
};
var on_tx_gain = function() {
    var tmp = parseFloat( templateObj.$.ti_widget_textbox_tx_gain.value );
    if (isNaN(tmp) === false) {
        mmwInput.update_input({tx_gain: tmp});
        reflectWidgets();
    }
};
var on_rx_gain = function() {
    var tmp = parseFloat( templateObj.$.ti_widget_textbox_rx_gain.value );
    if (isNaN(tmp) === false) {
        mmwInput.update_input({rx_gain: tmp});
        reflectWidgets();
    }
};
var on_frequency_range = function() {
    var tmp = templateObj.$.ti_widget_droplist_frequency_range.selectedValue;
    mmwInput.update_input({frequency_range: tmp});
    reflectWidgets();
};
var on_maximum_bandwidth = function() {
    var tmp = parseFloat( templateObj.$.ti_widget_textbox_maximum_bandwidth.value );
    if (isNaN(tmp) === false) {
        mmwInput.update_input({maximum_bandwidth: tmp});
        reflectWidgets();
    }
};
var on_tx_power = function() {
    var tmp = parseFloat( templateObj.$.ti_widget_textbox_tx_power.value);
    if (isNaN(tmp) === false) {
        mmwInput.update_input({tx_power: tmp});
        reflectWidgets();
    }
};
var on_ambient_temperature = function() {
    var tmp = parseFloat( templateObj.$.ti_widget_textbox_ambient_temperature.value);
    if (isNaN(tmp) === false) {
        mmwInput.update_input({ambient_temperature_degC: tmp});
        reflectWidgets();
    }
};
var on_maximum_detectable_range = function() {
    var tmp = parseFloat( templateObj.$.ti_widget_textbox_maximum_detectable_range.value);
    if (isNaN(tmp) === false) {
        mmwInput.update_input({maximum_detectable_range: tmp});
        reflectWidgets();
    }
};
var on_range_resolution = function() {
    var tmp = parseFloat( templateObj.$.ti_widget_textbox_range_resolution.value );
    if (isNaN(tmp) === false) {
        mmwInput.update_input({range_resolution: tmp});
        reflectWidgets();
    }
};
var on_maximum_velocity = function() {
    var tmp = parseFloat( templateObj.$.ti_widget_textbox_maximum_velocity.value );
    if (isNaN(tmp) === false) {
        mmwInput.update_input({maximum_velocity_kmph: tmp});
        reflectWidgets();
    }
};
var on_velocity_resolution = function() {
    var tmp = parseFloat( templateObj.$.ti_widget_textbox_velocity_resolution.value );
    if (isNaN(tmp) === false) {
        mmwInput.update_input({velocity_resolution_kmph: tmp});
        reflectWidgets();
    }
};
var on_measurement_rate = function() {
    var tmp = parseFloat( templateObj.$.ti_widget_textbox_measurement_rate.value );
    if (isNaN(tmp) === false) {
        mmwInput.update_input({measurement_rate: tmp});
        reflectWidgets();
    }
};
var on_typical_detected_object_choice = function() {
    var tmp = templateObj.$.ti_widget_droplist_typical_detected_object.selectedValue;
    if (tmp !== 'Custom') {
        templateObj.$.ti_widget_textbox_typical_detected_object.disabled = true;
        reflectTextbox(templateObj.$.ti_widget_textbox_typical_detected_object, mmwInput.typical_detected_object_to_rcs(tmp));
        mmwInput.update_input({typical_detected_object: tmp});
        reflectWidgets();
    } else {
        templateObj.$.ti_widget_textbox_typical_detected_object.disabled = false;
    }
};
var on_typical_detected_object = function() {
    var tmp = templateObj.$.ti_widget_textbox_typical_detected_object.value;
    mmwInput.update_input({typical_detected_object: tmp});
    reflectWidgets();
};

var on_detection_loss = function() {
    var tmp = parseFloat( templateObj.$.ti_widget_textbox_detection_loss.value );
    if (isNaN(tmp) === false) {
        mmwInput.update_input({detection_loss: tmp});
        reflectWidgets();
    }
};
var on_system_loss = function() {
    var tmp = parseFloat( templateObj.$.ti_widget_textbox_system_loss.value );
    if (isNaN(tmp) === false) {
        mmwInput.update_input({system_loss: tmp});
        reflectWidgets();
    }
};
var on_implementation_margin = function() {
    var tmp = parseFloat( templateObj.$.ti_widget_textbox_implementation_margin.value );
    if (isNaN(tmp) === false) {
        mmwInput.update_input({implementation_margin: tmp});
        reflectWidgets();
    }
};
var on_detection_SNR = function() {
    var tmp = parseFloat( templateObj.$.ti_widget_textbox_detection_SNR.value );
    if (isNaN(tmp) === false) {
        mmwInput.update_input({detection_SNR: tmp});
        reflectWidgets();
    }
};


var updateDroplistChoice = function(widget, values, labels) {
    widget.values = values.join('|');
    widget.labels = labels ? labels.join('|') : values.join('|');
};
var reflectDroplist = function(widget, newValue) {
    if (newValue && widget.selectedValue != newValue) {
        widget.selectedValue = newValue;
        return true;
    }
    return false;
};
var reflectTextbox = function(widget, newValue, prec) {
    if (newValue && prec != undefined) {
        newValue = MyUtil.sprintf(newValue, prec);
    }
    if (newValue && widget.getText() != newValue) {
        widget.setText(newValue);
        return true;
    }
    return false;
};
var onSaveCfg = function() {
    var data = JSON.stringify(mmwInput.Input, null, 4);
    var tmp = window.navigator.platform;
    if (tmp) {
        tmp = tmp.toLowerCase();
        if (tmp.indexOf('win') >= 0) {
            data = data.replace(/\n/g, '\r\n');
        }
    }
    gc.File.saveBrowserFile(data, {filename: 'design.json'}, function(e1) {
        // don't have any callback
    });
    
};
var onLoadCfg = function() {
    gc.File.browseAndLoad(null, null, function(data,fileInfo,err) {
        mmwInput.Input = JSON.parse(data);
        reflectInputWidgets();
        console.log("on load config");
    }, myFileLoadDialog);
};
// cache the cfg defaults that are feteched through http to minimize # of round-trips;
// do not put user uploaded cfg into this cache.
var cfg_cache = {};
var filename_to_url = function(filename) {
    var idx = location.pathname.indexOf('/index.html');
    var url = location.pathname;
    if (idx >= 0) {
        url = location.pathname.substring(0,idx);
    }
    if (url[url.length-1] != '/') url += '/';
    url += 'app/'+filename;
    return url;
};
var get_default_cfg = function(jsonfile) {
    if (!cfg_cache[jsonfile]) {
        var url = filename_to_url(jsonfile);
        MyUtil.httpGet(url, undefined, function(error, result) {
            if (!error) {
                cfg_cache[jsonfile] = result;
                onResetCfg(cfg_cache[jsonfile]);
            } else {
                // can't http get the default json, call to get mmWaveInput's built-in default?
                onResetCfg();
            }
        });
    } else {
        onResetCfg(cfg_cache[jsonfile]);
    }
};

var onDefaultCfg = function() {
    var tmp = templateObj.$.ti_widget_droplist_default_cfg.selectedValue;
    tmp = tmp.replace(/\s+/g, '_')+'.json';
    get_default_cfg(tmp);
}
var onResetCfg = function(data) {
    if (data) {
        mmwInput.Input = JSON.parse(data);
    } else {
        // if we load defaults from app's default json files, we may not need
        // this mmWaveInput's built-in default
        mmwInput.get_default1();
    }
    
    if (loadedFromURL == false) {
        console.log("Loading settings from URL.");
        loadFromURL();
        loadedFromURL = true;
    }
    
    reflectInputWidgets();
};
var reflectInputWidgets = function() {
    // compute output
    mmwInput.update_input();
    
    // reflect changes on input side (driven by default button, load cfg, etc.) to widgets
    reflectDroplist(templateObj.$.ti_widget_droplist_sensor, mmwInput.Input.platform );
    var rx_list = mmwInput.get_allowed_Rx(mmwInput.Input.platform);
    var tx_list = mmwInput.get_allowed_Tx(mmwInput.Input.platform);
    updateDroplistChoice(templateObj.$.ti_widget_droplist_num_rx, rx_list);
    updateDroplistChoice(templateObj.$.ti_widget_droplist_num_tx, tx_list);
    reflectDroplist(templateObj.$.ti_widget_droplist_num_rx, mmwInput.Input.num_rx );
    reflectDroplist(templateObj.$.ti_widget_droplist_num_tx, mmwInput.Input.num_tx );
    
    reflectTextbox(templateObj.$.ti_widget_textbox_tx_gain, mmwInput.Input.tx_gain );
    reflectTextbox(templateObj.$.ti_widget_textbox_rx_gain, mmwInput.Input.rx_gain );
    
    reflectDroplist(templateObj.$.ti_widget_droplist_frequency_range, mmwInput.Input.frequency_range );
    reflectTextbox(templateObj.$.ti_widget_textbox_maximum_bandwidth, mmwInput.Input.maximum_bandwidth );
    reflectTextbox(templateObj.$.ti_widget_textbox_tx_power, mmwInput.Input.tx_power );
    
    reflectTextbox(templateObj.$.ti_widget_textbox_ambient_temperature, mmwInput.Input.ambient_temperature_degC );
    reflectTextbox(templateObj.$.ti_widget_textbox_maximum_detectable_range, mmwInput.Input.maximum_detectable_range );
    reflectTextbox(templateObj.$.ti_widget_textbox_range_resolution, mmwInput.Input.range_resolution );
    reflectTextbox(templateObj.$.ti_widget_textbox_maximum_velocity, mmwInput.Input.maximum_velocity_kmph );
    reflectTextbox(templateObj.$.ti_widget_textbox_velocity_resolution, mmwInput.Input.velocity_resolution_kmph );
    reflectTextbox(templateObj.$.ti_widget_textbox_measurement_rate, mmwInput.Input.measurement_rate );
    
    var tmp = parseFloat(mmwInput.Input.typical_detected_object);
    if (isNaN(tmp) === false) {
        templateObj.$.ti_widget_textbox_typical_detected_object.disabled = false;
        reflectDroplist(templateObj.$.ti_widget_droplist_typical_detected_object, 'Custom' );
        reflectTextbox(templateObj.$.ti_widget_textbox_typical_detected_object, mmwInput.Input.typical_detected_object );
    } else {
        templateObj.$.ti_widget_textbox_typical_detected_object.disabled = true;
        reflectTextbox(templateObj.$.ti_widget_textbox_typical_detected_object, mmwInput.typical_detected_object_to_rcs(mmwInput.Input.typical_detected_object));
        reflectDroplist(templateObj.$.ti_widget_droplist_typical_detected_object, mmwInput.Input.typical_detected_object );
    }

    reflectTextbox(templateObj.$.ti_widget_textbox_detection_loss, mmwInput.Input.detection_loss );
    reflectTextbox(templateObj.$.ti_widget_textbox_system_loss, mmwInput.Input.system_loss );
    reflectTextbox(templateObj.$.ti_widget_textbox_implementation_margin, mmwInput.Input.implementation_margin );
    reflectTextbox(templateObj.$.ti_widget_textbox_detection_SNR, mmwInput.Input.detection_SNR );
    
    reflectWidgets();
    console.log("reflected");
};
var reflectWidgets = function() {
    // reflect computed data to output widgets
    reflectTextbox(templateObj.$.ti_widget_textbox_max_range_for_det_obj, mmwInput.Input.max_range_for_typical_detectable_object, 2 );

    reflectTextbox(templateObj.$.ti_widget_textbox_min_rcs_at_max_range, mmwInput.Input.min_rcs_detectable_at_max_range, 2 );
    
    reflectTextbox(templateObj.$.ti_widget_textbox_chirp_time, mmwInput.Input.ramp_end_time + mmwInput.Input.idle_time_minimum, 2 );
    
    reflectTextbox(templateObj.$.ti_widget_textbox_ramp_slope_parameter, mmwInput.Input.ramp_slope_parameter, 2 );
    
    reflectTextbox(templateObj.$.ti_widget_textbox_ramp_slope, mmwInput.Input.ramp_slope, 2 );
    
    reflectTextbox(templateObj.$.ti_widget_textbox_maximum_beat_frequency, mmwInput.Input.maximum_beat_frequency, 2 );
    
    reflectTextbox(templateObj.$.ti_widget_textbox_sampling_frequency, mmwInput.Input.sampling_frequency * 1000, 0 );
    
    reflectTextbox(templateObj.$.ti_widget_textbox_num_samples_per_chirp, mmwInput.Input.number_of_samples_per_chirp );
    
    reflectTextbox(templateObj.$.ti_widget_textbox_total_sweep_bandwidth, mmwInput.Input.total_sweep_bandwidth, 2 );
    
    reflectTextbox(templateObj.$.ti_widget_textbox_idle_time_minimum, mmwInput.Input.idle_time_minimum, 2 );
    
    reflectTextbox(templateObj.$.ti_widget_textbox_ramp_end_time, mmwInput.Input.ramp_end_time, 2 );

    reflectTextbox(templateObj.$.ti_widget_textbox_adc_valid_start_time, mmwInput.Input.adc_valid_start_time_2, 2 );
    
    reflectTextbox(templateObj.$.ti_widget_textbox_start_frequency, mmwInput.Input.starting_frequency, 0 );

    reflectTextbox(templateObj.$.ti_widget_textbox_chirp_repetition_period, mmwInput.Input.chirp_repetition_period, 2 );

    reflectTextbox(templateObj.$.ti_widget_textbox_num_range_fft_bins, mmwInput.Input.num_range_fft_bins );

    reflectTextbox(templateObj.$.ti_widget_textbox_min_num_chirp_loops, mmwInput.Input.min_num_of_chirp_loops );

    reflectTextbox(templateObj.$.ti_widget_textbox_num_doppler_fft_bins, mmwInput.Input.num_doppler_fft_bins );

    reflectTextbox(templateObj.$.ti_widget_textbox_active_frame_time, mmwInput.Input.active_frame_time, 2 );

    reflectTextbox(templateObj.$.ti_widget_textbox_range_inter_bin_resolution, mmwInput.Input.range_inter_bin_resolution, 2 );

    reflectTextbox(templateObj.$.ti_widget_textbox_velocity_inter_bin_resolution, mmwInput.Input.velocity_inter_bin_resolution, 2 );

    reflectTextbox(templateObj.$.ti_widget_textbox_radar_cube_size, mmwInput.Input.radar_cube_size, 2 );
    
    reflectTextbox(templateObj.$.ti_widget_textbox_periodicity, 1 / mmwInput.Input.measurement_rate * 1000, 2 );

    updateErrorTips();
    
    console.log("");
    
    console.log("Profile config and frame config are provided for debug purposes only.  They are not guaranteed to work with mmWave SDK out of box demo without calibrating digital processing chain.");
    
    console.log("");
    
    console.log("Profile Config:");
    
    console.log("profileCfg 0 " + mmwInput.Input.starting_frequency + " " + mmwInput.Input.idle_time_minimum + " " + mmwInput.Input.adc_valid_start_time_2 + " " + MyUtil.toPrecision(mmwInput.Input.ramp_end_time, 2) + " 0 0 " + MyUtil.toPrecision(mmwInput.Input.ramp_slope, 2) + " 1 " + mmwInput.Input.number_of_samples_per_chirp + " " + MyUtil.toPrecision(mmwInput.Input.sampling_frequency * 1000, 0) + " 0 0 30");

    console.log("");
    
    console.log("Frame Config:");
    
    console.log("frameCfg 0 0 " + mmwInput.Input.min_num_of_chirp_loops + " 0 " + MyUtil.toPrecision(1 / mmwInput.Input.measurement_rate * 1000, 2) + " 1 0");

    console.log("");
    
    console.log("Link to this chirp here:");
    
    console.log(window.location.href + "?platform=" + mmwInput.Input.platform + "&num_rx=" + mmwInput.Input.num_rx + "&num_tx=" + mmwInput.Input.num_tx + "&tx_gain=" + mmwInput.Input.tx_gain + "&rx_gain=" + mmwInput.Input.rx_gain + "&freq_range=" + mmwInput.Input.starting_frequency + "&bandwidth=" + mmwInput.Input.maximum_bandwidth + "&tx_power=" + mmwInput.Input.tx_power + "&temp=" + mmwInput.Input.ambient_temperature_degC + "&range=" + mmwInput.Input.maximum_detectable_range + "&range_resolution=" + mmwInput.Input.range_resolution + "&velocity=" + mmwInput.Input.maximum_velocity_kmph + "&velocity_resolution=" + mmwInput.Input.velocity_resolution_kmph + "&fps=" + mmwInput.Input.measurement_rate + "&rcs=" + mmwInput.Input.rcs_value);
};

var highlightProp = function(widget, error) {
    if (!widget) return;
    if (error) widget.addClassName('error1');
    else widget.removeClassName('error1');
};

var updateErrorTips = function() {
    var ans = mmwInput.check_rules();
    var value = '';
    
    var idx2=1;
    var errorProps = [];
    var clearProps = [];
    for (var idx=0; idx<ans.length; idx++) {
        if (ans[idx].error) {
            value += 'Error ' + (idx2) + ': '+ans[idx].error +'\n';
            value += 'Tips: '+ans[idx].tips + '\n\n';
            idx2 += 1;
            //console.log("Reached error.");
            //console.log(ans[idx].props);
            Array.prototype.push.apply(errorProps, ans[idx].props);
        } else {
            //console.log("Reached clear.");
            //console.log(ans[idx].props);
            Array.prototype.push.apply(clearProps, ans[idx].props);
        }
    }
    var prefix = 'ti_widget_container_';
    for (var idx=0; idx<clearProps.length; idx++) {
        highlightProp( templateObj.$[prefix+clearProps[idx]] );
    }
    for (var idx=0; idx<errorProps.length; idx++){
        highlightProp( templateObj.$[prefix+errorProps[idx]], true );
    }

    templateObj.$.ti_widget_textbox_cfg_console.value = value || 'No errors are found.';
};
