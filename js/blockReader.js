(function(exports){

	const
		USER_MESSAGE = 'перейти на сайт'

	var closeNews = document.querySelector('[data-role="closeNews"]'),
		link = document.querySelector('.link'),
		blockTop;

	closeNews.addEventListener( 'click', clearContent );

	var theBlock;

	function BlockReader( o ) {

		if ( theBlock ) {
			return theBlock;
		}
		theBlock = this;

		this.block = o.container;
		this.content = o.content;
		this.pubsub = o.pubsub;

		blockTop = o.blockTop;
	};

	BlockReader.prototype.updateContent = function( obj ) {

		theBlock.content.innerHTML = obj.content;
		link.href = obj.link;
		link.innerHTML = USER_MESSAGE;
		closeNews.style.visibility = 'visible';
		blockTop.style.height = '35%';
		theBlock.block.style.height = '65%';
	};

	function clearContent () {
		theBlock.content.innerHTML = '';
		link.innerHTML = '';
		link.href = '';
		link.innerHTML = '';
		closeNews.style.visibility = 'hidden';
		blockTop.style.height = '50%';
		theBlock.block.style.height = '50%';
	};

	exports.BlockReader = BlockReader;

})( window );