'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('world.salesservices', ['ngResource']).
value('version', '0.1')
  .factory('Place', ['$resource',
    function($resource) {
      return $resource('https://maps.googleapis.com/maps/api/place/nearbysearch/json'
        //?location=-33.8670522,151.1957362&radius=500&types=food&name=cruise&key=AddYourOwnKeyHere'
        , {
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
        post: {
          method: 'POST',
          params: {
            building: {}
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
  .factory('Adsservice', ['$resource',
    function($resource) {
      return $resource('/myproperties', {}, {
        query: {
          method: 'GET',
          params: {},
          isArray: true
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


// Sales Dashboard
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
        }
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