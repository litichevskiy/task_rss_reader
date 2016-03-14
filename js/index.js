(function() {

	var pabsub = new PubSub();

	var blockChannels = new BlockChannels({
		container : document.querySelector('[data-role="listChannels"]'),
		list 	  : document.querySelector('.listChannel'),
		pubsub    : pabsub
	});

	var listNames = storage.listLinks();

	blockChannels.addLinkInList( listNames );

	listNames.forEach(function(item){
		blockChannels.allNamesChannel.setName( item.name );
	});

	blockChannels.pubsub.subscribe( 'newLink', storage.addLink );
	blockChannels.pubsub.subscribe( 'deleteLink', storage.deleteLink );
	blockChannels.pubsub.subscribe( 'updateName', storage.updateName );

})();