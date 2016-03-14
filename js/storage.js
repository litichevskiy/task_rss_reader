(function( exports ){

	var storage = (function() {

		var storageLinks = {

			addLink : function( obj ) {
				var _storageLinks = JSON.parse(localStorage.getItem( '_storageLinks') );

				if ( !_storageLinks.hasOwnProperty( obj.name ) ) {
					_storageLinks[obj.name] = obj;

					localStorage.setItem('_storageLinks', JSON.stringify( _storageLinks) );
				}else console.log('name already exists');
			},

			deleteLink : function( obj ) {
				var _storageLinks = JSON.parse(localStorage.getItem( '_storageLinks') );

				if ( _storageLinks.hasOwnProperty( obj.name ) ) {

					delete _storageLinks[obj.name];
					localStorage.setItem('_storageLinks', JSON.stringify( _storageLinks) );
				}


			},

			listLinks : function() {
				var _storageLinks = JSON.parse(localStorage.getItem( '_storageLinks') ),
					list = [];

					for( var key in _storageLinks ) {
						list.push( _storageLinks[key] );
					}
				return list;
			},

			updateName : function ( obj ) {
				var _storageLinks = JSON.parse(localStorage.getItem( '_storageLinks') ),
					index;

				index = _storageLinks[obj.name];
				index.name = obj.newName
				index.quantity = obj.quantity;
				delete _storageLinks[obj.name];
				_storageLinks[obj.newName] = index;

				localStorage.setItem('_storageLinks', JSON.stringify( _storageLinks) );
			},

			init : function() {
				if ( localStorage.getItem('_storageLinks') ) {
                	console.log('_storageLinks exists');
                	return;
            	}

            	localStorage.setItem('_storageLinks', JSON.stringify({}));
            	console.log('_storageLinks inited');
			}
		}

		storageLinks.init();

		return {

			addLink : function( obj ) {
				storageLinks.addLink( obj );
			},

			deleteLink : function( obj ) {
				storageLinks.deleteLink( obj );
			},

			listLinks : function () {
				return storageLinks.listLinks();
			},

			updateName : function ( obj ) {
				storageLinks.updateName( obj );
			}
		}

	})();

	exports.storage = storage;

})( window );