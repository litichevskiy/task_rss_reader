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
		if( event.keyCode === KEYDOWN_ENTER ) return checkLink();
	}

	BlockChannels.prototype.createLink = function ( obj ) {
		var li, div, spanDelete, spanEdit;

	 	li = document.createElement('li');
	 	li.className = CURRENTCHANNEL;
	 	li.dataset.name = obj.name;
	 	li.dataset.link = obj.link;
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
		var parentTarget, childrenTarget;

		return function ( target ) {

			if ( typeof target !== 'string' ){
				parentTarget = target.parentElement;
				childrenTarget = parentTarget.querySelector('.channel'); //CHANNEL
				return;
			}

			if ( target === '' || target === parentTarget.dataset.name ) return;

			theBlock.pubsub.publish( 'updateName', {
				name 	: parentTarget.dataset.name,
				newName : target
			});
			theBlock.allNamesChannel.deleteName( parentTarget.dataset.name );
			theBlock.allNamesChannel.setName( target );
			parentTarget.dataset.name = target;
			childrenTarget.innerHTML = target;
		};

	})();


	function checkLink( ) {
		var link = inputLink.value,
			name = nameChannel.value,
			checkName;

		if ( !name ) return userInfo( NO_NAME );

		checkName = theBlock.allNamesChannel.getName( name );

		if ( checkName  !== -1 ) return userInfo( NAME_ALREADY_EXISTS );

		theBlock.allNamesChannel.setName( name );

		getNews(link)
		.then(function(response){

			theBlock.addLinkInList([{
				name : name,
				link : link
			}]);
			theBlock.pubsub.publish('newLink', {
				name : name,
				link : link
			});
			clearInput( [inputLink, nameChannel] );
		})
		.catch(function(error){

			clearInput( [inputLink] );
			userInfo();
		})
	};

	function checkClick( event ) {
		var target = event.target;

		if ( target.classList.contains( DELETE_CHANNEL ) ) {
			theBlock.removeteLink( target );
		} else {
			if ( target.classList.contains( EDIT_NAME ) ) {

				edit.style.top = '0';
				inputRename.focus();
				theBlock.updateName( target )
			}
		}
	};


	function userInfo( text ){
		textInfo.innerHTML = text || USER_MESSAGE;
		setTimeout(function(){
			textInfo.innerHTML = '';
		}, TIMER);
	};


	function getNews( link ) {

		return new Promise(function(resolve, reject){
			var feed = new google.feeds.Feed(link),
				news = [];

      		feed.setNumEntries(1);

      		feed.load(function(result) {
        		if (!result.error) {

          			for (var i = 0; i < result.feed.entries.length; i++) {
          				news.push(result.feed);
          			}
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