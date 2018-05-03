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
 
// 
// usage:
// var tmp = new mmWaveInput();
// tmp.update_input(); tmp.check_rules();

// Code structure Goal:
// Keep this code purely no GUI (i.e. no read/change to gui widget values)
// so that it is easier to do auto unit testing
// and potentially for code re-use in other cases.

(function () {
    //'use strict';

    function mmWaveInput() {
        if (!(this instanceof mmWaveInput))
            return new mmWaveInput();
        
        this.init();
    }

    //mmWaveInput.prototype = { };
    
    var Platform = {
		xWR12xx: 'xWR1243'
		, AWR14xx: 'AWR1443'
        , IWR14xx: 'IWR1443'
        , xWR16xx: 'xWR1642'
    };
    var Frequency_Range = {
        f76to77: '76 - 77'
        ,f77to81: '77 - 81'
    };
    function init() {
        this.Input = {
			// Device Specific Params
            //, platform: Platform.xWR16xx // xWR14xx, xWR16xx
			//, num_rx
			//, num_tx
			
			// Board Specific
			//, tx_gain
			//, rx_gain
			
			// Regulatory Restrictions
			//, frequency_range
			//, maximum_bandwith
			//, tx_power
			
			// Scene
			//, ambient_temperature
			//, maximum_detectable_range
			//, range_resolution
			//, maximum_velocity
			//, velocity_resolution
			//, measurement_rate
			//, typical_detected_object: Truck (100), Car (10), Motocycle (3.2), Adult (1), Child (0.5), Custom
			
			// Additional
			//, detection_loss
			//, system_loss
			//, implementation_margin
			//, detection_SNR
        };
        this.constants = {
            lightSpeed: 3e8 // speed of light m/us   F46
            , kB: 1.38064852e-23 // Bolzmann constant J/K, kgm^2/s^2K  F47
            , cube_4pi: Math.pow(4*Math.PI, 3)  // F48
        };
        
        this.Frequency_Range = Frequency_Range;
    }
    
	var maximum_radar_cube_size = function(platform) {
		//F51 =IF(F50=1;1000000;IF(F50=2;256;(IF(F50=3;640;1000000))))
		if (platform == Platform.xWR12xx) {
			return 1000000;
		} else if (platform == Platform.AWR14xx || platform == Platform.IWR14xx) {
			return 384;
		} else if (platform == Platform.xWR16xx) {
			return 768;
		} else {
			return 1000000;
		}
	};
	
	var maximum_RF_bandwidth = function(platform) {
		//F52 =IF(F50=1;15;IF(F50=2;15;(IF(F50=3;5;15))))
		if (platform == Platform.xWR12xx) {
			return 15;
		} else if (platform == Platform.AWR14xx) {
			return 5;
		} else if (platform == Platform.IWR14xx) {
			return 15;
		} else if (platform == Platform.xWR16xx) {
			return 5;
		} else {
			return 15;
		}
	};
	
	var maximum_sampling_frequency = function(platform) {
		//F53 =IF(F50=1;15;IF(F50=2;15;(IF(F50=3;5;15))))
		// Fs,max is xR12xx - 15Msps; xR14xx - 15Msps; xR16xx - 10Msps
		if (platform == Platform.xWR12xx) {
			return 18.75;
		} else if (platform == Platform.AWR14xx) {
			return 6.25;
		} else if (platform == Platform.IWR14xx) {
			return 18.75;
		} else if (platform == Platform.xWR16xx) {
			return 6.25;
		} else {
			return 18.75;
		}
	};
	
	var sensor_maximum_bandwidth = function(frequency_range) {
	    //F55 =IF(E17="76 - 77", 1000, 4000)
		if (frequency_range == Frequency_Range.f76to77) {
			return 1000;
		} else {
			return 4000;
		}
	};
	
	var maximum_allowed_bandwidth = function(maximum_bandwidth, sensor_maximum_bandwidth ) {
	    //F56 =MIN(E18,F55)
		return Math.min(maximum_bandwidth, sensor_maximum_bandwidth);
	};
	
	var starting_frequency = function(frequency_range) {
	    //F58 =IF(E17="76 - 77", 76, 77)
		if (frequency_range == Frequency_Range.f76to77) {
			return 76;
		} else {
			return 77;
		}
	};
	
	var maximum_velocity = function(maximum_velocity_kmph) {
	    //F59 =(E25*1000)/3600
		return maximum_velocity_kmph*1000/3600;  // in m/s
	};
	
	var velocity_resolution = function(velocity_resolution_kmph) {
	    //F60 =(E26*1000)/3600
		return velocity_resolution_kmph*1000/3600; // m/s
	};
	
	var idle_time = function(valid_sweep_bandwidth) {
	    //F61
	    if (valid_sweep_bandwidth <= 1000) {
			return 2;
		} else if (num_virtual_rx <= 2000) {
			return 5;
		} else if (num_virtual_rx <= 3000) {
			return 6;
		} else {
			return 7;
		}
	};
	
	var adc_valid_start_time =  function() {
	    //F62
		return 2.8;
	};
	
	var excess_ramping_time = function() {
	    //F63 
		return 1;
	};
	
	var periodicity = function(measurement_rate) {
	    //F64 =1/E27*1000
		return 1/measurement_rate*1000; // ms
	};
	
	var aux_comp_coeff_a = function(starting_frequency, valid_sweep_bandwidth) {
		//  auxiliary computation: quadratic equation coeff a
		//F68 =(F58*1000+K12/2)*1000000
		return (starting_frequency*1000+valid_sweep_bandwidth/2)*1000000;
	};
	
	var aux_comp_coeff_b = function(valid_sweep_bandwidth, adc_valid_start_time, starting_frequency, inter_chirp_time, lightSpeed, maximum_velocity, num_tx) {
		//  auxiliary computation: quadratic equation coeff b
		//F69 =(K12*F62+F58*1000*K13+K13*K12/2-F46/(4*F59*E10))
		return (valid_sweep_bandwidth*adc_valid_start_time +
           		starting_frequency*1000*inter_chirp_time + 
				inter_chirp_time*valid_sweep_bandwidth/2 -
				lightSpeed/(4*maximum_velocity*num_tx));
	};
	
	var aux_comp_T1 = function(ramp_slope) {
		//F71 =IF(K17<50;1;2.5)
		if (ramp_slope < 50) {
			return 1;
		} else {
			return 2.5;
		}
	};
	
	var aux_comp_T2 = function(sampling_frequency) {
		//F72 =ROUND(3-4.9*(1/(K24*1000))+36.5*(1/(K24*1000))*(1/(K24*1000));0.1)
		return MyUtil.toPrecision(
		    3-4.9*(1/(sampling_frequency))+36.5*(1/(sampling_frequency))*(1/(sampling_frequency)), 1);
	};
	
	var ambient_temperature = function(ambient_temperature_degC) {
	    //F75 =E22+273.15
		return ambient_temperature_degC + 273.15;
	};
	
	var noise_figure = function() {
	    //F76
		return 16;
	};
	
	var num_virtual_rx = function(num_rx, num_tx) {
	    //F77 =E9*E10
		return num_rx*num_tx;
	};
	
	var non_coherent_combining_loss = function(num_virtual_rx) {
		//F78 =IF(F77=8;3;IF(F77=4;2;(IF(F77=2;1;0))))
		// Math.log2(x)
		if (num_virtual_rx == 8) {
			return 3;
		} else if (num_virtual_rx == 4) {
			return 2;
		} else if (num_virtual_rx == 2) {
			return 1;
		} else {
			return 0;
		}		
	};
	
	var typical_detected_object_to_rcs = function(typical_detected_object) {
 		if (typical_detected_object == 'Truck')
 		    return 100;
 		if (typical_detected_object == 'Car')
 			return 5;
 		if (typical_detected_object == 'Motorcycle')
 			return 3.2;
 		if (typical_detected_object == 'Adult')
 			return 1;
 		if (typical_detected_object == 'Child')
 		    return 0.5;
 		return undefined;
	};
	var rcs_value = function(typical_detected_object) {
		//F80
		if (typical_detected_object && typeof(typical_detected_object) == 'string') {
		    var ans = typical_detected_object_to_rcs(typical_detected_object);
		    if (ans !== undefined) return ans;
		}
		var tmp = parseFloat(typical_detected_object);
		if (isNaN(tmp) === true) {
		    return 1;
		}
		return tmp;
	};
	
	var combined_factor_in_dB = function(tx_power, tx_gain, rx_gain, non_coherent_combining_loss,
	    detection_loss, system_loss, implementation_margin, detection_SNR, noise_figure) {
		//F82 =E19+E13+E14-F78-E32-E33-E34-E35-F76
		return tx_power+tx_gain+rx_gain-non_coherent_combining_loss-
			detection_loss-system_loss-implementation_margin-detection_SNR-noise_figure;
	};
	
	var combined_factor_linear = function(combined_factor_in_dB) {
	    //F83 =POWER(10,F82/10)
		return Math.pow(10, combined_factor_in_dB/10);
	};
	
    var max_range_for_typical_detectable_object = function(rcs_value, combined_factor_linear,
        lambda, num_virtual_rx, chirp_time, min_num_of_chirp_loops, cube_4pi, kB, ambient_temperature) {
        // K8 =SQRT(SQRT((0.001*F80*F83*K26*K26*F77*K14*K30)/(0.9*F48*F47*F75*1000000*1000000)))
        return Math.sqrt(Math.sqrt((0.001*rcs_value*combined_factor_linear*Math.pow(lambda,2)*num_virtual_rx*chirp_time*min_num_of_chirp_loops)/(0.9*cube_4pi*kB*ambient_temperature*1e12)))
    };
    
    var min_rcs_detectable_at_max_range = function(maximum_detectable_range, cube_4pi, kB,
        ambient_temperature, combined_factor_linear, lambda, num_virtual_rx, chirp_time, min_num_of_chirp_loops) {
        // K9 =(0.9*E23*E23*E23*E23*F48*F47*F75*1000000*1000000)/(0.001*F83*K26*K26*F77*K14*K30)
        return (0.9*Math.pow(maximum_detectable_range, 4)*
        cube_4pi*kB*ambient_temperature*1e12)/(0.001*combined_factor_linear*lambda*lambda*num_virtual_rx*chirp_time*min_num_of_chirp_loops);
    };
	
	var valid_sweep_bandwidth = function(lightSpeed, range_resolution) {
		//K12 =F46/(2*E24*0.01*1000000)
		return lightSpeed/(2*range_resolution*0.01*1000000);
	};
	
	var inter_chirp_time = function(idle_time, adc_valid_start_time, excess_ramping_time) {
		//K13 =F61+F62+F63
		return idle_time+adc_valid_start_time+excess_ramping_time;
	};
	
	var chirp_time = function(aux_comp_coeff_b, aux_comp_coeff_a) {
		//K14 =-1000000*F69/F68
		return -1000000*aux_comp_coeff_b/aux_comp_coeff_a;
	};
	
	var ramp_slope_init = function(valid_sweep_bandwidth, chirp_time) {
		//K15 =K12/K14
		return valid_sweep_bandwidth/chirp_time;
	};
	
	var ramp_slope_parameter = function(ramp_slope_init) {
		//K16 =ROUND(((K15*2^26*1000000)/(3600000000*900));1)
		//return MyUtil.toPrecision(((ramp_slope_init*(1<<26)*1000000)/(3600000000*900)), 1);
		// want ramp slope parameter to be integer
		return Math.round(((ramp_slope_init*(1<<26)*1000000)/(3600000000*900)) );
	};
	
	var ramp_slope = function(ramp_slope_parameter) {
		//K17 =(K16*3600000000*900)/(2^26*1000000)
		return (ramp_slope_parameter*3600000000*900)/((1<<26)*1000000);
	};
	
	var maximum_beat_frequency = function(ramp_slope, maximum_detectable_range, lightSpeed) {
		//K18 =2000000*K17*E23/F46
		return 2000000*ramp_slope*maximum_detectable_range/lightSpeed;
	};
	
	var sampling_frequency = function(maximum_beat_frequency) {
		//K19 =K18/0.9
		return Math.max(maximum_beat_frequency/0.9, 3);
	};
	
	var number_of_samples_per_chirp = function(chirp_time, sampling_frequency) {
		//K20 =CEILING((K14*K19),1)
		return Math.ceil(chirp_time*sampling_frequency);
	};
	
	var total_sweep_bandwidth = function(ramp_slope, adc_valid_start_time, number_of_samples_per_chirp, sampling_frequency, excess_ramping_time) {
	    //K21 =K17*(F62+K20/K19+F63)
	    return ramp_slope*(adc_valid_start_time+number_of_samples_per_chirp/sampling_frequency+excess_ramping_time);
	};
	
	var idle_time_minimum = function(total_sweep_bandwidth) {
	    //K22 =IF(K21 < 1000, 2, IF(K21 < 2000, 5, IF(K21< 3000, 6, 7)))
	    if (total_sweep_bandwidth < 1000) {
	        return 2;
	    } else if (total_sweep_bandwidth < 2000) {
	        return 5;
	    } else if (total_sweep_bandwidth < 3000) {
	        return 6;
	    } else {
	        return 7;
	    }
	};
	
	var ramp_end_time = function(adc_valid_start_time, number_of_samples_per_chirp, sampling_frequency, excess_ramping_time) {
	    //K23 =F62+K20/K19+F63
	    return adc_valid_start_time+number_of_samples_per_chirp/sampling_frequency+excess_ramping_time;
	};
	
	var carrier_frequency = function(starting_frequency, ramp_slope, adc_valid_start_time, number_of_samples_per_chirp, ramp_end_time) {
	    //K24 =(F58*1000+K17*F62+K20/(2*K23*1000))/1000
	    return (starting_frequency*1000+ramp_slope*adc_valid_start_time+number_of_samples_per_chirp/(2*ramp_end_time*1000))/1000;
	};
	
	var adc_valid_start_time_2 = function(aux_comp_T1, aux_comp_T2) {
	    //K25 =F71+F72
	    return aux_comp_T1+aux_comp_T2;
	};
	
	var lambda = function(lightSpeed, carrier_frequency) {
	    //K26 =(F46/K24)/1000000
	    return (lightSpeed/carrier_frequency)/1000000;
	};
	
	var max_chirp_repetition_period = function(lambda, maximum_velocity) {
	    //K27 =ROUND((1000*K26)/(4*F59),0.1)
	    return MyUtil.toPrecision((1000*lambda)/(4*maximum_velocity), 0);
	};
	
	var chirp_repetition_period = function(num_tx, idle_time, ramp_end_time) {
	    //K28 =ROUND(E10*(F61+K23),0.1)
	    return MyUtil.toPrecision(num_tx*(idle_time+ramp_end_time), 0);
	};
	
	var num_range_fft_bins = function(number_of_samples_per_chirp) {
	    //K29 =POWER(2,CEILING(LOG(K20,2),1))
	    return Math.pow(2,Math.ceil(Math.log2(number_of_samples_per_chirp)));
	};
	
	var min_num_of_chirp_loops = function(lightSpeed, carrier_frequency, chirp_repetition_period, velocity_resolution) {
	    //K30 =CEILING(F46/(2*K24*K28*F60*1000),1)
	    return Math.ceil(lightSpeed/(2*carrier_frequency*chirp_repetition_period*velocity_resolution*1000));
	};
	
	var num_doppler_fft_bins = function(min_num_of_chirp_loops) {
	    //K31 =POWER(2,CEILING(LOG(K30,2),1))
	    return Math.pow(2,Math.ceil(Math.log2(min_num_of_chirp_loops)));
	};
	
	var active_frame_time = function(min_num_of_chirp_loops, chirp_repetition_period) {
	    //K32 =K31*K28/1000
	    return min_num_of_chirp_loops*chirp_repetition_period/1000;
	};
	
	var range_inter_bin_resolution = function(range_resolution, number_of_samples_per_chirp, num_range_fft_bins) {
	    //K33 =E24*K20/K29
	    return range_resolution*number_of_samples_per_chirp/num_range_fft_bins;
	};
	
	var velocity_inter_bin_resolution = function(velocity_resolution, min_num_of_chirp_loops, num_doppler_fft_bins) {
	    //K34 =F60*K30/K31
	    return velocity_resolution*min_num_of_chirp_loops/num_doppler_fft_bins;
	};
	
	var radar_cube_size = function(num_range_fft_bins, min_num_of_chirp_loops, num_virtual_rx) {
	    //K35 =K29*K30*F77*4/1024
	    return num_range_fft_bins*min_num_of_chirp_loops*num_virtual_rx*4/1024;
	}
	
    var update_input = function(changes) {
        var Input = this.Input;
        var constants = this.constants;
        for (var k in changes) {
            if (changes.hasOwnProperty(k)) {
                Input[k] = changes[k];
            }
        }
        
		Input.maximum_radar_cube_size = maximum_radar_cube_size(Input.platform);
		
		Input.maximum_RF_bandwidth = maximum_RF_bandwidth(Input.platform);
		
		Input.maximum_sampling_frequency = maximum_sampling_frequency(Input.platform);
		
		Input.sensor_maximum_bandwidth = sensor_maximum_bandwidth(Input.frequency_range);
		
		Input.maximum_allowed_bandwidth = maximum_allowed_bandwidth(Input.maximum_bandwidth, Input.sensor_maximum_bandwidth);
		
		Input.starting_frequency = starting_frequency(Input.frequency_range);
		
		Input.maximum_velocity = maximum_velocity(Input.maximum_velocity_kmph);
		
		Input.velocity_resolution = velocity_resolution(Input.velocity_resolution_kmph);
		
		Input.valid_sweep_bandwidth = valid_sweep_bandwidth(constants.lightSpeed, Input.range_resolution);
		
		Input.idle_time = idle_time(Input.valid_sweep_bandwidth);
		
		Input.adc_valid_start_time = adc_valid_start_time();
		
		Input.excess_ramping_time = excess_ramping_time();
		
		Input.periodicity = periodicity(Input.measurement_rate);
		
		Input.ambient_temperature = ambient_temperature(Input.ambient_temperature_degC);
		
		Input.noise_figure = noise_figure();
		
		Input.num_virtual_rx = num_virtual_rx(Input.num_rx, Input.num_tx);
		
		Input.non_coherent_combining_loss = non_coherent_combining_loss(Input.num_virtual_rx);
		
		Input.rcs_value = rcs_value(Input.typical_detected_object);
		
		Input.combined_factor_in_dB = combined_factor_in_dB(
		  Input.tx_power, Input.tx_gain, Input.rx_gain, Input.non_coherent_combining_loss,
		  Input.detection_loss, Input.system_loss, Input.implementation_margin, Input.detection_SNR, Input.noise_figure);
		
		Input.combined_factor_linear = combined_factor_linear(Input.combined_factor_in_dB);
		
		Input.inter_chirp_time = inter_chirp_time(Input.idle_time, Input.adc_valid_start_time, Input.excess_ramping_time);
		
		Input.aux_comp_coeff_a = aux_comp_coeff_a(Input.starting_frequency, Input.valid_sweep_bandwidth);
		
		Input.aux_comp_coeff_b = aux_comp_coeff_b(Input.valid_sweep_bandwidth, Input.adc_valid_start_time,
		  Input.starting_frequency, Input.inter_chirp_time, constants.lightSpeed, Input.maximum_velocity, Input.num_tx);
		
		Input.chirp_time = chirp_time(Input.aux_comp_coeff_b, Input.aux_comp_coeff_a); 
		
		Input.ramp_slope_init = ramp_slope_init(Input.valid_sweep_bandwidth, Input.chirp_time);

		Input.ramp_slope_parameter = ramp_slope_parameter(Input.ramp_slope_init);
		
		Input.ramp_slope = ramp_slope(Input.ramp_slope_parameter);

		Input.aux_comp_T1 = aux_comp_T1(Input.ramp_slope);
		
		Input.maximum_beat_frequency = maximum_beat_frequency(Input.ramp_slope, Input.maximum_detectable_range, constants.lightSpeed);
		
		Input.sampling_frequency = sampling_frequency(Input.maximum_beat_frequency);
		
		Input.number_of_samples_per_chirp = number_of_samples_per_chirp(Input.chirp_time, Input.sampling_frequency);
		
		Input.total_sweep_bandwidth = total_sweep_bandwidth(Input.ramp_slope, Input.adc_valid_start_time, 
          Input.number_of_samples_per_chirp, Input.sampling_frequency, Input.excess_ramping_time);
		
		Input.idle_time_minimum = idle_time_minimum(Input.total_sweep_bandwidth);
        
        Input.ramp_end_time = ramp_end_time(Input.adc_valid_start_time, Input.number_of_samples_per_chirp, Input.sampling_frequency, Input.excess_ramping_time);
        
        Input.carrier_frequency = carrier_frequency(Input.starting_frequency, Input.ramp_slope, Input.adc_valid_start_time,
          Input.number_of_samples_per_chirp, Input.ramp_end_time);
        
		Input.aux_comp_T2 = aux_comp_T2(Input.sampling_frequency);
        
        Input.adc_valid_start_time_2 = adc_valid_start_time_2(Input.aux_comp_T1, Input.aux_comp_T2);
        
        Input.lambda = lambda(constants.lightSpeed, Input.carrier_frequency);
        
        Input.max_chirp_repetition_period = max_chirp_repetition_period(Input.lambda, Input.maximum_velocity);
        
        Input.chirp_repetition_period = chirp_repetition_period(Input.num_tx, Input.idle_time, Input.ramp_end_time);
        
        Input.num_range_fft_bins = num_range_fft_bins(Input.number_of_samples_per_chirp);
        
        Input.min_num_of_chirp_loops = min_num_of_chirp_loops(constants.lightSpeed, Input.carrier_frequency,
          Input.chirp_repetition_period, Input.velocity_resolution);
        
		Input.max_range_for_typical_detectable_object = max_range_for_typical_detectable_object(
		  Input.rcs_value, Input.combined_factor_linear, Input.lambda, Input.num_virtual_rx,
          Input.chirp_time, Input.min_num_of_chirp_loops, constants.cube_4pi, constants.kB, Input.ambient_temperature);
		  
		Input.min_rcs_detectable_at_max_range = min_rcs_detectable_at_max_range(
		  Input.maximum_detectable_range, constants.cube_4pi, constants.kB, Input.ambient_temperature,
          Input.combined_factor_linear, Input.lambda, Input.num_virtual_rx, Input.chirp_time, Input.min_num_of_chirp_loops);
          
        Input.num_doppler_fft_bins = num_doppler_fft_bins(Input.min_num_of_chirp_loops);
        
        Input.active_frame_time = active_frame_time(Input.min_num_of_chirp_loops, Input.chirp_repetition_period);
        
        Input.range_inter_bin_resolution = range_inter_bin_resolution(Input.range_resolution, Input.number_of_samples_per_chirp, Input.num_range_fft_bins);
        
        Input.velocity_inter_bin_resolution = velocity_inter_bin_resolution(Input.velocity_resolution, Input.min_num_of_chirp_loops, Input.num_doppler_fft_bins);
        
        Input.radar_cube_size = radar_cube_size(Input.num_range_fft_bins, Input.min_num_of_chirp_loops, Input.num_virtual_rx);
        
        var i = 0;
        
        while (Input.idle_time < Input.idle_time_minimum || Input.adc_valid_start_time != Input.adc_valid_start_time_2) {
            
            if (i > 10) {
                break;
            };
            
            console.log("Idle Time and ADC Start Time min search iteration #" + i);
            i++;
            
            console.log("Intermediate Valid ADC Start Time: " + Input.adc_valid_start_time);
            
            if (Input.idle_time < Input.idle_time_minimum) {
                Input.idle_time = Input.idle_time_minimum;
            };
            
            if (Input.adc_valid_start_time != Input.adc_valid_start_time_2) {
                Input.adc_valid_start_time = Input.adc_valid_start_time_2;
            };
            
            Input.maximum_radar_cube_size = maximum_radar_cube_size(Input.platform);
    		
    		Input.maximum_RF_bandwidth = maximum_RF_bandwidth(Input.platform);
    		
    		Input.maximum_sampling_frequency = maximum_sampling_frequency(Input.platform);
    		
    		Input.sensor_maximum_bandwidth = sensor_maximum_bandwidth(Input.frequency_range);
    		
    		Input.maximum_allowed_bandwidth = maximum_allowed_bandwidth(Input.maximum_bandwidth, Input.sensor_maximum_bandwidth);
    		
    		Input.starting_frequency = starting_frequency(Input.frequency_range);
    		
    		Input.maximum_velocity = maximum_velocity(Input.maximum_velocity_kmph);
    		
    		Input.velocity_resolution = velocity_resolution(Input.velocity_resolution_kmph);
    		
    		Input.valid_sweep_bandwidth = valid_sweep_bandwidth(constants.lightSpeed, Input.range_resolution);
    		
    		Input.excess_ramping_time = excess_ramping_time();
    		
    		Input.periodicity = periodicity(Input.measurement_rate);
    		
    		Input.ambient_temperature = ambient_temperature(Input.ambient_temperature_degC);
    		
    		Input.noise_figure = noise_figure();
    		
    		Input.num_virtual_rx = num_virtual_rx(Input.num_rx, Input.num_tx);
    		
    		Input.non_coherent_combining_loss = non_coherent_combining_loss(Input.num_virtual_rx);
    		
    		Input.rcs_value = rcs_value(Input.typical_detected_object);
    		
    		Input.combined_factor_in_dB = combined_factor_in_dB(
    		  Input.tx_power, Input.tx_gain, Input.rx_gain, Input.non_coherent_combining_loss,
    		  Input.detection_loss, Input.system_loss, Input.implementation_margin, Input.detection_SNR, Input.noise_figure);
    		
    		Input.combined_factor_linear = combined_factor_linear(Input.combined_factor_in_dB);
    		
    		Input.inter_chirp_time = inter_chirp_time(Input.idle_time, Input.adc_valid_start_time, Input.excess_ramping_time);
    		
    		Input.aux_comp_coeff_a = aux_comp_coeff_a(Input.starting_frequency, Input.valid_sweep_bandwidth);
    		
    		Input.aux_comp_coeff_b = aux_comp_coeff_b(Input.valid_sweep_bandwidth, Input.adc_valid_start_time,
    		  Input.starting_frequency, Input.inter_chirp_time, constants.lightSpeed, Input.maximum_velocity, Input.num_tx);
    		
    		Input.chirp_time = chirp_time(Input.aux_comp_coeff_b, Input.aux_comp_coeff_a); 
    		
    		Input.ramp_slope_init = ramp_slope_init(Input.valid_sweep_bandwidth, Input.chirp_time);
    
    		Input.ramp_slope_parameter = ramp_slope_parameter(Input.ramp_slope_init);
    		
    		Input.ramp_slope = ramp_slope(Input.ramp_slope_parameter);
    
    		Input.aux_comp_T1 = aux_comp_T1(Input.ramp_slope);
    		
    		Input.maximum_beat_frequency = maximum_beat_frequency(Input.ramp_slope, Input.maximum_detectable_range, constants.lightSpeed);
    		
    		Input.sampling_frequency = sampling_frequency(Input.maximum_beat_frequency);
    		
    		Input.number_of_samples_per_chirp = number_of_samples_per_chirp(Input.chirp_time, Input.sampling_frequency);
    		
    		Input.total_sweep_bandwidth = total_sweep_bandwidth(Input.ramp_slope, Input.adc_valid_start_time, 
              Input.number_of_samples_per_chirp, Input.sampling_frequency, Input.excess_ramping_time);
    		
    		Input.idle_time_minimum = idle_time_minimum(Input.total_sweep_bandwidth);
            
            Input.ramp_end_time = ramp_end_time(Input.adc_valid_start_time, Input.number_of_samples_per_chirp, Input.sampling_frequency, Input.excess_ramping_time);
            
            Input.carrier_frequency = carrier_frequency(Input.starting_frequency, Input.ramp_slope, Input.adc_valid_start_time,
              Input.number_of_samples_per_chirp, Input.ramp_end_time);
            
    		Input.aux_comp_T2 = aux_comp_T2(Input.sampling_frequency);
            
            Input.adc_valid_start_time_2 = adc_valid_start_time_2(Input.aux_comp_T1, Input.aux_comp_T2);
            
            Input.lambda = lambda(constants.lightSpeed, Input.carrier_frequency);
            
            Input.max_chirp_repetition_period = max_chirp_repetition_period(Input.lambda, Input.maximum_velocity);
            
            Input.chirp_repetition_period = chirp_repetition_period(Input.num_tx, Input.idle_time, Input.ramp_end_time);
            
            Input.num_range_fft_bins = num_range_fft_bins(Input.number_of_samples_per_chirp);
            
            Input.min_num_of_chirp_loops = min_num_of_chirp_loops(constants.lightSpeed, Input.carrier_frequency,
              Input.chirp_repetition_period, Input.velocity_resolution);
            
    		Input.max_range_for_typical_detectable_object = max_range_for_typical_detectable_object(
    		  Input.rcs_value, Input.combined_factor_linear, Input.lambda, Input.num_virtual_rx,
              Input.chirp_time, Input.min_num_of_chirp_loops, constants.cube_4pi, constants.kB, Input.ambient_temperature);
    		  
    		Input.min_rcs_detectable_at_max_range = min_rcs_detectable_at_max_range(
    		  Input.maximum_detectable_range, constants.cube_4pi, constants.kB, Input.ambient_temperature,
              Input.combined_factor_linear, Input.lambda, Input.num_virtual_rx, Input.chirp_time, Input.min_num_of_chirp_loops);
              
            Input.num_doppler_fft_bins = num_doppler_fft_bins(Input.min_num_of_chirp_loops);
            
            Input.active_frame_time = active_frame_time(Input.min_num_of_chirp_loops, Input.chirp_repetition_period);
            
            Input.range_inter_bin_resolution = range_inter_bin_resolution(Input.range_resolution, Input.number_of_samples_per_chirp, Input.num_range_fft_bins);
            
            Input.velocity_inter_bin_resolution = velocity_inter_bin_resolution(Input.velocity_resolution, Input.min_num_of_chirp_loops, Input.num_doppler_fft_bins);
            
            Input.radar_cube_size = radar_cube_size(Input.num_range_fft_bins, Input.min_num_of_chirp_loops, Input.num_virtual_rx);
        };
        
        console.log("Idle Time: " + Input.idle_time);
        console.log("Valid ADC Start Time: " + Input.adc_valid_start_time);
                
    };
    
    // we no longer need this mechanism to define default because we can use the default from app's json files
    var get_default1 = function() {
        var Input = this.Input;
        Input.platform = Platform.xWR16xx;
        Input.num_rx = 4;
        Input.num_tx = 1;
        
        Input.tx_gain = 8;
        Input.rx_gain = 8;
        
        Input.frequency_range = Frequency_Range.f77to81;
        Input.maximum_bandwidth = 4000;
        Input.tx_power = 12;
        
        Input.ambient_temperature_degC = 20;
        Input.maximum_detectable_range = 90;
        Input.range_resolution = 30 ;
        Input.maximum_velocity_kmph = 60;
        Input.velocity_resolution_kmph = 6;
        Input.measurement_rate = 10;
        //Input.typical_detected_object = 'Adult';
        Input.typical_detected_object = '50';
        
        Input.detection_loss = 2;
        Input.system_loss = 1;
        Input.implementation_margin = 2;
        Input.detection_SNR = 12;
    };

    var get_allowed_Rx = function(platform) {
		if (platform == Platform.xWR12xx) {
			return [1,2,3,4];
		} else if (platform == Platform.IWR14xx || platform == Platform.AWR14xx) {
			return [1,2,3,4];
		} else if (platform == Platform.xWR16xx) {
			return [1,2,3,4];
		} else {
			return [0];
		}
    };
    var get_allowed_Tx = function(platform) {
		if (platform == Platform.xWR12xx) {
			return [1,2,3];
		} else if (platform == Platform.IWR14xx || platform == Platform.AWR14xx) {
			return [1,2,3];
		} else if (platform == Platform.xWR16xx) {
			return [1,2];
		} else {
			return [0];
		}
    };
    
    // #Error 1: K12 (output valid sweep bandwidth) > F56 (maximum_allowed_bandwidth)
    // Error: The "Valid sweep bandwidth" is larger than the maximum allowed bandwidth
    // Tip: Increase the "Range Resolution" or increase the "Frequency Range" and "Maximum Bandwidth"
    var rule_valid_sweep_bandwidth = function(Input) {
        var ans = {};
        ans.props = ['valid_sweep_bandwidth', 'maximum_allowed_bandwidth', 
          'range_resolution', 'frequency_range', 'maximum_bandwidth'];
        if (Input.valid_sweep_bandwidth > Input.maximum_allowed_bandwidth) {
            ans.error = 'The "Valid sweep bandwidth" is larger than the maximum allowed bandwidth';
            ans.tips = 'Increase the "Range Resolution", increase the "Frequency Range", and/or increase the "Maximum Bandwidth"';
        }
        return ans;
    };
    
    // #Error 2: E18 (input maximum_bandwidth) > F55 (sensor maximum bandwidth MHz Bmax_sensor)
    // Error: The "Maximum Bandwidth" is larger than permitted by the "Frequency Range"
    // Tip: Reduce the "Maximum Bandwidth" or increase the "Frequency Range"
    var rule_maximum_bandwidth = function(Input) {
        var ans = {};
        ans.props = ['maximum_bandwidth', 'sensor_maximum_bandwidth', 'frequency_range'];
        if (Input.maximum_bandwidth > Input.sensor_maximum_bandwidth) {
            ans.error = 'The "Maximum Bandwidth" is larger than permitted by the "Frequency Range"';
            ans.tips = 'Reduce the "Maximum Bandwidth" and/or increase the "Frequency Range"';
        }
        return ans;
    };
    
    // #Error 3: K35 (output radar cube size) > F51 (maximum_radar_cube_size)
    // Error: The radar cube size is larger than available memory on device
    // Tip: Increase the "Range Resolution"/"Velocity Resolution" , decrease the
    //  "Maximum Range"/"Maximum Velocity", and/or reduce the "# of Rx Antennas"/
    //  "# of Tx Antennas"
    var rule_radar_cube_size = function(Input) {
        var ans = {};
        ans.props = ['radar_cube_size', 'maximum_radar_cube_size',
          'range_resolution', 'velocity_resolution', 'maximum_detectable_range', 'maximum_velocity',
          'num_rx', 'num_tx'];
        if (Input.radar_cube_size > Input.maximum_radar_cube_size) {
            ans.error = 'The radar cube size is larger than the available memory on the device';
            ans.tips = 'Increase the "Range Resolution"/"Velocity Resolution", ' +
              'decrease the "Maximum Range"/"Maximum Velocity", ' +
              'and/or reduce the "# of Rx Antennas"/"# of Tx Antennas"';
        }
        return ans;
    };
    
    // #Error 4: F64 "Periodicity" < 2* Tframe_active (2*K32, 2* output Active Frame time)
    // Error: Frame rate is too high for this chirp design
    // Tip: Decrease the frame rate, reduce max velocity or velocity resolution,
    //   reduce number of Tx Antennas
    var rule_periodicity = function(Input) {
        var ans = {};
        ans.props = ['periodicity', 'active_frame_time', 'measurement_rate', 
              'maximum_velocity', 'velocity_resolution', 'num_tx'];
        if (Input.periodicity < Input.active_frame_time) {
            ans.error = 'Frame rate is too high and causes higher than 100% duty cycle';
            ans.tips = 'Decrease the "Frame Rate", decrease the "Maximum Velocity", increase the "Velocity Resolution", and/or decrease the "# of Tx Antennas"';
        }
        
        if (Input.active_frame_time < 0.2) {
            console.log("Active frame too low.");
        }
        return ans;
    };
    
    // #Error 5: K17 output Ramp slope (MHz/us) > 100
    // Error: Ramp slope of this chirp design is too high
    // Tip: Make the range resolution coarser
    var rule_ramp_slope = function(Input) {
        var ans = {};
        ans.props = ['ramp_slope', 'range_resolution', 'maximum_velocity'];
        if (Input.ramp_slope > 100) {
            ans.error = 'Frequency slope of this chirp design is too high (>100MHz/us)';
            ans.tips = 'Increase the "Range Resolution" and/or decrease the "Maximum Velocity"';
        }
        return ans;
    };
    
    // #Error 6: Tr (K28 output Chirp Repetition period) > Tr,max (K27 output max chirp repetition period)
    // Error: Chirp time is too long
    // Tip: Coarser range resolution, reduce max velocity, reduce number of Tx Antennas,
    //  or increase sampling rate.
    var rule_chirp_repetition_period = function(Input) {
        var ans = {};
        ans.props = ['chirp_repetition_period', 'max_chirp_repetition_period', 'range_resolution',
          'maximum_velocity', 'num_tx']
        if (Input.chirp_repetition_period > Input.max_chirp_repetition_period) {
            ans.error = 'Chirp time is too long';
            ans.tips = 'Increase the "Range Resolution", decrease the "Maximum Velocity", and/or decrease the "# of Tx Antennas"';
        }
        return ans;
    };
    
    // #Error 7:
    var rule_sampling_frequency = function(Input) {
        var ans = {};
        ans.props = ['sampling_frequency', 'maximum_sampling_frequency', 'maximum_velocity', 'maximum_detectable_range', 'range_resolution']
        if (Input.sampling_frequency > Input.maximum_sampling_frequency) {
            ans.error = 'Sampling frequency is higher than the maximum sampling frequency (>' + Input.maximum_sampling_frequency + ' Msps)';
            ans.tips = 'Decrease the "Maximum Velocity", decrease the "Maximum Detectable Range", and/or increase the "Range Resolution"';
        }
        return ans;
    };
    
    // #Error 10:
    var rule_beat_frequency = function(Input) {
        var ans = {};
        ans.props = ['maximum_beat_frequency', 'maximum_RF_bandwidth', 'maximum_velocity', 'maximum_detectable_range', 'range_resolution']
        if (Input.sampling_frequency > Input.maximum_sampling_frequency) {
            ans.error = 'Beat frequency is higher than the maximum I/F frequency (>' + Input.maximum_RF_bandwidth + ' MHz)';
            ans.tips = 'Decrease the "Maximum Velocity", decrease the "Maximum Detectable Range", and/or increase the "Range Resolution"';
        }
        return ans;
    };

    // #Error 8: K21 (output total sweep bandwidth) > F56 (maximum_allowed_bandwidth)
    // Error: The "Total sweep bandwidth" is larger than the maximum allowed bandwidth
    // Tip: Increase the "Range Resolution" or increase the "Frequency Range" and "Maximum Bandwidth"
    var rule_total_sweep_bandwidth = function(Input) {
        var ans = {};
        ans.props = ['total_sweep_bandwidth', 'maximum_allowed_bandwidth', 
          'range_resolution', 'frequency_range', 'maximum_bandwidth'];
        if (Input.total_sweep_bandwidth > Input.maximum_allowed_bandwidth) {
            ans.error = 'The "Bandwidth" is larger than the "Maximum Bandwidth"';
            ans.tips = 'Increase the "Range Resolution", increase the "Frequency Range", and/or increase "Maximum Bandwidth"';
        }
        return ans;
    };

    // #Error 9:
    var rule_aux_comp_coeff_b = function(Input) {
        var ans = {};
        ans.props = ['aux_comp_coeff_b']
        /* TODO
        if (Input.aux_comp_coeff_b < 0) {
            ans.error = ' ';
            ans.tips = ' ';
        }
        */
        return ans;
    };

    var all_rules = [
      rule_maximum_bandwidth,
      rule_radar_cube_size,
      rule_periodicity,
      rule_ramp_slope,
      rule_chirp_repetition_period,
      rule_sampling_frequency,
      rule_beat_frequency,
      rule_total_sweep_bandwidth
    ];
    var check_rules = function() {
        // assume to check all rules
        var Input = this.Input;
        var ans = [];
        for (var idx=0; idx < all_rules.length; idx++) {
            ans.push(all_rules[idx](Input));
        }
        return ans;
    };
    
    mmWaveInput.prototype.init = init;
    mmWaveInput.prototype.update_input = update_input;
    mmWaveInput.prototype.get_default1 = get_default1;
    mmWaveInput.prototype.get_allowed_Rx = get_allowed_Rx;
    mmWaveInput.prototype.get_allowed_Tx = get_allowed_Tx;
    mmWaveInput.prototype.typical_detected_object_to_rcs = typical_detected_object_to_rcs
    mmWaveInput.prototype.check_rules = check_rules;
    mmWaveInput.prototype.Platform = Platform;

    // export as AMD/CommonJS module or global variable
    if (typeof define === 'function' && define.amd) define('mmWaveInput', function () { return mmWaveInput; });
    else if (typeof module !== 'undefined') module.exports = mmWaveInput;
    else if (typeof self !== 'undefined') self.mmWaveInput = mmWaveInput;
    else window.mmWaveInput = mmWaveInput;

})();
