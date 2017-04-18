// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

        .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'GoodrateCtrl',
        resolve: {
            "check": function($location) {

                if (sessionStorage.getItem('loggedin_id')) {

                    $location.path('tab/profile');
                }

            }
        }
    })

    .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
    })

    // 簽到
    .state('tab.dash', {
        url: '/dash',
        views: {
            'tab-dash': {
                templateUrl: 'templates/tab-dash.html',
                controller: 'DashCtrl'
            }
        }
    })

    // 個人資訊
    .state('tab.profile', {
        url: '/profile',
        views: {
            'tab-profile': {
                templateUrl: 'templates/profile.html',
                controller: 'profileCtrl'
            }
        }
    })

    // 簽退
    .state('tab.chats', {
        url: '/chats',
        views: {
            'tab-chats': {
                templateUrl: 'templates/check_out.html',
                controller: 'ChatsCtrl'
            }
        }
    })

    // 器材檢核
    .state('tab.account', {
        url: '/account',
        views: {
            'tab-account': {
                templateUrl: 'templates/equcheck.html',
                controller: 'EquCtrl'
            }
        }
    })

    // 良率檢核
    .state('tab.goodrate', {
        url: '/goodrate',
        views: {
            'tab-goodrate': {
                templateUrl: 'templates/goodrate.html',
                controller: 'EquCtrl'
            }
        }
    })

    .state('tab.goodrate-datail', {
        url: '/goodrate/:id',
        views: {
            'tab-goodrate': {
                templateUrl: 'templates/goodrate-detail.html',
                controller: 'EquCtrl'
            }
        }
    });

    // 預設頁面::登入頁面
    $urlRouterProvider.otherwise('/login');

});
