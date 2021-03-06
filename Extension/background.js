var min = 1;
var max = 5;
var current = min;
// var currentTabId;
// var currentUrl;
var fonts = [];
var target_fonts;
var plugins_temp = navigator.plugins; //Get plugins
var windowInfo; //Get window info
var userAgent = navigator.userAgent; //Get useragent
var date = new Date();
var timezone = date.getTimezoneOffset(); //Get timezone offset 
var screenheight = screen.height;
var screenwidth = screen.width;
var screendepth = screen.colorDepth;
var cookieEnabled = navigator.cookieEnabled;
var productSub = navigator.productSub;
var vendor = navigator.vendor;
var appVersion = navigator.appVersion;
var plugins = [];
var start;
var ips = [];
var URL = "https://androidsp.cs.unipi.gr:3001";
var   enc_plugins = [],
      enc_userAgent = "",
      enc_timezone = "",
      enc_cookieEnabled = "",
      enc_vendor = "",
      enc_productSub = "",
      enc_appVersion = "",
      enc_screendepth = "",
      enc_screenwidth = "",
      enc_screenheight = "",
      enc_fonts = [],
      enc_ips = [],
      enc_windowInfo = [];


var mycanvas = document.createElement("canvas");
mycanvas.id = "mycanvas";
document.body.appendChild(mycanvas);
gl = mycanvas.getContext("webgl");
gl.getExtension("WEBGL_debug_renderer_info");
webgl_gpu = gl.getParameter(37445);
webgl_gpu_vendor = gl.getParameter(37446);
webgl_shading_language_version = gl.getParameter(35724);
mycanvas.parentNode.removeChild(mycanvas);

//=================
// PSI requirements
//=================

var d = "5335761441782397234277447234913973201589175185447866954705307829918478026113498853291309468649025691088536692510101188431712139864088437299644669460473642261640495958458775315790900427648082799857147217568124167548444594999637191278982927661967296239864300239885211343388124155877797952742820716549114263881";
var n = "76401528863904952489150329786881595305341877677233309287857059045087894777671045302196318253627091264336777194021084025835507649174735397707409373482862393194466338546059932547698937851434291422254193216437880662517954000639540828451495436650148843556671167988287429211842659543191848230350764449474023290543";

one = bigInt(1);
var e = (one.shiftLeft(16)).add(1);

function xgcd(a, b) {
      a = bigInt(a);
      b = bigInt(b);
      if (b.isZero() == true) {
          return [1, 0, a];
      }
      tmp = a.divmod(b);
      temp = xgcd(b, a.mod(b));
      x = bigInt(temp[0]);
      y = bigInt(temp[1]);
      d = bigInt(temp[2]);

      // x-y*(a//b)
      adivb = a.divide(b);
      yprod = y.multiply(adivb);
      res = x.minus(yprod);
      return [y, res, d];
  }

  function invMod(a, n) {
      tmp = xgcd(a, n);
      if (tmp[0].isNegative()) {
          return tmp[0].plus(n);
      } else {
          return tmp[0].mod(n);
      }
  }

  function genPrime(BITS) {
      var lb = one.shiftLeft(BITS - 1);
      var ub = lb.shiftLeft(1);
      var p = bigInt.randBetween(lb, ub);
      while (p.isPrime() == false) {
          p = bigInt.randBetween(lb, ub);
      }
      return p;
  }

  function encrypt(m, e, n) {
      return m.modPow(e, n);
  }

  function decrypt(c, d, n) {
      return c.modPow(d, n);
  }

  function keyGen(bits) {
      var p = genPrime(bits);
      var q = genPrime(bits);
      var n = p.multiply(q);
      var fi = (p.add(-1)).multiply(q.add(-1));
      var d = invMod(e, fi);
      return [d, n];
  }

//=================
// End of basic functions for PSI
//=================



for (var i = 0; i < plugins_temp.length ; i++) {
  plugins.push({
    name: plugins_temp[i].name,
    filename: plugins_temp[i].filename,
    description: plugins_temp[i].description
  });
};


function errorHandler(e) {  
  console.log(e);
}



function initialize_bronymity(details){  
  start = performance.now(); 
  // chrome.tabs.getSelected(null,currentTab);  
  // chrome.windows.getLastFocused(null, WindowInfo);  
  call_remote_server(details);  
}




function getLocalIPs(callback) {

    var RTCPeerConnection = window.RTCPeerConnection ||
        window.webkitRTCPeerConnection || window.mozRTCPeerConnection;

    var pc = new RTCPeerConnection({
        iceServers: []
    });
    pc.createDataChannel('');
    
    // onicecandidate is triggered whenever a candidate has been found.
    pc.onicecandidate = function(e) {
        if (!e.candidate) { // Candidate gathering completed.
            pc.close();
            callback(ips);
            return;
        }
        var ip = /^candidate:.+ (\S+) \d+ typ/.exec(e.candidate.candidate)[1];
        if (ips.indexOf(ip) == -1) // avoid duplicate entries (tcp/udp)
            ips.push(ip);
    };
    pc.createOffer(function(sdp) {
        pc.setLocalDescription(sdp);
    }, function onerror() {});
}


