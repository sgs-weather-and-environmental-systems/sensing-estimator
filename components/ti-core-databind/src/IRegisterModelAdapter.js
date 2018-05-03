/*****************************************************************
 * Copyright (c) 2015 Texas Instruments and others
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

/**
 * This interface provides the adapter API for the generic I2CRegisterModel.  Clients like IPG-UI need 
 * to implement this API to adapt the generic I2C model to use the their own internal models.
 * 
 *  @interface
 */
gc.databind.IRegisterModelAdapter = function()
{
};

/**
 * Retrieve the value of a given register.
 * 
 * @param reg {object} register object returned by {@link gc.databind.IRegisterModelAdapter#findRegister}
 * @returns {boolean|number|string|object} The value of the register
 */
gc.databind.IRegisterModelAdapter.prototype.getValue = function(reg)
{
};

/**
 * Set the value of a given register.
 * 
 * @param reg {object} register object returned by {@link gc.databind.IRegisterModelAdapter#findRegister}
 * @param newValue {boolean|number|string|object} new value to write to the register
 */
gc.databind.IRegisterModelAdapter.prototype.setValue = function(reg, newValue)
{
};

/**
 * Add a valued change listener for a particular register.  This listener must be called
 * whenever the register changed, but it's acceptable to be called when the register has not
 * changed too.
 * 
 * @param reg {object} register object returned by {@link gc.databind.IRegisterModelAdapter#findRegister}
 * @param listener {function} listener to be called when the register may have changed.
 */
gc.databind.IRegisterModelAdapter.prototype.addRegisterChangedListener = function(reg, listener)
{
};

/**
 * Remove a valued change listener for a particular register previously added with addRegisterChangedListener.
 * 
 * @param reg {object} register object returned by {@link gc.databind.IRegisterModelAdapter#findRegister}
 * @param listener {function} listener to be no longer be called when the specified register has changed.
 */
gc.databind.IRegisterModelAdapter.prototype.removeRegisterChangedListener = function(reg, listener)
{
};

/**
 * Retrieve a register object for a entire register or a register field (sometimes refered to as a register group).  
 * There is no restriction that a register field or group cannot span multiple registers.  If that is the case, 
 * it would be expected that the field could be retrieved through any of the registers it spans.  
 * The register object received is only used as a reference in other API's in this interface.  
 * There is no expectation that the register object contains
 * any data or methods.    
 * 
 * @param regName {String} register identifier
 * @param fieldName {String} field identifier within the register.  Sometimes call a register group.
 * @returns {object} register object used as a reference
 */
gc.databind.IRegisterModelAdapter.prototype.findRegister = function(regName, fieldName)
{
};

/**
 * Retrieve a list of options strings representing register values for a given register.  
 * Sometimes registers, or register fields/groups represents an enumeration.  In this case,
 * this API is used to retrieve all possible enumerations with a user readable text string defining each one.
 * This API is called when the user binds to a register's .$labels attribute.  In this case, the binding is
 * not to the register value, but the list of enumerated values.  If the register fields was a single bit, 
 * this method could return an array containing the strings "true" and "false" or "on" and "off" for example.
 * 
 * @param reg {object} register object returned by {@link gc.databind.IRegisterModelAdapter#findRegister}
 * @returns {String[]} list of string values for each enumeration.
 */
gc.databind.IRegisterModelAdapter.prototype.getOptions = function(reg)
{
};

