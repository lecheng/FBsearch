<?php
    if($_GET['type'] != ''){
        $keyword = urlencode($_GET['q']);
        if($_GET['type'] == 'place'){
            $url = "https://graph.facebook.com/v2.8/search?q={$keyword}&type={$_GET['type']} &fields=id,name,picture.width(700).height(700)&center={$_GET['latitude']},{$_GET['longitude']}&access_token=EAAXcSXZAHkvgBAMtgZCmomQK6WF6MFHDRcy5xPvzoUSIxmMwAzfULNpapN5971CGb0uEB4jpscXS7357eYXahHAPUWqRcsbrZARGDB8w4ejxr1Wjbzy73OFi7OLz7fTdeyfClu4DCcht271eEkCZCfBdKDZATfRYZD";
        }
        else{
            $url = "https://graph.facebook.com/v2.8/search?q=" .$keyword ."&type=" .$_GET['type'] ."&fields=id,name,picture.width(700).height(700)&access_token=EAAXcSXZAHkvgBAMtgZCmomQK6WF6MFHDRcy5xPvzoUSIxmMwAzfULNpapN5971CGb0uEB4jpscXS7357eYXahHAPUWqRcsbrZARGDB8w4ejxr1Wjbzy73OFi7OLz7fTdeyfClu4DCcht271eEkCZCfBdKDZATfRYZD";
        }
        
        $json = file_get_contents($url);
        echo $json;
    }
    else if($_GET['id'] != ''){
        $url = "https://graph.facebook.com/v2.8/{$_GET['id']}?fields=albums.limit(5){name,photos.limit(2){name, picture}},posts.limit(5)&access_token=EAAXcSXZAHkvgBAMtgZCmomQK6WF6MFHDRcy5xPvzoUSIxmMwAzfULNpapN5971CGb0uEB4jpscXS7357eYXahHAPUWqRcsbrZARGDB8w4ejxr1Wjbzy73OFi7OLz7fTdeyfClu4DCcht271eEkCZCfBdKDZATfRYZD";
        $detail = file_get_contents($url);
        echo $detail;
    }
?>