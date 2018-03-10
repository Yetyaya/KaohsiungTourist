$(document).ready(function (){
// 透過AJAX撈資料
  var khData;
  var dataURL = "https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97";
  // var dataURL = "https://next.json-generator.com/api/json/get/EkdepabBE";
  var xhr = new XMLHttpRequest();
  xhr.open("get",dataURL,true);
  xhr.send(null);
  xhr.onload = function (){
    var str = JSON.parse(xhr.responseText);
    // console.log(str);
    khData = str.result.records;
    // khData = JSON.parse(xhr.responseText);
    // console.log(khData);
    // console.log(khData.length); //100筆
  }

  // --------------------------------- //

  var regionSelect = document.getElementById("regionId");
  var regionBox = document.querySelector(".regionBox");
  var list = document.querySelector(".list");
  var page = document.querySelector(".page");

  // --------------------------------------- //

  regionSelect.addEventListener("change",goRegion,false); //選擇行政區
  regionBox.addEventListener("click",regionButton,false); //熱門行政區

  // --------------------------------------- //
  //選擇行政區
  function goRegion(e){
    var selectStr = e.target.value;
    findRegion(selectStr);
    $(".list").fadeOut(0);
    pageContent(1);
  }

  // --------------------------------------- //
  //熱門行政區
  function regionButton(e){
    if (e.target.localName !== "button"){ return; }
    // console.log(e.target.textContent);
    var ckeckStr = e.target.textContent;
    regionSelect.value = e.target.textContent; //選擇行政區隨著點擊熱門行政區更動
    $(".list").fadeOut(0);
    findRegion(ckeckStr);
    pageContent(1);
    // changeSize();
  }

  // --------------------------------------- //

  // findRegion 找出同一區的景點，text 是選擇的區域名
  var selectData;
  function findRegion(text){
    list.innerHTML = "";
    selectData = [];
    for (let i=0 ; i<khData.length ; i++){
      document.querySelector(".regionName").textContent = text;
      if (text == khData[i].Zone){
        selectData.push(khData[i]);
      }else if(text == ""){
        document.querySelector(".regionName").textContent = "";
      }
    }
    // 地圖地標
    initMap(selectData);

    if (selectData.length == 0){
      document.querySelector(".noInfo").textContent = "目前尚無此區景點資料";
    }else{
      document.querySelector(".noInfo").textContent = "";
    }
  }

  // --------------------------------------- //

  // 分頁
  // nowPage 目前所在頁數位置; pageNum 每頁資料上限
  var pageNum = 6; //每頁資料上限
  var nowPage = 1; //現在所在頁數
  var totalPage; //所有頁數
  var totalInfo; //該區所有資料數

  function pageContent(thisPage){
    totalInfo = selectData.length; //該區所有資料數
    // console.log(totalInfo);
    var countPage = totalInfo / pageNum;

    //總共有幾頁
    totalPage = Math.ceil(countPage); //無條件進位

    // 如果頁數超過1頁 顯示頁數/上一頁/下一頁
    if (totalPage > 1){
      page.style.display = "block";
    }else{
      page.style.display = "none";    
    }

    // nowPage = 1;
    var startInfo; //開始顯示的資料  
    var endInfo; //最後顯示的資料

    if (thisPage == totalPage){
      startInfo = (totalPage-1) * pageNum;   
      endInfo = totalInfo; 
    } else{
      startInfo = (thisPage-1) * pageNum;   
      endInfo = thisPage * pageNum; 
    }
    var str = "";  
    if (selectData.length == 0 ){   return;  }
    for (var i=startInfo ; i<endInfo ; i++){
      str += '<div class="localBox" data-id="' + i
          + '"><div class="pic"><img class="adjust" src="' + selectData[i].Picture1 
          + '"/></div><h3 class="placeName">' + selectData[i].Name 
          + '<span class="placeRegion">' + selectData[i].Zone 
          + '</span></h3><p class="time">' + selectData[i].Opentime 
          + '</p><p class="addr">' + selectData[i].Add 
          + '</p><p class="tel">' + selectData[i].Tel 
          + '</p><p class="free">' + selectData[i].Ticketinfo + '</p></div>'; 
    }
    list.innerHTML = str; 
    
    $(".list").fadeIn(300);
    
    nowPage = thisPage;
    pageCount(totalPage);
  }

  // --------------------------------------- //

  function pageCount(totalPage){
    //顯示頁數
    var btnStr = "";
    for(let i=0 ; i<totalPage ; i++){
      btnStr += '<button class="btn" data-num="' + (i+1) + '">' + (i+1) + '</button>';
    }
    page.innerHTML = '<button id="prevBtn" data-add="-1">< prev</button>' + btnStr + '<button id="nextBtn" data-add="1">next ></button>';
  } 

  // --------------------------------------- //

  //頁數監聽
  page.addEventListener("click",pageClick,false);

  function pageClick(e){
    e.preventDefault();
    if (e.target.localName !== "button"){ return; }
    var thisPage;
    var pageAdd = parseInt(e.target.dataset.add);

    if (pageAdd == -1 || pageAdd == 1){   
      if (pageAdd == -1){
        if (nowPage + pageAdd < 1){return;}
        thisPage = nowPage - 1;
      } else if (pageAdd == 1){
        if (nowPage + pageAdd > totalPage){return;}
        thisPage = nowPage + 1;
      }
    }else{
      thisPage = parseInt(e.target.dataset.num);
      if (nowPage == thisPage){return;}
    }
    
    $(".list").fadeOut(0);
    $(".list").fadeIn(300);
    $("html").animate({
      scrollTop: 0 }, 1000
    );
    // $("html").scrollTop(0);
    pageContent(thisPage);
  }

  // --------------------------------- //
  // JQ

  // 回到最上方
  $(window).scroll(function (){
    let scrollLen = $(document).scrollTop();
    // console.log(scrollLen);
    if (scrollLen >= 290){
      // 出現
      $(".topBtn").fadeIn(300);
    } else {
      // 消失
      $(".topBtn").fadeOut(300);
    }
  });
  
  // 移動到最上方
  $(".topBtn").click(function (e){
    e.preventDefault();
    // $(selector).animate(styles,speed,easing,callback)
    $("html,body").animate({
      scrollTop: 0 }, 1000
      // scrollTop() 方法返回或設置匹配元素的滾動條的垂直位置
    );
  });  
});

