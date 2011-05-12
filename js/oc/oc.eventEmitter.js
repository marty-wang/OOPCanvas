//= require "oc.bootstrapper"
//= require "oc.util"

(function (OC) {

    // ++ Augment OOPCanvas ++
   
    OC.EventEmitter = EventEmitter;

    /**
     * shorthand method to create Event Emitter instance.
     */
    OC.prototype.eventEmitter = function () {
        return new EventEmitter();
    };

    // == EventEmitter ==

    /**
     * Can be created by using shorthand method {@link OOPCanvas#eventEmitter}
     * @name EventEmitter
     * @exports EventEmitter as OOPCanvas.EventEmitter
     * @class The class deals with eventing.
     */
    function EventEmitter () {
        this._eventsMapper = {};
    }

    /**
    * @param { String } eventName
    * @param { Object|Function } subscriber Subscriber can be either object or
    * function. If it is an object, it must have an event handler function named
    * after "oneventName". For example, if the event is "created", the
    * corresponding event handler function should be named as "oncreated". If the
    * subscriber is a function, there is no naming striction.
    */
    EventEmitter.prototype.subscribe = function(eventName, subscriber) {
        if(typeof subscriber !== "object" && typeof subscriber !== "function") {
            throw "The subcriber needs to be either an object or a function";
        }

        var mapper = this._eventsMapper;
        if (!Object.prototype.hasOwnProperty.call(mapper, eventName)) {
            mapper[eventName] = [];
        }

        mapper[eventName].push(subscriber);
    };

    /**
     * @param {String} eventName
     * @param {Object|Function} [subscriber] if subscriber is left out, it will remove all the subscribers for that event.
     */
    EventEmitter.prototype.unsubscribe = function(eventName, subscriber) {
        var subscribers = this._eventsMapper[eventName];

        if (subscribers === undefined) {
            return;
        }

        if (subscriber === undefined) {
            subscribers.length = 0;
        } else {
            var index = OC.Util.arrayIndexOf(subscribers, subscriber);
            if (index > -1) {
                subscribers.splice(index, 1);
            }
        }

        if(subscribers.length === 0) {
            delete this._eventsMapper[eventName];
        }
    };

    /**
     * trigger event
     */
    EventEmitter.prototype.fire = function(sender, eventName, eventArgs) {
        var subscribers = this._eventsMapper[eventName];

        if(subscribers === undefined) {
            return;
        }

        var num = subscribers.length;
        var i;
        var subscriber;
        var method;

        for (i = 0; i < num; i++) {
            subscriber = subscribers[i];
            if (typeof subscriber === "function") {
                subscriber.call(null, sender, eventArgs);
            } else if (typeof subscriber === "object") {
                method = "on" + eventName;
                subscriber[method].call(subscriber, sender, eventArgs);
            }
        }
    };

    debug.info("eventEmitter module is installed.");

})(OOPCanvas);
