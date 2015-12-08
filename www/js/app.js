(function(){
    'use strict';
    var module = angular.module('app', ['onsen']);
    //var storage_manager = new StorageManager("SOFTCREAM_COLLECTION_LIST");

    module.controller('AppController', function($scope, $data) {
        $scope.doSomething = function() {
            setTimeout(function() {
                alert('tappaed');
            }, 100);
        };
    });

    module.controller('MasterController', function($scope, $data) {
        $scope.items = $data.items;

        $scope.showDetail = function(index) {
            console.log("show detail comes");
            var selectedItem = $data.items[index];
            $data.selectedItem = selectedItem;
            //$scope.ons.navigator.pushPage('detail.html', {title : selectedItem.title});
            myNavigator.pushPage('entry_record.html', {title : selectedItem.title});
        };
    });


    module.controller("HomeController", function(currentBikeInfo){
        this.data = currentBikeInfo;

        this.visibility = {};
        this.visibility.dbg_disp_area = "inline";

        this.selectT_MAINTAINANCE = function(){
            dBAdapter.selectT_MAINTAINANCE();
        }
    });


    module.controller('EntryController', function($scope, selectList) {

        $scope.sf_title =  "";
        $scope.sf_date = "";
        $scope.sf_picture = "";
        $scope.sf_selected_flavor_group = "";
        $scope.sf_map_pos = "";
        $scope.sf_rating = 0;   
        $scope.sf_rating_corn = 0;
        $scope.sf_price = 0;
        $scope.sf_comment = "";

        // 味の系統リスト
        $scope.showSelectListFlavorGroup = function(){
            
            selectList.removeAllItems();

            selectList.addItem("1", "甘さたっぷり");
            selectList.addItem("2", "濃厚系");
            selectList.addItem("3", "ミルク感強し");
            selectList.addItem("4", "さっぱり");

            myNavigator.pushPage('list_select_page.html', {title: "flavor_group"});
        };

        //登録ボタン
        $scope.entryRecord = function(){

            //タイトルの入力判定
            if(isEmpty($scope.sf_title)){
                ons.notification.alert({
                  message: "タイトルを入力してよっ！！"
                });

                return;
            }


            var id = formatDate(new Date());

            var sf_obj = {
                id: id,
                title: $scope.sf_title,
                date: $scope.sf_date,
                picture: $scope.sf_picture,
                flavor_group: $scope.sf_selected_flavor_group,
                map: $scope.sf_map_pos,
                rating: $scope.sf_rating,
                rating_corn: $scope.sf_rating_corn,
                price: $scope.sf_price,
                comment: $scope.sf_comment
            };

            //ストレージに1件登録
            try{
                storage_manager.saveItem2Storage(id, sf_obj);

                //操作成功の場合は前画面に戻る
                myNavigator.popPage();
            }
            catch(e){
                ons.notification.alert({
                  message: "登録に失敗しました..."
                });
            }

            //ここで、成功した場合のみ前画面に戻りたい...
        }

        // リスト選択イベント受け取り
        $scope.$on("listSelected", function(e, param){

            //$scope.selected_bike = item.value;

            switch(param.parent_option.title){
                case "flavor_group":
                    $scope.sf_selected_flavor_group = param.item.value;
                    break;
                default:
                    console.log("return value missing...");
            }
        });

    });


    // 整備レコード照会画面用 controller
    module.controller("ViewListController", function($scope){

        $scope.items = storage_manager.getAllItem();

        $scope.processItemSelect = function(index){
            console.log("item selected!!");

        }
    });


    //汎用 選択リスト画面
    module.controller("SelectListController", function($scope, $rootScope, selectList){

        $scope.items = selectList.items;

        $scope.processItemSelect = function(index){
            var nav_options = myNavigator.getCurrentPage().options;
            var selectedItem = selectList.items[index];
            selectList.selectedItem = selectedItem;
            myNavigator.popPage();

            // イベント通知
            $rootScope.$broadcast("listSelected", {parent_option: nav_options, item: selectedItem});

        }
    });

    module.factory("currentBikeInfo", function(){
        var data = {};

        data.name = "gn125";
        data.purchace_date = "2012/03/11";
        data.comment = "this is my first bike";
        data.img = "none";
        data.maintainance_records = 11;
        data.touring_records = 21;

        return data;

    });

    module.service("selectList", function(){
        this.items = [];
        this.selectedItem = {};
        this.addItem = function(_key, _value){
            this.items.push({
                key: _key,
                value: _value
            });
        };
        this.removeItem = function(idx){
            this.items.splice(idx, 1);
        };
        this.removeAllItems = function(){
            this.items.length = 0;
        };
        this.createItemsFromObjectArr = function(objArr, key_name, value_name){
            /*
            objArr.forEach(function(val, idx, objArr){
                this.addItem(val[key_name], val[value_name]);
            });
            */
            for(var i = 0; i < objArr.length; i++){
                this.addItem(objArr[i][key_name], objArr[i][value_name]);
            }

        };
        this.createItemsFromArr = function(arr){
            /*
            arr.forEach(function(val, idx){
                this.addItem(idx, val);
            });
            */
            for(var i = 0; i < arr.length; i++){
                this.addItem("" + i, arr[i]);
            }
        };

    });

    module.controller("_ts", function(currentBikeInfo){
        this.data = currentBikeInfo;
    });


    module.controller('DetailController', function($scope, $data) {
        $scope.item = $data.selectedItem;
    });

    module.factory('$data', function() {
        var data = {};

        data.items = [
            {
                title: 'Item 1 Title',
                label: '4h',
                desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
            },
            {
                title: 'Another Item Title',
                label: '6h',
                desc: 'Ut enim ad minim veniam.'
            },
            {
                title: 'Yet Another Item Title',
                label: '1day ago',
                desc: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
            },
            {
                title: 'Yet Another Item Title',
                label: '1day ago',
                desc: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
            }
        ];

        return data;
    });





    /*
    module.controller('EntryController', function($scope) {

        ons.createPopover('entry_select_list_bike.html').then(function(popover) {
            $scope.popover_bike = popover;
        });

        ons.createPopover('entry_select_list_d_bunrui.html').then(function(popover) {
            $scope.popover_d_bunrui = popover;
        });

        $scope.show_select_list_bike = function(e) {
            $scope.popover_bike.show(e);
        };

        $scope.show_select_list_d_bunrui = function(e) {
            $scope.popover_d_bunrui.show(e);
        };

        $scope.select_bike = function(){
            console.log("in select_bike");
        }

    });
*/




})();