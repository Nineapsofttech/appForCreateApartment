'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('manage.services', ['ngResource']).
value('version', '0.1')
  .factory('Place', ['$resource',
    function($resource) {
      return $resource('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
        location: '',
        radius: 500,
        types: '',
        key: 'AIzaSyDnACcjGRPA_KhojEjtgHAzWBY9WsIW_rI'
      }, {
        query: {
          method: 'GET',
          params: {
            location: '',
            radius: 500,
            types: '',
            key: 'AIzaSyDnACcjGRPA_KhojEjtgHAzWBY9WsIW_rI'
          },
          isArray: false
        }
      });
    }
  ]).factory('SummaryBill', ['$resource',
    function($resource) {
      return $resource('/summarybill', {}, {
        put: {
          method: 'POST',
          params: {},
          isArray: false
        },
        post: {
          method: 'POST',
          params: {},
          isArray: false
        },
        get: {
          method: 'GET',
          params: {},
          isArray: false
        },
        query: {
          method: 'GET',
          params: {},
          isArray: true
        },
        remove: {
          method: 'DELETE',
          params: {},
          isArray: false
        }
      });
    }
  ]).factory('Menu', ['$resource',
    function($resource) {
      return $resource('/menu', {}, {        
        get: {
          method: 'GET',
          params: {},
          isArray: false
        }
      });
    }
  ]).factory('Note', ['$resource',
    function($resource) {
      return $resource('/noteapi', {}, {        
        get: {
          method: 'GET',
          params: {},
          isArray: false
        }, post: {
          method: 'POST',
          params: {},
          isArray: false
        }
      });
    }
  ]).factory('TransactionItem', ['$resource',
    function($resource) {
      return $resource('/transactionitem', {}, {        
        post: {
          method: 'POST',
          params: {},
          isArray: false
        }
      });
    }
  ]).factory('InvoiceApi', ['$resource',
    function($resource) {
      return $resource('/invoice_api', {}, {
        put: {
          method: 'POST',
          params: {},
          isArray: false
        },
        post: {
          method: 'POST',
          params: {},
          isArray: false
        },
        post_array: {
          method: 'POST',
          params: {},
          isArray: true
        },post_query: {
          method: 'POST',
          params: {},
          isArray: true
        },
        get: {
          method: 'GET',
          params: {},
          isArray: false
        },
        query: {
          method: 'GET',
          params: {},
          isArray: true
        },
        remove: {
          method: 'DELETE',
          params: {},
          isArray: false
        }
      });
    }
  ]).factory('Accounts', ['$resource',
    function($resource) {
      return $resource('/accounts', {}, {
        put: {
          method: 'POST',
          params: {},
          isArray: false
        },
        post: {
          method: 'POST',
          params: {},
          isArray: false
        },post_query: {
          method: 'POST',
          params: {},
          isArray: true
        },
        get: {
          method: 'GET',
          params: {},
          isArray: false
        },
        query: {
          method: 'GET',
          params: {},
          isArray: true
        },
        remove: {
          method: 'DELETE',
          params: {},
          isArray: false
        }
      });
    }
  ]).factory('MovingOut', ['$resource',
    function($resource) {
      return $resource('/moveout', {}, {
        put: {
          method: 'POST',
          params: {},
          isArray: false
        },
        post: {
          method: 'POST',
          params: {},
          isArray: false
        },post_query: {
          method: 'POST',
          params: {},
          isArray: true
        },
        get: {
          method: 'GET',
          params: {},
          isArray: false
        },
        query: {
          method: 'GET',
          params: {},
          isArray: true
        },
        remove: {
          method: 'DELETE',
          params: {},
          isArray: false
        }
      });
    }
  ]).factory('ExpendApi', ['$resource',
    function($resource) {
      return $resource('/expendapi', {}, {
        put: {
          method: 'POST',
          params: {},
          isArray: false
        },
        post: {
          method: 'POST',
          params: {},
          isArray: false
        },post_query: {
          method: 'POST',
          params: {},
          isArray: true
        },
        get: {
          method: 'GET',
          params: {},
          isArray: false
        },
        query: {
          method: 'GET',
          params: {},
          isArray: true
        },
        remove: {
          method: 'DELETE',
          params: {},
          isArray: false
        }
      });
    }
  ]).factory('CompanyApi', ['$resource',
    function($resource) {
      return $resource('/company_api', {}, {
        put: {
          method: 'PUT',
          params: {},
          isArray: false
        },
        post: {
          method: 'POST',
          params: {},
          isArray: false
        },post_query: {
          method: 'POST',
          params: {},
          isArray: true
        },
        get: {
          method: 'GET',
          params: {},
          isArray: false
        },
        query: {
          method: 'GET',
          params: {},
          isArray: true
        },
        remove: {
          method: 'DELETE',
          params: {},
          isArray: false
        }
      });
    }
  ]).factory('EmployeeApi', ['$resource',
    function($resource) {
      return $resource('/employeeapi', {}, {
        put: {
          method: 'POST',
          params: {},
          isArray: false
        },
        post: {
          method: 'POST',
          params: {},
          isArray: false
        },post_query: {
          method: 'POST',
          params: {},
          isArray: true
        },
        get: {
          method: 'GET',
          params: {},
          isArray: false
        },
        query: {
          method: 'GET',
          params: {},
          isArray: true
        },
        remove: {
          method: 'DELETE',
          params: {},
          isArray: false
        }
      });
    }
  ]).factory('ReceiptApi', ['$resource',
    function($resource) {
      return $resource('/receipt_api', {}, {
        put: {
          method: 'POST',
          params: {},
          isArray: false
        },
        post: {
          method: 'POST',
          params: {},
          isArray: false
        },post_query: {
          method: 'POST',
          params: {},
          isArray: true
        },
        get: {
          method: 'GET',
          params: {},
          isArray: false
        },
        query: {
          method: 'GET',
          params: {},
          isArray: true
        },
        remove: {
          method: 'DELETE',
          params: {},
          isArray: false
        }
      });
    }
  ])
  .factory('SponsorApartment', ['$resource',
    function($resource) {
      return $resource('/listsponsor', {}, {
        get: {
          method: 'GET',
          params: {},
          isArray: true
        }
      });
    }
  ]).factory('ResetDemo', ['$resource',
    function($resource) {
      return $resource('/demo_reset', {}, {
        post: {
          method: 'POST',
          params: {},
          isArray: false
        }
      });
    }
  ])
  .factory('Zipcode', ['$resource',
    function($resource) {
      return $resource('/getzipcode', {}, {
        get: {
          method: 'GET',
          params: {},
          isArray: false
        }
      });
    }
  ])
  .factory('Board', ['$resource',
    function($resource) {
      return $resource('/createtopic', {}, {
        create: {
          method: 'POST',
          params: {
            feedback: {}
          },
          isArray: false
        },
        feed: {
          method: 'GET',
          params: {},
          isArray: false
        },
        comment: {
          method: 'POST',
          params: {
            comments: {}
          },
          isArray: false
        },
      });
    }
  ])
  .factory('GotoInfo', ['$resource', function($resource) {
    return $resource('/adscountclick', {}, {
      post: {
        method: 'POST',
        param: {
          _id: {}
        },
        isArray: false
      }
    });
  }])
  .factory('Myads', ['$resource',
    function($resource) {
      return $resource('/myads', {}, {
        query: {
          method: 'GET',
          params: {},
          isArray: true
        }
      });
    }
  ])
  .factory('Adsstatus', ['$resource', function($resource) {
    return $resource('/adsstatus', {}, {
      query: {
        method: 'GET',
        param: {},
        isArray: false
      },
      post: {
        method: 'POST',
        params: {
          set: {}
        },
        isArray: false
      }
    });
  }])
  .factory('Adscreation', ['$resource',
    function($resource) {
      return $resource('/adsmanage', {}, {
        post: {
          method: 'POST',
          params: {
            cus_regis: {}
          },
          isArray: false
        }
      });
    }
  ])
  .factory('PasswordChange', ['$resource',
    function($resource) {
      return $resource('/forget', {}, {
        post: {
          method: 'POST',
          params: {
            reset: {}
          },
          isArray: false
        },
        query: {
          method: 'GET',
          params: {
            reset: {}
          },
          isArray: false
        }
      });
    }
  ])
  .factory('Permission', ['$resource',
    function($resource) {
      return $resource('/permission', {}, {
        post: {
          method: 'POST',
          params: {
            permis: {}
          },
          isArray: false
        },
        query: {
          method: 'GET',
          params: {},
          isArray: true
        }
      });
    }
  ])
  .factory('Userlist', ['$resource',
    function($resource) {
      return $resource('/listUser', {}, {
        query: {
          method: 'GET',
          params: {},
          isArray: true
        }
      });
    }
  ])
  .factory('Building', ['$resource',
    function($resource) {
      return $resource('/building', {}, {
        //query:
        //update:
        //delete:
        //post:
        put: {
          method: 'POST',
          params: {
            building: {}
          },
          isArray: false
        },
        post: {
          method: 'POST',
          params: {
            building: {}
          },
          isArray: false
        },
        get: {
          method: 'GET',
          params: {},
          isArray: false
        },
        query: {
          method: 'GET',
          params: {},
          isArray: true
        },
        remove: {
          method: 'DELETE',
          params: {},
          isArray: false
        }
      });
    }
  ])
  .factory('Room', ['$resource',
    function($resource) {
      return $resource('/roomapi', {}, {
        post: {
          method: 'POST',
          params: {
            room: {}
          },
          isArray: false
        },
        get: {
          method: 'GET',
          params: {},
          isArray: false
        },
        query: {
          method: 'GET',
          params: {},
          isArray: true
        },
        remove: {
          method: 'DELETE',
          params: {},
          isArray: false
        }
      });
    }
  ])
  .factory('Adsservice', ['$resource',
    function($resource) {
      return $resource('/myproperties', {}, {
        query: {
          method: 'GET',
          params: {},
          isArray: true
        },
        get: {
          method: 'GET',
          params: {},
          isArray: false
        }
      });
    }
  ])

