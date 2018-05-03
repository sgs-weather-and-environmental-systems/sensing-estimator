/*****************************************************************
 * Copyright (c) 2017 Texas Instruments and others
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
gc.databind.internal.expressionParser = gc.databind.internal.expressionParser || {};

(function()
{
	gc.databind.internal.expressionParser.QFunctionOperator = function()
	{
		gc.databind.internal.expressionParser.AbstractBinaryOperator.call(this);
	};
	
	gc.databind.internal.expressionParser.QFunctionOperator.prototype = new gc.databind.internal.expressionParser.AbstractBinaryOperator('Q()');
	
    gc.databind.internal.expressionParser.QFunctionOperator.factory = (function()
    {
        var Factory = function()
        {
        };
        
        Factory.prototype = new gc.databind.internal.expressionParser.AbstractBinaryOperator.Factory(',');

        Factory.prototype.parse = function(uri, factory, precedence)
        {
            var pos = factory.findFirstIndexOf(uri, ',');
            if (pos <= 0 || pos >= uri.length-1 || pos !== factory.findLastIndexOf(uri, ','))
            {
                throw "Invalid number of paramters for Q() function.  The Q() function requires two and only two parameters separated by a single comma."; 
            }
            
            var operandText = uri.substring(0, pos);
            var leftOperand = factory.parseExpression(operandText, precedence);
            operandText = uri.substring(pos + this.operator.length); 
            var rightOperand = factory.parseExpression(operandText, precedence);
            
            var result = this.createOperator();
            result.leftOperand = leftOperand;
            result.rightOperand = rightOperand;
            return result;
        };
        
        Factory.prototype.createOperator = function()
        {
            return new gc.databind.internal.expressionParser.QFunctionOperator();
        };
        
        return new Factory();
    }());

	gc.databind.internal.expressionParser.AbstractBinaryOperator.prototype.getType = function()
	{
		return "number";
	};
	
	gc.databind.internal.expressionParser.QFunctionOperator.prototype.getValue = function()
	{
		var value = +this.leftOperand.getValue();
		var q = +this.rightOperand.getValue();
		
		if (isNaN(value))
		{
			return value;
		}
		if (isNaN(q))
		{
			return q;
		}
		
		return value / (Math.pow(2, q));
	};
	
	gc.databind.internal.expressionParser.QFunctionOperator.prototype.setValue = function(newValue, progress)
	{
		newValue = +newValue;
		var q = +this.rightOperand.getValue();
		
		if (isNaN(q))
		{
			newValue = q;
		}
		else if (!isNaN(newValue))
		{
			newValue = Math.round(newValue * Math.pow(2, q));
		}
		this.leftOperand.setValue(newValue, progress);
	};
	
	gc.databind.internal.expressionParser.QFunctionOperator.prototype.toString = function()
	{
	    return 'Q(' + this.leftOperand.toString() + ', ' + this.rightOperand.toString() + ')';
	};


}());