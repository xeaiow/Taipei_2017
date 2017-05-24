angular.module('starter.controllers', [])

.controller('ChatsCtrl', function($scope, $ionicPopup) {


})

.controller('GoodrateCtrl', ['$scope', '$http', '$ionicPopup', '$state', '$ionicHistory', '$cordovaGeolocation', function($scope, $http, $ionicPopup, $state, $ionicHistory, $cordovaGeolocation) {

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

    // 登入後載入的狀態資訊
    $scope.isCheckIn = true;
    $scope.isCheckOut = true;
    $scope.isCheckEqpt = true;


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

        // 登入處理
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

                localStorage.setItem('id', $scope.user_details.data.user.id);
                localStorage.setItem('username', $scope.user_details.data.user.username);
                localStorage.setItem('email', $scope.user_details.data.user.email);
                localStorage.setItem('name', $scope.user_details.data.user.name);
                localStorage.setItem('tel', $scope.user_details.data.user.tel);
                localStorage.setItem('token', $scope.user_details.data.user.token);

                // 目前簽到簽退及檢核的狀態
                localStorage.setItem('isCheckIn', $scope.user_details.data.is_check_in);
                localStorage.setItem('isCheckOut', $scope.user_details.data.is_check_out);
                localStorage.setItem('isCheckEqpt', $scope.user_details.data.is_check_eqpt);

                localStorage.setItem('signItem', ($scope.user_details.data.check != false) ? $scope.user_details.data.check[0].item.name : '');
                localStorage.setItem('signLocation', ($scope.user_details.data.check != false) ? $scope.user_details.data.check[0].location.name : '');
                localStorage.setItem('signLat', ($scope.user_details.data.check != false) ? $scope.user_details.data.check[0].location.latitude : '');
                localStorage.setItem('signLong', ($scope.user_details.data.check != false) ? $scope.user_details.data.check[0].location.longitude : '');
                localStorage.setItem('signDetailId', ($scope.user_details.data.check != false) ? $scope.user_details.data.check[0].id : '');
                localStorage.setItem('isConfirmChecked', false);

                $ionicHistory.nextViewOptions({
                    disableAnimate: true,
                    disableBack: true
                });

                // 如果成功登入就跳轉到 dash
                $state.go('tab.dash', {}, { location: "replace", reload: true });
            });
    }


    // 今日是否遷到過
    $scope.isCheckIn = (localStorage.getItem('isCheckIn') == 'true') ? true : false;
    $scope.isCheckOut = (localStorage.getItem('isCheckOut') == 'true') ? true : false;
    $scope.isCheckEqpt = (localStorage.getItem('isCheckEqpt') == 'true') ? true : false;
    $scope.signItem = localStorage.getItem('signItem');
    $scope.signLocation = localStorage.getItem('signLocation');
    $scope.signDetailId = localStorage.getItem('signDetailId');
    $scope.isConfirmChecked = localStorage.getItem('isConfirmChecked');
    $scope.againShow = true;
    $scope.msg = {};
    $scope.isMsg = {};

    $scope.userSignInfo = {};

    $scope.AgainSign = function() {
        $scope.isCheckIn = false;
        $scope.againShow = false;

    }

    // 讀取事項
    $scope.loadMsg = function() {
        $scope.isMsg = JSON.parse(localStorage.getItem('msg'));
    }


    $scope.lat = ''; // 經度
    $scope.long = ''; // 緯度
    $scope.gpsErrorMsg = "";

    // 計算 2 個經緯的距離 (回傳公尺)
    $scope.distance = function(lat1, lon1, lat2, lon2) {
        var R = 6371; // km (change this constant to get miles)
        var dLat = (lat2 - lat1) * Math.PI / 180;
        var dLon = (lon2 - lon1) * Math.PI / 180;
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return Math.round(d * 1000);
    }

    // 簽到
    $scope.sign = function(select_place) {

        localStorage.setItem('signDetailId', select_place);

        // get GPS location.
        $cordovaGeolocation.getCurrentPosition()
            .then(function(position) {

                localStorage.setItem('lat', position.coords.latitude);
                localStorage.setItem('long', position.coords.longitude);


            }, function(err) {

                console.log('get GPS failed.');
            });

        if ($scope.distance(localStorage.getItem('lat'), localStorage.getItem('long'), localStorage.getItem('signLat'), localStorage.getItem('signLong')) < 15000) {

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
                                    username: localStorage.getItem('username'),
                                    token: localStorage.getItem('token'),
                                    item_detail_id: (localStorage.getItem('signDetailId') != '') ? localStorage.getItem('signDetailId') : select_place
                                }
                            })
                            .then(function(response) {

                                if (response.status == 200) {

                                    localStorage.setItem('sign', select_place);
                                    $scope.isSign = true; // 之後要做 api 傳遞已簽到資訊到資料庫
                                    $scope.isOut = false;
                                    $scope.isCheckOut = false;
                                    localStorage.setItem('isCheckOut', false);
                                    console.log(response.data);
                                    localStorage.setItem('isCheckIn', true);
                                    $scope.userSignInfo = response.data;
                                    localStorage.setItem('signItem', $scope.userSignInfo.item);
                                    localStorage.setItem('signLocation', $scope.userSignInfo.location);
                                    $scope.msg = response.data.msg;
                                    localStorage.setItem('msg', JSON.stringify($scope.msg));
                                    $scope.isMsg = JSON.parse(localStorage.getItem('msg'));
                                    $scope.isCheckIn = true;
                                } else {

                                    console.log('failed');
                                }

                            });
                    }
                }]
            });
        } else {
            $scope.gpsErrorMsg = "超遠啦！";
        }
    };


    // 簽退
    $scope.CheckOut = function() {

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
                                username: localStorage.getItem('username'),
                                token: localStorage.getItem('token'),
                                item_detail_id: localStorage.getItem('signDetailId'),
                            }
                        })
                        .then(function(response) {

                            if (response.status == 200) {

                                $scope.isOut = true; // 之後要做 api 傳遞已簽到資訊到資料庫
                                localStorage.setItem('isCheckOut', true);
                                localStorage.setItem('isCheckIn', true);
                                $scope.isCheckOut = true;
                                $scope.againShow = true;
                                console.log(response.data);
                                localStorage.removeItem('msg');
                                localStorage.removeItem('checkedInfo');

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
    $scope.user_details.id = localStorage.getItem('id');
    $scope.user_details.username = localStorage.getItem('username');
    $scope.user_details.email = localStorage.getItem('email');
    $scope.user_details.name = localStorage.getItem('name');
    $scope.user_details.tel = localStorage.getItem('tel');
    $scope.user_details.token = localStorage.getItem('token');

    //logout function
    $scope.logout = function() {

        localStorage.clear();
        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();
        $scope.user_details = '';

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

.controller('EquCtrl', function($scope, $http, $state, $ionicPopup, $stateParams, $cordovaCamera) {

    $scope.isCheckItem = false; // 是否器材檢核
    $scope.check_item = []; // 每個項目的檢核後數量
    $scope.dd = $stateParams.id;
    $scope.equpInfo = {};
    $scope.checkedInfo = [];
    $scope.isChecked = false;
    $scope.reportInfo = {};
    $scope.resultInfo = {};

    // 讀取待檢核器材設備
    $scope.loadEqpt = function() {
        $http({
                url: 'http://140.135.112.96/api/EquipCheckLoad',
                method: "POST",
                data: {
                    username: localStorage.getItem('username'),
                    token: localStorage.getItem('token'),
                }
            })
            .then(function(response) {

                if (response.status == 200) {

                    $scope.equpInfo = {};
                    $scope.equpInfo = response.data.form;
                    console.log(response);

                } else {

                    console.log('failed');
                }
            }).catch(function(err) {
                console.log('failed');
            });
    }

    $scope.isEditing = false;

    //進入確定器材檢核頁面
    $scope.EnterCheck = function() {
        $scope.isEditing = true;
        console.log($scope.isEditing);
    }

    // 編輯檢核器材
    $scope.EditCheck = function() {
        $scope.isEditing = false;
    }

    // 器材檢核
    $scope.ConfirmCheck = function() {


        // if ($scope.check_item) {

        //     // 有欄位未填寫就彈跳視窗
        //     $ionicPopup.alert({
        //         title: '請確實檢核所有項目',
        //         template: '有欄位未填寫數量！'
        //     });
        //     return false;
        // }

        // 將這批器材檢核資訊包成一個 object
        for (var i = 0; i < $scope.equpInfo.eqpt.length; i++) {

            $scope.checkedInfo.push({

                "name": $scope.equpInfo.eqpt[i].name,
                "unit": $scope.equpInfo.eqpt[i].unit,
                "quantity": $scope.equpInfo.eqpt[i].quantity,
                "check_quantity": $scope.check_item[i]
            });
        }

        localStorage.setItem('checkedInfo', JSON.stringify($scope.checkedInfo));


        console.log(JSON.stringify($scope.checkedInfo));

        $http({
                url: 'http://140.135.112.96/api/EquipCheck',
                method: "POST",
                data: {
                    username: localStorage.getItem('username'),
                    token: localStorage.getItem('token'),
                    eqpt: $scope.checkedInfo
                }
            })
            .then(function(response) {

                if (response.status == 200) {

                    console.log(response);
                    $scope.isChecked = true; // 鎖定送出審核
                    $scope.isCheckItem = true;
                    $scope.isConfirmChecked = true;
                    localStorage.setItem('isConfirmChecked', true);
                    $scope.isEditing = true;

                } else {

                    console.log('failed');
                }
            });

    }

    // 異常回報
    $scope.reportLoad = function() {

        $http({
                url: 'http://140.135.112.96/api/ReportLoad',
                method: "POST",
                data: {
                    username: localStorage.getItem('username'),
                    token: localStorage.getItem('token'),
                }
            })
            .then(function(response) {

                if (response.status == 200) {

                    $scope.reportInfo = response.data.eqpt;
                    console.log($scope.reportInfo);

                } else {

                    console.log('failed')
                }
            });
    }

    $scope.reportInfoIsNull = true;

    // 讀取器材檢核存下的資料
    $scope.checkInfoLoad = function() {

        if (localStorage.getItem('checkedInfo') != '') {
            $scope.reportInfo = JSON.parse(localStorage.getItem('checkedInfo'));
            console.log($scope.reportInfo);
            $scope.reportInfoIsNull = false;
        }
    }

    $scope.reportResult = [];

    // 確定送出異常回報
    $scope.ConfirmReport = function(id, quantity, form_id) {

        $scope.reportResult.push({
            "eqpt_id": id,
            "form_id": form_id,
            "quantity": quantity,
            "remark": $scope.resultInfo.reportDescription,
            "pic": $scope.imgURI,
        });

        $http({
                url: 'http://140.135.112.96/api/Report',
                method: "POST",
                data: {
                    username: localStorage.getItem('username'),
                    token: localStorage.getItem('token'),
                    abn: $scope.reportResult
                }
            })
            .then(function(response) {

                if (response.status == 200) {

                    console.log(response);

                } else {

                    console.log('failed');
                }
            });
    }


    // 拍照
    $scope.takePhoto = function() {
        var options = {
            quality: 75,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 300,
            targetHeight: 300,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

        $cordovaCamera.getPicture(options).then(function(imageData) {
            $scope.imgURI = imageData;
        }, function(err) {
            // "data:image/jpeg;base64," +
        });
    }

    // 選照片
    $scope.choosePhoto = function() {
        var options = {
            quality: 75,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 300,
            targetHeight: 300,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

        $cordovaCamera.getPicture(options).then(function(imageData) {
            $scope.imgURI = imageData;
        }, function(err) {

        });
    }


});