.factory('Check', ['$resource',
    function($resource) {
      return $resource('/checklogin', {}, {
        query: {
          method: 'GET',
          params: {
            username: [],
            password: []
          },
          isArray: false
        }

      });
    }
  ])
  .factory('Uploadprofilepic', ['$resource',
    function($resource) {
      return $resource('/uploadprofilepic', {}, {
        upload: {
          method: 'POST',
          param: {
            activecode: {}
          },
          isArray: false
        }
      });
    }
  ])
  .factory('Active', ['$resource',
    function($resource) {
      return $resource('/login_activeuser', {}, {
        query: {
          method: 'GET',
          params: {},
          isArray: false
        },
        active: {
          method: 'POST',
          param: {
            activecode: {}
          },
          isArray: false
        }
      });
    }
  ])
  .factory('ElectApi', ['$resource',
    function($resource) {
      return $resource('/electapi', {}, {
        get: {
          method: 'GET',
          params: {},
          isArray: false
        },
        query: {
          method: 'GET',
          params: {},
          isArray: true
        },
        post: {
          method: 'POST',
          params: {},
          isArray: false
        },
        remove: {
          method: 'DELETE',
          params: {},
          isArray: false
        }
      });
    }
  ]).factory('PhoneApi', ['$resource',
    function($resource) {
      return $resource('/phoneapi', {}, {
        get: {
          method: 'GET',
          params: {},
          isArray: false
        },
        query: {
          method: 'GET',
          params: {},
          isArray: true
        },
        post: {
          method: 'POST',
          params: {},
          isArray: false
        },
        remove: {
          method: 'DELETE',
          params: {},
          isArray: false
        }
      });
    }
  ])
  .factory('SendNotification', ['$resource',
    function($resource) {
      return $resource('/sendnotification', {}, {
        get: {
          method: 'GET',
          params: {},
          isArray: false
        },
        query: {
          method: 'GET',
          params: {},
          isArray: true
        },
        post: {
          method: 'POST',
          params: {},
          isArray: false
        },
        remove: {
          method: 'DELETE',
          params: {},
          isArray: false
        }
      });
    }
  ])
  .factory('TransactionApi', ['$resource',
    function($resource) {
      return $resource('/transactionapi', {}, {
        get: {
          method: 'GET',
          params: {},
          isArray: false
        },
        query: {
          method: 'GET',
          params: {},
          isArray: true
        },
        post: {
          method: 'POST',
          params: {},
          isArray: false
        },
        remove: {
          method: 'DELETE',
          params: {},
          isArray: false
        }
      });
    }
  ])
  .factory('WaterApi', ['$resource',
    function($resource) {
      return $resource('/waterapi', {}, {
        get: {
          method: 'GET',
          params: {},
          isArray: false
        },
        query: {
          method: 'GET',
          params: {},
          isArray: true
        },
        post: {
          method: 'POST',
          params: {},
          isArray: false
        },
        remove: {
          method: 'DELETE',
          params: {},
          isArray: false
        }
      });
    }
  ]).factory('ServerTime', ['$resource',
    function($resource) {
      return $resource('/server_time', {}, {
        get: {
          method: 'GET',
          params: {},
          isArray: false
        }
      });
    }
  ])
  .factory('PropertyApi', ['$resource',
    function($resource) {
      return $resource('/propertiesapi', {}, {
        get: {
          method: 'GET',
          params: {},
          isArray: false
        },
        query: {
          method: 'GET',
          params: {},
          isArray: true
        },
        post: {
          method: 'POST',
          params: {},
          isArray: false
        },
        remove: {
          method: 'DELETE',
          params: {},
          isArray: false
        }
      });
    }
  ])
  .factory('CalendarApi', ['$resource',
    function($resource) {
      return $resource('/calendarapi', {}, {
        get: {
          method: 'GET',
          params: {},
          isArray: false
        },
        query: {
          method: 'GET',
          params: {},
          isArray: true
        },
        post: {
          method: 'POST',
          params: {},
          isArray: false
        },
        remove: {
          method: 'DELETE',
          params: {},
          isArray: false
        }
      });
    }
  ]).factory('InventoryApi', ['$resource',
    function($resource) {
      return $resource('/inventoryapi', {}, {
        get: {
          method: 'GET',
          params: {},
          isArray: false
        },
        query: {
          method: 'GET',
          params: {},
          isArray: true
        },
        post: {
          method: 'POST',
          params: {},
          isArray: false
        },
        remove: {
          method: 'DELETE',
          params: {},
          isArray: false
        }
      });
    }
  ]).factory('UtilityApi', ['$resource',
    function($resource) {
      return $resource('/utilityapi', {}, {
        get: {
          method: 'GET',
          params: {},
          isArray: false
        },
        query: {
          method: 'GET',
          params: {},
          isArray: true
        },
        post: {
          method: 'POST',
          params: {},
          isArray: false
        },
        remove: {
          method: 'DELETE',
          params: {},
          isArray: false
        }
      });
    }
  ]).factory('CustomerApi', ['$resource',
    function($resource) {
      return $resource('/customerapi', {}, {
        get: {
          method: 'GET',
          params: {},
          isArray: false
        },
        query: {
          method: 'GET',
          params: {},
          isArray: true
        },
        post: {
          method: 'POST',
          params: {},
          isArray: false
        },
        remove: {
          method: 'DELETE',
          params: {},
          isArray: false
        }

      });
    }
  ])
  .factory('Property', ['$resource',
    function($resource) {
      return $resource('/properties', {}, {
        query: {
          method: 'GET',
          params: {
            location: []
          },
          isArray: true
        }

      });
    }
  ])
  .factory('Duplicate', ['$resource',
    function($resource) {
      return $resource('/checkduplicate', {}, {
        query: {
          method: 'GET',
          params: {},
          isArray: false
        }

      });
    }
  ])

