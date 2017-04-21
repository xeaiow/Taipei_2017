angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $state, $http, $ionicPopup) {

    $scope.isSign = false; // 今日是否簽到

    $scope.sign = function() {

         var ConfirmSign = $ionicPopup.prompt({
            template:
                '<div class="confirm-basic">確定簽到嗎？</div>',
            buttons: [{
                text: '取消',
                type: 'button-default',
                onTap: function(e) {
                    e.preventDefault();
                    ConfirmSign.close();
                }
            }, {
                text: '確定',
                type: 'button-positive',
                onTap: function(e) {

                    $scope.isSign = true; // 之後要做 api 傳遞已簽到資訊到資料庫
                }
            }]
        });
    }
})

.controller('ChatsCtrl', function($scope, $ionicPopup) {

    $scope.isOut = false; // 今日是否簽退

    $scope.CheckOut = function() {

        var ConfirmCheckOut = $ionicPopup.prompt({
           template:
               '<div class="confirm-basic">確定簽退嗎？</div>',
           buttons: [{
               text: '取消',
               type: 'button-default',
               onTap: function(e) {
                   e.preventDefault();
                   ConfirmCheckOut.close();
               }
           }, {
               text: '確定',
               type: 'button-positive',
               onTap: function(e) {

                   $scope.isOut = true; // 之後要做 api 傳遞已簽到資訊到資料庫
               }
           }]
       });
    }
})

.controller('GoodrateCtrl', function($scope, $http, $ionicPopup, $state, $ionicHistory) {

    $scope.user = {};

    $scope.login = function() {

        if (!$scope.user.email && !$scope.user.password) {

            var LoginFailed = $ionicPopup.prompt({
               template:
                   '<div class="confirm-basic">請填寫帳號及密碼！</div>',
               buttons: [{
                   text: '好',
                   type: 'button-dark',
                   onTap: function(e) {
                       e.preventDefault();
                       LoginFailed.close();
                   }
               }]
           });
           return false;
        }

        $http({
            url: 'http://140.135.113.9/login.php',
            method: "POST",
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: {
                username : $scope.user.email,
                password : $scope.user.password
            }
        })
        .success( function(response) {

            if (response.status == false) {

                var LoginFailed = $ionicPopup.prompt({
                   template:
                       '<div class="confirm-basic">帳號或密碼錯誤！</div>',
                   buttons: [{
                       text: '好',
                       type: 'button-dark',
                       onTap: function(e) {
                           e.preventDefault();
                           LoginFailed.close();
                       }
                   }]
               });
               return false;
            }

            $scope.user_details = response.result;

            sessionStorage.setItem('loggedin_name', $scope.user_details.u_name);
            sessionStorage.setItem('loggedin_id', $scope.user_details.u_id);
            sessionStorage.setItem('loggedin_phone', $scope.user_details.u_phone);
            sessionStorage.setItem('loggedin_address', $scope.user_details.u_address);
            sessionStorage.setItem('loggedin_pincode', $scope.user_details.u_pincode);

            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });

            // 如果成功登入就跳轉到 dash
            $state.go('tab.dash', {}, { location: "replace", reload: true });
        })
        .error( function(response) {

            var LoginFailed = $ionicPopup.prompt({
               template:
                   '<div class="confirm-basic">帳號或密碼錯誤！</div>',
               buttons: [{
                   text: '好',
                   type: 'button-dark',
                   onTap: function(e) {
                       e.preventDefault();
                       LoginFailed.close();
                   }
               }]
           });
        });
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

        // 登出成功跳轉到登入頁面
        $state.go('login', {}, { location: "replace", reload: true });
    };
})

.controller('AccountCtrl', function($scope) {
    $scope.settings = {
        enableFriends: true
    };
})

.controller('EquCtrl', function($scope, $ionicPopup, $stateParams) {

    $scope.isCheckItem = false; // 是否器材檢核
    $scope.check_item = []; // 每個項目的檢核後數量
    $scope.dd = $stateParams.id;

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