function parseURL(url) { //Function to parse the url. Aquiring the hostname of the visiting url.
    var parser = document.createElement('a'),
        searchObject = {},
        queries, split, i;
    // Let the browser do the work
    parser.href = url;
    // Convert query string to object
    queries = parser.search.replace(/^\?/, '').split('&');
    for( i = 0; i < queries.length; i++ ) {
        split = queries[i].split('=');
        searchObject[split[0]] = split[1];
    }
    return {
        protocol: parser.protocol,
        host: parser.host,
        hostname: parser.hostname,
        port: parser.port,
        pathname: parser.pathname,
        search: parser.search,
        searchObject: searchObject,
        hash: parser.hash
    };
}


function sendtoflask(){
  //Sending to the flask framework in order to update the fonts
  var xhr2 = new XMLHttpRequest();
  var url2 = "http://localhost:5000/fonts";
  xhr2.open("POST", url2, false); // False for synchronous
  xhr2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr2.onreadystatechange = function() {
    if (xhr2.readyState === 4) {
      //Upon receiving the response from the flask framework
      var res = xhr2.responseText;
      var success_count = JSON.parse(res).success_count;
      var fail_count = JSON.parse(res).fail_count;
      var python_elapsed_time = JSON.parse(res).elapsed_time;
      console.log('Fonts successfully removed: ' + success_count);
      console.log('Fonts failed to be removed: ' + fail_count)
      var end = performance.now();
      var time = end - start;
      console.log('Execution time: ' + time/1000 + ' seconds');
      console.log('Font removal time: ' + python_elapsed_time + ' seconds')
    }
  };
  //Send only the plugins and the fonts. At the moment plugins are useless / no need to send them.
  xhr2.send("fonts=" + encodeURIComponent(JSON.stringify(fonts))
          + "&target_fonts=" + encodeURIComponent(JSON.stringify(target_fonts))
         );
}


function PSI_encrypt(data){
  m = bigInt(md5(data), 16);
  return m
}


function obfuscate(data){
  r = bigInt.randBetween(0,n);
  obf = (r.modPow(e, n).multiply(data)).mod(n);
  return {
        obfuscated: obf.toString(),
        r_value: r.toString()
    };       
}