.factory('CreateProperty', ['$resource',
    function($resource) {
      return $resource('/createproperty', {}, {
        post: {
          method: 'POST',
          params: {
            property: {}
          },
          isArray: false
        },
        query: {
          method: 'GET',
          params: {
            _id: []
          },
          isArray: false
        }

      });
    }
  ])
  .factory('Propertys', ['$resource',
    function($resource) {
      return $resource('/propertiesalone', {}, {
        post: {
          method: 'POST',
          params: {
            prop: {}
          },
          isArray: false
        },
        query: {
          method: 'GET',
          params: {
            _id: []
          },
          isArray: false
        }

      });
    }
  ])
  .factory('Filtermain', ['$resource',
    function($resource) {
      return $resource('/propertyInfos', {}, {
        query: {
          method: 'GET',
          params: {},
          isArray: true
        }
      });
    }
  ])
  .factory('Filter', ['$resource',
    function($resource) {
      return $resource('/getfilter', {}, {
        post: {
          method: 'POST',
          params: {
            prop: {}
          },
          isArray: false
        },
        query: {
          method: 'GET',
          params: {},
          isArray: false
        }

      });
    }
  ])
  .factory('Info', ['$resource',
    function($resource) {
      return $resource('/propertyInfo', {}, {
        query: {
          method: 'GET',
          params: {},
          isArray: false
        },
        kill: {
          method: 'DELETE',
          params: {},
          isArray: false
        }

      });
    }
  ])
  .factory('Search', ['$resource',
    function($resource) {
      return $resource('/search', {}, {
        post: {
          method: 'POST',
          params: {
            search: {}
          },
          isArray: true
        },
        query: {
          method: 'GET',
          params: {},
          isArray: true
        }
      });
    }
  ])
  .factory('Member', ['$resource',
    function($resource) {
      return $resource('/login_resendemail', {}, {
        query: {
          method: 'GET',
          params: {
            reg: {}
          },
          isArray: false
        },
        post: {
          method: 'post',
          params: {
            upgrade: {}
          },
          isArray: false
        }

      });
    }
  ])
  .factory('User', ['$resource',
    function($resource) {
      return $resource('/login', {}, {
        post: {
          method: 'POST',
          params: {
            reg: {}
          },
          isArray: false
        },
        query: {
          method: 'GET',
          params: {},
          isArray: false
        }

      });
    }
  ])
  .factory('List', ['$resource', function($resource) {
    return $resource('/somelist', {}, {
      query: {
        method: 'GET',
        params: {},
        isArray: false
      }
    });
  }])
  .factory('socket', function(socketFactory) {
    return socketFactory({
      ioSocket: io.connect('/')
    });
  }) // Sales Dashboard
  .factory('Customer', ['$resource',
    function($resource) {
      return $resource('/customer', {
        customerId: ''
      }, {
        get: {
          method: 'GET',
          params: {
            customerId: ''
          },
          isArray: false
        }
      });
    }
  ])
  .factory('CustomerProperty', ['$resource',
    function($resource) {
      return $resource('/customerproperties/:customerId', {
        customerId: ''
      }, {
        get: {
          method: 'GET',
          params: {
            customerId: ''
          },
          isArray: true
        }
      });
    }
  ])
  // user owner property
  .factory('CustomerPropertyOwner', ['$resource',
    function($resource) {
      return $resource('/customerowner', {
        customerId: ''
      }, {
        get: {
          method: 'GET',
          params: {
            customerId: ''
          },
          isArray: false
        }
      });
    }
  ])
  // ads sponsor
  .factory('Sponsor', ['$resource',
    function($resource) {
      return $resource('/sponsor', {}, {
        get: {
          method: 'GET',
          params: {},
          isArray: true
        }
      });
    }
  ])
  .factory('Paypal', ['$resource',
    function($resource) {
      return $resource('/paypal', {}, {
        get: {
          method: 'GET',
          params: {},
          isArray: true
        }
      });
    }
  ])
  .factory('Userpayment', ['$resource',
    function($resource) {
      return $resource('/userpayment', {}, {
        query: {
          method: 'GET',
          params: {},
          isArray: true
        }
      });
    }
  ])
  .factory('CreateTransaction', ['$resource',
    function($resource) {
      return $resource('/createtransaction', {}, {
        post: {
          method: 'POST',
          params: {},
          isArray: false
        },
        query: {
          method: 'GET',
          params: {},
          isArray: true
        },
        get: {
          method: 'GET',
          params: {},
          isArray: false
        },
      });
    }
  ])
  .factory('Paysbuy', ['$resource',
    function($resource) {
      return $resource('https://www.paysbuy.com/paynow.aspx', {}, {
        post: {
          method: 'POST',
          params: {},
          isArray: false
        }
      });
    }
  ])
  .factory('Updatenotice', ['$resource',
    function($resource) {
      return $resource('/noticeupdatedata', {}, {
        post: {
          method: 'POST',
          params: {},
          isArray: false
        }
      });
    }
  ])
  .factory('Favoritproperty', ['$resource',
    function($resource) {
      return $resource('/favoritproperty', {}, {
        get: {
          method: 'GET',
          params: {},
          isArray: true
        }
      });
    }
  ])

