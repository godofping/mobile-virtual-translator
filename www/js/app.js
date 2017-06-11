const translateApp = angular.module('translator', ['ionic', 'angularRipple']);

translateApp.run($ionicPlatform => {
  $ionicPlatform.ready(() => {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

translateApp.controller('translateCtrl', ($scope, $timeout, $ionicModal, Translate, CordovaTTS) => {
  $scope.spinner = false;
  $scope.talkButton = false;
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
        $scope.spinner = false;
        $scope.talkButton = false;
      } else {
        console.log("wait");
      }
      $scope.$evalAsync();
    });
  }

  $scope.start = () => {
    $scope.spinner = true;
    $scope.talkButton = true;
    startOneCommandArtyom();
    redirectRecognizedTextOutput();;
  }

  $scope.selectLang = (code, name) => {
    $scope.lang.artyom = code;
    $scope.lang.yandex = code.substring(0, code.indexOf('-'));
    $scope.lang.name = name;
    $scope.languagesModal.hide();
  }
})

translateApp.factory('Translate', ($http, CordovaTTS) => {
  const yandex_api = "trnsl.1.1.20170609T083328Z.bc764b99ad68e76a.6e5983803d01cb65a2b4bbfa1b2cfd872599d055";
  return {
    get(text, lang, ttsLang) {
      return $http.get(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=${yandex_api}&text=${text}&lang=${lang}`).then(response => {
        //artyom.say(response.data.text[0]);
        CordovaTTS.say(response.data.text[0], ttsLang);
      }).catch(err => {
        //artyom.say("I'm sorry. An error occured.");
        CordovaTTS.say("I'm sorry. An error occured.", ttsLang)
      })
    }
  }
})

translateApp.factory('CordovaTTS', () => {
  return {
    say(text, lang) {
      document.addEventListener('deviceready', function () {
        return TTS
          .speak({
            text: text,
            locale: lang,
            rate: 1.2
          });
      }, false);
    }
  }

})

