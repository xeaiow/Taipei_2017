angular.module('starter.controllers', [])

.controller('ChatsCtrl', function($scope, $ionicPopup) {


}).filter('mark', function() {
    return function(status) {
        if (status == 1) {
            return '✔';
        }
    };
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
                    type: 'ui button taipei-theme',
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
                            type: 'ui button taipei-theme',
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
                // localStorage.setItem('signLat', ($scope.user_details.data.check != false) ? $scope.user_details.data.check[0].location.latitude : '');
                // localStorage.setItem('signLong', ($scope.user_details.data.check != false) ? $scope.user_details.data.check[0].location.longitude : '');
                localStorage.setItem('signDetailId', ($scope.user_details.data.check != false) ? $scope.user_details.data.check[0].id : '');
                localStorage.setItem('isConfirmChecked', false);
                localStorage.setItem('lockLoadEqpt', false);

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
    $scope.venuesMsg = {};

    $scope.userSignInfo = {};

    $scope.AgainSign = function() {
        $scope.isCheckIn = false;
        $scope.againShow = false;

    }

    // 讀取所有注意事項
    $scope.loadMsg = function() {
        if (localStorage.getItem('msg') != undefined || localStorage.getItem('msg') != null) {
            $scope.isMsg = JSON.parse(localStorage.getItem('msg'));
        }
    }

    // 讀取場館注意事項
    $scope.loadVenuesMsg = function() {
        $scope.venuesMsg = JSON.parse(localStorage.getItem('venuesMsg'));
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

        // 取得所選之場館編號
        localStorage.setItem('signDetailId', select_place);

        // get GPS location.
        $cordovaGeolocation.getCurrentPosition()
            .then(function(position) {

                localStorage.setItem('lat', position.coords.latitude);
                localStorage.setItem('long', position.coords.longitude);


            }, function(err) {

                console.log('get GPS failed.');
                $scope.gpsErrorMsg = "請開啟定位系統";
                setTimeout(function() { $('.ui.negative.message').transition(); }, 1200);
            });

        if (localStorage.getItem('lat') != null || localStorage.getItem('lat') != undefined || localStorage.getItem('long') != null || localStorage.getItem('long') != undefined) {

            if ($scope.distance(localStorage.getItem('lat'), localStorage.getItem('long'), $scope.item_detail[select_place - 1].location.latitude, $scope.item_detail[select_place - 1].location.longitude) < 15000) {

                $scope.gpsErrorMsg = "";

                var ConfirmSign = $ionicPopup.prompt({
                    template: '<div class="confirm-basic">確定簽到嗎？</div>',
                    buttons: [{
                        text: '取消',
                        type: 'ui button taipei-red',
                        onTap: function(e) {
                            e.preventDefault();
                            ConfirmSign.close();
                        }
                    }, {
                        text: '確定',
                        type: 'ui button taipei-theme',
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
                                        // 所有注意事項
                                        localStorage.setItem('msg', JSON.stringify(response.data.msg));
                                        $scope.isMsg = JSON.parse(localStorage.getItem('msg'));
                                        // 場館注意事項
                                        localStorage.setItem('venuesMsg', JSON.stringify(response.data.notes));
                                        $scope.venuesMsg = JSON.parse(localStorage.getItem('venuesMsg'));
                                        $scope.isCheckIn = true;
                                    } else {

                                        console.log('failed');
                                    }

                                });
                        }
                    }]
                });
            } else {

                $scope.gpsErrorMsg = "距離欲簽到場地太遠，請更靠近點！";
                setTimeout(function() { $('.ui.negative.message').transition(); }, 1500);
            }

        }
    };


    // 簽退
    $scope.CheckOut = function() {

        var ConfirmCheckOut = $ionicPopup.prompt({
            template: '<div class="confirm-basic">確定簽退嗎？</div>',
            buttons: [{
                text: '取消',
                type: 'ui button taipei-red',
                onTap: function(e) {
                    e.preventDefault();
                    ConfirmCheckOut.close();
                }
            }, {
                text: '確定',
                type: 'ui button taipei-theme',
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
                                localStorage.setItem('isCheckIn', false);
                                $scope.isCheckOut = true;
                                $scope.againShow = true;
                                console.log(response.data);

                                // 移除注意事項跟檢核器材資訊
                                localStorage.removeItem('msg');
                                localStorage.removeItem('venuesMsg');
                                localStorage.removeItem('checkedInfo');

                                // 將已器材檢核紀錄清除
                                localStorage.setItem('isCheckEqpt', false);
                                localStorage.setItem('isConfirmChecked', false);


                                localStorage.setItem('lockLoadEqpt', false);


                            } else {

                                console.log('failed')
                            }
                        });
                }
            }]
        });
    }


}])

