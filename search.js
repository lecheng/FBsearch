// facebook SDK
window.fbAsyncInit = function() {
    FB.init({
      appId      : '1649582958678776',
      xfbml      : true,
      version    : 'v2.8'
    });
    FB.AppEvents.logPageView();
  };

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

//Geolocation
loc = {};
function getGeolocation(){
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    function success(pos) {
      loc = pos.coords;
      console.log('Your current position is:');
      console.log(`Latitude : ${loc.latitude}`);
      console.log(`Longitude: ${loc.longitude}`);
      console.log(`More or less ${loc.accuracy} meters.`);
    };

    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    };

    navigator.geolocation.getCurrentPosition(success, error, options);
}
getGeolocation();

//other functions
function addAnimate(type){
    if(type != undefined){
        $('#list').addClass("animate-hide-right");
    }
    else{
        $('#favorite').addClass("animate-hide-right");
    }
}

function removeAnimate(type){
    if($('#list').hasClass("animate-hide-right"))   $('#list').removeClass("animate-hide-right");
    if($('#favorite').hasClass("animate-hide-right"))   $('#favorite').removeClass("animate-hide-right");
}

function convertTime(item,index,array){
    array[index]['created_time'] = moment(item['created_time']).format('YYYY-MM-DD H:MM:SS');
}

//angular
var app = angular.module("fb",["ngAnimate"]);
app.controller("myCtrl",function($scope,$http){
    $('#types tab')[0].classList.add('activeTab');
//    $scope.types = ["Users","Pages","Events","Places","Groups","Favorites"];
    $scope.tabs = [
        {"name":"Users","value":"user"},
        {"name":"Pages","value":"page"},
        {"name":"Events","value":"event"},
        {"name":"Places","value":"place"},
        {"name":"Groups","value":"group"}
    ]
    $scope.isRightSlide = false;
    $scope.theads = ["#","Profile photo","Name","Favorite","Details"];
    $scope.theadsF = ["#","Profile photo","Name","Type","Favorite","Details"];
    $scope.isTableShow = false;
    $scope.isFavoriteShow = false;
    $scope.isProgressShow = false;
    $scope.isDetailShow = false;
    $scope.type = "user";
    $scope.data = {"data":[],"paging":{}};
    $scope.clear = function(){
        $scope.keyword = undefined;
        $scope.isTableShow = false;
        $scope.isDetailShow = false;
        $scope.isFavoriteShow = false;
        $scope.type = "user";
        $('#types > tab.activeTab').removeClass('activeTab');
        $('#types tab')[0].classList.add('activeTab');
    }
    $scope.submitForm = function(event){
        if($scope.keyword==undefined){
            alert('Keyword is empty!');
            return;
        }
        if(event.currentTarget.getAttribute('value') != undefined){
            $scope.type = event.currentTarget.getAttribute('value');
            $('#types > tab.activeTab').removeClass('activeTab');
            event.currentTarget.classList.add('activeTab');
        }
        var type = $('#types > tab.activeTab').attr('value');
        if(type==undefined){
            alert("Type is incorrect!")
            return;
        }
        removeAnimate();
        $scope.isTableShow = false;
        $scope.isFavoriteShow = false;
        $scope.isDetailShow = false;
        $scope.isProgressShow = true;
        var params;
        if($scope.type=="place"){
            params = {
                q:$scope.keyword,
                type:$scope.type,
                latitude:loc.latitude,
                longitude:loc.longitude,
            };
        }
        else{
            params = {
                q:$scope.keyword,
                type:$scope.type,
            };
        }
        
        $http({
            method:'GET',
            url:'http://lechengbuptsse.appspot.com/search.php',
            params:params,
            headers : {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .success(function(data){
            $scope.isProgressShow = false;
            $scope.isTableShow = true;
            $scope.type = type;
            $scope.data.paging = data.paging;
            var dataList = [];
            data.data.forEach(function(obj){
                var isFavorite = (localStorage.getItem(obj.id)==null)?false:true;
                var d = {
                            "pictureUrl":obj.picture.data.url,
                            "id":obj.id,
                            "isFavorite":isFavorite,
                            "type":type,
                            "name":obj.name,
                }
                dataList.push(d);
            })
            $scope.data.data = dataList;
        })
        .error(function(){
            console.log('error');
        });
    }
    $scope.changePage = function(event){
        $http({
            method:'GET',
            url:event.currentTarget.getAttribute('href'),
        })
        .success(function(data){
            var type = $('#types > tab.activeTab').attr('value');
            $scope.data.paging = data.paging;
            var dataList = [];
            data.data.forEach(function(obj){
                var isFavorite = (localStorage.getItem(obj.id)==null)?false:true;
                var d = {
                            "pictureUrl":obj.picture.data.url,
                            "id":obj.id,
                            "isFavorite":isFavorite,
                            "type":type,
                            "name":obj.name,
                }
                dataList.push(d);
            })
            $scope.data.data = dataList;
        })
    }
    $scope.favorite = function(event,item){
        item.isFavorite = item.isFavorite? false:true;
        var id = event.currentTarget.getAttribute('itemid');
        if(localStorage.getItem(id)==null)  localStorage.setItem(id,JSON.stringify(item));
        else    localStorage.removeItem(id);
    }
    $scope.favoriteObjs = [];
    $scope.showFavorites = function(event){
        $('#types > tab.activeTab').removeClass('activeTab');
        removeAnimate();
        event.currentTarget.classList.add('activeTab');
        $scope.favoriteObjs = [];
        $scope.isTableShow = false;
        $scope.isDetailShow = false;
        $scope.isFavoriteShow = true;
        for(var i=0;i<localStorage.length;i++){
            var key = localStorage.key(i);
            var obj = JSON.parse(localStorage.getItem(key));
            if($scope.favoriteObjs.indexOf(obj)<0)  $scope.favoriteObjs.push(obj);
        }
    }
    $scope.delete = function(item){
        var index = $scope.favoriteObjs.indexOf(item);
        $scope.favoriteObjs.splice(index,1);
        localStorage.removeItem(item.id);
    }
    $scope.detail = function(item){
        $scope.isTableShow = false;
        $scope.isFavoriteShow = false;
        $scope.isProgressA = true;
        $scope.isProgressP = true;
        $scope.isDetailShow = true;
        $scope.detailInfo = {"item":item,"data":{}};
        $http({
            method:'GET',
            url:'http://lechengbuptsse.appspot.com/search.php',
//            url: 'data.json',
            params:{
                id:item.id,
            },
            headers : {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .success(function(data){
            var type = $('#types > tab.activeTab').attr('value');
            $scope.detailInfo.data = data;
            if(data.posts != undefined){
                if(data.posts.data != undefined) data.posts.data.forEach(convertTime);
            }
            $scope.isProgressA = false;
            $scope.isProgressP = false;
            addAnimate(type);
        })
        .error(function(){
            console.log('error');
        });
    }
    $scope.back = function(){
        var type = $('#types > tab.activeTab').attr('value');
        if(type != undefined){
            $scope.isFavoriteShow = false;
            $scope.isDetailShow = false;
            $scope.isTableShow = true;
        }
        else{
            $scope.isDetailShow = false;
            $scope.isTableShow = false;
            $scope.isFavoriteShow = true;
        }
    }
    $scope.fbPost = function(item){
        FB.ui({
            app_id: '1649582958678776',
            method: 'feed',
            picture: item.pictureUrl, 
            name: item.name, 
            caption: 'FB SEARCH FROM USC CSCI571',
        }, function(response){
                if (response && !response.error_message)
                    alert('Posted Successfully');
                else
                    alert('Not Posted');
            }
        );
    }
});