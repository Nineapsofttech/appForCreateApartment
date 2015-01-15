'use strict';

/* Filters */

angular.module('world.filters', []).
filter('interpolate', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    };
  }).filter('customerStatus', function() {
    return function(code) {
      code = parseInt(code);
      console.log(code);
      if (code == 0) {
        return 'รอดำเนินการ';
      } else if (code == 1) {
        return 'จอง';
      } else if (code == 2) {
        return 'เข้าพัก';
      } else return '-';
    }
  })
  .filter('startFrom', function() {
    return function(input, start) {
      try {
        start = +start; //parse to int
        return input.slice(start);
      } catch (e) {
        return null;
      }
    }
  })
  .filter('roomStatus', function() {
    return function(code) {
      code = parseInt(code);
      console.log(code);
      if (code == 0) {
        return 'ว่าง';
      } else if (code == 1) {
        return 'จอง';
      } else if (code == 2) {
        return 'เข้าพัก';
      } else if (code == 3) {
        return 'แจ้งย้าย';
      } else if (code == 2) {
        return 'ยกเลิกการจอง';
      } else return 'ไม่พบสถานะ';
    }
  }).filter('transactionType', function() {
    return function(code) {
      code = parseInt(code);
      console.log(code);
      if (code == '0') {
        return 'รอดำเนินการ';
      } else if (code == '1') {
        return 'ใบจอง';
      } else if (code == '2') {
        return 'ใบรับเงินจอง';
      } else if (code == '3') {
        return 'สัญญาเช่า';
      } else if (code == '4') {
        return '---';
      } else return 'ไม่พบสถานะ';
    }
  }).filter('rentType', function() {
    return function(code) {
      code = parseInt(code);
      console.log(code);
      if (code == 1) {
        return 'รายวัน';
      } else if (code == 2) {
        return 'รายเดือน';
      } else return 'ไม่พบประเภท';
    }
  }).filter('imagefullsize', ["$rootScope", function($rootScope) {
    return function(code) {
      if (code && code.substr(1, 1) === "_") {
        if ($rootScope.isMobile) {
          return "images/mobile/" + code;
        } else {
          return "images/desktop/" + code;
        }
      }else return code;

    };
  }]).filter('imageThumbnail', function() {
    return function(code) {
      try {
        if (code.substr(0, 2) === "1_")
          return "images/thumbnail/" + code;
        else
          return code;
      } catch (e) {

      }

    }
  }).filter('thbToString', function() {
    return function(code) {
      var thb = "";

      if (code.search(/\./) !== -1) {
        var point = code.split('.');
        code = point[0];
        for (var i = 0; i <= code.length - 1; i++) {
          if (code[i] !== "0" && code[i] !== "2" && code[i] !== "1") {
            thb += thbtotext(code[i]);
            thb += thbpostfix(code.length - 1 - i);
          } else if (code[i] === "1" && (code.length - 1 - i) == 1) {
            thb += "สิบ";
          } else if (code[i] === "2" && (code.length - 1 - i) == 1) {
            thb += "ยี่สิบ";
          } else if (code[i] === "1" && (code.length - 1 - i) == 0) {
            thb += "เอ็ดบาท";
          } else if (code[i] === "2" && (code.length - 1 - i) !== 1) {
            thb += thbtotext(code[i]);
            thb += thbpostfix(code.length - 1 - i);
          } else if (code[i] === "1" && (code.length - 1 - i) !== 0) {
            thb += thbtotext(code[i]);
            thb += thbpostfix(code.length - 1 - i);
          } else if (code[i] === "0" && (code.length - 1 - i) === 0) {

            thb += thbpostfix(code.length - 1 - i);
          } else {
            // thb += thbtotext(code[i]);
            // thb += thbpostfix(code.length - 1 - i);
          }
        };
        code = point[1];
        for (var i = 0; i <= code.length - 1; i++) {
          if (code[i] !== "0" && code[i] !== "2" && code[i] !== "1") {
            thb += thbtotext(code[i]);
            thb += thbpostfixpoint(code.length - 1 - i);
          } else if (code[i] === "1" && (code.length - 1 - i) == 1) {
            thb += "สิบ";
          } else if (code[i] === "2" && (code.length - 1 - i) == 1) {
            thb += "ยี่สิบ";
          } else if (code[i] === "1" && (code.length - 1 - i) == 0) {
            thb += "เอ็ดสตางค์";
          } else if (code[i] === "2" && (code.length - 1 - i) !== 1) {
            thb += thbtotext(code[i]);
            thb += thbpostfixpoint(code.length - 1 - i);
          } else if (code[i] === "1" && (code.length - 1 - i) !== 0) {
            thb += thbtotext(code[i]);
            thb += thbpostfixpoint(code.length - 1 - i);
          } else if (code[i] === "0" && (code.length - 1 - i) === 0) {

            thb += thbpostfixpoint(code.length - 1 - i);
          } else {
            // thb += thbtotext(code[i]);
            // thb += thbpostfixpoint(code.length - 1 - i);
          }
        };
        return thb;
      } else {
        for (var i = 0; i <= code.length - 1; i++) {

          if (code[i] !== "0" && code[i] !== "2" && code[i] !== "1") {
            thb += thbtotext(code[i]);
            thb += thbpostfix(code.length - 1 - i);
          } else if (code[i] === "1" && (code.length - 1 - i) == 1) {
            thb += "สิบ";
          } else if (code[i] === "2" && (code.length - 1 - i) == 1) {
            thb += "ยี่สิบ";
          } else if (code[i] === "1" && (code.length - 1 - i) == 0) {
            thb += "เอ็ดบาท";
          } else if (code[i] === "2" && (code.length - 1 - i) !== 1) {
            thb += thbtotext(code[i]);
            thb += thbpostfix(code.length - 1 - i);
          } else if (code[i] === "1" && (code.length - 1 - i) !== 0) {
            thb += thbtotext(code[i]);
            thb += thbpostfix(code.length - 1 - i);
          } else if (code[i] === "0" && (code.length - 1 - i) === 0) {

            thb += thbpostfix(code.length - 1 - i);
          } else {
            // thb += thbtotext(code[i]);
            // thb += thbpostfix(code.length - 1 - i);
          }
        };

        return thb;


      }
    };
  });

var thbpostfix = function(input) {
  if (input == 6) {
    return "ล้าน";
  } else if (input == 5) {
    return "แสน";
  } else if (input == 4) {
    return "หมื่น";
  } else if (input == 3) {
    return "พัน";
  } else if (input == 2) {
    return "ร้อย";
  } else if (input == 1) {
    return "สิบ"
  } else if (input == 0) {
    return "บาท";
  }
}
var thbpostfixpoint = function(input) {
  if (input == 6) {
    return "ล้าน";
  } else if (input == 5) {
    return "แสน";
  } else if (input == 4) {
    return "หมื่น";
  } else if (input == 3) {
    return "พัน";
  } else if (input == 2) {
    return "ร้อย";
  } else if (input == 1) {
    return "สิบ"
  } else if (input == 0) {
    return "สตางค์";
  }
}
var thbtotext = function(input) {
  if (input === "1") {
    return "หนึ่ง";
  } else if (input === "2") {
    return "สอง";
  } else if (input === "3") {
    return "สาม";
  } else if (input === "4") {
    return "สี่";
  } else if (input === "5") {
    return "ห้า";
  } else if (input === "6") {
    return "หก";
  } else if (input === "7") {
    return "เจ็ด";
  } else if (input === "8") {
    return "แปด";
  } else if (input === "9") {
    return "เก้า";
  } else if (input === "0") {
    return "";
  }
};