L.Control.BackButton = L.Control.extend({
	_map: null,
    _backButton: null,
    _state: {
        backDisabled: null,
        history: {
            items: []
        },
    },
	options: {
		position: 'topleft',
		backImage: 'fa-solid fa-arrow-left',
		backTooltip: 'Backward'
	},
	initialize: function(options) {
            L.Util.setOptions(this, options);
    },
	onAdd: function (map) {
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        this._backButton = this._createButton(container);
        this._updateState();
        return container;
	},
	onRemove: function(map) {
	},
	_createButton: function (container) {
        var imageClass = this.options["backImage"];
        var tooltip = this.options["backTooltip"];
        var button = L.DomUtil.create('a', 'leaflet-control-back', container);
        button.innerHTML = '<i class="' + imageClass + '"></i>';
        button.href = '#';
        button.title = tooltip;

        var stop = L.DomEvent.stopPropagation;
        L.DomEvent
            .on(button, 'click', stop)
            .on(button, 'mousedown', stop)
            .on(button, 'dblclick', stop)
            .on(button, 'click', L.DomEvent.preventDefault)
            .on(button, 'click', this.goBack, this)
            .on(button, 'click', this._refocusOnMap, this);

        return button;
    },
    _updateState: function () {
        var isBackDisabled = (this._state.history.items.length === 0);
        if(isBackDisabled !== this._state.backDisabled) {
            this._state.backDisabled = isBackDisabled;
            //this._map.fire('historyback' + (backDisabled ? 'disabled' : 'enabled'));
        }
        this._setButtonState(isBackDisabled);
    },
    _setButtonState: function(condition) {
        var className = 'leaflet-disabled';
        if(condition) {
            L.DomUtil.addClass(this._backButton, className);
        }
        else {
            L.DomUtil.removeClass(this._backButton, className);
        }
    },
    /* GENERIC STACK FUNCTIONS */
    _pop: function() {
        var stack = this._state.history.items;
        if(L.Util.isArray(stack) && stack.length > 0) {
        	var debut = stack.length - 1;
        	var nbASupprimer = 1;
        	var itemsSupprimes = stack.splice(debut,nbASupprimer);
            return itemsSupprimes[0];
        }
        return undefined;
    },
    _push: function(value) {
        var maxLength = 2;
        var stack = this._state.history.items;
        if(L.Util.isArray(stack)) {
            stack.push(value);
            // depassement => rotation de la pile
            if(maxLength > 0 && stack.length > maxLength) {
                stack.splice(0, 1);
            }
        }
    },
    _popStackAndUseLocation : function() {
        //check if we can pop
    	var stack = this._state.history.items;
        if(L.Util.isArray(stack) && stack.length > 0) {
            //get most recent
            var previous =  this._pop(stack);
            this._map.setView(previous.center, previous.zoom);
            return previous
        }
    },
    _pushLocationAndLayersStack : function(center, zoom, removedLayer, addedLayer) {
    	var stack = this._state.history.items;
    	this._push({center, zoom, removedLayer, addedLayer});
    },
    goBack: function() {
    	var oldstate = this._popStackAndUseLocation();
    	oldstate.addedLayer.remove();
		oldstate.removedLayer.addTo(this._map);
		this._updateState();
    	return oldstate;
    },
    goForward: function(removedLayer, addedLayer) {
    	var zoom = this._map.getZoom();
    	var center = this._map.getCenter();
    	this._pushLocationAndLayersStack(center, zoom, removedLayer, addedLayer);
    	this._updateState();
    },
});