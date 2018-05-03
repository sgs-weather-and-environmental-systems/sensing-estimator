/*******************************************************************************
 * Copyright (c) 2015 Texas Instruments and others All rights reserved. This
 * program and the accompanying materials are made available under the terms of
 * the Eclipse Public License v1.0 which accompanies this distribution, and is
 * available at http://www.eclipse.org/legal/epl-v10.html
 * 
 * Contributors: Gingrich, Paul - Initial API and implementation
 ******************************************************************************/
var gc = gc || {};
gc.databind = gc.databind || {};

(function() // closure for private static methods and data.
{
    var i2cService = new gc.databind.IRegisterModelAdapter();
    var i2cServiceFireReady;
    var i2cServiceReady = Q.promise(function(resolve)
    {
        i2cServiceFireReady = resolve;
    });

    var I2CRegisterOptionsBind = function(regName, fieldName)
    {
        gc.databind.VariableLookupBindValue.call(this);
        this.setStale(true);

        var that = this;
        i2cServiceReady.then(function(i2cService)
        {
            that.init(i2cService.findRegister(regName, fieldName));
        });
    };

    I2CRegisterOptionsBind.prototype = new gc.databind.VariableLookupBindValue('array');

    I2CRegisterOptionsBind.prototype.init = function(register)
    {
        this.reg = register;
        if (register)
        {
            this.setData(i2cService.getOptions(register));
            this.setStale(false);
        }
        else
        {
            this.setStatus(gc.databind.AbstractStatus.createErrorStatus('Register "' + this.getName() + '" is not defined.'));
        }
    };

    var I2CRegisterBind = function(regName, fieldName, bit)
    {
        gc.databind.AbstractBindValue.call(this);
        this.setStale(true);

        var that = this;
        i2cServiceReady.then(function(i2cService)
        {
            that.init(i2cService.findRegister(regName, fieldName, bit));
        });
    };

    I2CRegisterBind.prototype = new gc.databind.AbstractBindValue('number');

    I2CRegisterBind.prototype.init = function(register)
    {
        this.reg = register;
        if (register)
        {
            if (this.hasChangedListeners())
            {
                this.onFirstValueChangedListenerAdded(); // call this again,
                // now that this.reg
                // is defined.
            }
            this.registerChangedHandler();
            this.setStale(false);
        }
        else
        {
            this.setStatus(gc.databind.AbstractStatus.createErrorStatus('Register "' + this.getName() + '" is not defined.'));
        }
    };

    I2CRegisterBind.prototype.onValueChanged = function(oldValue, newValue)
    {
        if (this.reg)
        {
            i2cService.setValue(this.reg, newValue);
        }
    };

    I2CRegisterBind.prototype.registerChangedHandler = function()
    {
        if (this.reg)
        {
            this.updateValue(i2cService.getValue(this.reg));
        }
    };

    I2CRegisterBind.prototype.onFirstValueChangedListenerAdded = function()
    {
        if (this.reg)
        {
            this._registerChangedListener = this._registerChangedListener || this.registerChangedHandler.bind(this);
            i2cService.addRegisterChangedListener(this.reg, this._registerChangedListener);
            this.registerChangedHandler(); // kick start read operation again.
        }
    };

    I2CRegisterBind.prototype.onLastValueChangedListenerRemoved = function()
    {
        if (this.reg)
        {
            i2cService.removeRegisterChangedListener(this.reg, this._registerChangedListener);
        }
    };

    var I2C_MODEL = "i2c";

    var I2CRegisterModel = function()
    {
        gc.databind.AbstractBindFactory.call(this);

        this._targetConnectedBind = new gc.databind.VariableBindValue(false, true);
    };

    I2CRegisterModel.prototype = new gc.databind.AbstractBindFactory(I2C_MODEL);

    I2CRegisterModel.prototype.createNewBind = function(name)
    {
        if (name.indexOf('$') === 0)
        {
            if (name === "$target_connected")
            {
                return this._targetConnectedBind;
            }
        }

        var fields = name.split('.');
        var reg;
        if (fields.length > 2)
        {
            if (fields[2] === '$labels')
            {
                return new I2CRegisterOptionsBind(fields[0], fields[1]);
            }
            else
            {
                console.log('I2CRegister binding ' + name + ' has too many dot separators.');
            }
        }
        else if (fields.length > 1)
        {
            return new I2CRegisterBind(fields[0], fields[1]);
        }
        else
        {
            return new I2CRegisterBind(name);
        }
        return null;
    };

    I2CRegisterModel.prototype.setConnectedState = function(newState)
    {
        this._targetConnectedBind.updateValue(newState);
    };

    var i2cRegisterModelInstance = new I2CRegisterModel();

    // register program model with bindingRegistry
    gc.databind.registry.registerModel(new gc.databind.StorageProviderBindFactoryWrapper(i2cRegisterModelInstance), true);

    gc.databind.I2CRegisterModel =
    {
        connect : function()
        {
            i2cRegisterModelInstance.setConnectedState(true);
        },
        disconnect : function()
        {
            i2cRegisterModelInstance.setConnectedState(false);
        },
        setI2CServiceInstance : function(i2cServiceInstance)
        {
            i2cService = i2cServiceInstance;
            if (i2cServiceFireReady)
            {
                i2cServiceFireReady(i2cService);
                i2cServiceFireReady = undefined;
            }
        }
    };
}());