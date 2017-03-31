angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {

    $scope.chats = Chats.all();
    $scope.remove = function(chat) {
        Chats.remove(chat);
    };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
})

.controller('GoodrateCtrl', function($scope, $http, $ionicPopup, $state, $ionicHistory) {

    $scope.user = {};  //declares the object user

    $scope.login = function() {

        str = "http://localhost/ionic/login.php?e=" + $scope.user.email + "&p=" + $scope.user.password;

        $http.get(str).success(function (response){   // if login request is Accepted

            // records is the 'server response array' variable name.
            $scope.user_details = response.records;  // copy response values to user-details object.

            //stores the data in the session. if the user is logged in, then there is no need to show login again.
            sessionStorage.setItem('loggedin_name', $scope.user_details.u_name);
            sessionStorage.setItem('loggedin_id', $scope.user_details.u_id );
            sessionStorage.setItem('loggedin_phone', $scope.user_details.u_phone);
            sessionStorage.setItem('loggedin_address', $scope.user_details.u_address);
            sessionStorage.setItem('loggedin_pincode', $scope.user_details.u_pincode);

            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });

            }).error(function() {  //if login failed
                var alertPopup = $ionicPopup.alert({
                    title: '登入失敗',
                    template: '帳號或密碼錯誤！'
                });
            });

            $state.go('tab.account', {}, {location: "replace", reload: true});
    };

})

.controller('profileCtrl', function($scope, $rootScope, $ionicHistory, $state, $ionicPopup) {

    // loads value from the loggin session
    $scope.loggedin_name = sessionStorage.getItem('loggedin_name');
    $scope.loggedin_id = sessionStorage.getItem('loggedin_id');
    $scope.loggedin_phone = sessionStorage.getItem('loggedin_phone');
    $scope.loggedin_address = sessionStorage.getItem('loggedin_address');
    $scope.loggedin_pincode = sessionStorage.getItem('loggedin_pincode');

    //logout function
    $scope.logout = function(){

        //delete all the sessions
        delete sessionStorage.loggedin_name;
        delete sessionStorage.loggedin_id;
        delete sessionStorage.loggedin_phone;
        delete sessionStorage.loggedin_address;
        delete sessionStorage.loggedin_pincode;

        $scope.loggedin_name = "";
        $scope.loggedin_id = "";
        $scope.loggedin_phone = "";
        $scope.loggedin_address = "";
        $scope.loggedin_pincode = "";

        // remove the profile page backlink after logout.
        $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });

        var alertPopup = $ionicPopup.alert({
            title: '登出成功',
            template: '您已登出！'
        });

        // After logout you will be redirected to the menu page,with no backlink
        $state.go('tab.goodrate', {}, {location: "replace", reload: true});
    };
})

.controller('AccountCtrl', function($scope) {
    $scope.settings = {
        enableFriends: true
    };
});
