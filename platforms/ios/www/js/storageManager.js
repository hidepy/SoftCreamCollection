/*********************************

	localStorage manager

**********************************/

/*
**********	properties	**********
なし


**********	methods		**********
convStorage2Hash -private
	_storage_key_nameをキーとし、localstorageから保存されたデータを取得する

getAllItem -public
	現在保持しているハッシュの値を全件返却する

getItem(key) -public
	key に指定された値をキーとして、現在保持しているハッシュの値1件を返却する

deleteItem(key) -public
	key に指定された値をキーとして、現在保持しているハッシュ、localstorageから1件削除する

saveItem2Storage(key, data) -public
	key に指定された値をキーとし、dataを現在保持しているハッシュ、localstorageに1件登録する

*/
var StorageManager = function(storage_key_name){

	this.init(storage_key_name);

	console.log("要素の長さ: " + Object.keys(this.getAllItem));

};

// プロトタイプ定義
!function(proto){

	var _storage_key_name = "";
	var _items = {};

	proto.init = function(storage_key_name) {
		//initialize...

		//対象となるlocalstorageのキーを格納
		_storage_key_name = storage_key_name;

		//インスタンス化直後、現在のストレージの情報をハッシュに格納する
		_items = convStorage2Hash(storage_key_name);

		console.log("init ends");
	};

	var convStorage2Hash = function(storage_key_name){

		var item_hash = {};

		try{

			//console.log(JSON.parse('{"hoge": 1}'));

			var s = window.localStorage.getItem(storage_key_name);

			if(s){
				item_hash = JSON.parse(s);
			}

		}
		catch(e){
			console.log("eror occured");
			console.log(e);
		}

		return item_hash;
	};

	//proto.convStorage2Hash = function(){
	var _convStorage2Hash = function(storage_key_name){

		console.log("storage_key_name is: " + storage_key_name);

		var items = window.localStorage.getItem(storage_key_name);	

		console.log("before parse");
		console.log(items);

		if(!items){
			return {};
		}

		console.log("is not returned");

		var item_hash = JSON.parse(items);

		console.log("after parse");

		return item_hash;
	};

	proto.getAllItem = function(){
		return _items;
	};

	proto.getItem = function(key){
		return _items[key];
	}

	proto.deleteItem = function(key){

		delete　_items[key];

		window.localStorage.setItem(JSON.stringify(_items));
	};

	proto.saveItem2Storage = function(key, data){

		_items[key] = data;

		window.localStorage.setItem(_storage_key_name, JSON.stringify(_items));

	};

	// ！！！！！！！！！！通常使用不可！！！！！！！！！！
	proto.deleteAllItem = function(){
		window.localStorage.setItem(_storage_key_name, {});
	}

}(StorageManager.prototype);



