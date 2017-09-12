 var app = angular.module('myApp', ["ngRoute"]);

app.config(function($routeProvider){
    
    $routeProvider
    .when('/home',{
        templateUrl:'html/home.html'
    })
    .otherwise({redirectTo:'/home'});
});







app.controller('homeController',function($scope){
   
    $scope.totaltranscription = '';
    $scope.talk=true;
    $scope.notSelected = true;
    $scope.beginIndex = 0;
    $scope.endIndex = 0;
    $scope.alert = false;
    var timer; 
    var selectedRange = null;
    
    
        
    $scope.new = function()
    {
        timer = setInterval(getSelectedRange, 1222); 
    };
    
    
    function upgrade() 
    {
      alert('Please use Google Chrome for best experience');
    }

      if (!(window.webkitSpeechRecognition) && !(window.speechRecognition)) 
      {
        upgrade();
      } 
    
    else
      {
         var recognizing;
         $scope.init = function()
         {
              reset();
         }
          
        function reset() 
         {
            recognizing = false;
            $scope.transcription = ''; 
            $scope.interim_span = ''; 
         }

        var speech = new webkitSpeechRecognition() || speechRecognition();
        speech.continuous = false;
        speech.interimResults = true;
        speech.lang = 'en-US'; // check google web speech example source for more lanuages
        speech.onstart = function() 
            {
            // When recognition begins
            recognizing = true;
            };
          
        speech.onend = function() 
            {
              if($scope.talk)
                  {
                    speech.start();  
                  }
              else
                  {
            speech.stop();
                  }
              
            console.log($scope.talk); 
            };
          
          $scope.start = function ()
          {
              
            speech.start();
            $scope.talk = true;

          };
    
          $scope.stop = function ()
          {
            $scope.talk = false;
            speech.stop();
            reset();
    
          };
        
        speech.onresult = function(event) {
          var interim_transcript = '';
          var final_transcript = '';

          // main for loop for final and interim results
          for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              final_transcript += event.results[i][0].transcript;
            } else {
              interim_transcript += event.results[i][0].transcript;
            }
          }
          $scope.transcription = final_transcript; 
          $scope.interim_span = interim_transcript; 
            $scope.$apply();
        };

          $scope.$watch('transcription',function(){
              
              $scope.totaltranscription += ' '+$scope.transcription;

          });
         
          
        speech.onerror = function(event) {
            // Either 'No-speech' or 'Network connection error'
            console.error(event.error);
        };
      }
    
    
  
    
 

     
var getSelectedRange = function() {
    try {
        if (window.getSelection) {
            selectedRange = window.getSelection();
            console.log(selectedRange.anchorOffset);
            console.log('---------------------------------');
            console.log(selectedRange);
            
            
            console.log(selectedRange.isCollapsed);
            
            
            if(selectedRange.isCollapsed)
                {
                     $scope.notSelected = true;
                
                }
            else
                {
                    $scope.notSelected = false;
                    $scope.beginIndex = selectedRange.anchorOffset;
                    $scope.endIndex = selectedRange.focusOffset;
                    $scope.selectedText = selectedRange.getRangeAt(0);
                    $scope.alert = true;
                    
                }
            
            
        function reset()
            {
                if($scope.alert)
                {
                clearInterval(timer);
                $scope.alert = false;
                selectedRange.empty();   
                }
                
                timer = setInterval(getSelectedRange, 1222); 
            
            }
            
            $scope.closeAlert = function()
                {
                    reset();
                }
            $scope.$apply();
            
        } else {
            selectedRange = document.getSelection();
        }
    }
    catch (err)
    
    {
console.log(err);
    }

};
    
    
    
    
});

app.directive("popUp", function() {
    
    return {
        restrict: 'E',
        scope:{
            'startValue':'=',
            'endValue':'=',
            'text':'=',
            'closeMe': '&'
        },
        
        templateUrl:"directive/pop-up.html"
    };
});

