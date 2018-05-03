/*****************************************************************
 * Copyright (c) 2016 Texas Instruments and others
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *  Paul Gingrich - Initial API and implementation
 *****************************************************************/
var gc = gc || {};
gc.databind = gc.databind || {};
gc.databind.internal = gc.databind.internal || {};

(function() 
{
    var codecAliases = {};
    
    gc.databind.internal.PacketCodec = function(codecName, targetCodec)
    {
        codecName = codecAliases[codecName] || codecName;
        var codecs = codecName.toLowerCase().split('+');
        this.decoder = targetCodec && targetCodec.decode.bind(targetCodec, null);
        this.encoder = targetCodec && targetCodec.encode.bind(targetCodec, null);
        
        for(var i = 0; i < codecs.length; i++ )
        {
            var codec = codecs[i];
            codec = gc.databind.internal.CodecFactory.create(codec);
            if (codec)
            {
                this.decoder = codec.decode.bind(codec, this.decoder);
            }
            codecs[i] = codec;
        }
        for(i = codecs.length; i-- > 0; )
        {
            if (codecs[i])
            {
                this.encoder = codecs[i].encode.bind(codecs[i], this.encoder);
            }
        }
    };
    
    gc.databind.internal.PacketCodec.prototype = new gc.databind.IPacketCodec();
    
    var codecRegistry = {};

    gc.databind.registerCustomCodec = function(name, constructor, baseCodecs)
    {
        name = name.toLowerCase();
        codecRegistry[name] = constructor;
        if (baseCodecs)
        {
            codecAliases[name] = name + '+' + baseCodecs;
        }
    };

    gc.databind.internal.CodecFactory = 
    {
        create: function(PacketCodec)
        {
            if (typeof PacketCodec === 'string')
            {
                PacketCodec = codecRegistry[PacketCodec.toLowerCase()];
            }
            return PacketCodec && new PacketCodec();
        }
    };
}());