function dump_enc_profile(){
      var r;
      var obf;

      stuff = {}
      var rs = {}
      // stuff['windowInfo'] = {}
      // rs['windowInfo'] = {}

      // stuff['windowInfo']['alwaysOnTop'] = (bigInt(md5(windowInfo.alwaysOnTop), 16)).toString();

      // stuff['windowInfo']['focused'] = bigInt(md5(windowInfo.focused), 16).toString();
      // stuff['windowInfo']['height'] = bigInt(md5(windowInfo.height), 16).toString();
      // stuff['windowInfo']['incognito'] = bigInt(md5(windowInfo.incognito), 16).toString();
      // stuff['windowInfo']['left'] = bigInt(md5(windowInfo.left), 16).toString();
      // stuff['windowInfo']['state'] = bigInt(md5(windowInfo.state), 16).toString();
      // stuff['windowInfo']['top'] = bigInt(md5(windowInfo.top), 16).toString();
      // stuff['windowInfo']['type'] = bigInt(md5(windowInfo.type), 16).toString();
      // stuff['windowInfo']['width'] = bigInt(md5(windowInfo.width), 16).toString();


      // result = obfuscate(stuff['windowInfo']['alwaysOnTop'])
      // stuff['windowInfo']['alwaysOnTop'] = result.obfuscated
      // rs['windowInfo']['alwaysOnTop'] = result.r_value
      

      // result = obfuscate(stuff['windowInfo']['focused'])
      // stuff['windowInfo']['focused'] = result.obfuscated
      // rs['windowInfo']['focused'] = result.r_value

      // result = obfuscate(stuff['windowInfo']['height'])
      // stuff['windowInfo']['height'] = result.obfuscated
      // rs['windowInfo']['height'] = result.r_value

      // result = obfuscate(stuff['windowInfo']['incognito'])
      // stuff['windowInfo']['incognito'] = result.obfuscated
      // rs['windowInfo']['incognito'] = result.r_value

      // result = obfuscate(stuff['windowInfo']['left'])
      // stuff['windowInfo']['left'] = result.obfuscated
      // rs['windowInfo']['left'] = result.r_value

      // result = obfuscate(stuff['windowInfo']['state'])
      // stuff['windowInfo']['state'] = result.obfuscated
      // rs['windowInfo']['state'] = result.r_value

      // result = obfuscate(stuff['windowInfo']['top'])
      // stuff['windowInfo']['top'] = result.obfuscated
      // rs['windowInfo']['top'] = result.r_value

      // result = obfuscate(stuff['windowInfo']['type'])
      // stuff['windowInfo']['type'] = result.obfuscated
      // rs['windowInfo']['type'] = result.r_value

      // result = obfuscate(stuff['windowInfo']['width'])
      // stuff['windowInfo']['width'] = result.obfuscated
      // rs['windowInfo']['width'] = result.r_value




      stuff['userAgent'] = bigInt(md5(userAgent), 16).toString();

      stuff['timezone'] = bigInt(md5(timezone), 16).toString();
      stuff['cookieEnabled'] = bigInt(md5(cookieEnabled), 16).toString();
      stuff['vendor'] = bigInt(md5(vendor), 16).toString();
      stuff['productSub'] = bigInt(md5(productSub), 16).toString();
      stuff['appVersion'] = bigInt(md5(appVersion), 16).toString();
      stuff['screendepth'] = bigInt(md5(screendepth), 16).toString();
      stuff['screenwidth'] = bigInt(md5(screenwidth), 16).toString();
      stuff['screenheight'] = bigInt(md5(screenheight), 16).toString();

      result = obfuscate(stuff['userAgent'])
      stuff['userAgent'] = result.obfuscated
      rs['userAgent'] = result.r_value


      result = obfuscate(stuff['timezone'])
      stuff['timezone'] = result.obfuscated
      rs['timezone'] = result.r_value

      result = obfuscate(stuff['cookieEnabled'])
      stuff['cookieEnabled'] = result.obfuscated
      rs['cookieEnabled'] = result.r_value

      result = obfuscate(stuff['vendor'])
      stuff['vendor'] = result.obfuscated
      rs['vendor'] = result.r_value

      result =obfuscate(stuff['productSub'])
      stuff['productSub'] = result.obfuscated
      rs['productSub'] = result.r_value

      result = obfuscate(stuff['appVersion'])
      stuff['appVersion'] = result.obfuscated
      rs['appVersion'] = result.r_value

      result = obfuscate(stuff['screendepth'])
      stuff['screendepth'] = result.obfuscated
      rs['screendepth'] = result.r_value

      result = obfuscate(stuff['screenwidth'])
      stuff['screenwidth'] = result.obfuscated
      rs['screenwidth'] = result.r_value

      result = obfuscate(stuff['screenheight'])
      stuff['screenheight'] = result.obfuscated
      rs['screenheight'] = result.r_value

      stuff['ips'] = new Array(ips.length);
      rs['ips'] = new Array(ips.length);
      console.log(ips);

      ips.forEach(function(element, index){
        stuff['ips'][index] = bigInt(md5(element), 16).toString();

        result = obfuscate(stuff['ips'][index])
        stuff['ips'][index] = result.obfuscated
        rs['ips'][index] = result.r_value
      })

      stuff['plugins'] = new Array(plugins.length);
      rs['plugins'] = new Array(plugins.length);


      plugins.forEach(function(element, index){

        stuff['plugins'][index] = {}
        rs['plugins'][index] = {}


        stuff['plugins'][index]['description'] = bigInt(md5(element.description), 16).toString();
        stuff['plugins'][index]['filename'] = bigInt(md5(element.filename), 16).toString();
        stuff['plugins'][index]['name'] = bigInt(md5(element.name), 16).toString();
      
        result = obfuscate(stuff['plugins'][index]['description'])
        stuff['plugins'][index]['description'] = result.obfuscated
        rs['plugins'][index]['description'] = result.r_value

        result = obfuscate(stuff['plugins'][index]['filename'])
        stuff['plugins'][index]['filename'] = result.obfuscated
        rs['plugins'][index]['filename'] = result.r_value

        result = obfuscate(stuff['plugins'][index]['name'])
        stuff['plugins'][index]['name'] = result.obfuscated
        rs['plugins'][index]['name'] = result.r_value

      })

      stuff['fonts'] = new Array(fonts.length);
      rs['fonts'] = new Array(fonts.length);

      fonts.forEach(function(element, index){
        stuff['fonts'][index] = {}
        rs['fonts'][index] = {}


        stuff['fonts'][index]['displayName'] = bigInt(md5(element.displayName), 16).toString();
        stuff['fonts'][index]['fontId'] = bigInt(md5(element.fontId), 16).toString();

        result = obfuscate(stuff['fonts'][index]['displayName'])
        stuff['fonts'][index]['displayName'] = result.obfuscated
        rs['fonts'][index]['displayName'] = result.r_value

        result = obfuscate(stuff['fonts'][index]['fontId'])
        stuff['fonts'][index]['fontId'] = result.obfuscated
        rs['fonts'][index]['fontId'] = result.r_value

      })


      // NOT TESTED
      stuff['webgl_gpu'] = bigInt(md5(webgl_gpu), 16).toString();
      result = obfuscate(stuff['webgl_gpu'])
      stuff['webgl_gpu'] = result.obfuscated
      rs['webgl_gpu'] = result.r_value

      stuff['webgl_gpu_vendor'] = bigInt(md5(webgl_gpu_vendor), 16).toString();
      result = obfuscate(stuff['webgl_gpu_vendor'])
      stuff['webgl_gpu_vendor'] = result.obfuscated
      rs['webgl_gpu_vendor'] = result.r_value

      stuff['webgl_shading_language_version'] = bigInt(md5(webgl_shading_language_version), 16).toString();
      result = obfuscate(stuff['webgl_shading_language_version'])
      stuff['webgl_shading_language_version'] = result.obfuscated
      rs['webgl_shading_language_version'] = result.r_value

      return rs

}