// --------------------------------- //

var map ;
function initMap(data){  
  map = new google.maps.Map(
    document.getElementById('map'), {
    center: {lat: 22.6275598, lng: 120.3119502},
    zoom: 13,
    styles: [
    {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#597c84"
            },
            {
                "lightness": "-37"
            }
        ]
    },
    {
        "featureType": "administrative.province",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "lightness": "0"
            },
            {
                "saturation": "0"
            },
            {
                "color": "#f5f5f2"
            },
            {
                "gamma": "1"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "all",
        "stylers": [
            {
                "lightness": "-3"
            },
            {
                "gamma": "1.00"
            }
        ]
    },
    {
        "featureType": "landscape.natural.terrain",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#bae5ce"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 45
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#fac9a9"
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text",
        "stylers": [
            {
                "color": "#4e4e4e"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#787878"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "transit.station.airport",
        "elementType": "labels.icon",
        "stylers": [
            {
                "hue": "#0a00ff"
            },
            {
                "saturation": "-77"
            },
            {
                "gamma": "0.57"
            },
            {
                "lightness": "0"
            }
        ]
    },
    {
        "featureType": "transit.station.rail",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#43321e"
            }
        ]
    },
    {
        "featureType": "transit.station.rail",
        "elementType": "labels.icon",
        "stylers": [
            {
                "hue": "#ff6c00"
            },
            {
                "lightness": "4"
            },
            {
                "gamma": "0.75"
            },
            {
                "saturation": "-68"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#eaf6f8"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#a8d7d8"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "lightness": "-49"
            },
            {
                "saturation": "-53"
            },
            {
                "gamma": "0.79"
            }
        ]
    }
]
  });
  
  
  for (var i=0 ; i<data.length ; i++){
    var marker = {};
    var place = {};
    
    // 記得用parseFloat將字串轉為數字(小數)
    place.lat = parseFloat(data[i].Py);
    place.lng = parseFloat(data[i].Px);
    
    marker.position = place;
    marker.map = map;
    marker.title = data[i].Name;
    
    new google.maps.Marker(marker);
  }
  
  var infoWindow = new google.maps.InfoWindow({map: map});

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: parseFloat(data[0].Py),
        lng: parseFloat(data[0].Px)
      };
      // infoWindow.setPosition(pos);
      // infoWindow.setContent('Location found.');
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}