(function() {
    'use strict';

    angular.module('abort', [
            'services',
            'ngGeolocation',
            'icici.dateofbirth',
            'ui.bootstrap',
            'ngMessages',
            'icici.city',
            'icici.bootstrap'
        ])
        .controller('abortController', [
            '$scope',
            '$window',
            'applicationService',
            '$http',
            '$geolocation',
            'locationService',
            '$filter',
            '$rootScope',
            'commonService',
            function($scope, $window, applicationService, $http, $geolocation, locationService, $filter, $rootScope, commonService) {

                var pdfData = $rootScope.pdfData || {};

                var showAbort = true;
                var abortAgain = true;
                $rootScope.loading = false;
                $scope.disabledSubmit = false;
                var ua = navigator.userAgent.toLowerCase();
                var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
                if(isAndroid) {
                    var myEl = angular.element( document.querySelector( 'body' ) );
                    myEl.addClass('android');
                }
                $scope.$evalAsync(function() {
                    applicationService.skipAndContinue().get(function(data, headerGetter) {
                        var headers = headerGetter();
                        $scope.user.authorization = headers.authorization;
                    });
                });

                $window.onbeforeunload = function() {

                    if (abortAgain) {
                        var abortuser = {};
                        var savelater = {};
                        abortuser['firstName'] = $scope.user.firstname || null;
                        abortuser['lastName'] = $scope.user.lastname || null;
                        abortuser['mobilenumber'] = $scope.user.mobilenumber || null;
                        abortuser['cityName'] = $scope.user.cityName || null;
                        abortuser['errorMessage'] = $scope.user.errormessage || null;
                        abortuser['productName'] = $scope.user.productName || null;
                        abortuser['portalId'] = $scope.user.portalId || null;
                        abortuser['productId'] = $scope.user.productId || null;
                        abortuser['subProductId'] = $scope.user.subProductId || null;
                        abortuser['isICICIcust'] = $scope.user.isICICIcust || null;
                        abortuser['disbursementRequestId'] = $scope.user.disbursementRequestId || null;
                        abortuser['customerId'] = $scope.user.customerId || null;
                        abortuser['device'] = $scope.user.device || null;
                        abortuser['ipAddress'] = $scope.user.ipAddress || null;
                        abortuser['consent'] = 'Y';
                        abortuser['dropoutIdentifier'] = $scope.user.dropoutIdentifier;
                        if ($scope.productName === 'CC' || $scope.productName === 'AL') {
                            if ($scope.user.dob) {
                                abortuser['dob'] = commonService.getDate(new Date($scope.user.dob));
                            } else { abortuser['dob'] = null; }
                        } else {
                            if ($scope.user.dob instanceof Date)
                                abortuser['dob'] = commonService.getDate(new Date($scope.user.dob));
                            else
                                abortuser['dob'] = $scope.user.dob;
                        }
                        if ($scope.productName === 'CC') {
                            abortuser['spo_flag'] = $scope.user.spo_flag;
                        }
                        abortuser['marketingId'] = $window.marketingId || null;
                        abortuser['uploadPercentage'] = $window.abort.uploadPercentage || null;
                        if ($scope.user.res4) {
                            abortuser['res4'] = $scope.user.res4;
                        } else {
                            abortuser['res4'] = null;
                        }
                        savelater['portalId'] = $scope.user.portalId;
                        savelater['res4'] = $scope.user.res4;
                        savelater['isAbort'] = "Y";

                        if (parseInt($scope.user.dropoutIdentifier) > 5 && $scope.user.productId == "4") {
                            applicationService.postUploadLater().save(savelater).$promise.then(function(data) {});
                        }
                        $rootScope.loading = true;
                        if (abortuser['disbursementRequestId'] == null) {
                            delete abortuser['device'];
                            delete abortuser['ipAddress'];
                            delete abortuser['disbursementRequestId'];
                            delete abortuser['customerId'];
                        if(parseInt($scope.user.dropoutIdentifier) > 3)
                        {
                            applicationService.createLead(abortuser).success(function(data) {
                                    $rootScope.loading = false;
                                showAbort = false;

                                applicationService.syncInvalidatePDFToken(pdfData);

                                $window.open("http://www.icicibank.com/");
                                $window.close();
                            }).error(function(error) {
                                    $rootScope.loading = false;
                                $window.open("http://www.icicibank.com/");
                                $window.close();
                            });
                        }
                    }else {

                            abortuser['consent'] = 'N';
                            applicationService.createLeadDisbReq(abortuser).success(function(data) {
                                $rootScope.loading = false;
                                showAbort = false;

                                applicationService.syncInvalidatePDFToken(pdfData);

                                $window.open("http://www.icicibank.com/");
                                $window.close();
                            }).error(function(error) {
                                $rootScope.loading = false;
                                $window.open("http://www.icicibank.com/");
                                $window.close();
                            });
                        }
                        // if (showAbort) {
                        //     window.open("http://www.icicibank.com/", '');
                        // }
                    }
                };

                $scope.user = {};

                function getParameterByName(name) {

                    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
                    return match && decodeURIComponent(match[1]);
                }

                function modifyDate(date) {

                    if (angular.isDefined(date)) {
                        if (date != null && date != "" && date != undefined) {
                            var chunks = date.split('../../../index.html');
                            return '' + chunks[1] + '/' + chunks[0] + '/' + chunks[2];
                        }
                    } else {
                        return undefined;
                    }
                }

                $window.myVariable = JSON.parse(getParameterByName('abort'));
                $scope.eligy = $window.myVariable.dob;
                $scope.productName = $window.myVariable.productName;
                $scope.user = $window.myVariable;
                $scope.user.cityName = $window.myVariable.cityname || $window.myVariable.cityName;
                // $scope.user.cityName = $window.myVariable.cityname;
                
                if(angular.isDefined($scope.user.disbursementRequestId) && ($scope.user.disbursementRequestId !=null)){
                   
                    var d = document.getElementById("letUsConnect-modal");
                    var filledElements = document.getElementsByClassName('input--filled');
                    d.className += " disburse-abort";
                    for(var i=0; i<=(filledElements.length-1);i++){
                        var inputFilled = filledElements[i].getElementsByTagName('input')[0];
                        inputFilled.setAttribute('tabindex', '-1');
                    }
                }
                var ccDob = angular.copy($window.myVariable.dob);
                if(angular.isObject(ccDob)){
                    $scope.user.dob = commonService.getDate(ccDob);
                } else {
                    $scope.user.dob = ccDob;
                }
                if ($window.myVariable.dropoutIdentifier == '3') {
                    $scope.eligy = ccDob;
                }
                $scope.user.dob1 = new Date($scope.user.dob);
                if (!$window.myVariable) {
                    $window.myVariable.servpath = "../%25%25PLAPI%25%25/services/api/index.html"
                }
                $rootScope.token = $scope.user.authorization;
                $rootScope.csrfToken = $scope.user.csrfToken;
                $scope.connectCheckBox = true;

                $scope.submitForm = function(isValid) {
                    $rootScope.loading = true;
                    $scope.disabledSubmit = true;
                    var abortuser = {};
                    var savelater = {};
                    abortAgain = false;

                    abortuser['firstName'] = $scope.user.firstname;
                    abortuser['lastName'] = $scope.user.lastname;
                    abortuser['mobilenumber'] = $scope.user.mobilenumber;
                    abortuser['cityName'] = $scope.user.cityName;
                    abortuser['errorMessage'] = $scope.user.errormessage;
                    abortuser['productName'] = $scope.user.productName;
                    abortuser['portalId'] = $scope.user.portalId;
                    abortuser['productId'] = $scope.user.productId;
                    abortuser['subProductId'] = $scope.user.subProductId;
                    abortuser['isICICIcust'] = $scope.user.isICICIcust;
                    abortuser['disbursementRequestId'] = $scope.user.disbursementRequestId || null;
                    abortuser['customerId'] = $scope.user.customerId || null;
                    abortuser['device'] = $scope.user.device || null;
                    abortuser['ipAddress'] = $scope.user.ipAddress || null;
                    abortuser['consent'] = 'Y';
                    abortuser['dropoutIdentifier'] = $scope.user.dropoutIdentifier;
                    abortuser['isInsta'] = $scope.user.isInsta || 'N';
                    if ($scope.productName === 'CC' || $scope.productName === 'AL') {
                        if ($scope.user.dob instanceof Date)
                            abortuser['dob'] = commonService.getDate(new Date($scope.user.dob));
                        else
                            abortuser['dob'] = $scope.user.dob;
                    } else {
                        if ($scope.user.dob instanceof Date)
                            abortuser['dob'] = commonService.getDate(new Date($scope.user.dob));
                        else
                            abortuser['dob'] = $scope.user.dob;
                    }
                    if ($scope.productName === 'CC') {
                        abortuser['spo_flag'] = $scope.user.spo_flag;
                    }
                    abortuser['marketingId'] = $window.marketingId;
                    abortuser['uploadPercentage'] = $window.abort.uploadPercentage;
                    if ($scope.user.res4) {
                        abortuser['res4'] = $scope.user.res4;
                    } else {
                        abortuser['res4'] = null;
                    }
                    savelater['portalId'] = $scope.user.portalId;
                    savelater['res4'] = $scope.user.res4;
                    savelater['isAbort'] = "Y";

                    if (parseInt($scope.user.dropoutIdentifier) > 5 && $scope.user.productId == "4") {
                        applicationService.postUploadLater().save(savelater).$promise.then(function(data) {});
                    }
                    $rootScope.loading = true;
                    if (abortuser['disbursementRequestId'] == null) {
                        delete abortuser['device'];
                        delete abortuser['ipAddress'];
                        delete abortuser['disbursementRequestId'];
                        delete abortuser['customerId'];
                        applicationService.abortApplication().save(abortuser).$promise.then(function(data) {
                            $rootScope.loading = false;
                            showAbort = false;

                            applicationService.syncInvalidatePDFToken(pdfData);
                             $scope.disabledSubmit = false;
                            $window.open("http://www.icicibank.com/");
                            $window.close();
                        }, function(e) {
                            angular.element('#uploadscenario').show();
                        });
                    } else {
                        applicationService.abortApplicationDisReq().save(abortuser).$promise.then(function(data) {
                            $rootScope.loading = false;
                            showAbort = false;
                            applicationService.syncInvalidatePDFToken(pdfData);
                            $scope.disabledSubmit = false;
                            $window.open("http://www.icicibank.com/");
                            $window.close();
                        }, function(e) {
                            angular.element('#uploadscenario').show();
                        });
                    }
                };

                $rootScope.abortDob = $window.myVariable.dob;
                $scope.disableAbortDob = false;
                if ($rootScope.abortDobError == true) {
                    $scope.disableAbortDob = true;
                }

                $scope.setCurrentLocation = function() {

                    $geolocation.getCurrentPosition({
                        timeout: 60000
                    }).then(function(response) {

                        $scope.latitude = response.coords.latitude; // this is regularly updated
                        $scope.longitude = response.coords.longitude; // this is regularly updated
                        $scope.myError = response.error; // this becomes truthy, and has 'code' and 'message' if an error occurs
                        var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + $scope.latitude + ',' + $scope.longitude + '&sensor=true';
                        locationService.getCurrentLocation(url).get().$promise.then(function(data) {

                            var tempLocation = [];
                            data.results.forEach(function(val) {
                                val.address_components.forEach(function(add) {
                                    tempLocation.push(add);
                                });
                            });

                            $scope.user.cityName = $filter('filter')(tempLocation, { $: 'locality' }, true)[0].long_name;
                            $scope.cityError = false;
                            if (!angular.isUndefined($scope.user.resCity)) {
                                $scope.cities = [];
                                applicationService.getCities($scope.user.resCity, $scope.user.productId, $scope.user.subProductId).get().$promise.then(function(data) {
                                    $scope.cities = data.cities;
                                    if ($scope.cities.length == 0) {
                                        $scope.cityError = true;
                                    }
                                });
                            }
                        });
                    }, function(error) {

                        $scope.cityfetchError = true;
                    });
                };

                $scope.enterTenDigits = false;

                $scope.checkLength = function() {

                    $scope.enterTenDigits = false;
                };

                $scope.checkUser = function(mobNumber) {

                    if (mobNumber != null && mobNumber.length == 10) {
                        $scope.enterTenDigits = false;
                    }
                };

                $scope.checkMobLength = function(mobNumber) {

                    if (mobNumber.length < 10 || mobNumber === undefined) {
                        $scope.enterTenDigits = true;
                    }
                };

                $scope.cityError = false;
                $scope.hidecities = true;
                $scope.interfaceName = "APS";
                $scope.countryOfResidence = -99;
                var productId = $scope.user.productId;
                var subProductId = $scope.user.subProductId;

                if (productId == '3') {
                    $scope.interfaceName = $window.myVariable.interfaceName;
                    $scope.countryOfResidence = $window.myVariable.countryOfResidence;
                }

                $scope.showcities = function() {

                    $scope.cityError = false;
                    $scope.cityfetchError = false;
                    if (!angular.isUndefined($scope.user.cityName)) {
                        if ($scope.user.cityName.length >= 3) {
                            if (productId == "2" || productId == "1") {
                                applicationService.getCities($scope.user.cityName, productId, subProductId).get().$promise.then(function(data) {
                                    $scope.cities = data.cities;
                                    if ($scope.cities.length == 0) {
                                        $scope.cityError = true;
                                        $scope.hidecities = true;
                                    } else {
                                        $scope.hidecities = false;
                                    }
                                });
                            } else if (productId == "4" || productId == "3") {
                                applicationService.getCitiesHL($scope.user.cityName, $scope.countryOfResidence, $scope.interfaceName, productId).get().$promise.then(function(data) {
                                    $scope.cities = data.cities;
                                    if ($scope.cities.length == 0) {
                                        $scope.cityError = true;
                                        $scope.hidecities = true;
                                    } else {
                                        $scope.hidecities = false;
                                    }
                                });
                            }
                        } else {
                            $scope.hidecities = true;
                            $scope.cityError = false;
                        }
                    }
                };

                $scope.selectedCity = function(city) {

                    $scope.user.cityName = city.cityName;
                    $scope.hidecities = true;
                };
            }
        ])
        .directive('abortTitleCase', [
            '$parse',
            function($parse) {

                return {
                    restrict: 'A',
                    require: 'ngModel',
                    link: function(scope, iElem, iAttrs, ngModelCtrl) {

                        var model = $parse(iAttrs.ngModel);

                        function titleCase(val) {

                            var capitalized, chunks;

                            if (angular.isString(val)) {
                                chunks = val.split(' ');
                                angular.forEach(chunks, function(chunk, index) {
                                    chunks[index] = chunk.charAt(0).toUpperCase() + chunk.substring(1).toLowerCase();
                                });
                                capitalized = chunks.join(" ");
                            }
                            return capitalized;
                        };

                        function convertToTitleCase(val) {

                            var result;

                            if (angular.isString(val)) {
                                result = titleCase(val);
                                if (result !== val) {
                                    ngModelCtrl.$setViewValue(result);
                                    ngModelCtrl.$render();
                                }
                            }

                            return result;
                        }

                        ngModelCtrl.$parsers.push(convertToTitleCase);
                        convertToTitleCase(model(scope));
                    }
                };
            }
        ])
        .directive('mblSame', [
            function() {

                return {
                    restrict: 'A',
                    require: 'ngModel',
                    link: function(scope, iElem, iAttrs, ctrl) {

                        ctrl.$validators.mblSame = function(modelVal, viewVal) {

                            var inputVal = modelVal || viewVal;
                            if (angular.isDefined(inputVal)) {
                                if (inputVal === '9999999999' || inputVal === '8888888888' || inputVal === '7777777777') {
                                    return false;
                                }
                            }
                            return true;
                        };
                    }
                };
            }
        ]);
})();
