/*
 Copyright (c) 2013 [Sencha Extensions Contributors](mailto:admin@webappsolution.com)

 WASI Sencha Extensions is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 WASI Sencha Extensions is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with WASI Sencha Extensions.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * The base class for mock services adds a delay to the mock asynchronous network call in milliseconds.
 */
Ext.define("SenchaExtensions.mvc.service.mock.AbstractServiceMock", {
    extend: "SenchaExtensions.mvc.service.AbstractService",

    statics: {

        /**
         * The logger for the object.
         */
        logger: SenchaExtensions.logger.Logger.getLogger("SenchaExtensions.mvc.service.mock.AbstractServiceMock"),

        /**
         * {Number} DELAY_IN_MILLISECONDS The default delay of 3 seconds for mock services.
         */
        DELAY_IN_MILLISECONDS: 3000
    },

    /**
     * Used by mock services to call a successful mock service callback with a time delay to mimic network traffic.
     *
     * @param {*} response Contains the data packet from the successful service response.
     * @param {Number} delayInMilliSeconds The number of milliseconds to delay the mock service callback.
     */
    delayedSuccess: function(response, delayInMilliSeconds, useAsyncToken) {
        SenchaExtensions.mvc.service.mock.AbstractServiceMock.logger.debug("delayedSuccess");

        var token;
        var me;

        token = this.getTokenOrPromise();
        me = this;

        // Using a delayed task in order to give the hide animation above
        // time to finish before executing the next steps.
        var task = Ext.create("Ext.util.DelayedTask", function() {
            me.success(response, token);
        });

        delayInMilliSeconds = this.getDelayInMilliSeconds(delayInMilliSeconds);
        task.delay(delayInMilliSeconds);

        return (token.promise) ? token.promise : token;
    },

    /**
     * Used by mock services to call a failed mock service callback with a time delay to mimic network traffic.
     *
     * @param {*} response Contains the data packet from the failed service response.
     * @param {Number} delayInMilliSeconds The number of milliseconds to delay the mock service callback.
     */
    delayedFailure: function(response, delayInMilliSeconds) {
        SenchaExtensions.mvc.service.mock.AbstractServiceMock.logger.debug("delayedFailure");

        var token;
        var me;

        token = this.getTokenOrPromise();
        me = this;

        // Using a delayed task in order to give the hide animation above
        // time to finish before executing the next steps.
        var task = Ext.create("Ext.util.DelayedTask", function() {
            me.failure(response, token);
        });

        delayInMilliSeconds = this.getDelayInMilliSeconds(delayInMilliSeconds);
        task.delay(delayInMilliSeconds);

        return (token.promise) ? token.promise : token;
    },

    /**
     * TODO
     *
     * @returns {SenchaExtensions.mvc.service.rpc.AsyncToken/Deft.promise.Deferred} Reference to the AsyncToken or
     * Promise
     */
    getTokenOrPromise: function() {
        var token;

        if(this.getUsePromise()) {
            token = Ext.create("Deft.promise.Deferred");
        } else {
            token = Ext.create("SenchaExtensions.mvc.service.rpc.AsyncToken");
        }

        return token;
    },

    /**
     * Helper method used to get the number of milliseconds to delay the mock service callback.
     *
     * @param {Number} delayInMilliSeconds The number of milliseconds to delay the mock service callback.
     * @return {Number} The number of milliseconds to delay the mock service callback.
     */
    getDelayInMilliSeconds: function(delayInMilliSeconds) {
        delayInMilliSeconds =
            (delayInMilliSeconds == null)
            ? SenchaExtensions.mvc.service.mock.AbstractServiceMock.DELAY_IN_MILLISECONDS
            : delayInMilliSeconds;

        SenchaExtensions.mvc.service.mock.AbstractServiceMock.logger.debug("getDelayInMilliSeconds: " + delayInMilliSeconds);
        return delayInMilliSeconds;
    },

    /**
     * Helper method to create random numbers within a given range. Helpful for mocking data.
     *
     * @param {Number} min The minimum or low end of the range.
     * @param {Number} max The maximum or high end of the range.
     * @return {Number} The random generated number.
     */
    getRandomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
});

