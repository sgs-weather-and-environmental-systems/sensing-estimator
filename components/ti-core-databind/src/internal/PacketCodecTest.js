/*****************************************************************
 * Copyright (c) 2013-2014 Texas Instruments and others
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *  Paul Gingrich, Dobrin Alexiev - Initial API and implementation
 *****************************************************************/
var gc = gc || {};
gc.databind = gc.databind || {};
gc.databind.internal = gc.databind.internal || {};

(function() 
{
    var testCount = 0;
    var testExpression = "";
    
    var fail = function(message)
    {
        console.log("Failed test " + testCount + ' "' + testExpression + '" : ' + message);
    };
    
    var assertTrue = function(value)
    {
        if (value !== true)
        {
            fail("assertion failed. Expected true result but it was false instead.");
        }
    };
    
    var assertEquals = function(expected, actual)
    {
        assertTrue(actual.length === expected.length);
        
        for(var i = actual.length; i-- > 0; )
        {
            assertEquals(actual[i], expected[i]);
        }
    };

    var sink = function(data) 
    {
        this.data = data;
    };
    sink.prototype = new gc.databind.IPacketCodec();
    sink.prototype.decode = function(target, decodedResult)
    {
        if (decodedResult instanceof window.ArrayBuffer)
        {
            decodedResult = new window.Uint8Array(decodedResult);
        }
        assertEquals(this.data, decodedResult);
        return true;
    };
    sink.prototype.encode = function(target, encodedResult)
    {
        this.encodedResult = encodedResult;
    };
    
    var evaluate = function(codecName, data)
    {
        testCount++;
        testExpression = codecName;
        var dest = new sink(data);
        var codec = new gc.databind.internal.PacketCodec(codecName, dest);
        
        try
        {
            codec.encoder(data);
            var results = dest.encodedResult;
            if (typeof results === 'string') 
            {
                var newResults = [];
                for(var i = 0; i < results.length; i++)
                {
                    newResults.push(results.charCodeAt(i));
                }
                results = newResults;
            }
            assertTrue(codec.decoder(results));
        }
        catch(e)
        {
            fail(e.toString());
        }
    };
    
    var PacketCodecTest = function()
    {
    }; 
    
    PacketCodecTest.prototype.test = function() 
    {
        var data = [];
        for(var i = 256; i-- > 0; )
        {
            data.push(i);
        }
        
        evaluate('base64', data);
        evaluate('base64+CR', data);
        
        evaluate('raw', data);
        
        data = { data: data };
        
        evaluate('JSon', data);
        evaluate('json+cr', data);
    };

    return new PacketCodecTest();
    
}().test());