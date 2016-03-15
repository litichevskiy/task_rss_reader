(function() {

	var pubsub = new PubSub();

	var blockChannels = new BlockChannels({
		container : document.querySelector('[data-role="listChannels"]'),
		list 	  : document.querySelector('.listChannel'),
		pubsub    : pubsub
	});

	var listNames = storage.listLinks();

	blockChannels.addLinkInList( listNames );

	listNames.forEach(function(item){
		blockChannels.allNamesChannel.setName( item.name );
	});

	blockChannels.pubsub.subscribe( 'newLink', storage.addLink );
	blockChannels.pubsub.subscribe( 'deleteLink', storage.deleteLink );
	blockChannels.pubsub.subscribe( 'updateName', storage.updateName );


	var blockListMessage = new BlockListMessage({
		container : document.querySelector('[data-role="messages"]'),
		list 	  : document.querySelector('.listMessage'),
		pubsub    : pubsub
	});


	blockListMessage.pubsub.subscribe( 'listNews', blockListMessage.updateList );

	var blockReader = new BlockReader({
		container : document.querySelector('[data-role="reader"]'),
		content   : document.querySelector('.content'),
		blockTop  : document.querySelector('[data-role="messages"]'),
		pubsub    : pubsub
	});


	blockReader.pubsub.subscribe( 'showPreview', blockReader.updateContent );

	var blockStatistics = new BlockStatistics({
		container : document.querySelector('[data-role="statistics"]'),
		list      : document.querySelector('.statistics'),
		pubsub    : pubsub
	});


	blockStatistics.setCountChannels( listNames.length );
	blockStatistics.pubsub.subscribe( 'newLink', blockStatistics.addCountChannels );
	blockStatistics.pubsub.subscribe( 'deleteLink', blockStatistics.removeCountChannels );
	blockStatistics.pubsub.subscribe( 'listNews', blockStatistics.countMessages );
	blockStatistics.pubsub.subscribe( 'clear', blockStatistics.clearCount );
	blockStatistics.pubsub.subscribe( 'newText', blockStatistics.checkLetters );

})();