.controller('profileCtrl', function($scope, $http, $ionicHistory, $state, $ionicPopup) {


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

        $http({
                url: 'http://140.135.112.96/api/Logout',
                method: "POST",
                data: {
                    username: localStorage.getItem('username'),
                    token: localStorage.getItem('token'),
                }
            })
            .then(function(response) {

                if (response.status == 200) {

                    localStorage.clear();
                    $ionicHistory.clearCache();
                    $ionicHistory.clearHistory();
                    $scope.user_details = '';
                    localStorage.removeItem('signLat');
                    localStorage.removeItem('signLong');
                    localStorage.removeItem('token');

                    // remove the profile page backlink after logout.
                    $ionicHistory.nextViewOptions({
                        disableAnimate: true,
                        disableBack: true
                    });

                    var alertPopup = $ionicPopup.prompt({
                        template: '<div class="confirm-basic">登出成功！</div>',
                        buttons: [{
                            text: '確定',
                            type: 'ui button taipei-theme',
                            onTap: function(e) {
                                e.preventDefault();
                                alertPopup.close();
                            }
                        }]
                    });
                    console.log(response);

                } else {

                    console.log('logout failed.');
                }
            }).catch(function(err) {
                console.log('logout failed.');
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

.controller('EquCtrl', function($scope, $http, $state, $ionicPopup, $stateParams, $cordovaCamera, $ionicScrollDelegate) {

    $scope.isCheckItem = false; // 是否器材檢核
    $scope.isSignedAgain = (localStorage.getItem('isCheckIn') == "true") ? true : false;
    $scope.check_item = []; // 每個項目的檢核後數量
    $scope.dd = $stateParams.id;
    $scope.equpInfo = {};
    $scope.checkedInfo = [];
    $scope.isChecked = false;
    $scope.reportInfo = {};
    $scope.resultInfo = {};
    $scope.isCheckOut = (localStorage.getItem('isCheckOut') == "true") ? true : false;
    $scope.isCheckIn = (localStorage.getItem('isCheckIn') == "true") ? true : false;

    $scope.lockLoadEqpt = (localStorage.getItem('lockLoadEqpt') == "true") ? true : false;

    // 讀取待檢核器材設備
    $scope.loadEqpt = function() {

        if ($scope.isSignedAgain == true) {
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
                        console.log(response.data.form);

                    } else {

                        console.log('failed');
                    }
                }).catch(function(err) {
                    console.log('failed');
                });
        }
    }

    $scope.isEditing = false;

    //進入確定器材檢核頁面
    $scope.EnterCheck = function() {

        $scope.isEditing = true;
        $ionicScrollDelegate.scrollTop();

    }


    // 編輯檢核器材
    $scope.EditCheck = function() {
        $scope.isEditing = false;
        $scope.checkQuanNormal = true;
    }

    // 檢核數量異常
    $scope.checkQuanNormal = true;

    // 器材檢核
    $scope.ConfirmCheck = function() {


        // 將這批器材檢核資訊包成一個 object
        for (var i = 0; i < $scope.equpInfo.eqpt.length; i++) {

            if ($scope.equpInfo.eqpt[i].quantity >= $scope.check_item[i]) {

                $scope.checkedInfo.push({

                    "name": $scope.equpInfo.eqpt[i].name,
                    "unit": $scope.equpInfo.eqpt[i].unit,
                    "quantity": $scope.equpInfo.eqpt[i].quantity,
                    "check_quantity": $scope.check_item[i],
                    "form_id": localStorage.getItem('reportLoadForm_id'),
                    "id": $scope.equpInfo.eqpt[i].id,
                    "status": 0
                });

            } else {
                $scope.checkQuanNormal = false;
                $ionicScrollDelegate.scrollTop();
                return false;
            }
        }


        // 送出器材檢核同時將所有紀錄存到 checkedInfo
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
                    localStorage.setItem('isCheckEqpt', true);

                    // 鎖定讀取檢核器材
                    $scope.lockLoadEqpt = true;
                    localStorage.setItem('lockLoadEqpt', true);
                    $ionicScrollDelegate.scrollTop();


                } else {

                    console.log('failed');
                }
            });


    }

    // 異常回報
    // $scope.reportLoad = function() {

    //     if (localStorage.getItem('checkedInfo') == null) {

    //         $http({
    //                 url: 'http://140.135.112.96/api/ReportLoad',
    //                 method: "POST",
    //                 data: {
    //                     username: localStorage.getItem('username'),
    //                     token: localStorage.getItem('token'),
    //                 }
    //             })
    //             .then(function(response) {

    //                 if (response.status == 200) {

    //                     $scope.reportInfo = response.data.eqpt;

    //                     console.log('初次取得');

    //                 } else {

    //                     console.log('failed');
    //                 }
    //             });
    //     } else {

    //         $scope.reportInfo = JSON.parse(localStorage.getItem('checkedInfo'));
    //         // delete $scope.reportInfo[1];
    //         console.log($scope.reportInfo);
    //         // $scope.reportInfoIsNull = false;
    //     }


    // }

    // $scope.reportInfoIsNull = true;

    // 讀取器材檢核存下的資料
    $scope.searchResult = [];
    $scope.reportLoadForm_id = '';
    $scope.checkInfoLoad = function(dd) {

        // 讀取最新的 form_id
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

                    console.log('-------' + response.data.id);
                    $scope.reportLoadForm_id = response.data.id;
                    localStorage.setItem('reportLoadForm_id', response.data.id);
                    console.log(response.data);

                }
            });



        $scope.reportInfo = JSON.parse(localStorage.getItem('checkedInfo'));

        angular.forEach($scope.reportInfo, function(value, key) {
            if (value.id == dd) {
                $scope.searchResult = $scope.reportInfo[key];
            }
        });

        // delete $scope.reportInfo[1];
        $scope.reportInfoIsNull = true;
    }

    $scope.reportResult = [];
    $scope.ConfirmReportErrorMsg = '';
    $scope.isReportChecked = true;

    // 確定送出異常回報
    $scope.ConfirmReport = function(id, quantity, form_id, check_quantity) {

        if (id && form_id && quantity && $scope.resultInfo.reportDescription) {

            $scope.isReportChecked = false;
            $scope.reportResult.push({
                "eqpt_id": id,
                "form_id": form_id,
                "quantity": quantity,
                "remark": $scope.resultInfo.reportDescription,
                "pic": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABq0lEQVRoQ2NkGOKAcYi7n2HUAwMdg1SPAcbcov+EPPV/ch/V7KWaQTBHj3qAUPShyVMlBpBD/X5XB0EnKJZVwNVQmpxGPQAKyiEZA7gcnXvzOcEklCotCFfj39RAUXIiOwmNegAa7nSNAVyhfunLD3gymP30PdYkNFlJAC6ee+8DVjVb5k4kOTmRlIRGPQAN30EXA8glz2R1SXgyQE5ayGkGVzIbsCQ06gFo9NAkBogp75GTDTEV2eY7D+ApyldFgaISiWApNOoBLOE76GIAuW2Dq4RB9seoB5BCgyp5YEjGAHIl5XfwPMFSBVcSYnj9DGspxHjtNFHtIrJjYNQDsPAdqBjAVWEhlzA4u2Y8wtilvryFizMe3EjbJDTqAWxxQIsYQLYHuVnhk5wPl9p8/BhCmaIuwU49w/3LWNUzbp1HVLJBcRNh2xAqRj0AC4thFQOiUiSXPIMrCY16gJRcjNwKRJrI+G/vj5DBVUkh20NGcYnLmQTbQjg1jnoAEjTENhmoHgO4KjhSU+Sgm+AY9QCJIUB2JibRHpopH/UAzYKWSINHY4DIgKKZMgBQlsVAV8dz0QAAAABJRU5ErkJggg==",
                "signature": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABq0lEQVRoQ2NkGOKAcYi7n2HUAwMdg1SPAcbcov+EPPV/ch/V7KWaQTBHj3qAUPShyVMlBpBD/X5XB0EnKJZVwNVQmpxGPQAKyiEZA7gcnXvzOcEklCotCFfj39RAUXIiOwmNegAa7nSNAVyhfunLD3gymP30PdYkNFlJAC6ee+8DVjVb5k4kOTmRlIRGPQAN30EXA8glz2R1SXgyQE5ayGkGVzIbsCQ06gFo9NAkBogp75GTDTEV2eY7D+ApyldFgaISiWApNOoBLOE76GIAuW2Dq4RB9seoB5BCgyp5YEjGAHIl5XfwPMFSBVcSYnj9DGspxHjtNFHtIrJjYNQDsPAdqBjAVWEhlzA4u2Y8wtilvryFizMe3EjbJDTqAWxxQIsYQLYHuVnhk5wPl9p8/BhCmaIuwU49w/3LWNUzbp1HVLJBcRNh2xAqRj0AC4thFQOiUiSXPIMrCY16gJRcjNwKRJrI+G/vj5DBVUkh20NGcYnLmQTbQjg1jnoAEjTENhmoHgO4KjhSU+Sgm+AY9QCJIUB2JibRHpopH/UAzYKWSINHY4DIgKKZMgBQlsVAV8dz0QAAAABJRU5ErkJggg==",
                "status": 0,
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

                        angular.forEach($scope.reportInfo, function(value, key) {
                            if (value.id == id) {
                                $scope.reportInfo[key].status = 1;
                            }
                        });


                        localStorage.setItem('checkedInfo', JSON.stringify($scope.reportInfo));
                        console.log(localStorage.getItem('checkedInfo'));

                        $state.go('tab.goodrate', {}, { location: "replace", reload: true });

                    } else {

                        console.log('failed');
                    }
                });
        } else {

            $scope.ConfirmReportErrorMsg = "請填寫異常說明！";
            setTimeout(function() { $('.ui.negative.message').transition(); }, 1200);
        }

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