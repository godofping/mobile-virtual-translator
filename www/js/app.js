const translateApp = angular.module('translator', ['ionic', 'angularRipple', 'ngCordova']);

translateApp.run(($ionicPlatform, $ionicPopup) => {
  $ionicPlatform.ready(() => {
    if (window.Connection) {
      if (navigator.connection.type == Connection.NONE) {
        $ionicPopup.confirm({
            title: "Internet Disconnected",
            content: "You need internet connection to run this app."
          })
          .then(result => {
            if (!result) {
              ionic.Platform.exitApp();
            }
          });
      }
    }
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

translateApp.controller('translateCtrl', ($rootScope, $scope, $timeout, $ionicModal, $ionicPopup, Translate, CordovaTTS) => {
  $scope.spinner = false;
  $scope.talkButton = false;
  $rootScope.talkButton_text = "TAP TO TALK";
  $rootScope.talkButton_disabled = false;
  $scope.lang = {
    artyom: "en-GB",
    yandex: "en",
    name: "English"
  };

  $scope.languages = [{
      img: 'img/langs/flag-usa.png',
      code: 'en-GB',
      name: 'English'
    },
    {
      img: 'img/langs/flag-brasil.png',
      code: 'pt-PT',
      name: 'Portuguese'
    },
    {
      img: 'img/langs/flag-china.png',
      code: 'zh-CN',
      name: 'Chinese'
    },
    {
      img: 'img/langs/flag-france.png',
      code: 'fr-FR',
      name: 'French'
    },
    {
      img: 'img/langs/flag-german.png',
      code: 'de-DE',
      name: 'German'
    },
    {
      img: 'img/langs/flag-hindi.png',
      code: 'hi-IN',
      name: 'Hindi'
    },
    {
      img: 'img/langs/flag-indonesia.png',
      code: 'id-ID',
      name: 'Indonesian'
    },
    {
      img: 'img/langs/flag-italy.png',
      code: 'it-IT',
      name: 'Italian'
    },
    {
      img: 'img/langs/flag-japan.png',
      code: 'ja-JP',
      name: 'Japanese'
    },
    {
      img: 'img/langs/flag-netherlands.png',
      code: 'nl-NL',
      name: 'Dutch'
    },
    {
      img: 'img/langs/flag-russia.png',
      code: 'ru-RU',
      name: 'Russian'
    },
    {
      img: 'img/langs/flag-spanish.png',
      code: 'es-ES',
      name: 'Spanish'
    }
  ]

  $ionicModal.fromTemplateUrl('languages.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(modal => {
    $scope.languagesModal = modal;
  });

  const command = {
    indexes: ["test"],
    action() {
      //artyom.say("Artyom works.");
      CordovaTTS.say("Everything works.", $scope.lang.artyom)
    }
  };

  artyom.addCommands(command);

  function startOneCommandArtyom() {
    artyom.fatality(); // use this to stop any of
    setTimeout(() => { // if you use artyom.fatality , wait 250 ms to initialize again.
      artyom.initialize({
        lang: $scope.lang.artyom, // A lot of languages are supported. Read the docs !
        continuous: false, // recognize 1 command and stop listening !
        listen: true, // Start recognizing
        debug: true, // Show everything in the console
        speed: 1 // talk normally
      }).then(() => {
        console.log("Ready to work !");
      });
    }, 250);
  }

  function redirectRecognizedTextOutput() {
    artyom.redirectRecognizedTextOutput((recognized, isFinal) => {
      if (isFinal) {
        Translate.get(recognized, $scope.lang.yandex, $scope.lang.artyom);
        //Translate.get(recognized, $scope.lang.yandex);
        $scope.spinner = false;
        $scope.talkButton = false;
      } else {
        console.log("wait");
      }
      $scope.$evalAsync();
    });
  }

  $scope.start = () => {
    $rootScope.talkButton_disabled = true;
    $scope.spinner = true;
    $scope.talkButton = true;
    startOneCommandArtyom();
    redirectRecognizedTextOutput();;
  }

  $scope.selectLang = (code, name) => {

    $scope.lang.artyom = code;
    $scope.lang.yandex = code.substring(0, code.indexOf('-'));
    $scope.lang.name = name;
    $scope.languagesModal.hide().then(() => {
      $ionicPopup.alert({
        title: "Language Selection",
        content: `Output language set to ${name}`
      })
    })

  }

  $scope.cancelTalk = () => {
    artyom.fatality();
    $scope.spinner = false;
    $scope.talkButton = false;
    $rootScope.talkButton_text = "TAP TO TALK";
    $rootScope.talkButton_disabled = false;
  }

  $scope.exit = () => {
    $ionicPopup.confirm({
        title: "Rate my App!",
        content: "Thank you for using the app. Will you please rate it? :)"
      })
      .then(result => {
        if (!result) {
          ionic.Platform.exitApp();
        } else {
          ionic.Platform.exitApp();
          // android url
        }
      });
  }
})

translateApp.factory('Translate', ($rootScope, $http, $timeout, CordovaTTS) => {
  const yandex_api = "trnsl.1.1.20170609T083328Z.bc764b99ad68e76a.6e5983803d01cb65a2b4bbfa1b2cfd872599d055";
  return {
    get(text, lang, ttsLang) {
      $rootScope.talkButton_text = "Translating...";
      return $http.get(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=${yandex_api}&text=${text}&lang=${lang}`).then(response => {
        $rootScope.talkButton_text = "TAP TO TALK";
        $timeout(function() {
          $rootScope.talkButton_disabled = false;
        }, 250)
        //artyom.say(response.data.text[0]);
        CordovaTTS.say(response.data.text[0], ttsLang);
      }).catch(err => {
        //artyom.say("I'm sorry. An error occured.");
        CordovaTTS.say("I'm sorry. There was an error. Might be your internet connection?", ttsLang)
      })
    }
  }
})

translateApp.factory('CordovaTTS', function($rootScope) {
  return {
    say(text, lang) {
      document.addEventListener('deviceready', function() {
        TTS.speak({
          text,
          locale: lang,
          rate: 1.2
        })
      }, false)
    }
  }
})