function rehash_elements(data, rs){
  // data['windowInfo']['alwaysOnTop'] = bigInt(md5((bigInt(data['windowInfo']['alwaysOnTop']).multiply(invMod(rs['windowInfo']['alwaysOnTop'], n)).mod(n))), 16);
  // data['windowInfo']['focused'] = bigInt(md5((bigInt(data['windowInfo']['focused']).multiply(invMod(rs['windowInfo']['focused'], n)).mod(n))), 16);
  // data['windowInfo']['height'] = bigInt(md5((bigInt(data['windowInfo']['height']).multiply(invMod(rs['windowInfo']['height'], n)).mod(n))), 16);
  // data['windowInfo']['incognito'] = bigInt(md5((bigInt(data['windowInfo']['incognito']).multiply(invMod(rs['windowInfo']['incognito'], n)).mod(n))), 16);
  // data['windowInfo']['left'] = bigInt(md5((bigInt(data['windowInfo']['left']).multiply(invMod(rs['windowInfo']['left'], n)).mod(n))), 16);
  // data['windowInfo']['state'] = bigInt(md5((bigInt(data['windowInfo']['state']).multiply(invMod(rs['windowInfo']['state'], n)).mod(n))), 16);
  // data['windowInfo']['top'] = bigInt(md5((bigInt(data['windowInfo']['top']).multiply(invMod(rs['windowInfo']['top'], n)).mod(n))), 16);
  // data['windowInfo']['type'] = bigInt(md5((bigInt(data['windowInfo']['type']).multiply(invMod(rs['windowInfo']['type'], n)).mod(n))), 16);
  // data['windowInfo']['width'] = bigInt(md5((bigInt(data['windowInfo']['width']).multiply(invMod(rs['windowInfo']['width'], n)).mod(n))), 16);
  

  data['userAgent'] = bigInt(md5((bigInt(data['userAgent']).multiply(invMod(rs['userAgent'], n)).mod(n))), 16);
  data['timezone'] = bigInt(md5((bigInt(data['timezone']).multiply(invMod(rs['timezone'], n)).mod(n))), 16);
  data['cookieEnabled'] = bigInt(md5((bigInt(data['cookieEnabled']).multiply(invMod(rs['cookieEnabled'], n)).mod(n))), 16);
  data['vendor'] = bigInt(md5((bigInt(data['vendor']).multiply(invMod(rs['vendor'], n)).mod(n))), 16);
  data['productSub'] = bigInt(md5((bigInt(data['productSub']).multiply(invMod(rs['productSub'], n)).mod(n))), 16);;
  data['appVersion'] = bigInt(md5((bigInt(data['appVersion']).multiply(invMod(rs['appVersion'], n)).mod(n))), 16);
  data['screendepth'] = bigInt(md5((bigInt(data['screendepth']).multiply(invMod(rs['screendepth'], n)).mod(n))), 16);
  data['screenwidth'] = bigInt(md5((bigInt(data['screenwidth']).multiply(invMod(rs['screenwidth'], n)).mod(n))), 16);
  data['screenheight'] = bigInt(md5((bigInt(data['screenheight']).multiply(invMod(rs['screenheight'], n)).mod(n))), 16);
  
  
  data['ips'].forEach(function(element, index){
      data['ips'][index] = bigInt(md5((bigInt(element).multiply(invMod(rs['ips'][index], n)).mod(n))), 16);
  })


  data['plugins'].forEach(function(element, index){
    data['plugins'][index].description = bigInt(md5((bigInt(element.description).multiply(invMod(rs['plugins'][index].description, n)).mod(n))), 16);
    data['plugins'][index].filename = bigInt(md5((bigInt(element.filename).multiply(invMod(rs['plugins'][index].filename, n)).mod(n))), 16);
    data['plugins'][index].name = bigInt(md5((bigInt(element.name).multiply(invMod(rs['plugins'][index].name, n)).mod(n))), 16);
  })


  data['fonts'].forEach(function(element, index){
    data['fonts'][index].displayName = bigInt(md5((bigInt(element.displayName).multiply(invMod(rs['fonts'][index].displayName, n)).mod(n))), 16);
    data['fonts'][index].fontId = bigInt(md5((bigInt(element.fontId).multiply(invMod(rs['fonts'][index].fontId, n)).mod(n))), 16);
  })

  data['webgl_gpu'] = bigInt(md5((bigInt(data['webgl_gpu']).multiply(invMod(rs['webgl_gpu'], n)).mod(n))), 16);
  data['webgl_gpu_vendor'] = bigInt(md5((bigInt(data['webgl_gpu_vendor']).multiply(invMod(rs['webgl_gpu_vendor'], n)).mod(n))), 16);
  data['webgl_shading_language_version'] = bigInt(md5((bigInt(data['webgl_shading_language_version']).multiply(invMod(rs['webgl_shading_language_version'], n)).mod(n))), 16);

  return data
}


