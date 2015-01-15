'use strict';

/* Filters */

angular.module('manage.filters', []).
filter('interpolate', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    };
  }).filter('accountsType', function() {
    return function(code) {
      code = parseInt(code);
      if (code ==1) {
        return 'หมวดสินทรัพย์';
      } else if (code == 2) {
        return 'หมวดหนี้สิน';
      } else if (code == 3) {
        return 'หมวดส่วนของเจ้าของ (ทุน)';
      } else if (code == 4) {
        return 'หมวดรายได้';
      }else if (code == 5) {
        return 'หมวดค่าใช้จ่าย';
      }else return '-';
    }
  }).filter('customerStatus', function() {
    return function(code) {
      code = parseInt(code);
      if (code == 0) {
        return 'รอดำเนินการ';
      } else if (code == 1) {
        return 'จอง';
      } else if (code == 2) {
        return 'เข้าพัก';
      } else return '-';
    }
  }).filter('invForm', function() {
    return function(code) {
      try {
        var formated = '';
        formated = "INV" + code.year + code.month;

        var array = [];

        if (code.running < 10) {
          formated += "0000" + code.running;
          return formated;
        } else if (code.running < 100) {
          formated += "000" + code.running;
          return formated;
        } else if (code.running < 1000) {
          formated += "00" + code.running;
          return formated;
        } else if (code.running < 10000) {
          formated += "0" + code.running;
          return formated;
        } else if (code.running < 100000) {
          formated += code.running;
          return formated;
        }

      } catch (e) {
        return e;
      }

    }
  }).filter('recForm', function() {
    return function(code) {
      try {
        var formated = '';
        formated = "REC" + code.year + code.month;

        var array = [];

        if (code.running < 10) {
          formated += "0000" + code.running;
          return formated;
        } else if (code.running < 100) {
          formated += "000" + code.running;
          return formated;
        } else if (code.running < 1000) {
          formated += "00" + code.running;
          return formated;
        } else if (code.running < 10000) {
          formated += "0" + code.running;
          return formated;
        } else if (code.running < 100000) {
          formated += code.running;
          return formated;
        }

      } catch (e) {
        return e;
      }

    }
  }).filter('thDate', function() {
    return function(dateStr) {
      if (dateStr && dateStr.split('/')[0] !== undefined) {
        var tempDate = dateStr;
        tempDate = dateStr.split('/');
        tempDate[2] = parseInt(tempDate[2]) > 2100 ? parseInt(tempDate[2]) : parseInt(tempDate[2]) + 543;

        if (tempDate[1] === "December") {
          tempDate[1] = "ธันวาคม";
        } else if (tempDate[1] === "November") {
          tempDate[1] = "พฤษจิกายน";
        } else if (tempDate[1] === "October") {
          tempDate[1] = "ตุลาคม";
        } else if (tempDate[1] === "September") {
          tempDate[1] = "กันยายน";
        } else if (tempDate[1] === "August") {
          tempDate[1] = "สิงหาคม";
        } else if (tempDate[1] === "July") {
          tempDate[1] = "กรกฎาคม"
        } else if (tempDate[1] === "June") {
          tempDate[1] = "มิถุนายน";
        } else if (tempDate[1] === "May") {
          tempDate[1] = "พฤษภาคม";
        } else if (tempDate[1] === "April") {
          tempDate[1] = "เมษายน";
        } else if (tempDate[1] === "March") {
          tempDate[1] = "มีนาคม";
        } else if (tempDate[1] === "February") {
          tempDate[1] = "กุมภาพันธ์";
        } else if (tempDate[1] === "January") {
          tempDate[1] = "มกราคม";
        }

        tempDate = tempDate.join(' ');
      }
      return tempDate;
    }
  })
  .filter('monthDate', function() {
    return function(dateStr) {
      if (dateStr && dateStr.split('/')[0] !== undefined) {
        var tempDate = dateStr;
        tempDate = dateStr.split('/');
        tempDate[2] = parseInt(tempDate[2]) + 543;

        if (tempDate[1] === "December") {
          tempDate[1] = "ธันวาคม";
        } else if (tempDate[1] === "November") {
          tempDate[1] = "พฤษจิกายน";
        } else if (tempDate[1] === "October") {
          tempDate[1] = "ตุลาคม";
        } else if (tempDate[1] === "September") {
          tempDate[1] = "กันยายน";
        } else if (tempDate[1] === "August") {
          tempDate[1] = "สิงหาคม";
        } else if (tempDate[1] === "July") {
          tempDate[1] = "กรกฎาคม"
        } else if (tempDate[1] === "June") {
          tempDate[1] = "มิถุนายน";
        } else if (tempDate[1] === "May") {
          tempDate[1] = "พฤษภาคม";
        } else if (tempDate[1] === "April") {
          tempDate[1] = "เมษายน";
        } else if (tempDate[1] === "March") {
          tempDate[1] = "มีนาคม";
        } else if (tempDate[1] === "Feburary") {
          tempDate[1] = "กุมภาพันธ์";
        } else if (tempDate[1] === "January") {
          tempDate[1] = "มกราคม";
        }

        //tempDate = tempDate.join('/');
      }
      return tempDate[1];
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
  .filter('getFirst', function() {
    return function(code) {
      try {
        code = code.toString();
        var fs = code.substr(0, 1);

        return fs;
      } catch (e) {
        console.log(e);
        return code;
      }
    }
  })
  .filter('firstUpper', function() {
    return function(code) {
      try {
        var fs = code.substr(0, 1);
        fs = fs.toUpperCase();
        fs = fs + code.substr(1, code.length);
        return fs;
      } catch (e) {
        console.log(e);
        return code;
      }
    }
  })
  .filter('topupFrom', function() {
    return function(code) {
      if (code === "02") {
        return 'บัตรเครดิต';
      } else if (code === "01") {
        return 'บัญชีเพย์สบาย';
      } else if (code === "03") {
        return 'บัญชีเพย์พาล';
      } else if (code === "04") {
        return 'อเมริกัน เอ็กเพรช';
      } else if (code === "05") {
        return 'ออนไลน์ ไดเร็กเดบิต';
      } else if (code === "06") {
        return 'เงินสด';
      } else return '-';
    }
  })
  .filter('coverageStatus', function() {
    return function(code) {
      if (code == 1) {
        return '-';
      } else if (code == 2) {
        return 'จ่ายแล้ว';
      } else return '-';
    }
  })
  .filter('roomStatus', function() {
    return function(code) {
      code = parseInt(code);
      if (code == 0) {
        return 'ว่าง';
      } else if (code == 1) {
        return 'จอง';
      } else if (code == 2) {
        return 'เข้าพัก';
      } else if (code == 3) {
        return 'ค้างชำระ';
      } else if (code == 4) {
        return 'แจ้งย้าย';
      } else if (code == 5) {
        return 'ยกเลิกการจอง';
      } else return 'ห้องว่าง';
    }
  })
  .filter('roomStatusColor', function() {
    return function(code) {
      code = parseInt(code);
      if (code == 0) {
        return '#a7ed57';
      } else if (code == 1) {
        return '#ede165';
      } else if (code == 2) {
        return '#4b98ed';
      } else if (code == 3) {
        return 'red';
      } else if (code == 4) {
        return '#b73aff';
      } else return 'ไม่พบสถานะ';
    }
  }).filter('transactionType', function() {
    return function(code) {
      code = parseInt(code);
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
  })
  .filter('transactionName', function() {
    return function(transaction) {
      
      if (transaction.transaction_type == 0 && transaction.status == 0) {
        return 'รอดำเนินการ';
      } else if (transaction.transaction_type == 1 && transaction.status == 0) {
        return 'จองห้องแต่ยังไม่ได้ชำระเงิน';
      } else if (transaction.transaction_type == 1 && transaction.status == 1) {
        return 'จองและชำระเงินแล้ว';
      } else if (transaction.transaction_type == 2 && transaction.status == 1) {
        return 'ใบเสร็จ';
      } else if (transaction.transaction_type == 3 && transaction.status == 1) {
        return 'เข้าพัก';
      } else if (transaction.transaction_type == 3 && transaction.status == 2) {
        return 'ย้ายออก';
      } else if (transaction.transaction_type == 4 && transaction.status == 0) {
        return 'ใบแจ้งหนี้ยังไม่ชำระ';
      }else if (transaction.transaction_type == 4 && transaction.status == 1) {
        return 'ใบแจ้งหนี้ชำระเงินแล้ว';
      } else return '---';
    }
  })
  .filter('paymentList', function() {
    return function(code) {
      if (code == '50') {
        return 'เงินสด';
      } else if (code == '51') {
        return 'เช็คธนาคาร';
      } else if (code == '52') {
        return 'บัตรเครดิต';
      } else if (code == '1') {
        return 'ธนาคารกรุงเทพ';
      } else if (code == '2') {
        return 'ธนาคารกรุงศรีอยุธยา';
      } else if (code == '3') {
        return 'ธนาคารกสิกรไทย';
      } else if (code == '4') {
        return 'ธนาคารทหารไทย';
      } else if (code == '5') {
        return 'ธนาคารทิสโก้';
      } else if (code == '6') {
        return 'ธนาคารไทยพาณิชย์';
      } else if (code == '7') {
        return 'ธนาคารธนชาต';
      } else if (code == '8') {
        return 'ธนาคารกรุงไทย';
      } else if (code == '9') {
        return 'ธนาคารออมสิน';
      } else if (code == '10') {
        return 'ธนาคารอิสลามแห่งประเทศไทย';
      } else if (code == '11') {
        return 'ธนาคารไทยเครดิตเพื่อรายย่อย';
      } else if (code == '12') {
        return 'ธนาคารยูโอบี';
      } else return '-';
    }
  }).filter('rentType', function() {
    return function(code) {
      code = parseInt(code);
      if (code == 1) {
        return 'รายวัน';
      } else if (code == 2) {
        return 'รายเดือน';
      } else return 'ไม่พบประเภท';
    }
  }).filter('imagefullsize', ["$rootScope", function($rootScope) {
    return function(code) {
      if (code.substr(1, 1) === "_") {
        if ($rootScope.isMobile) {
          return "images/mobile/" + code;
        } else {
          return "images/desktop/" + code;
        }
      }
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
    return function(baht) {
      var code = parseFloat(baht).toFixed(2);
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
          } else if (code[i] === "0" && (code.length - 1 - i) == 0) {

            thb += thbpostfixpoint(code.length - 1 - i);
          } else {
            // thb += thbtotext(code[i]);
            // thb += thbpostfixpoint(code.length - 1 - i);
          }
        };        
        if (code === "00") {          
          thb = thb.replace("สตางค์", " ");          
          return thb;
        } else {
          return thb;
        }

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
          } else if (code[i] === "0" && (code.length - 1 - i) == 0) {

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