.factory('Notificationowner', ['$resource',
    function($resource) {
      return $resource('/notificationcount', {}, {
        get: {
          method: 'GET',
          params: {},
          isArray: false
        }
      });
    }
  ])
  .factory('Favoritboard', ['$resource',
    function($resource) {
      return $resource('/favoritboard', {}, {
        get: {
          method: 'GET',
          params: {},
          isArray: true
        }
      });
    }
  ])
  .factory('Contactmail', ['$resource',
    function($resource) {
      return $resource('/mailcontact', {}, {
        post: {
          method: 'POST',
          params: {},
          isArray: false
        }
      });
    }
  ]).factory('salelist', ['$resource',
    function($resource) {
      return $resource('/salelist', {}, {
        get: {
          method: 'GET',
          params: {},
          isArray: true
        }
      });
    }
  ])
  .factory('Favorite', ['$resource',
    function($resource) {
      return $resource('/favorite', {}, {
        get: {
          method: 'GET',
          params: {
            user_id: ''
          },
          isArray: true
        },
        owerget: {
          method: 'GET',
          params: {
            owner_id: ''
          },
          isArray: true
        },
        post: {
          method: 'POST',
          params: {},
          isArray: false
        },
        kill: {
          method: 'DELETE',
          params: {},
          isArray: false
        }
      });
    }
  ]);