angular.module('starter.controllers', [])

.controller('ChatsCtrl', function($scope, $ionicPopup) {


})

.controller('GoodrateCtrl', ['$scope', '$http', '$ionicPopup', '$state', '$ionicHistory', function($scope, $http, $ionicPopup, $state, $ionicHistory) {

    $scope.user = {};
    $scope.user_details = {};

    // 今日是否簽到    
    $scope.isSign = false;

    // 選擇的項目    
    $scope.select_eqpt;

    // 選擇的場館
    $scope.select_place;

    // 今日是否簽退    
    $scope.isOut = true;

    $scope.isCheckIn = true;
    $scope.isCheckOut = true;


    // 項目    
    $http.get('assets/json/eqpt.json')
        .success(function(data) {
            $scope.eqpt = data;
        });

    // 場館
    $http.get('assets/json/place.json')
        .success(function(data) {
            $scope.place = data;
        });

    // 項目對應表
    $http.get('assets/json/match_data.json')
        .success(function(data) {
            $scope.item_detail = data;
        });


    // Function
    $scope.login = function() {


        if (!$scope.user.email || !$scope.user.password) {

            var LoginFailed = $ionicPopup.prompt({
                template: '<div class="confirm-basic">請填寫帳號及密碼！</div>',
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
                url: 'http://140.135.112.96/api/Login',
                method: "POST",
                data: {
                    username: $scope.user.email,
                    password: $scope.user.password
                }
            })
            .then(function(response) {


                // username or password error
                if (response.data.status === 0) {

                    var LoginFailed = $ionicPopup.prompt({
                        template: '<div class="confirm-basic">帳號或密碼錯誤！</div>',
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


                $scope.sdg = (response.data.is_check_in === true) ? 'true' : 'false';

                // success login                
                $scope.user_details = response;
                console.log(response);

                sessionStorage.setItem('id', $scope.user_details.data.user.id);
                sessionStorage.setItem('username', $scope.user_details.data.user.username);
                sessionStorage.setItem('email', $scope.user_details.data.user.email);
                sessionStorage.setItem('name', $scope.user_details.data.user.name);
                sessionStorage.setItem('tel', $scope.user_details.data.user.tel);
                sessionStorage.setItem('token', $scope.user_details.data.user.token);
                sessionStorage.setItem('isCheckIn', $scope.user_details.data.is_check_in);
                sessionStorage.setItem('isCheckOut', $scope.user_details.data.is_check_out);
                sessionStorage.setItem('signItem', ($scope.user_details.data.check != false) ? $scope.user_details.data.check[0].item.name : '');
                sessionStorage.setItem('signLocation', ($scope.user_details.data.check != false) ? $scope.user_details.data.check[0].location.name : '');
                sessionStorage.setItem('signDetailId', ($scope.user_details.data.check != false) ? $scope.user_details.data.check[0].id : '');

                $ionicHistory.nextViewOptions({
                    disableAnimate: true,
                    disableBack: true
                });

                // 如果成功登入就跳轉到 dash
                $state.go('tab.dash', {}, { location: "replace", reload: true });
            });

    };

    // 今日是否遷到過    
    $scope.isCheckIn = (sessionStorage.getItem('isCheckIn') == 'true') ? true : false;
    $scope.isCheckOut = (sessionStorage.getItem('isCheckOut') == 'true') ? true : false;
    $scope.signItem = sessionStorage.getItem('signItem');
    $scope.signLocation = sessionStorage.getItem('signLocation');
    $scope.signDetailId = sessionStorage.getItem('signDetailId');

    $scope.userSignInfo = {};

    // 簽到
    $scope.sign = function(select_place) {

        var ConfirmSign = $ionicPopup.prompt({
            template: '<div class="confirm-basic">確定簽到嗎？</div>',
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

                    $http({
                            url: 'http://140.135.112.96/api/CheckIn',
                            method: "POST",
                            data: {
                                username: sessionStorage.getItem('username'),
                                token: sessionStorage.getItem('token'),
                                item_detail_id: (sessionStorage.getItem('signDetailId') != '') ? sessionStorage.getItem('signDetailId') : select_place
                            }
                        })
                        .then(function(response) {

                            if (response.status == 200) {

                                sessionStorage.setItem('sign', select_place);
                                $scope.isSign = true; // 之後要做 api 傳遞已簽到資訊到資料庫
                                $scope.isOut = false;
                                console.log(response.data);
                                $scope.userSignInfo = response.data;
                            } else {

                                console.log('failed');
                            }

                        });
                }
            }]
        });
    };


    $scope.CheckOut = function(select_place) {

        var ConfirmCheckOut = $ionicPopup.prompt({
            template: '<div class="confirm-basic">確定簽退嗎？</div>',
            buttons: [{
                text: '取消',
                type: 'button-dark',
                onTap: function(e) {
                    e.preventDefault();
                    ConfirmCheckOut.close();
                }
            }, {
                text: '確定',
                type: 'button-positive',
                onTap: function(e) {

                    $http({
                            url: 'http://140.135.112.96/api/CheckOut',
                            method: "POST",
                            data: {
                                username: sessionStorage.getItem('username'),
                                token: sessionStorage.getItem('token'),
                                item_detail_id: select_place,
                            }
                        })
                        .then(function(response) {

                            if (response.status == 200) {

                                $scope.isOut = true; // 之後要做 api 傳遞已簽到資訊到資料庫

                                console.log(select_place);


                            } else {

                                console.log('failed')
                            }
                        });
                }
            }]
        });
    }

}])

.controller('profileCtrl', function($scope, $ionicHistory, $state, $ionicPopup) {


    $scope.user_details = {};
    // loads value from the loggin session
    $scope.user_details.id = sessionStorage.getItem('id');
    $scope.user_details.username = sessionStorage.getItem('username');
    $scope.user_details.email = sessionStorage.getItem('email');
    $scope.user_details.name = sessionStorage.getItem('name');
    $scope.user_details.tel = sessionStorage.getItem('tel');
    $scope.user_details.token = sessionStorage.getItem('token');

    //logout function
    $scope.logout = function() {

        //delete all the sessions
        delete sessionStorage.id;
        delete sessionStorage.username;
        delete sessionStorage.email;
        delete sessionStorage.name;
        delete sessionStorage.tel;
        delete sessionStorage.token;

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

.controller('EquCtrl', function($scope, $http, $state, $ionicPopup, $stateParams) {

    $scope.isCheckItem = false; // 是否器材檢核
    $scope.check_item = []; // 每個項目的檢核後數量
    $scope.dd = $stateParams.id;
    $scope.equpInfo = {};
    $scope.checkedInfo = {};
    $scope.checkedInfo.eqpt = [];
    $scope.isChecked = false;

    $scope.loadEqpt = function() {
        $http({
                url: 'http://140.135.112.96/api/EquipCheckLoad',
                method: "POST",
                data: {
                    username: sessionStorage.getItem('username'),
                    token: sessionStorage.getItem('token'),
                }
            })
            .then(function(response) {

                if (response.status == 200) {

                    $scope.equpInfo = response.data;
                    console.log(response);

                } else {

                    console.log('failed')
                }
            });
        // for (var i = 0; i < 2; i++) {
        //     $scope.person.push({
        //         'name': 'test',
        //         'unit': '個',
        //         'quantity': 5,
        //         'check_quantity': 3
        //     });
        // }

        // console.log($scope.person);
    }


    $scope.ConfirmCheck = function() {


        // if ($scope.check_item) {

        //     // 有欄位未填寫就彈跳視窗
        //     $ionicPopup.alert({
        //         title: '請確實檢核所有項目',
        //         template: '有欄位未填寫數量！'
        //     });
        //     return false;
        // }


        // 按下檢核就跳轉到預覽頁面｀按下編輯就回到檢核頁面
        $scope.isCheckItem = ($scope.isCheckItem == true) ? false : true;

        if ($scope.isCheckItem == false) {

            for (var i = 0; i < $scope.equpInfo.length; i++) {

                $scope.checkedInfo.eqpt.push({

                    "name": $scope.equpInfo.eqpt[i].name,
                    "unit": $scope.equpInfo.eqpt[i].unit,
                    "quantity": $scope.equpInfo.eqpt[i].quantity,
                    "check_quantity": $scope.check_item[i]
                });
            }

            console.log(JSON.stringify($scope.checkedInfo));


            // $http({
            //         url: 'http://140.135.112.96/api/EquipCheck',
            //         method: "POST",
            //         data: {
            //             username: sessionStorage.getItem('username'),
            //             token: sessionStorage.getItem('token'),
            //             eqpts: $scope.checkedInfo
            //         }
            //     })
            //     .then(function(response) {

            //         if (response.status == 200) {

            //             console.log(response);
            //             $scope.isChecked = true;

            //         } else {

            //             console.log('failed')
            //         }
            //     });
        }

    }
});