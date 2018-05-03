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
 
 var MyUtil;

(function() {
  "use strict";

  MyUtil = {

    toLabels: function(nums, p) {
        return nums.reduce(function(total,v,i,ary) {
            return i>0 ? total+','+(p?v.toFixed(p):v) : (p?v.toFixed(p):v)}, '');
    },
    sprintf: function(num, d) {
        // num is number, d is number of digits after decimal if num is not integer
        if (Number.isInteger(num)) return num;
        else if (typeof(num) == 'number') return num.toFixed(d);
        else return num;
    },
    toPrecision: function(x, p)  {
        return Number(x.toFixed(p));
    },
    toCeil: function(x, p) {
        return this.toPrecision(x + 0.5/Math.pow(10,p), p);
    },
    toFloor: function(x, p) {
        return this.toPrecision(x - 0.5/Math.pow(10,p), p);
    },
    
    min: function(items) {
        var found = items.length>0 ? items[0] : undefined;
        for (var idx=1; idx<items.length; idx++) {
            found = Math.min(items[idx], found);
        }
        return found;
    },
    max: function(items) {
        var found = items.length>0 ? items[0] : undefined;
        for (var idx=1; idx<items.length; idx++) {
            found = Math.max(items[idx], found);
        }
        return found;
    },

    httpGet: function(url, responseType, cb) {
        var req = new XMLHttpRequest();
        req.onreadystatechange = function () {
            if (req.readyState === 4){
                if (req.status == 200 || (req.status === 0 && !!req.response)){
                    cb(undefined, req.response);
                }  else {
                    cb(req.status, req);
                }
            }
        };
        if (responseType) {
            req.responseType = responseType;
        }
        req.open("GET", url, true);  // async request specified by 3rd param = true
        req.send();
    }
    
  };

  if(typeof module !== "undefined")
    module.exports = MyUtil;
})();

