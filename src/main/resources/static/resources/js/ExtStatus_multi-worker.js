window = document = this;
importScripts("sockjs-0.3.4.js");
importScripts("stomp.min.js");

/*
self.addEventListener('message', function(e) {
	var data = JSON.parse(e.data);
	busyWork(data);
});
*/

onmessage = function (event) {
	var data = JSON.parse(event.data);
	busyWork(data);
};
	
function busyWork(data){
	switch (data.cmd) {
		case 'connect':
			connect();
			break;
		default:
			break;
	}
	
/*	sock.subscribe("/topic/ext.status.*", function(message) {
    	var data = JSON.parse(message.body);
        // console.log("/topic/ext.status : " + data.extension + ", " + data.status);
        // update_ext_status(data);
        
    	// var scope = angular.element($("#ctrlextstatus")).scope();
//	    scope.$apply(function () {
//	        scope.updateExtStatus(data);
//	    });
    	
    	self.postMessage(data);
    });*/
}

var whoami;
var client;

function connect() {
	var socket = new SockJS('/webcrm');
	client = Stomp.over(socket);
	
	// client = Stomp.client('ws://localhost:8080/webcrm');
	// client = Stomp.over(socket);
	// client.outgoing = 10000;
	// client.incoming = 10000;
    
	client.connect({}, function(frame) {
    	whoami = frame.headers['user-name'];

        /*
        client.subscribe("/user/topic/callstatus", function(message) {
        	console.log('index.html /topic/callstatus: ' + JSON.parse(message.body));
        });
        */

    	client.subscribe("/topic/ext.status.*", function(message) {
        	var data = JSON.parse(message.body);
            console.log("worker /topic/ext.status : " + data.extension + ", " + data.status);
            // update_ext_status(data);
        	// self.postMessage(message.body);
            postMessage(message.body);
        });
        
    	client.subscribe("/user/queue/groupware", function(message) {
        	// console.log('index.html /user/queus/groupware: ' + JSON.parse(message.body));
        	// console.log('index.html /user/queus/groupware: ' + message.body);
		});
        
    	client.subscribe("/user/queue/errors", function(message) {
        	console.log('index.html /app/queue/errors: ' + JSON.parse(message.body));
		});

    	console.log('index.html Connected: ' + frame);
    });
}

function disconnect() {
    if (client != null) {
    	client.disconnect();
    }
    // setConnected(false);
    console.log("Disconnected");
}