function find_common_elements(client_data, profiles){
  var cnt = new Array(server_profiles.length);
  cnt.fill(0);
  profiles.forEach(function(element, index){

    // if ('windowInfo' in element && 'alwaysOnTop' in element.windowInfo){

    //   if (bigInt(client_data.windowInfo.alwaysOnTop).toString() == element.windowInfo.alwaysOnTop){
    //     cnt[index] += 1
    //   }
    // }
    
    // if ('windowInfo' in element && 'focused' in element.windowInfo){
    //   if (bigInt(client_data.windowInfo.focused).toString() == element.windowInfo.focused){
    //     cnt[index] += 1
    //   }
    // }
    
    // if ('windowInfo' in element && 'height' in element.windowInfo){
    //   if (bigInt(client_data.windowInfo.height).toString() == element.windowInfo.height){
    //     cnt[index] += 1
    //   }
    // }
    
    // if ('windowInfo' in element && 'incognito' in element.windowInfo){
    //   if (bigInt(client_data.windowInfo.incognito).toString() == element.windowInfo.incognito){
    //     cnt[index] += 1
    //   }
    // }
    
    // if ('windowInfo' in element && 'left' in element.windowInfo){
    //   if (bigInt(client_data.windowInfo.left).toString() == element.windowInfo.left){
    //     cnt[index] += 1
    //   }
    // }
    
    // if ('windowInfo' in element && 'state' in element.windowInfo){
    //   if (bigInt(client_data.windowInfo.state).toString() == element.windowInfo.state){
    //     cnt[index] += 1
    //   }
    // }
    
    // if ('windowInfo' in element && 'top' in element.windowInfo){
    //   if (bigInt(client_data.windowInfo.top).toString() == element.windowInfo.top){
    //     cnt[index] += 1
    //   }
    // }
    
    // if ('windowInfo' in element && 'type' in element.windowInfo){
    //   if (bigInt(client_data.windowInfo.type).toString() == element.windowInfo.type){
    //     cnt[index] += 1
    //   }
    // }

    // if ('windowInfo' in element && 'width' in element.windowInfo){
    //   if (bigInt(client_data.windowInfo.width).toString() == element.windowInfo.width){
    //     cnt[index] += 1
    //   }
    // }

    if ('userAgent' in element){
      if (bigInt(client_data.userAgent).toString() == element.userAgent){
        cnt[index] += 1
      }
    }

    if ('timezone' in element){
      if (bigInt(client_data.timezone).toString() == element.timezone){
        cnt[index] += 1
      }
    }
    if ('cookieEnabled' in element){
      if (bigInt(client_data.cookieEnabled).toString() == element.cookieEnabled){
        cnt[index] += 1
      }
    }
    if ('vendor' in element){
      if (bigInt(client_data.vendor).toString() == element.vendor){
        cnt[index] += 1
      }
    }
    if ('productSub' in element){
      if (bigInt(client_data.productSub).toString() == element.productSub){
        cnt[index] += 1
      }
    }
    if ('appVersion' in element){
      if (bigInt(client_data.appVersion).toString() == element.appVersion){
        cnt[index] += 1
      }
    }
    if ('screendepth' in element){
      if (bigInt(client_data.screendepth).toString() == element.screendepth){
        cnt[index] += 1
      }
    }
    if ('screenwidth' in element){
      if (bigInt(client_data.screenwidth).toString() == element.screenwidth){
        cnt[index] += 1
      }
    }

    if ('screenheight' in element){
      if (bigInt(client_data.screenheight).toString() == element.screenheight){
        cnt[index] += 1
      }
    }


    if ('ips' in element){
      client_data.ips.forEach(function(child_element, child_index){
        if (element.ips.indexOf(bigInt(child_element).toString()) > -1) {
          cnt[index] += 1
        }
      })
    }


    /*
      Perhaps we might have to count all three elements as one 
      or add some kind of weight. 
    */

    if ('plugins' in element){
      client_data.plugins.forEach(function(child_element, child_index){
        element.plugins.forEach(function(sub_element, sub_index){
          if(bigInt(child_element.description).toString() == sub_element.description){
            cnt[index] += 1

          }
          if(bigInt(child_element.filename).toString() == sub_element.filename){
            cnt[index] += 1

          }
          if(bigInt(child_element.name).toString() == sub_element.name){
            cnt[index] += 1
          }
        })        
      })
    }


    /*
      Same as above. We might have to count both elements as one
      or add some weight to it.
    */
    if ('fonts' in element){
      client_data.fonts.forEach(function(child_element, child_index){
        element.fonts.forEach(function(sub_element, sub_index){
          if(bigInt(child_element.displayName).toString() == sub_element.displayName){
            cnt[index] += 1

          }
          if(bigInt(child_element.fontId).toString() == sub_element.fontId){
            cnt[index] += 1
          }
        })        
      })
    }

    if ('webgl_gpu' in element){
      if (bigInt(client_data.webgl_gpu).toString() == element.webgl_gpu){
        cnt[index] += 1
      }
    }

    if ('webgl_gpu_vendor' in element){
      if (bigInt(client_data.webgl_gpu_vendor).toString() == element.webgl_gpu_vendor){
        cnt[index] += 1
      }
    }

    if ('webgl_shading_language_version' in element){
      if (bigInt(client_data.webgl_shading_language_version).toString() == element.webgl_shading_language_version){
        cnt[index] += 1
      }
    }



  })
  console.log(cnt)
  return cnt
}


