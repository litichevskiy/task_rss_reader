(function( exports ) {

	const
		MESSAGE_CHANNEL = 'каналов: ',
		LICOUNTMESSAGES_TEXT = 'новотей: ',
		LICOUNTAUTHORS_TEXT = 'авторов: ',
		SEARCH_LAT_LETTERS = /[a-zA-Z]/gi;


	var liCountChannels = document.querySelector('.countChannels'),
		liCountMessages = document.querySelector('.countMessages'),
		liCountAuthors = document.querySelector('.countAuthors'),
		htmlElemChart = document.querySelector('.chart');
		countChannels = 0;

	var theBlock;

	function BlockStatistics( o ) {

		if ( theBlock ) {
			return theBlock;
		}
		theBlock = this;

		this.block = o.container;
		this.list = o.list;
		this.pubsub = o.pubsub;
	};

	BlockStatistics.prototype.setCountChannels = function( count ) {

			countChannels = count;
			liCountChannels.innerHTML = MESSAGE_CHANNEL + countChannels;
	};

	BlockStatistics.prototype.addCountChannels = function( o ) {

		if ( !o ) return;
		countChannels += 1;
		liCountChannels.innerHTML = MESSAGE_CHANNEL + countChannels;
	};

	BlockStatistics.prototype.removeCountChannels = function( o ) {

		if ( !o ) return;
		countChannels -= 1;
		liCountChannels.innerHTML = MESSAGE_CHANNEL + countChannels;
	};

	BlockStatistics.prototype.countMessages = function ( list ) {
		var count, countAuthors = 0;

		count = list[0].length;
		liCountMessages.innerHTML = LICOUNTMESSAGES_TEXT + count;

		list[0].forEach(function( item ) {

			if ( item.author !== '' ) {
				countAuthors += 1
			}
		});

		liCountAuthors.innerHTML = LICOUNTAUTHORS_TEXT + countAuthors;
	};

	BlockStatistics.prototype.clearCount = function( ) {

		liCountMessages.innerHTML =  LICOUNTMESSAGES_TEXT;
		liCountAuthors.innerHTML = LICOUNTAUTHORS_TEXT;
	};

	BlockStatistics.prototype.checkLetters = function ( text ) {

		var storageLetters = {},
			totalSumma, lat_Letters;

		text = text.toLowerCase();
		lat_Letters = text.match( SEARCH_LAT_LETTERS );
		clearChart();

		if ( lat_Letters === null ) return;

		totalSumma = lat_Letters.length + 1;

		for ( var i = 0; i < lat_Letters.length; i++ ) {

			if ( !storageLetters.hasOwnProperty( lat_Letters[i] ) ) {

					storageLetters[lat_Letters[i]] = 1;
					continue
			} else storageLetters[lat_Letters[i]] += 1;

		}
		determinePercentage( storageLetters, totalSumma );

	};

	function determinePercentage ( obj, totalSumma ) {
		var storage = [['letters','percente']], letter;

		for ( var key in obj ) {

			obj[key] = obj[key] / totalSumma * 100;
			storage.push( [ key, obj[key] ] );
		}

		drawChart( storage );
	};


    google.load("visualization", "1", {packages:["corechart"]});

    function drawChart( o ) {

		google.setOnLoadCallback(drawChart);

        var data = google.visualization.arrayToDataTable( o );

        var options = {

            title: 'letters',
            is3D: true,
            pieResidueSliceLabel: ''
        };

        var chart = new google.visualization.PieChart( htmlElemChart );

        chart.draw(data, options);
    };

    function clearChart() {
    	htmlElemChart.innerHTML = '';
    };


	exports.BlockStatistics = BlockStatistics;

})( window );