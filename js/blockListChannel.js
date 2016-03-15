(function( exports ){

	const
		USER_MESSAGE = 'incorrect link',
		CURRENTCHANNEL = 'currentChannel',
		CHANNEL = 'channel',
		NO_NAME = 'must be the channel name',
		NAME_ALREADY_EXISTS = 'name already exists',
		DELETE_CHANNEL = 'deleteChannel',
		CHECK_LINK = 'check link',
		EDIT_NAME = 'editName'
		KEYDOWN_ENTER = 13,
		EDIT = false,
		TIMER = 3000;

	var inputLink = document.querySelector('[data-role="linkToTheChannel"]'),
		saveChannel = document.querySelector('[data-role="saveChannel"]'),
		nameChannel = document.querySelector('[data-role="nameChannel"]'),
		textInfo = document.querySelector('.textInfo'),
		edit = document.querySelector('[data-role="edit"]'),
		inputRename = document.querySelector('[data-role="reNameChannel"]'),
		saveNewName = document.querySelector('[data-role="saveNewName"]');

	var theBlock;

	google.load( 'feeds', '1' );
	saveChannel.addEventListener( 'click', checkLink );
	document.addEventListener('click', getNewName );


	function BlockChannels( o ) {

		if ( theBlock ) {
			return theBlock;
		}
		theBlock = this;

		this.block = o.container;
		this.list  = o.list;
		this.pubsub = o.pubsub;

		this.block.addEventListener('keydown', checkKey );
		this.list.addEventListener('click', checkClick );

	};

	BlockChannels.prototype.allNamesChannel = (function() {
		var allName = [];

		return{
			setName : function( name ) {
				allName.push( name );
			},

			getName : function ( name ) {
				var result = allName.indexOf( name );
				return result;
			},

			deleteName : function ( name ) {
				var index = this.getName( name );
				allName.splice( index, 1 );
			}
		}

	})();


	BlockChannels.prototype.addLinkInList = function( name ) {
		var newChannel = '';

		if ( name.length === 0 ) return;

		name.forEach(function(item) {

			newChannel = theBlock.createLink( item );
			theBlock.list.appendChild( newChannel );
		});

	};

	function getNewName( event ) {
		if ( event.target !== saveNewName ) return;

		newName = inputRename.value;
		theBlock.updateName( newName );
		edit.style.top = '-5em';
		clearInput( [inputRename] );
	}

	function checkKey ( event ) {
		if( event.keyCode === KEYDOWN_ENTER && EDIT === false ) return checkLink();
		if( event.keyCode === KEYDOWN_ENTER && EDIT === true ) return saveNewName.click();
	}

	BlockChannels.prototype.createLink = function ( obj ) {
		var li, div, spanDelete, spanEdit;

	 	li = document.createElement('li');
	 	li.className = CURRENTCHANNEL;
	 	li.dataset.name = obj.name;
	 	li.dataset.link = obj.link;
	 	li.dataset.quantity = obj.quantity;
		div = document.createElement('div');
		div.className = CHANNEL;
		div.innerHTML = obj.name;
		spanDelete = document.createElement('span');
		spanDelete.className = DELETE_CHANNEL;
		spanEdit = document.createElement('span');
		spanEdit.className = EDIT_NAME;
		spanEdit.innerHTML = 'edit';
		spanDelete.innerHTML = 'delete';
		li.appendChild( spanDelete );
		li.appendChild( spanEdit );
		li.appendChild( div );
		return li;
	};

	BlockChannels.prototype.removeteLink = function( target ) {
		theBlock.pubsub.publish( 'deleteLink', {
			name : target.parentElement.dataset.name,
			link : target.parentElement.dataset.link
		})

		theBlock.allNamesChannel.deleteName( target.parentElement.dataset.name );
		theBlock.list.removeChild( target.parentElement );
	};


	BlockChannels.prototype.updateName = (function( ) {
		var parentTarget, childrenTarget, _quantity, name;

		return function ( target ) {

			if ( typeof target !== 'string' ){
				parentTarget = target.parentElement;
				childrenTarget = parentTarget.querySelector('.channel');
				return;
			}

			if ( target === '' ) return;

			name = inputRename.value;
			_quantity = document.querySelector('input:checked').dataset.quantity;

			if ( name ==! parentTarget.dataset.name ||
				_quantity !== parentTarget.dataset.quantity ) {

				theBlock.pubsub.publish( 'updateName', {
					name 	 : parentTarget.dataset.name,
					newName  : target,
					quantity : _quantity
				});

				theBlock.allNamesChannel.deleteName( parentTarget.dataset.name );
				theBlock.allNamesChannel.setName( target );
				parentTarget.dataset.name = target;
				parentTarget.dataset.quantity = _quantity;
				childrenTarget.innerHTML = target;
				EDIT = false;
			}
		};

	})();


	function checkLink( ) {
		var link = inputLink.value,
			name = nameChannel.value,
			checkName, _quantity;

		if ( !name ) return userInfo( NO_NAME );

		checkName = theBlock.allNamesChannel.getName( name );

		if ( checkName  !== -1 ) return userInfo( NAME_ALREADY_EXISTS );

		theBlock.allNamesChannel.setName( name );

		getNews(link)
		.then(function(response){

			_quantity = document.querySelector('input:checked').dataset.quantity;
			theBlock.addLinkInList([{
				name : name,
				link : link,
				quantity : Number( _quantity )
			}]);
			theBlock.pubsub.publish('newLink', {
				name : name,
				link : link,
				quantity : Number( _quantity )
			});
			clearInput( [inputLink, nameChannel] );
		})
		.catch(function(error){

			clearInput( [inputLink] );
			userInfo();
		})
	};

	function checkClick( event ) {
		var target = event.target,
		link, quantity;

		if ( target.classList.contains( DELETE_CHANNEL ) ) {
			theBlock.removeteLink( target );
			return;
		}

		if ( target.classList.contains( EDIT_NAME ) ) {
			edit.style.top = '0';
			inputRename.focus();
			inputRename.value = target.parentElement.dataset.name;
			theBlock.updateName( target )
			EDIT = true;
			return;
		}

		if ( target.classList.contains( CHANNEL ) ) {
			link = target.parentElement.dataset.link;
			quantity = target.parentElement.dataset.quantity;

			getNews( link, quantity )
			.then(function(response){

				theBlock.pubsub.publish( 'listNews', response );
			})
			.catch(function(error){
				console.log( error )
			})
			return;
		}
	};


	function userInfo( text ){
		textInfo.innerHTML = text || USER_MESSAGE;
		setTimeout(function(){
			textInfo.innerHTML = '';
		}, TIMER);
	};


	function getNews( link, quantity ) {

		return new Promise(function(resolve, reject){
			var feed = new google.feeds.Feed(link),
				news = [];
				if ( !quantity ) quantity = 1;

      		feed.setNumEntries( quantity );

      		feed.load(function(result) {

        		if (!result.error) {

          				news.push(result.feed.entries);
          				news.push(result.feed);

          			resolve(news);
        		}
        		else reject( CHECK_LINK );
      		})
		})
	};

	function clearInput( inputs ){
		inputs.forEach(function(item){
			item.value = '';
		});
	};


	exports.BlockChannels = BlockChannels;

})( window );