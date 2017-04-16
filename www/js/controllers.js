angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $state) {

    $scope.isSign = false; // 今日是否簽到

    $scope.sign = function() {

        $scope.isSign = true; // 之後要做 api 傳遞已簽到資訊到資料庫
    }
})

.controller('ChatsCtrl', function($scope, Chats) {

    $scope.isOut = false; // 今日是否簽退

    $scope.CheckOut = function() {

        $scope.isOut = true; // 之後要做 api 傳遞已簽到資訊到資料庫
    }
})

.controller('GoodrateCtrl', function($scope, $http, $ionicPopup, $state, $ionicHistory) {

    $scope.user = {}; //declares the object user

    $scope.login = function() {

        str = "http://localhost/ionic/login.php?e=" + $scope.user.email + "&p=" + $scope.user.password;

        $http.get(str).success(function(response) { // if login request is Accepted

            // records is the 'server response array' variable name.
            $scope.user_details = response.records; // copy response values to user-details object.

            //stores the data in the session. if the user is logged in, then there is no need to show login again.
            sessionStorage.setItem('loggedin_name', $scope.user_details.u_name);
            sessionStorage.setItem('loggedin_id', $scope.user_details.u_id);
            sessionStorage.setItem('loggedin_phone', $scope.user_details.u_phone);
            sessionStorage.setItem('loggedin_address', $scope.user_details.u_address);
            sessionStorage.setItem('loggedin_pincode', $scope.user_details.u_pincode);

            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });

        }).error(function() { //if login failed
            var alertPopup = $ionicPopup.alert({
                title: '登入失敗',
                template: '帳號或密碼錯誤！'
            });
        });

        $state.go('tab.account', {}, { location: "replace", reload: true });
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
    $scope.logout = function() {

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
        $state.go('tab.goodrate', {}, { location: "replace", reload: true });
    };
})

.controller('AccountCtrl', function($scope) {
    $scope.settings = {
        enableFriends: true
    };
})

.controller('EquCtrl', function($scope, $ionicPopup) {

    $scope.isCheckItem = false; // 是否器材檢核
    $scope.check_item = []; // 每個項目的檢核後數量

    $scope.ConfirmCheck = function() {

        // 範例而已，之後把這邊跑回圈確定所有器材檢核都有正確填寫才送出
        if (!$scope.check_item[0] && !$scope.check_item[1] && !$scope.check_item[2]) {

            // 有欄位未填寫就彈跳視窗
            $ionicPopup.alert({
                title: '請確實檢核所有項目',
                template: '有欄位未填寫數量！'
            });
            return false;
        }
        // 按下檢核就跳轉到預覽頁面｀按下編輯就回到檢核頁面
        $scope.isCheckItem = ($scope.isCheckItem == true) ? false : true;
    }
});