function uploadProfile(){
  profile = dump_profile();
  var xhr = new XMLHttpRequest();
  var url = URL + "/uploadProfile";
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      var serverResponse = xhr.responseText;
      console.log("Received data");
      pop_notification("Profile has been Uploaded!");
    }       
  };
  var profile_data = "profile=" + 
      encodeURIComponent(JSON.stringify(profile))
  xhr.send(profile_data);
}

function dump_profile(){

      stuff = {}
      // stuff['windowInfo'] = {}
      // stuff['windowInfo']['alwaysOnTop'] = windowInfo.alwaysOnTop;
      // stuff['windowInfo']['focused'] = windowInfo.focused;
      // stuff['windowInfo']['height'] = windowInfo.height;
      // stuff['windowInfo']['incognito'] = windowInfo.incognito;
      // stuff['windowInfo']['left'] = windowInfo.left;
      // stuff['windowInfo']['state'] = windowInfo.state;
      // stuff['windowInfo']['top'] = windowInfo.top;
      // stuff['windowInfo']['type'] = windowInfo.type;
      // stuff['windowInfo']['width'] = windowInfo.width;
      stuff['userAgent'] = userAgent;
      stuff['timezone'] = timezone;

      stuff['cookieEnabled'] = cookieEnabled;
      stuff['vendor'] = vendor;
      stuff['productSub'] = productSub;
      stuff['appVersion'] = appVersion;
      stuff['screendepth'] = screendepth;
      stuff['screenwidth'] = screenwidth;
      stuff['screenheight'] = screenheight;
      stuff['ips'] = new Array(ips.length);

      ips.forEach(function(element, index){
        stuff['ips'][index] = element;
      })

      stuff['plugins'] = new Array(plugins.length);
      plugins.forEach(function(element, index){
        stuff['plugins'][index] = {}
        stuff['plugins'][index]['description'] = element.description;
        stuff['plugins'][index]['filename'] = element.filename;
        stuff['plugins'][index]['name'] = element.name;
      })

      stuff['fonts'] = new Array(fonts.length);

      fonts.forEach(function(element, index){
        stuff['fonts'][index] = {}
        stuff['fonts'][index]['displayName'] = element.displayName;
        stuff['fonts'][index]['fontId'] = element.fontId;
      })

      stuff['webgl_gpu'] = webgl_gpu;
      stuff['webgl_gpu_vendor'] = webgl_gpu_vendor;
      stuff['webgl_shading_language_version'] = webgl_shading_language_version;

      return stuff


}

function adapt_phase(received_data, details){
   //Change the user agent by modifying the navigator object
    navigator.__defineGetter__('userAgent', function(){
      return received_data.userAgent;
    }); 

    //Change the plugins by modifying the navigator object
    navigator.__defineGetter__('plugins', function(){
      return received_data.plugins;
    });   

    //Change the cookieEnabled option by modifying the navigator object
    navigator.__defineGetter__('cookieEnabled', function(){
      return received_data.cookieEnabled;
    }); 

    navigator.__defineGetter__('productSub', function(){
      return received_data.productSub;
    }); 

    navigator.__defineGetter__('vendor', function(){
      return received_data.vendor;
    }); 

    navigator.__defineGetter__('appVersion', function(){
      return received_data.appVersion;
    }); 

    screen.__defineGetter__('width', function(){
      return received_data.screenwidth;
    })

    screen.__defineGetter__('depth', function(){
      return received_data.screendepth;
    })

    screen.__defineGetter__('height', function(){
      return received_data.screenheight;
    })
    // Resetting the window name
    window.name = ""

    // WebGL section start
    var docId = getRandomString();
    var docId2 = getRandomString();
    // generate_canvas_fp();
    chrome.tabs.executeScript(details, {
      code: "var docId='" + docId + 
            "';var docId2='" + docId2 + 
            "';var r=" + canvas_data.r + 
            ";var g=" + canvas_data.g + 
            ";var b=" + canvas_data.b + 
            ";var a=" + canvas_data.a + 
            ";var webgl_gpu_vendor='" + received_data.webgl_gpu_vendor + 
            "';var webgl_gpu='" + received_data.webgl_gpu + 
            "';var webgl_shading_language_version='" + received_data.webgl_shading_language_version + 
            "';",
      runAt: "document_start",
      allFrames: true,
      matchAboutBlank: true
    });
    chrome.tabs.executeScript(details, {
        file: "content.js",
        runAt: "document_start",
        allFrames: true,
        matchAboutBlank: true
    });  
    // WebGL section end
}

