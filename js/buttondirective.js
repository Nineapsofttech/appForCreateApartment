
'use strict';
angular.module('world.buttondirective', []).
directive('favoriteButton', ['$cookies', 'Favorite','socket', function ($cookies, Favorite,socket) {
	return {
		restrict: 'EA',
		link: function ($scope, elem, attributes, ngModel) {
	      	$scope.uid = $cookies.UID;
	        $scope.isAdded = true;
	        
	        Favorite.get({user_id:$scope.uid}, function (response) {
	        	for (var i = response.length - 1; i >= 0; i--) {
	        		if ($scope.propertyId === response[i].propertyId) {
	        			$scope.isAdded = false;
	        			elem.html('Added');
	        		}
	        	};
	        });

	        
	        elem.on('mousedown', function(event) {
	        	// Prevent default dragging of selected content
	        	event.preventDefault();
				$scope.uid = $cookies.UID;
				if($cookies.UID!==undefined){
					if ($scope.isAdded) {

						elem.html('Added');
						if($scope.uid !== undefined){

							socket.emit('Noticesend', $scope.ownerId);
							Favorite.post({user_id:$scope.uid, property_id: $scope.propertyId,owner_id: $scope.ownerId}, function (response){
								$scope.isAdded = !$scope.isAdded;
							});

						}

					} else {

						elem.html('Favorite');
						if($scope.uid !== undefined){

							Favorite.kill({user_id:$scope.uid, property_id: $scope.propertyId , owner_id:$scope.ownerId}, function (response){
								$scope.isAdded = !$scope.isAdded;
							});

						}

					}
				}else{

					alert('กรุณา สมัครสมาชิก หรือ ทำการ login เพื่อ favorite');

				}
			});
	    },
      	scope: {
      		propertyId: "@propertyId",
	        ownerId: "@ownerId",
	        eventHandler: '&ngClick'
	    },
	    controller: function ($scope, $cookies) {
	    }
	};
}]).
directive('ownernotichAlertDetail', function ($cookies,$rootScope,Propertys,Notificationowner,Updatenotice) {
	return {
		restrict: 'AEC',
		link: function ($scope, elem, attributes, ngModel) {
			$scope.updatedata={};
			$scope.splitData = $scope.rawData.split(':');
			$scope.newData = $scope.splitData[0]+":"+$scope.splitData[1]+":"+"0";

			Propertys.query({_id:$scope.splitData[0]},function (res){
				var name = res.name === undefined ? "-" : res.name;
                var email = res.email === undefined ? "-" : res.email;
                var title = res.title === undefined ? "-" : res.title;
                var updated = res.updated === undefined ? "-" : res.updated;
                var user_id = res.user_id === undefined ? "admin" : res.user_id;

                elem.append('<td><p class="profile--p"><a target="_blank" href="#!/info?_id='+res._id+'">'+title+'</a></p></td>'+
                '<td><p class="profile--p">'+$scope.followerCount+'</p></td>'+
                '<td><p class="profile--p">'+email+'</p></td>'+
                '<td><p class="profile--p">'+updated+'</p></td>'+
                '<td><p class="profile--p"><div title="Delete '+title+'" favorite-button property-id="'+res._id+'" owner-id="'+user_id+'" data-ng-click="addFavorite('+res._id+')" class="icon--png__16px icon--false"></div></p></td>');
                
                $scope.updatedata.oldele = $scope.rawData;
                $scope.updatedata.newele = $scope.newData;
                $scope.updatedata.uid = $cookies.Permission==5 ? "admin":$cookies.UID;
                
                if($scope.splitData[2]==1){
                  Updatenotice.post({element:$scope.updatedata},function(res){
                    console.log(res);
                  });
                }
            });
		},
		scope: {
			rawData: "@rawData",
			followerCount: "@followerCount"
		},
		controller: function ($scope, $cookies) {
		}
	}
});