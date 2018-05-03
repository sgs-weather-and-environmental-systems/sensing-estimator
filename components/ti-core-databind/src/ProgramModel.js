/*****************************************************************
 * Copyright (c) 2013-15 Texas Instruments and others
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

(function() // closure for private static methods and data.
{
	var PROGRAM_MODEL = "pm";
	var DS_REFRESH_INTERVAL = "$refresh_interval";
	var DS_TARGET_CONNECTED = "$target_connected";
	var ACTIVE_DEBUG_CONTEXT_NAME = "$active_context_name";
	
	gc.databind.ProgramModel = function() 
	{
	};
	
	gc.databind.ProgramModel.prototype = new gc.databind.AbstractBindFactory(PROGRAM_MODEL);
	
	gc.databind.ProgramModel.prototype.createNewBind = function(uri)
	{
		if( uri === DS_REFRESH_INTERVAL)
		{
			var refreshBinding = new gc.databind.RefreshIntervalBindValue();
			var activeDebugContext = this.getBinding(ACTIVE_DEBUG_CONTEXT_NAME);
			activeDebugContext.addChangedListener(
		    {
		        onValueChanged: function() 
			    {
		            //...[ clear out critical errors on every context change
		            var pm = gc.databind.registry.getModel('pm');
                    if (pm && pm.getAllBindings)
                    {
                        var bindings = pm.getAllBindings();
                        for(var bindName in bindings)
                        {
                            if (bindings.hasOwnProperty(bindName))
                            {
                                var bind = bindings[bindName];
                                if (bind.reportCriticalError)
                                {
                                    bind.reportCriticalError(null);
                                }
                            }
                        }
                    }
                    // ...]

		            refreshBinding.onRefresh();
			    } 
		    });
			return refreshBinding;
		}
		else if (uri === DS_TARGET_CONNECTED)
		{
			var binding = new gc.databind.VariableBindValue(false);
			gc.target.access.addTargetConnectedChangedListener(function(state)
			{
				binding.setValue(state);
			});
			return binding;
		}
		else if (uri === ACTIVE_DEBUG_CONTEXT_NAME)
		{
            return new gc.databind.VariableBindValue('');
		}
		
		if (!this._refreshIntervalProvider)
		{
			this._refreshIntervalProvider = this.getBinding(DS_REFRESH_INTERVAL);
		}

		return new gc.databind.internal.pm.DSEvalBind(uri, this._refreshIntervalProvider);
	};
	
	// register program model with bindingRegistry
	gc.databind.registry.registerModel(
			new gc.databind.QualifierBindFactoryWrapper(
			new gc.databind.StorageProviderBindFactoryWrapper(
			new gc.databind.ProgramModel())), true);
}());