function adapt_phase_fonts(received_data){

  console.log("Initiating font call to local server");
  target_fonts = received_data.fonts;
  sendtoflask();
}


function request_new_profile(profile, details){
      var xhr = new XMLHttpRequest();
      var url = URL + "/retrieveprofile";
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.onreadystatechange = function() {

        if (xhr.readyState === 4) {

          var serverResponse = xhr.responseText;
          received_data = JSON.parse(serverResponse).resp;
          localStorage["profile"] = JSON.stringify(received_data);
          // Adapt fonts
          local_profile = localStorage["profile"];
          try {
            adapt_phase_fonts(local_profile);   
            pop_notification("Fonts updated!");
          } catch (err) {
            console.log(err);
            pop_notification("Font removal failed. Cannot connect to server");
          }
          // 
        }
      }
          
      var profile_data = "profile=" + 
      encodeURIComponent(JSON.stringify(profile))
      xhr.send(profile_data);
}


function call_remote_server(details){  
      var xhr = new XMLHttpRequest();
      var url = URL;
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {

          var serverResponse = xhr.responseText;
          /*
            Read the received data and identify the number of common elements.

          */
          console.log("Received data");
          received_data = JSON.parse(serverResponse).resp;
          client_elements = received_data[0];
          client_elements = rehash_elements(client_elements, rs_array)
          server_profiles = received_data;          
          server_profiles.shift();

          count = find_common_elements(client_elements, server_profiles)

          max = 0;
          profile_number = -1;
          count.forEach(function(element, index){
            if (element >= max){
              max = element
              profile_number = index
            }
          })
          console.log("Closest profile is number #"+ profile_number + " with #" +max + " common elements");

          request_new_profile(profile_number, details);
          
        }        
      };
      rs_array = dump_enc_profile();      
      /*
          Take all of the hashed elements of the clinet
          and apply a random value.

      */   
      var enc_data_final = "enc_data=" + 
        encodeURIComponent(JSON.stringify(stuff))
      console.log("Before send")

      /*
        We will only send the encrypted values.
      */
      xhr.send(enc_data_final);
}

function giefFonts(FontName){
  fonts = FontName;
  getLocalIPs(function(temp_ips) { 
    ips = temp_ips
    main_init();
  });  
}

function WindowInfo(e){
  windowInfo = e;
}


//======== CANVAS=============/
function generate_canvas_fp(){
    var tmp_data = {};
    tmp_data.r = 10 - randomIntFromInterval(0, 20);
    tmp_data.g = 10 - randomIntFromInterval(0, 20);
    tmp_data.b = 10 - randomIntFromInterval(0, 20);
    tmp_data.a = 10 - randomIntFromInterval(0, 20);
    var jsonData = JSON.stringify(tmp_data);
    localStorage["canvas_data"] = jsonData;
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function getRandomString() {
    var text = "";
    var charset = "abcdefghijklmnopqrstuvwxyz";
    for (var i = 0; i < 5; i++)
        text += charset.charAt(Math.floor(Math.random() * charset.length));
    return text;
}
//============CANVAS==========/



function pop_notification(message) {
    var options = {
        type: "basic",
        title: "Upload profile status",
        message: message,
        iconUrl: "img/img.png"
    }

    chrome.notifications.create(options, function (notificationId) {
    });
}





// IP and Fonts are delayed. Why?
var local_profile = localStorage["profile"];
var bronymity_active = localStorage["status"];
var userID = localStorage["userID"];
if (userID == undefined) {
  localStorage["userID"] = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
});
  userID = localStorage["userID"];
}

var bronymity_status = localStorage["status"];
if (bronymity_status == undefined) {
  localStorage["status"] = "deactivated";
}

var canvas_data = localStorage["canvas_data"];
if (canvas_data == undefined) {
  generate_canvas_fp();
  canvas_data = localStorage["canvas_data"];
  pop_notification("New canvas fingerprint generated!");
}

