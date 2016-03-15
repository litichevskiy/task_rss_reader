(function( exports ) {

	const
		ITEM_MESSAGE = 'itemMessage',
		TIILE = 'title',
		DATE = 'date',
		DISPLAY = 'displayNone',
		GET_DATE = /.+?:\d\d/gi;

	var titleChannel = document.querySelector('.titleChannel'),
		close = document.querySelector('.close');

		close.addEventListener('click', clearList );

	var theBlock;

	function BlockListMessage( o ) {

		if ( theBlock ) {
			return theBlock;
		}
		theBlock = this;

		this.block = o.container;
		this.list  = o.list;
		this.pubsub = o.pubsub;

		this.list.addEventListener( 'click', publishNews );
	};

	function publishNews ( event ) {
		var target = event.target, id, news;

		if ( target.tagName === 'DIV' ) {
			id = target.parentElement.dataset.id;
			news = storagePreview.getNews( id );

			theBlock.pubsub.publish( 'showPreview', news );
		}
	};

	var storagePreview = (function(){
		var storage = {};

		return {
			setNews : function ( obj, id ) {
				storage[id] = obj;
			},

			getNews : function ( id ) {
				if ( storage.hasOwnProperty( id ) ) {

					return storage[id];
				}
			},

			clearStorage : function () {
				storage = {};
			}
		}

	})();

	BlockListMessage.prototype.updateList = function( list ) {
		var html = '';

		clearList();
		storagePreview.clearStorage();
		titleChannel.innerHTML = list[1].title;
		hideShowElem( DISPLAY );

		list[0].forEach(function( count, item ) {

			html = theBlock.createLink( count, item );
			theBlock.list.appendChild(html);

			storagePreview.setNews( count, item );
		});

	};

	BlockListMessage.prototype.createLink = function( obj, count ) {
		var li, div, spanDate;

		li = document.createElement('li');
		li.className = ITEM_MESSAGE;
		li.dataset.id = count;
		div = document.createElement('div');
		div.className = TIILE;
		div.innerHTML = obj.title;
		spanDate = document.createElement('span');
		spanDate.className = DATE;
		spanDate.innerHTML = dateParse( obj.publishedDate );
		li.appendChild( div );
		li.appendChild( spanDate );
		return li;
	};

	function dateParse( string ) {
		var date = string.match( GET_DATE );
		return date[0];
	};

	function clearList( event ) {
		theBlock.list.innerHTML = '';
		titleChannel.innerHTML = '';

		theBlock.pubsub.publish( 'clear' );

		if ( event === undefined )  return;
		else hideShowElem();
	};

	function hideShowElem ( className ) {

		if ( !className ) {
			close.classList.add( DISPLAY );
		}

		close.classList.remove( className );
	};

	exports.BlockListMessage = BlockListMessage;

})( window );