chrome.fontSettings.getFontList(giefFonts); // Get fonts
// Font may pose a great time consuming process
// This is why we change fonts only at initializion
// and not on every Update of the tabs.
function main_init(){  
  local_profile = localStorage["profile"];
  bronymity_active = localStorage["status"];
  if (bronymity_active === "activated"){
    if (local_profile == undefined) {
      initialize_bronymity();
      pop_notification("Bronymity initialized");    
    } else {
      local_profile = JSON.parse(local_profile);
      try {
        adapt_phase_fonts(local_profile);   
        pop_notification("Fonts updated!");
      } catch (err) {
        console.log(err);
        pop_notification("Font removal failed. Cannot connect to server");
      }
    }
  }
  
}

function automate_test(newURL, tableId, flag){
  tmpfile = flag+".js"
  chrome.tabs.create({ url: newURL }, function(tab){
      chrome.tabs.executeScript(tab.tabId, {
      code: "tableId='" + tableId + 
            "';flag='" + flag +
            "';",
      runAt: "document_start",
      allFrames: true,
      matchAboutBlank: true
    });
    chrome.tabs.executeScript(tab.tabId, {
      file: tmpfile
    }, function() {
      // If you try and inject into an extensions page or the webstore/NTP you'll get an error
      if (chrome.runtime.lastError) {
        message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
      }
    });
  });
}

function start_tests(){
  automate_test("https://amiunique.org/fp", "#details", "getPageSource");
}

function start_browserprint(){
  chrome.tabs.create({ url: "https://browserprint.info/test" });
}

function uploadTestResults(){
  if (localStorage["amiunique"] !== undefined &&
    localStorage["browserprint"] !== undefined &&
    localStorage["panopticlick"] !== undefined &&
    localStorage["status"] !== undefined &&
    localStorage["userID"] !== undefined) {


      var xhr = new XMLHttpRequest();
      var url = URL + "/uploadTestResults";
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          var serverResponse = xhr.responseText;
          console.log("Received data");
          pop_notification("Test results have been Uploaded!");
        }       
      };
      var test_results = "amiunique=" + encodeURIComponent(JSON.stringify(localStorage["amiunique"])) +
                          "&browserprint=" + encodeURIComponent(JSON.stringify(localStorage["browserprint"])) +
                          "&panopticlick=" + encodeURIComponent(JSON.stringify(localStorage["panopticlick"])) +
                          "&status=" + encodeURIComponent(JSON.stringify(localStorage["status"])) +
                          "&userID=" + encodeURIComponent(JSON.stringify(localStorage["userID"]))


      xhr.send(test_results);


  } else {
    pop_notification("You are missing something")
  }
}

/*
  Clear local storage data. We need the client to submit two times 
  the profile's data. Once before Bronymity and after Bronymity.
*/
function clearStorage(){
  localStorage.removeItem("amiunique");
  localStorage.removeItem("browserprint");
  localStorage.removeItem("panopticlick");
}

// The following listener might get called
// before main_init is finished. Some errors might occur
// but we're Ok.
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  bronymity_active = localStorage["status"];
  if (bronymity_active === "activated"){
    adapt_phase(local_profile, tabId);
    // Block Flash    
    if (changeInfo && changeInfo.url !== undefined){
        chrome.contentSettings.plugins.set({
          'primaryPattern': '<all_urls>',
          'resourceIdentifier': { 'id': 'adobe-flash-player' },
          'setting': 'block',
        }, callback);
      }
  }
});

function callback() {
    if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError.message);
    } else {
        // Tab exists
    }
}
chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
   if (request.action === "upload-profile") {
        uploadProfile();
    } else if (request.action === "reinitialize-profile"){
      initialize_bronymity();
    } else if (request.action === "start-tests"){
      start_tests();
    } else if (request.action === "start-browserprint"){
      start_browserprint();
    } else if (request.action == "getPageSource") {
      localStorage["amiunique"] = request.source;
      console.log(request.source);
      automate_test("https://panopticlick.eff.org/results", "#results", "panopticlick");
    } else if (request.action == "panopticlick") {
      console.log(request.source);
      localStorage["panopticlick"] = request.source;
    } else if (request.action == "submit-browserprint") {
      localStorage["browserprint"] = request.source;
    } else if (request.action == "enable-plugin") {
      localStorage["status"] = "activated";
      main_init();
    } else if (request.action == "disable-plugin") {
      localStorage["status"] = "deactivated";
    } else if (request.action == "upload-test-results") {
      uploadTestResults();
    } else if (request.action == "clear-storage") {
      clearStorage();
    } 
   
});


/**
Obfuscate the ETag header. Replace it with a base64 encoded
random string of 16 characters.
**/
chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    for (var i = 0; i < details.requestHeaders.length; ++i) {
      if (details.requestHeaders[i].name === 'ETag') {
        charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var randomString = '';
        for (var j = 0; j < 16; j++) {
            var position = Math.floor(Math.random() * charSet.length);
            randomString += charSet.substring(position, position+1);
        }
        details.requestHeaders[i].value = btoa(randomString);
        console.log(details.requestHeaders[i])
        break;n
      }
    }
    return { requestHeaders: details.requestHeaders };
  },
  {urls: ['<all_urls>']},
  [ 'blocking', 'requestHeaders']
);
