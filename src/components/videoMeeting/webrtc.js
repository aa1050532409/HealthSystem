// /* eslint-disable */
// List of
import adapter from 'webrtc-adapter';
Webrtcgw.sessions = {};
Webrtcgw.audioIndex = null;
Webrtcgw.videoIndex = null;
Webrtcgw.videoBandWidth = null;

Webrtcgw.isExtensionEnabled = function () {
	if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
		// No need for the extension, getDisplayMedia is supported
		return true;
	}
	if (window.navigator.userAgent.match('Chrome')) {
		var chromever = parseInt(window.navigator.userAgent.match(/Chrome\/(.*) /)[1], 10);
		var maxver = 33;
		if (window.navigator.userAgent.match('Linux')) { maxver = 35; }	// "known" crash in chrome 34 and 35 on linux
		if (chromever >= 26 && chromever <= maxver) {
			// Older versions of Chrome don't support this extension-based approach, so lie
			return true;
		}
		return Webrtcgw.extension.isInstalled();
	} else {
		// Firefox of others, no need for the extension (but this doesn't mean it will work)
		return true;
	}
};

var defaultExtension = {
	// Screensharing Chrome Extension ID
	extensionId: 'hapfgfdkleiggjjpfpenajgdnfckjpaj',
	isInstalled: function () { return document.querySelector('#webrtcgw-extension-installed') !== null; },
	getScreen: function (callback) {
		var pending = window.setTimeout(function () {
			var error = new Error('NavigatorUserMediaError');
			error.name = 'The required Chrome extension is not installed: click <a href="#">here</a> to install it. (NOTE: this will need you to refresh the page)';
			return callback(error);
		}, 1000);
		this.cache[pending] = callback;
		window.postMessage({ type: 'webrtcgwGetScreen', id: pending }, '*');
	},
	init: function () {
		var cache = {};
		this.cache = cache;
		// Wait for events from the Chrome Extension
		window.addEventListener('message', function (event) {
			if (event.origin !== window.location.origin) { return; }
			if (event.data.type === 'webrtcgwGotScreen' && cache[event.data.id]) {
				var callback = cache[event.data.id];
				delete cache[event.data.id];

				if (event.data.sourceId === '') {
					// user canceled
					var error = new Error('NavigatorUserMediaError');
					error.name = 'You cancelled the request for permission, giving up...';
					callback(error);
				} else {
					callback(null, event.data.sourceId);
				}
			} else if (event.data.type === 'webrtcgwGetScreenPending') {
				console.log('clearing ', event.data.id);
				window.clearTimeout(event.data.id);
			}
		});
	}
};

Webrtcgw.useDefaultDependencies = function (deps) {
	var f = (deps && deps.fetch) || fetch;
	var P = (deps && deps.Promise) || Promise;
	var SocketCls = (deps && deps.WebSocket) || WebSocket;

	return {
		newWebSocket: function (server, proto) { return new SocketCls(server, proto); },
		extension: (deps && deps.extension) || defaultExtension,
		isArray: function (arr) { return Array.isArray(arr); },
		webRTCAdapter: (deps && deps.adapter) || adapter,
		httpAPICall: function (url, options) {
			var fetchOptions = {
				method: options.verb,
				headers: {
					'Accept': 'application/json, text/plain, */*'
				},
				cache: 'no-cache'
			};
			if (options.verb === 'POST') {
				fetchOptions.headers['Content-Type'] = 'application/json';
			}
			if (options.withCredentials !== undefined) {
				fetchOptions.credentials = options.withCredentials === true ? 'include' : (options.withCredentials ? options.withCredentials : 'omit');
			}
			if (options.body !== undefined) {
				fetchOptions.body = JSON.stringify(options.body);
			}

			var fetching = f(url, fetchOptions).catch(function (error) {
				return P.reject({ message: 'Probably a network error, is the server down?', error: error });
			});

			/*
			 * fetch() does not natively support timeouts.
			 * Work around this by starting a timeout manually, and racing it agains the fetch() to see which thing resolves first.
			 */

			if (options.timeout !== undefined) {
				var timeout = new P(function (resolve, reject) {
					var timerId = setTimeout(function () {
						clearTimeout(timerId);
						return reject({ message: 'Request timed out', timeout: options.timeout });
					}, options.timeout);
				});
				fetching = P.race([fetching, timeout]);
			}

			fetching.then(function (response) {
				if (response.ok) {
					if (typeof (options.success) === typeof (Webrtcgw.noop)) {
						return response.json().then(function (parsed) {
							options.success(parsed);
						}).catch(function (error) {
							return P.reject({ message: 'Failed to parse response body', error: error, response: response });
						});
					}
				} else {
					return P.reject({ message: 'API call failed', response: response });
				}
			}).catch(function (error) {
				if (typeof (options.error) === typeof (Webrtcgw.noop)) {
					options.error(error.message || '<< internal error >>', error);
				}
			});

			return fetching;
		}
	};
};

Webrtcgw.useOldDependencies = function (deps) {
	var jq = (deps && deps.jQuery);
	var SocketCls = (deps && deps.WebSocket) || WebSocket;
	return {
		newWebSocket: function (server, proto) { return new SocketCls(server, proto); },
		isArray: function (arr) { return jq.isArray(arr); },
		extension: (deps && deps.extension) || defaultExtension,
		webRTCAdapter: (deps && deps.adapter) || adapter,
		httpAPICall: function (url, options) {
			var payload = options.body !== undefined ? {
				contentType: 'application/json',
				data: JSON.stringify(options.body)
			} : {};
			var credentials = options.withCredentials !== undefined ? { xhrFields: { withCredentials: options.withCredentials } } : {};

			return jq.ajax(jq.extend(payload, credentials, {
				url: url,
				type: options.verb,
				cache: false,
				dataType: 'json',
				async: options.async,
				timeout: options.timeout,
				success: function (result) {
					if (typeof (options.success) === typeof (Webrtcgw.noop)) {
						options.success(result);
					}
				},
				error: function (xhr, status, err) {
					if (typeof (options.error) === typeof (Webrtcgw.noop)) {
						options.error(status, err);
					}
				}
			}));
		}
	};
};

Webrtcgw.noop = function () { };

Webrtcgw.dataChanDefaultLabel = 'WebrtcgwDataChannel';

// Note: in the future we may want to change this, e.g., as was
Webrtcgw.endOfCandidates = null;

// Initialization
Webrtcgw.init = function (options) {
	options = options || {};
	Webrtcgw.videoBandWidth = options.bandwidth;
	options.callback = (typeof options.callback === 'function') ? options.callback : Webrtcgw.noop;
	if (Webrtcgw.initDone === true) {
		// Already initialized
		options.callback();
	} else {
		// if (typeof console === 'undefined' || typeof console.log === 'undefined') { console = { log: function() {} }; }
		// Console logging (all debugging disabled by default)
		Webrtcgw.trace = Webrtcgw.noop;
		Webrtcgw.debug = Webrtcgw.noop;
		Webrtcgw.vdebug = Webrtcgw.noop;
		Webrtcgw.log = Webrtcgw.noop;
		Webrtcgw.warn = Webrtcgw.noop;
		Webrtcgw.error = Webrtcgw.noop;
		if (options.debug === true || options.debug === 'all') {
			// Enable all debugging levels
			Webrtcgw.trace = console.trace.bind(console);
			Webrtcgw.debug = console.debug.bind(console);
			Webrtcgw.vdebug = console.debug.bind(console);
			Webrtcgw.log = console.log.bind(console);
			Webrtcgw.warn = console.warn.bind(console);
			Webrtcgw.error = console.error.bind(console);
		} else if (Array.isArray(options.debug)) {
			for (var i in options.debug) {
				var d = options.debug[i];
				switch (d) {
					case 'trace':
						Webrtcgw.trace = console.trace.bind(console);
						break;
					case 'debug':
						Webrtcgw.debug = console.debug.bind(console);
						break;
					case 'vdebug':
						Webrtcgw.vdebug = console.debug.bind(console);
						break;
					case 'log':
						Webrtcgw.log = console.log.bind(console);
						break;
					case 'warn':
						Webrtcgw.warn = console.warn.bind(console);
						break;
					case 'error':
						Webrtcgw.error = console.error.bind(console);
						break;
					default:
						console.error("Unknown debugging option '" + d + "' (supported: 'trace', 'debug', 'vdebug', 'log', warn', 'error')");
						break;
				}
			}
		}

		var usedDependencies = options.dependencies || Webrtcgw.useDefaultDependencies();
		Webrtcgw.isArray = usedDependencies.isArray;
		Webrtcgw.webRTCAdapter = usedDependencies.webRTCAdapter;
		Webrtcgw.httpAPICall = usedDependencies.httpAPICall;
		Webrtcgw.newWebSocket = usedDependencies.newWebSocket;
		Webrtcgw.extension = usedDependencies.extension;
		Webrtcgw.extension.init();

		// Helper method to enumerate devices
		Webrtcgw.listDevices = function (callback, config) {
			callback = (typeof callback === 'function') ? callback : Webrtcgw.noop;
			if (config == null) config = { audio: true, video: true };
			if (Webrtcgw.isGetUserMediaAvailable()) {
				navigator.mediaDevices.getUserMedia(config)
					.then(function (stream) {
						navigator.mediaDevices.enumerateDevices().then(function (devices) {
							callback(devices);
							// Get rid of the now useless stream
							try {
								var tracks = stream.getTracks();
								for (var i in tracks) {
									var mst = tracks[i];
									if (mst !== null && mst !== undefined) { mst.stop(); }
								}
							} catch (e) { console.log(e); }
						});
					})
					.catch(function (err) {
						Webrtcgw.error(err);
						callback([]);
					});
			} else {
				Webrtcgw.warn('navigator.mediaDevices unavailable');
				callback([]);
			}
		};
		// Helper methods to attach/reattach a stream to a video element (previously part of adapter.js)
		Webrtcgw.attachMediaStream = function (element, stream) {
			if (Webrtcgw.webRTCAdapter.browserDetails.browser === 'chrome') {
				var chromever = Webrtcgw.webRTCAdapter.browserDetails.version;
				if (chromever >= 52) {
					element.srcObject = stream;
				} else if (typeof element.src !== 'undefined') {
					element.src = URL.createObjectURL(stream);
				} else {
					Webrtcgw.error('Error attaching stream to element');
				}
			} else {
				element.srcObject = stream;
			}
		};
		Webrtcgw.reattachMediaStream = function (to, from) {
			if (Webrtcgw.webRTCAdapter.browserDetails.browser === 'chrome') {
				var chromever = Webrtcgw.webRTCAdapter.browserDetails.version;
				if (chromever >= 52) {
					to.srcObject = from.srcObject;
				} else if (typeof to.src !== 'undefined') {
					to.src = from.src;
				} else {
					Webrtcgw.error('Error reattaching stream to element');
				}
			} else {
				to.srcObject = from.srcObject;
			}
		};
		// Detect tab close: make sure we don't loose existing onbeforeunload handlers
		// (note: for iOS we need to subscribe to a different event, 'pagehide', see
		// https://gist.github.com/thehunmonkgroup/6bee8941a49b86be31a787fe8f4b8cfe)
		var iOS = ['iPad', 'iPhone', 'iPod'].indexOf(navigator.platform) >= 0;
		var eventName = iOS ? 'pagehide' : 'beforeunload';
		var oldOBF = window['on' + eventName];
		window.addEventListener(eventName, function (event) {
			Webrtcgw.log('Closing window');
			for (var s in Webrtcgw.sessions) {
				if (Webrtcgw.sessions[s] !== null && Webrtcgw.sessions[s] !== undefined &&
					Webrtcgw.sessions[s].destroyOnUnload) {
					Webrtcgw.log('Destroying session ' + s);
					Webrtcgw.sessions[s].destroy({ asyncRequest: false, notifyDestroyed: false });
				}
			}
			if (oldOBF && typeof oldOBF === 'function') { oldOBF(); }
		});
		// If this is a Safari Technology Preview, check if VP8 is supported
		Webrtcgw.safariVp8 = false;
		if (Webrtcgw.webRTCAdapter.browserDetails.browser === 'safari' &&
			Webrtcgw.webRTCAdapter.browserDetails.version >= 605) {
			// Let's see if RTCRtpSender.getCapabilities() is there
			if (RTCRtpSender && RTCRtpSender.getCapabilities && RTCRtpSender.getCapabilities('video') &&
				RTCRtpSender.getCapabilities('video').codecs && RTCRtpSender.getCapabilities('video').codecs.length) {
				for (let i in RTCRtpSender.getCapabilities('video').codecs) {
					var codec = RTCRtpSender.getCapabilities('video').codecs[i];
					if (codec && codec.mimeType && codec.mimeType.toLowerCase() === 'video/vp8') {
						Webrtcgw.safariVp8 = true;
						break;
					}
				}
				if (Webrtcgw.safariVp8) {
					Webrtcgw.log('This version of Safari supports VP8');
				} else {
					Webrtcgw.warn("This version of Safari does NOT support VP8: if you're using a Technology Preview, " +
						"try enabling the 'WebRTC VP8 codec' setting in the 'Experimental Features' Develop menu");
				}
			} else {
				// We do it in a very ugly way, as there's no alternative...
				// We create a PeerConnection to see if VP8 is in an offer
				var testpc = new RTCPeerConnection({}, {});
				testpc.createOffer({ offerToReceiveVideo: true }).then(function (offer) {
					Webrtcgw.safariVp8 = offer.sdp.indexOf('VP8') !== -1;
					if (Webrtcgw.safariVp8) {
						Webrtcgw.log('This version of Safari supports VP8');
					} else {
						Webrtcgw.warn("This version of Safari does NOT support VP8: if you're using a Technology Preview, " +
							"try enabling the 'WebRTC VP8 codec' setting in the 'Experimental Features' Develop menu");
					}
					testpc.close();
					testpc = null;
				});
			}
		}
		// Check if this browser supports Unified Plan and transceivers
		// Based on https://codepen.io/anon/pen/ZqLwWV?editors=0010
		Webrtcgw.unifiedPlan = false;
		if (Webrtcgw.webRTCAdapter.browserDetails.browser === 'firefox' &&
			Webrtcgw.webRTCAdapter.browserDetails.version >= 59) {
			// Firefox definitely does, starting from version 59
			Webrtcgw.unifiedPlan = true;
		} else if (Webrtcgw.webRTCAdapter.browserDetails.browser === 'chrome' &&
			Webrtcgw.webRTCAdapter.browserDetails.version < 72) {
			// Chrome does, but it's only usable from version 72 on
			Webrtcgw.unifiedPlan = false;
			// } else if (!('currentDirection' in RTCRtpTransceiver.prototype)) {
			// 	// Safari supports addTransceiver() but not Unified Plan when
			// 	// currentDirection is not defined (see codepen above)
			// 	Webrtcgw.unifiedPlan = false;
			// }
		} else {
			// Check if addTransceiver() throws an exception
			const tempPc = new RTCPeerConnection();
			try {
				tempPc.addTransceiver('audio');
				Webrtcgw.unifiedPlan = true;
			} catch (e) { console.log(e); }
			tempPc.close();
		}
		Webrtcgw.initDone = true;
		options.callback();
	}
};

// Helper method to check whether WebRTC is supported by this browser
Webrtcgw.isWebrtcSupported = function () {
	return window.RTCPeerConnection !== undefined && window.RTCPeerConnection !== null;
};
// Helper method to check whether devices can be accessed by this browser (e.g., not possible via plain HTTP)
Webrtcgw.isGetUserMediaAvailable = function () {
	return navigator.mediaDevices !== undefined && navigator.mediaDevices !== null &&
		navigator.mediaDevices.getUserMedia !== undefined && navigator.mediaDevices.getUserMedia !== null;
};

// Helper method to create random identifiers (e.g., transaction)
Webrtcgw.randomString = function (len) {
	var charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var randomString = '';
	for (var i = 0; i < len; i++) {
		var randomPoz = Math.floor(Math.random() * charSet.length);
		randomString += charSet.substring(randomPoz, randomPoz + 1);
	}
	return randomString;
};

function Webrtcgw(gatewayCallbacks) {
	if (Webrtcgw.initDone === undefined) {
		gatewayCallbacks.error('Library not initialized');
		return {};
	}
	if (!Webrtcgw.isWebrtcSupported()) {
		gatewayCallbacks.error('WebRTC not supported by this browser');
		return {};
	}
	gatewayCallbacks = gatewayCallbacks || {};
	gatewayCallbacks.success = (typeof gatewayCallbacks.success === 'function') ? gatewayCallbacks.success : Webrtcgw.noop;
	gatewayCallbacks.error = (typeof gatewayCallbacks.error === 'function') ? gatewayCallbacks.error : Webrtcgw.noop;
	gatewayCallbacks.destroyed = (typeof gatewayCallbacks.destroyed === 'function') ? gatewayCallbacks.destroyed : Webrtcgw.noop;
	if (gatewayCallbacks.server === null || gatewayCallbacks.server === undefined) {
		gatewayCallbacks.error('Invalid server url');
		return {};
	}
	var websockets = false;
	var ws = null;
	var wsHandlers = {};
	var wsKeepaliveTimeoutId = null;

	var servers = null;
	var serversIndex = 0;
	var server = gatewayCallbacks.server;
	if (Webrtcgw.isArray(server)) {
		Webrtcgw.log('Multiple servers provided (' + server.length + '), will use the first that works');
		server = null;
		servers = gatewayCallbacks.server;
	} else {
		if (server.indexOf('ws') === 0) {
			websockets = true;
			Webrtcgw.log('Using WebSockets to contact Webrtcgw: ' + server);
		} else {
			websockets = false;
			Webrtcgw.log('Using REST API to contact: ' + server);
		}
	}
	var iceServers = gatewayCallbacks.iceServers;
	if (iceServers === undefined || iceServers === null) { iceServers = [{ urls: 'stun:stun.l.google.com:19302' }]; }
	var iceTransportPolicy = gatewayCallbacks.iceTransportPolicy;
	var bundlePolicy = gatewayCallbacks.bundlePolicy;
	// Whether IPv6 candidates should be gathered
	var ipv6Support = gatewayCallbacks.ipv6;
	if (ipv6Support === undefined || ipv6Support === null) { ipv6Support = false; }
	// Whether we should enable the withCredentials flag for XHR requests
	var withCredentials = false;
	if (gatewayCallbacks.withCredentials !== undefined && gatewayCallbacks.withCredentials !== null) { withCredentials = gatewayCallbacks.withCredentials === true; }
	// Optional max events
	var maxev = 10;
	if (gatewayCallbacks.max_poll_events !== undefined && gatewayCallbacks.max_poll_events !== null) { maxev = gatewayCallbacks.max_poll_events; }
	if (maxev < 1) { maxev = 1; }
	// Token to use (only if the token based authentication mechanism is enabled)
	var token = null;
	if (gatewayCallbacks.token !== undefined && gatewayCallbacks.token !== null) { token = gatewayCallbacks.token; }
	// API secret to use (only if the shared API secret is enabled)
	var apisecret = null;
	if (gatewayCallbacks.apisecret !== undefined && gatewayCallbacks.apisecret !== null) { apisecret = gatewayCallbacks.apisecret; }
	// Whether we should destroy this session when onbeforeunload is called
	this.destroyOnUnload = true;
	if (gatewayCallbacks.destroyOnUnload !== undefined && gatewayCallbacks.destroyOnUnload !== null) { this.destroyOnUnload = (gatewayCallbacks.destroyOnUnload === true); }
	// Some timeout-related values
	var keepAlivePeriod = 25000;
	if (gatewayCallbacks.keepAlivePeriod !== undefined && gatewayCallbacks.keepAlivePeriod !== null) { keepAlivePeriod = gatewayCallbacks.keepAlivePeriod; }
	if (isNaN(keepAlivePeriod)) { keepAlivePeriod = 25000; }
	var longPollTimeout = 60000;
	if (gatewayCallbacks.longPollTimeout !== undefined && gatewayCallbacks.longPollTimeout !== null) { longPollTimeout = gatewayCallbacks.longPollTimeout; }
	if (isNaN(longPollTimeout)) { longPollTimeout = 60000; }

	// overrides for default maxBitrate values for simulcasting
	function getMaxBitrates(simulcastMaxBitrates) {
		var maxBitrates = {
			high: 900000,
			medium: 300000,
			low: 100000
		};

		if (simulcastMaxBitrates !== undefined && simulcastMaxBitrates !== null) {
			if (simulcastMaxBitrates.high) { maxBitrates.high = simulcastMaxBitrates.high; }
			if (simulcastMaxBitrates.medium) { maxBitrates.medium = simulcastMaxBitrates.medium; }
			if (simulcastMaxBitrates.low) { maxBitrates.low = simulcastMaxBitrates.low; }
		}

		return maxBitrates;
	}

	var connected = false;
	var sessionId = null;
	var pluginHandles = {};
	var that = this;
	var retries = 0;
	var transactions = {};
	createSession(gatewayCallbacks);

	// Public methods
	this.getServer = function () { return server; };
	this.isConnected = function () { return connected; };
	this.reconnect = function (callbacks) {
		callbacks = callbacks || {};
		callbacks.success = (typeof callbacks.success === 'function') ? callbacks.success : Webrtcgw.noop;
		callbacks.error = (typeof callbacks.error === 'function') ? callbacks.error : Webrtcgw.noop;
		callbacks['reconnect'] = true;
		createSession(callbacks);
	};
	this.getSessionId = function () { return sessionId; };
	this.destroy = function (callbacks) { destroySession(callbacks); };
	this.attach = function (callbacks) { createHandle(callbacks); };

	function eventHandler() {
		if (sessionId == null) { return; }
		if (!connected) {
			Webrtcgw.warn('Is the server down? (connected=false)');
			return;
		}
		var longpoll = server + '/' + sessionId + '?rid=' + new Date().getTime();
		if (maxev !== undefined && maxev !== null) { longpoll = longpoll + '&maxev=' + maxev; }
		if (token !== null && token !== undefined) { longpoll = longpoll + '&token=' + encodeURIComponent(token); }
		if (apisecret !== null && apisecret !== undefined) { longpoll = longpoll + '&apisecret=' + encodeURIComponent(apisecret); }
		Webrtcgw.httpAPICall(longpoll, {
			verb: 'GET',
			withCredentials: withCredentials,
			success: handleEvent,
			timeout: longPollTimeout,
			error: function (textStatus, errorThrown) {
				Webrtcgw.error(textStatus + ':', errorThrown);
				retries++;
				if (retries > 3) {
					// Did we just lose the server? :-(
					connected = false;
					gatewayCallbacks.error('Lost connection to the server (is it down?)');
					return;
				}
				eventHandler();
			}
		});
	}

	// Private event handler: this will trigger plugin callbacks, if set
	function handleEvent(json, skipTimeout) {
		retries = 0;
		if (!websockets && sessionId !== undefined && sessionId !== null && skipTimeout !== true) { eventHandler(); }
		if (!websockets && Webrtcgw.isArray(json)) {
			// We got an array: it means we passed a maxev > 1, iterate on all objects
			for (var i = 0; i < json.length; i++) {
				handleEvent(json[i], true);
			}
			return;
		}
		if (json['webrtcgw'] === 'keepalive') {
			// Nothing happened
			Webrtcgw.vdebug('Got a keepalive on session ' + sessionId);
			return;
		} else if (json['webrtcgw'] === 'ack') {
			// Just an ack, we can probably ignore
			let transaction = json['transaction'];
			if (transaction !== null && transaction !== undefined) {
				let reportSuccess = transactions[transaction];
				if (reportSuccess !== null && reportSuccess !== undefined) {
					reportSuccess(json);
				}
				delete transactions[transaction];
			}
			return;
		} else if (json['webrtcgw'] === 'success') {
			// Success!
			let transaction = json['transaction'];
			if (transaction !== null && transaction !== undefined) {
				let reportSuccess = transactions[transaction];
				if (reportSuccess !== null && reportSuccess !== undefined) {
					reportSuccess(json);
				}
				delete transactions[transaction];
			}
			return;
		} else if (json['webrtcgw'] === 'trickle') {
			var sender = json['sender'];
			if (sender === undefined || sender === null) {
				Webrtcgw.warn('Missing sender...');
				return;
			}
			var pluginHandle = pluginHandles[sender];
			if (pluginHandle === undefined || pluginHandle === null) {
				return;
			}
			var candidate = json['candidate'];
			var config = pluginHandle.webrtcStuff;
			if (config.pc && config.remoteSdp) {
				// Add candidate right now
				if (!candidate || candidate.completed === true) {
					// end-of-candidates
					config.pc.addIceCandidate(Webrtcgw.endOfCandidates);
				} else {
					// New candidate
					config.pc.addIceCandidate(candidate);
				}
			} else {
				// We didn't do setRemoteDescription (trickle got here before the offer?)
				if (!config.candidates) { config.candidates = []; }
				config.candidates.push(candidate);
			}
		} else if (json['webrtcgw'] === 'webrtcup') {
			// The PeerConnection with the server is up! Notify this
			let sender = json['sender'];
			if (sender === undefined || sender === null) {
				Webrtcgw.warn('Missing sender...');
				return;
			}
			let pluginHandle = pluginHandles[sender];
			if (pluginHandle === undefined || pluginHandle === null) {
				return;
			}
			pluginHandle.webrtcState(true);
			return;
		} else if (json['webrtcgw'] === 'hangup') {
			// A plugin asked the core to hangup a PeerConnection on one of our handles
			let sender = json['sender'];
			if (sender === undefined || sender === null) {
				Webrtcgw.warn('Missing sender...');
				return;
			}
			let pluginHandle = pluginHandles[sender];
			if (pluginHandle === undefined || pluginHandle === null) {
				return;
			}
			pluginHandle.webrtcState(false, json['reason']);
			pluginHandle.hangup();
		} else if (json['webrtcgw'] === 'detached') {
			// A plugin asked the core to detach one of our handles
			let sender = json['sender'];
			if (sender === undefined || sender === null) {
				Webrtcgw.warn('Missing sender...');
				return;
			}
			let pluginHandle = pluginHandles[sender];
			if (pluginHandle === undefined || pluginHandle === null) {
				// Don't warn here because destroyHandle causes this situation.
				return;
			}
			pluginHandle.detached = true;
			pluginHandle.ondetached();
			pluginHandle.detach();
		} else if (json['webrtcgw'] === 'media') {
			// Media started/stopped flowing
			let sender = json['sender'];
			if (sender === undefined || sender === null) {
				Webrtcgw.warn('Missing sender...');
				return;
			}
			let pluginHandle = pluginHandles[sender];
			if (pluginHandle === undefined || pluginHandle === null) {
				return;
			}
			pluginHandle.mediaState(json['type'], json['receiving']);
		} else if (json['webrtcgw'] === 'slowlink') {
			// Trouble uplink or downlink
			let sender = json['sender'];
			if (sender === undefined || sender === null) {
				Webrtcgw.warn('Missing sender...');
				return;
			}
			let pluginHandle = pluginHandles[sender];
			if (pluginHandle === undefined || pluginHandle === null) {
				return;
			}
			pluginHandle.slowLink(json['uplink'], json['lost'], json['media']);
		} else if (json['webrtcgw'] === 'error') {
			// Oops, something wrong happened
			Webrtcgw.error('Ooops: ' + json['error'].code + ' ' + json['error'].reason);	// FIXME
			let transaction = json['transaction'];
			if (transaction !== null && transaction !== undefined) {
				let reportSuccess = transactions[transaction];
				if (reportSuccess !== null && reportSuccess !== undefined) {
					reportSuccess(json);
				}
				delete transactions[transaction];
			}
			return;
		} else if (json['webrtcgw'] === 'event') {
			let sender = json['sender'];
			if (sender === undefined || sender === null) {
				Webrtcgw.warn('Missing sender...');
				return;
			}
			let plugindata = json['plugindata'];
			if (plugindata === undefined || plugindata === null) {
				Webrtcgw.warn('Missing plugindata...');
				return;
			}
			let data = plugindata['data'];
			let pluginHandle = pluginHandles[sender];
			if (pluginHandle === undefined || pluginHandle === null) {
				Webrtcgw.warn('This handle is not attached to this session');
				return;
			}
			let jsep = json['jsep'];
			let callback = pluginHandle.onmessage;
			if (callback !== null && callback !== undefined) {
				// Send to callback specified when attaching plugin handle
				callback(data, jsep);
			} else {
				// Send to generic callback (?)
			}
		} else if (json['webrtcgw'] === 'timeout') {
			Webrtcgw.error('Timeout on session ' + sessionId);
			if (websockets) {
				ws.close(3504, 'Gateway timeout');
			}
			return;
		} else {
			Webrtcgw.warn("Unknown message/event  '" + json['webrtcgw'] + "' on session " + sessionId);
		}
	}

	// Private helper to send keep-alive messages on WebSockets
	function keepAlive() {
		if (server === null || !websockets || !connected) { return; }
		wsKeepaliveTimeoutId = setTimeout(keepAlive, keepAlivePeriod);
		let request = { 'webrtcgw': 'keepalive', 'session_id': sessionId, 'transaction': Webrtcgw.randomString(12) };
		if (token !== null && token !== undefined) { request['token'] = token; }
		if (apisecret !== null && apisecret !== undefined) { request['apisecret'] = apisecret; }
		ws.send(JSON.stringify(request));
	}

	// Private method to create a session
	function createSession(callbacks) {
		var transaction = Webrtcgw.randomString(12);
		var request = { 'webrtcgw': 'create', 'transaction': transaction };
		if (callbacks['reconnect']) {
			// We're reconnecting, claim the session
			connected = false;
			request['webrtcgw'] = 'claim';
			request['session_id'] = sessionId;
			// If we were using websockets, ignore the old connection
			if (ws) {
				ws.onopen = null;
				ws.onerror = null;
				ws.onclose = null;
				if (wsKeepaliveTimeoutId) {
					clearTimeout(wsKeepaliveTimeoutId);
					wsKeepaliveTimeoutId = null;
				}
			}
		}
		if (token !== null && token !== undefined) { request['token'] = token; }
		if (apisecret !== null && apisecret !== undefined) { request['apisecret'] = apisecret; }
		if (server === null && Webrtcgw.isArray(servers)) {
			// We still need to find a working server from the list we were given
			server = servers[serversIndex];
			if (server.indexOf('ws') === 0) {
				websockets = true;
				Webrtcgw.log('Server #' + (serversIndex + 1) + ': trying WebSockets to contact Webrtcgw (' + server + ')');
			} else {
				websockets = false;
				Webrtcgw.log('Server #' + (serversIndex + 1) + ': trying REST API to contact Webrtcgw (' + server + ')');
			}
		}
		if (websockets) {
			ws = Webrtcgw.newWebSocket(server, 'webrtcgw-protocol');
			wsHandlers = {
				'error': function () {
					Webrtcgw.error('Error connecting to the Webrtcgw WebSockets server... ' + server);
					if (Webrtcgw.isArray(servers) && !callbacks['reconnect']) {
						serversIndex++;
						if (serversIndex === servers.length) {
							// We tried all the servers the user gave us and they all failed
							callbacks.error('Error connecting to any of the provided Webrtcgw servers: Is the server down?');
							return;
						}
						// Let's try the next server
						server = null;
						setTimeout(function () {
							createSession(callbacks);
						}, 200);
						return;
					}
					callbacks.error('Error connecting to the Webrtcgw WebSockets server: Is the server down?');
				},

				'open': function () {
					// We need to be notified about the success
					transactions[transaction] = function (json) {
						if (json['webrtcgw'] !== 'success') {
							Webrtcgw.error('Ooops: ' + json['error'].code + ' ' + json['error'].reason);	// FIXME
							callbacks.error(json['error'].reason);
							return;
						}
						wsKeepaliveTimeoutId = setTimeout(keepAlive, keepAlivePeriod);
						connected = true;
						sessionId = json['session_id'] ? json['session_id'] : json.data['id'];
						if (callbacks['reconnect']) {
							Webrtcgw.log('Claimed session: ' + sessionId);
						} else {
							Webrtcgw.log('Created session: ' + sessionId);
						}
						Webrtcgw.sessions[sessionId] = that;
						callbacks.success();
					};
					ws.send(JSON.stringify(request));
				},

				'message': function (event) {
					handleEvent(JSON.parse(event.data));
				},

				'close': function () {
					if (server === null || !connected) {
						return;
					}
					connected = false;
					// FIXME What if this is called when the page is closed?
					gatewayCallbacks.error('Lost connection to the server (is it down?)');
				}
			};

			for (var eventName in wsHandlers) {
				ws.addEventListener(eventName, wsHandlers[eventName]);
			}

			return;
		}
		Webrtcgw.httpAPICall(server, {
			verb: 'POST',
			withCredentials: withCredentials,
			body: request,
			success: function (json) {
				if (json['webrtcgw'] !== 'success') {
					Webrtcgw.error('Ooops: ' + json['error'].code + ' ' + json['error'].reason);	// FIXME
					callbacks.error(json['error'].reason);
					return;
				}
				connected = true;
				sessionId = json['session_id'] ? json['session_id'] : json.data['id'];
				if (callbacks['reconnect']) {
					Webrtcgw.log('Claimed session: ' + sessionId);
				} else {
					// Webrtcgw.log('Created session: ' + sessionId);
				}
				Webrtcgw.sessions[sessionId] = that;
				eventHandler();
				callbacks.success();
			},
			error: function (textStatus, errorThrown) {
				Webrtcgw.error(textStatus + ':', errorThrown);	// FIXME
				if (Webrtcgw.isArray(servers) && !callbacks['reconnect']) {
					serversIndex++;
					if (serversIndex === servers.length) {
						// We tried all the servers the user gave us and they all failed
						callbacks.error('Error connecting to any of the provided Webrtcgw servers: Is the server down?');
						return;
					}
					// Let's try the next server
					server = null;
					setTimeout(function () { createSession(callbacks); }, 200);
					return;
				}
				if (errorThrown === '') { callbacks.error(textStatus + ': Is the server down?'); } else { callbacks.error(textStatus + ': ' + errorThrown); }
			}
		});
	}

	// Private method to destroy a session
	function destroySession(callbacks) {
		callbacks = callbacks || {};
		// FIXME This method triggers a success even when we fail
		callbacks.success = (typeof callbacks.success === 'function') ? callbacks.success : Webrtcgw.noop;
		var asyncRequest = true;
		if (callbacks.asyncRequest !== undefined && callbacks.asyncRequest !== null) { asyncRequest = (callbacks.asyncRequest === true); }
		var notifyDestroyed = true;
		if (callbacks.notifyDestroyed !== undefined && callbacks.notifyDestroyed !== null) { notifyDestroyed = (callbacks.notifyDestroyed === true); }
		var cleanupHandles = false;
		if (callbacks.cleanupHandles !== undefined && callbacks.cleanupHandles !== null) { cleanupHandles = (callbacks.cleanupHandles === true); }
		Webrtcgw.log('Destroying session ' + sessionId + ' (async=' + asyncRequest + ')');
		if (!connected) {
			Webrtcgw.warn('Is the server down? (connected=false)');
			callbacks.success();
			return;
		}
		if (sessionId === undefined || sessionId === null) {
			Webrtcgw.warn('No session to destroy');
			callbacks.success();
			if (notifyDestroyed) { gatewayCallbacks.destroyed(); }
			return;
		}
		if (cleanupHandles) {
			for (var handleId in pluginHandles) { destroyHandle(handleId, { noRequest: true }); }
		}
		// No need to destroy all handles first, Webrtcgw will do that itself
		var request = { 'webrtcgw': 'destroy', 'transaction': Webrtcgw.randomString(12) };
		if (token !== null && token !== undefined) { request['token'] = token; }
		if (apisecret !== null && apisecret !== undefined) { request['apisecret'] = apisecret; }
		if (websockets) {
			request['session_id'] = sessionId;

			var unbindWebSocket = function () {
				for (var eventName in wsHandlers) {
					ws.removeEventListener(eventName, wsHandlers[eventName]);
				}
				ws.removeEventListener('message', onUnbindMessage);
				ws.removeEventListener('error', onUnbindError);
				if (wsKeepaliveTimeoutId) {
					clearTimeout(wsKeepaliveTimeoutId);
				}
				ws.close();
			};

			var onUnbindMessage = function (event) {
				var data = JSON.parse(event.data);
				if (data.session_id === request.session_id && data.transaction === request.transaction) {
					unbindWebSocket();
					callbacks.success();
					if (notifyDestroyed) { gatewayCallbacks.destroyed(); }
				}
			};
			var onUnbindError = function (event) {
				unbindWebSocket();
				callbacks.error('Failed to destroy the server: Is the server down?');
				if (notifyDestroyed) { gatewayCallbacks.destroyed(); }
			};

			ws.addEventListener('message', onUnbindMessage);
			ws.addEventListener('error', onUnbindError);

			ws.send(JSON.stringify(request));
			return;
		}
		Webrtcgw.httpAPICall(server + '/' + sessionId, {
			verb: 'POST',
			async: asyncRequest,	// Sometimes we need false here, or destroying in onbeforeunload won't work
			withCredentials: withCredentials,
			body: request,
			success: function (json) {
				Webrtcgw.log('Destroyed session:');
				sessionId = null;
				connected = false;
				if (json['webrtcgw'] !== 'success') {
					Webrtcgw.error('Ooops: ' + json['error'].code + ' ' + json['error'].reason);	// FIXME
				}
				callbacks.success();
				if (notifyDestroyed) { gatewayCallbacks.destroyed(); }
			},
			error: function (textStatus, errorThrown) {
				Webrtcgw.error(textStatus + ':', errorThrown);	// FIXME
				// Reset everything anyway
				sessionId = null;
				connected = false;
				callbacks.success();
				if (notifyDestroyed) { gatewayCallbacks.destroyed(); }
			}
		});
	}

	// Private method to create a plugin handle
	function createHandle(callbacks) {
		callbacks = callbacks || {};
		callbacks.success = (typeof callbacks.success === 'function') ? callbacks.success : Webrtcgw.noop;
		callbacks.error = (typeof callbacks.error === 'function') ? callbacks.error : Webrtcgw.noop;
		callbacks.consentDialog = (typeof callbacks.consentDialog === 'function') ? callbacks.consentDialog : Webrtcgw.noop;
		callbacks.iceState = (typeof callbacks.iceState === 'function') ? callbacks.iceState : Webrtcgw.noop;
		callbacks.mediaState = (typeof callbacks.mediaState === 'function') ? callbacks.mediaState : Webrtcgw.noop;
		callbacks.webrtcState = (typeof callbacks.webrtcState === 'function') ? callbacks.webrtcState : Webrtcgw.noop;
		callbacks.slowLink = (typeof callbacks.slowLink === 'function') ? callbacks.slowLink : Webrtcgw.noop;
		callbacks.onmessage = (typeof callbacks.onmessage === 'function') ? callbacks.onmessage : Webrtcgw.noop;
		callbacks.onlocalstream = (typeof callbacks.onlocalstream === 'function') ? callbacks.onlocalstream : Webrtcgw.noop;
		callbacks.onremotestream = (typeof callbacks.onremotestream === 'function') ? callbacks.onremotestream : Webrtcgw.noop;
		callbacks.ondata = (typeof callbacks.ondata === 'function') ? callbacks.ondata : Webrtcgw.noop;
		callbacks.ondataopen = (typeof callbacks.ondataopen === 'function') ? callbacks.ondataopen : Webrtcgw.noop;
		callbacks.oncleanup = (typeof callbacks.oncleanup === 'function') ? callbacks.oncleanup : Webrtcgw.noop;
		callbacks.ondetached = (typeof callbacks.ondetached === 'function') ? callbacks.ondetached : Webrtcgw.noop;
		if (!connected) {
			Webrtcgw.warn('Is the server down? (connected=false)');
			callbacks.error('Is the server down? (connected=false)');
			return;
		}
		var plugin = callbacks.plugin;
		if (plugin === undefined || plugin === null) {
			Webrtcgw.error('Invalid plugin');
			callbacks.error('Invalid plugin');
			return;
		}
		var opaqueId = callbacks.opaqueId;
		var handleToken = callbacks.token ? callbacks.token : token;
		var transaction = Webrtcgw.randomString(12);
		var request = { 'webrtcgw': 'attach', 'plugin': plugin, 'opaque_id': opaqueId, 'transaction': transaction };
		if (handleToken !== null && handleToken !== undefined) { request['token'] = handleToken; }
		if (apisecret !== null && apisecret !== undefined) { request['apisecret'] = apisecret; }
		if (websockets) {
			transactions[transaction] = function (json) {
				if (json['webrtcgw'] !== 'success') {
					Webrtcgw.error('Ooops: ' + json['error'].code + ' ' + json['error'].reason);	// FIXME
					callbacks.error('Ooops: ' + json['error'].code + ' ' + json['error'].reason);
					return;
				}
				var handleId = json.data['id'];
				Webrtcgw.log('Created handle: ' + handleId);
				var pluginHandle =
				{
					session: that,
					plugin: plugin,
					id: handleId,
					token: handleToken,
					detached: false,
					webrtcStuff: {
						started: false,
						myStream: null,
						streamExternal: false,
						remoteStream: null,
						mySdp: null,
						mediaConstraints: null,
						pc: null,
						dataChannel: {},
						dtmfSender: null,
						trickle: true,
						iceDone: false,
						volume: {
							value: null,
							timer: null
						},
						netState: {
							audioSend: {},
							audioRecv: {},
							videoSend: {},
							videoRecv: {}
						},
						bitrate: {
							value: null,
							bsnow: null,
							bsbefore: null,
							tsnow: null,
							tsbefore: null,
							timer: null,
							fsnow: null,
							fsbefore: null,
							psrnow: null,
							psrbefore: null,
							pslnow: null,
							pslbefore: null,
							bsnowSend: null,
							bsbeforeSend: null,
							fsnowSend: null,
							fsbeforeSend: null,
							tsnowSend: null,
							tsbeforeSend: null,
							audiobsnow: null,
							audiobsbefore: null,
							audiotsnow: null,
							audiotsbefore: null,
							audiopsrnow: null,
							audiopsrbefore: null,
							audiopslnow: null,
							audiopslbefore: null,
							audiobsnowSend: null,
							audiobsbeforeSend: null,
							audiotsnowSend: null,
							audiotsbeforeSend: null
						}
					},
					getId: function () { return handleId; },
					getPlugin: function () { return plugin; },
					getVolume: function () { return getVolume(handleId, true); },
					getRemoteVolume: function () { return getVolume(handleId, true); },
					getLocalVolume: function () { return getVolume(handleId, false); },
					isAudioMuted: function () { return isMuted(handleId, false); },
					muteAudio: function () { return mute(handleId, false, true); },
					unmuteAudio: function () { return mute(handleId, false, false); },
					isVideoMuted: function () { return isMuted(handleId, true); },
					muteVideo: function () { return mute(handleId, true, true); },
					unmuteVideo: function () { return mute(handleId, true, false); },
					getBitrate: function () { return getBitrate(handleId); },
					send: function (callbacks) { sendMessage(handleId, callbacks); },
					data: function (callbacks) { sendData(handleId, callbacks); },
					dtmf: function (callbacks) { sendDtmf(handleId, callbacks); },
					consentDialog: callbacks.consentDialog,
					iceState: callbacks.iceState,
					mediaState: callbacks.mediaState,
					webrtcState: callbacks.webrtcState,
					slowLink: callbacks.slowLink,
					onmessage: callbacks.onmessage,
					createOffer: function (callbacks) { prepareWebrtc(handleId, true, callbacks); },
					createAnswer: function (callbacks) { prepareWebrtc(handleId, false, callbacks); },
					handleRemoteJsep: function (callbacks) { prepareWebrtcPeer(handleId, callbacks); },
					onlocalstream: callbacks.onlocalstream,
					onremotestream: callbacks.onremotestream,
					ondata: callbacks.ondata,
					ondataopen: callbacks.ondataopen,
					oncleanup: callbacks.oncleanup,
					ondetached: callbacks.ondetached,
					hangup: function (sendRequest) { cleanupWebrtc(handleId, sendRequest === true); },
					detach: function (callbacks) { destroyHandle(handleId, callbacks); }
				};
				pluginHandles[handleId] = pluginHandle;
				callbacks.success(pluginHandle);
			};
			request['session_id'] = sessionId;
			ws.send(JSON.stringify(request));
			return;
		}
		Webrtcgw.httpAPICall(server + '/' + sessionId, {
			verb: 'POST',
			withCredentials: withCredentials,
			body: request,
			success: function (json) {
				if (json['webrtcgw'] !== 'success') {
					Webrtcgw.error('Ooops: ' + json['error'].code + ' ' + json['error'].reason);	// FIXME
					callbacks.error('Ooops: ' + json['error'].code + ' ' + json['error'].reason);
					return;
				}
				var handleId = json.data['id'];
				// Webrtcgw.log('Created handle: ' + handleId);
				var pluginHandle =
				{
					session: that,
					plugin: plugin,
					id: handleId,
					token: handleToken,
					detached: false,
					webrtcStuff: {
						started: false,
						myStream: null,
						streamExternal: false,
						remoteStream: null,
						mySdp: null,
						mediaConstraints: null,
						pc: null,
						dataChannel: {},
						dtmfSender: null,
						trickle: true,
						iceDone: false,
						volume: {
							value: null,
							timer: null
						},
						netState: {
							audioSend: {},
							audioRecv: {},
							videoSend: {},
							videoRecv: {}
						},
						bitrate: {
							value: null,
							bsnow: null,
							bsbefore: null,
							tsnow: null,
							tsbefore: null,
							timer: null,
							fsnow: null,
							fsbefore: null,
							psrnow: null,
							psrbefore: null,
							pslnow: null,
							pslbefore: null,
							bsnowSend: null,
							bsbeforeSend: null,
							fsnowSend: null,
							fsbeforeSend: null,
							tsnowSend: null,
							tsbeforeSend: null,
							audiobsnow: null,
							audiobsbefore: null,
							audiotsnow: null,
							audiotsbefore: null,
							audiopsrnow: null,
							audiopsrbefore: null,
							audiopslnow: null,
							audiopslbefore: null,
							audiobsnowSend: null,
							audiobsbeforeSend: null,
							audiotsnowSend: null,
							audiotsbeforeSend: null
						}
					},
					getId: function () { return handleId; },
					getPlugin: function () { return plugin; },
					getVolume: function () { return getVolume(handleId, true); },
					getRemoteVolume: function () { return getVolume(handleId, true); },
					getLocalVolume: function () { return getVolume(handleId, false); },
					isAudioMuted: function () { return isMuted(handleId, false); },
					muteAudio: function () { return mute(handleId, false, true); },
					unmuteAudio: function () { return mute(handleId, false, false); },
					isVideoMuted: function () { return isMuted(handleId, true); },
					muteVideo: function () { return mute(handleId, true, true); },
					unmuteVideo: function () { return mute(handleId, true, false); },
					getBitrate: function () { return getBitrate(handleId); },
					send: function (callbacks) { sendMessage(handleId, callbacks); },
					data: function (callbacks) { sendData(handleId, callbacks); },
					dtmf: function (callbacks) { sendDtmf(handleId, callbacks); },
					consentDialog: callbacks.consentDialog,
					iceState: callbacks.iceState,
					mediaState: callbacks.mediaState,
					webrtcState: callbacks.webrtcState,
					slowLink: callbacks.slowLink,
					onmessage: callbacks.onmessage,
					createOffer: function (callbacks) { prepareWebrtc(handleId, true, callbacks); },
					createAnswer: function (callbacks) { prepareWebrtc(handleId, false, callbacks); },
					handleRemoteJsep: function (callbacks) { prepareWebrtcPeer(handleId, callbacks); },
					onlocalstream: callbacks.onlocalstream,
					onremotestream: callbacks.onremotestream,
					ondata: callbacks.ondata,
					ondataopen: callbacks.ondataopen,
					oncleanup: callbacks.oncleanup,
					ondetached: callbacks.ondetached,
					hangup: function (sendRequest) { cleanupWebrtc(handleId, sendRequest === true); },
					detach: function (callbacks) { destroyHandle(handleId, callbacks); }
				};
				pluginHandles[handleId] = pluginHandle;
				callbacks.success(pluginHandle);
			},
			error: function (textStatus, errorThrown) {
				Webrtcgw.error(textStatus + ':', errorThrown);	// FIXME
			}
		});
	}

	// Private method to send a message
	function sendMessage(handleId, callbacks) {
		callbacks = callbacks || {};
		callbacks.success = (typeof callbacks.success === 'function') ? callbacks.success : Webrtcgw.noop;
		callbacks.error = (typeof callbacks.error === 'function') ? callbacks.error : Webrtcgw.noop;
		if (!connected) {
			Webrtcgw.warn('Is the server down? (connected=false)');
			callbacks.error('Is the server down? (connected=false)');
			return;
		}
		var pluginHandle = pluginHandles[handleId];
		if (pluginHandle === null || pluginHandle === undefined ||
			pluginHandle.webrtcStuff === null || pluginHandle.webrtcStuff === undefined) {
			Webrtcgw.warn('Invalid handle');
			callbacks.error('Invalid handle');
			return;
		}
		var message = callbacks.message;
		var jsep = callbacks.jsep;
		var transaction = Webrtcgw.randomString(12);
		var request = { 'webrtcgw': 'message', 'body': message, 'transaction': transaction };
		if (pluginHandle.token !== null && pluginHandle.token !== undefined) { request['token'] = pluginHandle.token; }
		if (apisecret !== null && apisecret !== undefined) { request['apisecret'] = apisecret; }
		if (jsep !== null && jsep !== undefined) { request.jsep = jsep; }
		if (websockets) {
			request['session_id'] = sessionId;
			request['handle_id'] = handleId;
			transactions[transaction] = function (json) {
				if (json['webrtcgw'] === 'success') {
					// We got a success, must have been a synchronous transaction
					var plugindata = json['plugindata'];
					if (plugindata === undefined || plugindata === null) {
						Webrtcgw.warn('Request succeeded, but missing plugindata...');
						callbacks.success();
						return;
					}
					Webrtcgw.log('Synchronous transaction successful (' + plugindata['plugin'] + ')');
					var data = plugindata['data'];
					callbacks.success(data);
					return;
				} else if (json['webrtcgw'] !== 'ack') {
					// Not a success and not an ack, must be an error
					if (json['error'] !== undefined && json['error'] !== null) {
						Webrtcgw.error('Ooops: ' + json['error'].code + ' ' + json['error'].reason);	// FIXME
						callbacks.error(json['error'].code + ' ' + json['error'].reason);
					} else {
						Webrtcgw.error('Unknown error');	// FIXME
						callbacks.error('Unknown error');
					}
					return;
				}
				// If we got here, the plugin decided to handle the request asynchronously
				callbacks.success();
			};
			ws.send(JSON.stringify(request));
			return;
		}
		Webrtcgw.httpAPICall(server + '/' + sessionId + '/' + handleId, {
			verb: 'POST',
			withCredentials: withCredentials,
			body: request,
			success: function (json) {
				if (json['webrtcgw'] === 'success') {
					// We got a success, must have been a synchronous transaction
					var plugindata = json['plugindata'];
					if (plugindata === undefined || plugindata === null) {
						Webrtcgw.warn('Request succeeded, but missing plugindata...');
						callbacks.success();
						return;
					}
					Webrtcgw.log('Synchronous transaction successful (' + plugindata['plugin'] + ')');
					var data = plugindata['data'];
					callbacks.success(data);
					return;
				} else if (json['webrtcgw'] !== 'ack') {
					// Not a success and not an ack, must be an error
					if (json['error'] !== undefined && json['error'] !== null) {
						Webrtcgw.error('Ooops: ' + json['error'].code + ' ' + json['error'].reason);	// FIXME
						callbacks.error(json['error'].code + ' ' + json['error'].reason);
					} else {
						Webrtcgw.error('Unknown error');	// FIXME
						callbacks.error('Unknown error');
					}
					return;
				}
				// If we got here, the plugin decided to handle the request asynchronously
				callbacks.success();
			},
			error: function (textStatus, errorThrown) {
				Webrtcgw.error(textStatus + ':', errorThrown);	// FIXME
				callbacks.error(textStatus + ': ' + errorThrown);
			}
		});
	}

	// Private method to send a trickle candidate
	function sendTrickleCandidate(handleId, candidate) {
		if (!connected) {
			Webrtcgw.warn('Is the server down? (connected=false)');
			return;
		}
		var pluginHandle = pluginHandles[handleId];
		if (pluginHandle === null || pluginHandle === undefined ||
			pluginHandle.webrtcStuff === null || pluginHandle.webrtcStuff === undefined) {
			Webrtcgw.warn('Invalid handle');
			return;
		}
		var request = { 'webrtcgw': 'trickle', 'candidate': candidate, 'transaction': Webrtcgw.randomString(12) };
		if (pluginHandle.token !== null && pluginHandle.token !== undefined) { request['token'] = pluginHandle.token; }
		if (apisecret !== null && apisecret !== undefined) { request['apisecret'] = apisecret; }
		Webrtcgw.vdebug('Sending trickle candidate (handle=' + handleId + '):');
		Webrtcgw.vdebug(request);
		if (websockets) {
			request['session_id'] = sessionId;
			request['handle_id'] = handleId;
			ws.send(JSON.stringify(request));
			return;
		}
		Webrtcgw.httpAPICall(server + '/' + sessionId + '/' + handleId, {
			verb: 'POST',
			withCredentials: withCredentials,
			body: request,
			success: function (json) {
				Webrtcgw.vdebug('Candidate sent!');
				Webrtcgw.vdebug(json);
				if (json['webrtcgw'] !== 'ack') {
					Webrtcgw.error('Ooops: ' + json['error'].code + ' ' + json['error'].reason);	// FIXME
					return;
				}
			},
			error: function (textStatus, errorThrown) {
				Webrtcgw.error(textStatus + ':', errorThrown);	// FIXME
			}
		});
	}

	// Private method to create a data channel
	function createDataChannel(handleId, dclabel, incoming, pendingText) {
		var pluginHandle = pluginHandles[handleId];
		if (pluginHandle === null || pluginHandle === undefined ||
			pluginHandle.webrtcStuff === null || pluginHandle.webrtcStuff === undefined) {
			Webrtcgw.warn('Invalid handle');
			return;
		}
		var config = pluginHandle.webrtcStuff;
		var onDataChannelMessage = function (event) {
			Webrtcgw.log('Received message on data channel:', event);
			var label = event.target.label;
			pluginHandle.ondata(event.data, label);
		};
		var onDataChannelStateChange = function (event) {
			Webrtcgw.log('Received state change on data channel:', event);
			var label = event.target.label;
			var dcState = config.dataChannel[label] ? config.dataChannel[label].readyState : 'null';
			Webrtcgw.log('State change on <' + label + '> data channel: ' + dcState);
			if (dcState === 'open') {
				// Any pending messages to send?
				if (config.dataChannel[label].pending && config.dataChannel[label].pending.length > 0) {
					Webrtcgw.log('Sending pending messages on <' + label + '>:', config.dataChannel[label].pending.length);
					for (var i in config.dataChannel[label].pending) {
						var text = config.dataChannel[label].pending[i];
						Webrtcgw.log('Sending string on data channel <' + label + '>: ' + text);
						config.dataChannel[label].send(text);
					}
					config.dataChannel[label].pending = [];
				}
				// Notify the open data channel
				pluginHandle.ondataopen(label);
			}
		};
		var onDataChannelError = function (error) {
			Webrtcgw.error('Got error on data channel:', error);
			// TODO
		};
		if (!incoming) {
			// FIXME Add options (ordered, maxRetransmits, etc.)
			config.dataChannel[dclabel] = config.pc.createDataChannel(dclabel, { ordered: false });
		} else {
			config.dataChannel[dclabel] = incoming;
		}
		config.dataChannel[dclabel].onmessage = onDataChannelMessage;
		config.dataChannel[dclabel].onopen = onDataChannelStateChange;
		config.dataChannel[dclabel].onclose = onDataChannelStateChange;
		config.dataChannel[dclabel].onerror = onDataChannelError;
		config.dataChannel[dclabel].pending = [];
		if (pendingText) { config.dataChannel[dclabel].pending.push(pendingText); }
	}

	// Private method to send a data channel message
	function sendData(handleId, callbacks) {
		callbacks = callbacks || {};
		callbacks.success = (typeof callbacks.success === 'function') ? callbacks.success : Webrtcgw.noop;
		callbacks.error = (typeof callbacks.error === 'function') ? callbacks.error : Webrtcgw.noop;
		var pluginHandle = pluginHandles[handleId];
		if (pluginHandle === null || pluginHandle === undefined ||
			pluginHandle.webrtcStuff === null || pluginHandle.webrtcStuff === undefined) {
			Webrtcgw.warn('Invalid handle');
			callbacks.error('Invalid handle');
			return;
		}
		var config = pluginHandle.webrtcStuff;
		var text = callbacks.text;
		if (text === null || text === undefined) {
			Webrtcgw.warn('Invalid text');
			callbacks.error('Invalid text');
			return;
		}
		var label = callbacks.label ? callbacks.label : Webrtcgw.dataChanDefaultLabel;
		if (!config.dataChannel[label]) {
			// Create new data channel and wait for it to open
			createDataChannel(handleId, label, false, text);
			callbacks.success();
			return;
		}
		if (config.dataChannel[label].readyState !== 'open') {
			config.dataChannel[label].pending.push(text);
			callbacks.success();
			return;
		}
		Webrtcgw.log('Sending string on data channel <' + label + '>: ' + text);
		config.dataChannel[label].send(text);
		callbacks.success();
	}

	// Private method to send a DTMF tone
	function sendDtmf(handleId, callbacks) {
		callbacks = callbacks || {};
		callbacks.success = (typeof callbacks.success === 'function') ? callbacks.success : Webrtcgw.noop;
		callbacks.error = (typeof callbacks.error === 'function') ? callbacks.error : Webrtcgw.noop;
		var pluginHandle = pluginHandles[handleId];
		if (pluginHandle === null || pluginHandle === undefined ||
			pluginHandle.webrtcStuff === null || pluginHandle.webrtcStuff === undefined) {
			Webrtcgw.warn('Invalid handle');
			callbacks.error('Invalid handle');
			return;
		}
		var config = pluginHandle.webrtcStuff;
		if (config.dtmfSender === null || config.dtmfSender === undefined) {
			// Create the DTMF sender the proper way, if possible
			if (config.pc !== undefined && config.pc !== null) {
				var senders = config.pc.getSenders();
				var audioSender = senders.find(function (sender) {
					return sender.track && sender.track.kind === 'audio';
				});
				if (!audioSender) {
					Webrtcgw.warn('Invalid DTMF configuration (no audio track)');
					callbacks.error('Invalid DTMF configuration (no audio track)');
					return;
				}
				config.dtmfSender = audioSender.dtmf;
				if (config.dtmfSender) {
					Webrtcgw.log('Created DTMF Sender');
					config.dtmfSender.ontonechange = function (tone) { Webrtcgw.debug('Sent DTMF tone: ' + tone.tone); };
				}
			}
			if (config.dtmfSender === null || config.dtmfSender === undefined) {
				Webrtcgw.warn('Invalid DTMF configuration');
				callbacks.error('Invalid DTMF configuration');
				return;
			}
		}
		var dtmf = callbacks.dtmf;
		if (dtmf === null || dtmf === undefined) {
			Webrtcgw.warn('Invalid DTMF parameters');
			callbacks.error('Invalid DTMF parameters');
			return;
		}
		var tones = dtmf.tones;
		if (tones === null || tones === undefined) {
			Webrtcgw.warn('Invalid DTMF string');
			callbacks.error('Invalid DTMF string');
			return;
		}
		var duration = dtmf.duration;
		if (duration === null || duration === undefined) { duration = 500; }	// We choose 500ms as the default duration for a tone
		var gap = dtmf.gap;
		if (gap === null || gap === undefined) { gap = 50; }	// We choose 50ms as the default gap between tones
		config.dtmfSender.insertDTMF(tones, duration, gap);
		callbacks.success();
	}

	// Private method to destroy a plugin handle
	function destroyHandle(handleId, callbacks) {
		callbacks = callbacks || {};
		callbacks.success = (typeof callbacks.success === 'function') ? callbacks.success : Webrtcgw.noop;
		callbacks.error = (typeof callbacks.error === 'function') ? callbacks.error : Webrtcgw.noop;
		var asyncRequest = true;
		if (callbacks.asyncRequest !== undefined && callbacks.asyncRequest !== null) { asyncRequest = (callbacks.asyncRequest === true); }
		var noRequest = true;
		if (callbacks.noRequest !== undefined && callbacks.noRequest !== null) { noRequest = (callbacks.noRequest === true); }
		Webrtcgw.log('Destroying handle ' + handleId + ' (async=' + asyncRequest + ')');
		cleanupWebrtc(handleId);
		var pluginHandle = pluginHandles[handleId];
		if (pluginHandle === null || pluginHandle === undefined || pluginHandle.detached) {
			// Plugin was already detached by Webrtcgw, calling detach again will return a handle not found error, so just exit here
			delete pluginHandles[handleId];
			callbacks.success();
			return;
		}
		if (noRequest) {
			// We're only removing the handle locally
			delete pluginHandles[handleId];
			callbacks.success();
			return;
		}
		if (!connected) {
			Webrtcgw.warn('Is the server down? (connected=false)');
			callbacks.error('Is the server down? (connected=false)');
			return;
		}
		var request = { 'webrtcgw': 'detach', 'transaction': Webrtcgw.randomString(12) };
		if (pluginHandle.token !== null && pluginHandle.token !== undefined) { request['token'] = pluginHandle.token; }
		if (apisecret !== null && apisecret !== undefined) { request['apisecret'] = apisecret; }
		if (websockets) {
			request['session_id'] = sessionId;
			request['handle_id'] = handleId;
			ws.send(JSON.stringify(request));
			delete pluginHandles[handleId];
			callbacks.success();
			return;
		}
		Webrtcgw.httpAPICall(server + '/' + sessionId + '/' + handleId, {
			verb: 'POST',
			async: asyncRequest,	// Sometimes we need false here, or destroying in onbeforeunload won't work
			withCredentials: withCredentials,
			body: request,
			success: function (json) {
				Webrtcgw.log('Destroyed handle:');
				if (json['webrtcgw'] !== 'success') {
					Webrtcgw.error('Ooops: ' + json['error'].code + ' ' + json['error'].reason);	// FIXME
				}
				delete pluginHandles[handleId];
				callbacks.success();
			},
			error: function (textStatus, errorThrown) {
				Webrtcgw.error(textStatus + ':', errorThrown);	// FIXME
				// We cleanup anyway
				delete pluginHandles[handleId];
				callbacks.success();
			}
		});
	}

	// WebRTC stuff
	function streamsDone(handleId, jsep, media, callbacks, stream) {
		var pluginHandle = pluginHandles[handleId];
		if (pluginHandle === null || pluginHandle === undefined ||
			pluginHandle.webrtcStuff === null || pluginHandle.webrtcStuff === undefined) {
			Webrtcgw.warn('Invalid handle');
			callbacks.error('Invalid handle');
			return;
		}
		var config = pluginHandle.webrtcStuff;
		if (stream) {
			// console.log(stream);
		}
		// We're now capturing the new stream: check if we're updating or if it's a new thing
		var addTracks = false;
		if (!config.myStream || !media.update || config.streamExternal) {
			config.myStream = stream;
			addTracks = true;
		} else {
			// We only need to update the existing stream
			if (((!media.update && isAudioSendEnabled(media)) || (media.update && (media.addAudio || media.replaceAudio))) &&
				stream.getAudioTracks() && stream.getAudioTracks().length) {
				config.myStream.addTrack(stream.getAudioTracks()[0]);
				if (Webrtcgw.unifiedPlan) {
					// Use Transceivers
					Webrtcgw.log((media.replaceAudio ? 'Replacing' : 'Adding') + ' audio track:', stream.getAudioTracks()[0]);
					var audioTransceiver = null;
					var transceivers = config.pc.getTransceivers();
					if (transceivers && transceivers.length > 0) {
						for (var i in transceivers) {
							var t = transceivers[i];
							if ((t.sender && t.sender.track && t.sender.track.kind === 'audio') ||
								(t.receiver && t.receiver.track && t.receiver.track.kind === 'audio')) {
								audioTransceiver = t;
								break;
							}
						}
					}
					if (audioTransceiver && audioTransceiver.sender) {
						audioTransceiver.sender.replaceTrack(stream.getAudioTracks()[0]);
					} else {
						config.pc.addTrack(stream.getAudioTracks()[0], stream);
					}
				} else {
					Webrtcgw.log((media.replaceAudio ? 'Replacing' : 'Adding') + ' audio track:', stream.getAudioTracks()[0]);
					config.pc.addTrack(stream.getAudioTracks()[0], stream);
				}
			}
			if (((!media.update && isVideoSendEnabled(media)) || (media.update && (media.addVideo || media.replaceVideo))) &&
				stream.getVideoTracks() && stream.getVideoTracks().length) {
				config.myStream.addTrack(stream.getVideoTracks()[0]);
				if (Webrtcgw.unifiedPlan) {
					// Use Transceivers
					Webrtcgw.log((media.replaceVideo ? 'Replacing' : 'Adding') + ' video track:', stream.getVideoTracks()[0]);
					let videoTransceiver = null;
					let transceivers = config.pc.getTransceivers();
					if (transceivers && transceivers.length > 0) {
						for (let i in transceivers) {
							let t = transceivers[i];
							if ((t.sender && t.sender.track && t.sender.track.kind === 'video') ||
								(t.receiver && t.receiver.track && t.receiver.track.kind === 'video')) {
								videoTransceiver = t;
								break;
							}
						}
					}
					if (videoTransceiver && videoTransceiver.sender) {
						videoTransceiver.sender.replaceTrack(stream.getVideoTracks()[0]);
					} else {
						config.pc.addTrack(stream.getVideoTracks()[0], stream);
					}
				} else {
					Webrtcgw.log((media.replaceVideo ? 'Replacing' : 'Adding') + ' video track:', stream.getVideoTracks()[0]);
					config.pc.addTrack(stream.getVideoTracks()[0], stream);
				}
			}
		}
		// If we still need to create a PeerConnection, let's do that
		if (!config.pc) {
			var pc_config = { 'iceServers': iceServers, 'iceTransportPolicy': iceTransportPolicy, 'bundlePolicy': bundlePolicy };
			if (Webrtcgw.webRTCAdapter.browserDetails.browser === 'chrome') {
				// For Chrome versions before 72, we force a plan-b semantic, and unified-plan otherwise
				pc_config['sdpSemantics'] = (Webrtcgw.webRTCAdapter.browserDetails.version < 72) ? 'plan-b' : 'unified-plan';
			}
			var pc_constraints = {
				'optional': [{ 'DtlsSrtpKeyAgreement': true }]
			};
			if (ipv6Support === true) {
				pc_constraints.optional.push({ 'googIPv6': true });
			}
			// Any custom constraint to add?
			if (callbacks.rtcConstraints && typeof callbacks.rtcConstraints === 'object') {
				for (let i in callbacks.rtcConstraints) {
					pc_constraints.optional.push(callbacks.rtcConstraints[i]);
				}
			}
			if (Webrtcgw.webRTCAdapter.browserDetails.browser === 'edge') {
				// This is Edge, enable BUNDLE explicitly
				pc_config.bundlePolicy = 'max-bundle';
			}
			Webrtcgw.log('Creating PeerConnection');
			config.pc = new RTCPeerConnection(pc_config, pc_constraints);
			Webrtcgw.log(config.pc, pc_config, pc_constraints);
			if (config.pc.getStats) {	// FIXME
				config.volume = {};
				config.bitrate.value = '0 kbits/sec';
			}
			Webrtcgw.log('Preparing local SDP and gathering candidates (trickle=' + config.trickle + ')');
			config.pc.oniceconnectionstatechange = function (e) {
				if (config.pc) { pluginHandle.iceState(config.pc.iceConnectionState); }
			};
			config.pc.onicecandidate = function (event) {
				if (event.candidate == null ||
					(Webrtcgw.webRTCAdapter.browserDetails.browser === 'edge' && event.candidate.candidate.indexOf('endOfCandidates') > 0)) {
					Webrtcgw.log('End of candidates.');
					config.iceDone = true;
					if (config.trickle === true) {
						// Notify end of candidates
						sendTrickleCandidate(handleId, { 'completed': true });
					} else {
						// No trickle, time to send the complete SDP (including all candidates)
						sendSDP(handleId, callbacks);
					}
				} else {
					// JSON.stringify doesn't work on some WebRTC objects anymore
					// See https://code.google.com/p/chromium/issues/detail?id=467366
					var candidate = {
						'candidate': event.candidate.candidate,
						'sdpMid': event.candidate.sdpMid,
						'sdpMLineIndex': event.candidate.sdpMLineIndex
					};
					if (config.trickle === true) {
						// Send candidate
						sendTrickleCandidate(handleId, candidate);
					}
				}
			};
			config.pc.ontrack = function (event) {
				Webrtcgw.log('Handling Remote Track', event);
				if (!event.streams) { return; }
				config.remoteStream = event.streams[0];
				pluginHandle.onremotestream(config.remoteStream);
				// if (event.track.onended) { return; }
				// Webrtcgw.log('Adding onended callback to track:', event.track);
				// event.track.onended = function(ev) {
				// 	Webrtcgw.log('Remote track muted/removed:', ev);
				// 	if (config.remoteStream) {
				// 		config.remoteStream.removeTrack(ev.target);
				// 		pluginHandle.onremotestream(config.remoteStream);
				// 	}
				// };
				// event.track.onmute = event.track.onended;
				// event.track.onunmute = function(ev) {
				// 	Webrtcgw.log('Remote track flowing again:', ev);
				// 	try {
				// 		config.remoteStream.addTrack(ev.target);
				// 		pluginHandle.onremotestream(config.remoteStream);
				// 	} catch (e) {
				// 		Webrtcgw.error(e);
				// 	}
				// };
			};
		}
		if (addTracks && stream !== null && stream !== undefined) {
			Webrtcgw.log('Adding local stream');
			var simulcast2 = callbacks.simulcast2 === true;
			stream.getTracks().forEach(function (track) {
				Webrtcgw.log('Adding local track:', track);
				if (!simulcast2) {
					config.pc.addTrack(track, stream);
				} else {
					if (track.kind === 'audio') {
						config.pc.addTrack(track, stream);
					} else {
						Webrtcgw.log('Enabling rid-based simulcasting:', track);
						const maxBitrates = getMaxBitrates(callbacks.simulcastMaxBitrates);
						config.pc.addTransceiver(track, {
							direction: 'sendrecv',
							streams: [stream],
							sendEncodings: [
								{ rid: 'h', active: true, maxBitrate: maxBitrates.high },
								{ rid: 'm', active: true, maxBitrate: maxBitrates.medium, scaleResolutionDownBy: 2 },
								{ rid: 'l', active: true, maxBitrate: maxBitrates.low, scaleResolutionDownBy: 4 }
							]
						});
					}
				}
			});
		}
		// Any data channel to create?
		if (isDataEnabled(media) && !config.dataChannel[Webrtcgw.dataChanDefaultLabel]) {
			Webrtcgw.log('Creating data channel');
			createDataChannel(handleId, Webrtcgw.dataChanDefaultLabel, false);
			config.pc.ondatachannel = function (event) {
				Webrtcgw.log('Data channel created by Webrtcgw:', event);
				createDataChannel(handleId, event.channel.label, event.channel);
			};
		}
		// If there's a new local stream, let's notify the application
		if (config.myStream) { pluginHandle.onlocalstream(config.myStream); }
		// Create offer/answer now
		if (jsep === null || jsep === undefined) {
			createOffer(handleId, media, callbacks);
		} else {
			let sdp = jsep.sdp;
			jsep.sdp = sdp;
			config.pc.setRemoteDescription(jsep)
				.then(function () {
					Webrtcgw.log('Remote description accepted!');
					config.remoteSdp = jsep.sdp;
					// Any trickle candidate we cached?
					if (config.candidates && config.candidates.length > 0) {
						for (var i = 0; i < config.candidates.length; i++) {
							var candidate = config.candidates[i];
							if (!candidate || candidate.completed === true) {
								// end-of-candidates
								config.pc.addIceCandidate(Webrtcgw.endOfCandidates);
							} else {
								// New candidate
								config.pc.addIceCandidate(candidate);
							}
						}
						config.candidates = [];
					}
					// Create the answer now
					createAnswer(handleId, media, callbacks);
				}, callbacks.error);
		}
	}

	function prepareWebrtc(handleId, offer, callbacks) {
		callbacks = callbacks || {};
		callbacks.success = (typeof callbacks.success === 'function') ? callbacks.success : Webrtcgw.noop;
		callbacks.error = (typeof callbacks.error === 'function') ? callbacks.error : webrtcError;
		var jsep = callbacks.jsep;
		if (offer && jsep) {
			Webrtcgw.error('Provided a JSEP to a createOffer');
			callbacks.error('Provided a JSEP to a createOffer');
			return;
		} else if (!offer && (!jsep || !jsep.type || !jsep.sdp)) {
			Webrtcgw.error('A valid JSEP is required for createAnswer');
			callbacks.error('A valid JSEP is required for createAnswer');
			return;
		}
		callbacks.media = callbacks.media || { audio: true, video: true };
		var media = callbacks.media;
		var pluginHandle = pluginHandles[handleId];
		if (pluginHandle === null || pluginHandle === undefined ||
			pluginHandle.webrtcStuff === null || pluginHandle.webrtcStuff === undefined) {
			Webrtcgw.warn('Invalid handle');
			callbacks.error('Invalid handle');
			return;
		}
		var config = pluginHandle.webrtcStuff;
		config.trickle = isTrickleEnabled(callbacks.trickle);
		// Are we updating a session?
		if (config.pc === undefined || config.pc === null) {
			// Nope, new PeerConnection
			media.update = false;
			media.keepAudio = false;
			media.keepVideo = false;
		} else if (config.pc !== undefined && config.pc !== null) {
			Webrtcgw.log('Updating existing media session');
			media.update = true;
			// Check if there's anything to add/remove/replace, or if we
			// can go directly to preparing the new SDP offer or answer
			if (callbacks.stream !== null && callbacks.stream !== undefined) {
				// External stream: is this the same as the one we were using before?
				if (callbacks.stream !== config.myStream) {
					Webrtcgw.log('Renegotiation involves a new external stream');
				}
			} else {
				// Check if there are changes on audio
				if (media.addAudio) {
					media.keepAudio = false;
					media.replaceAudio = false;
					media.removeAudio = false;
					media.audioSend = true;
					if (config.myStream && config.myStream.getAudioTracks() && config.myStream.getAudioTracks().length) {
						Webrtcgw.error("Can't add audio stream, there already is one");
						callbacks.error("Can't add audio stream, there already is one");
						return;
					}
				} else if (media.removeAudio) {
					media.keepAudio = false;
					media.replaceAudio = false;
					media.addAudio = false;
					media.audioSend = false;
				} else if (media.replaceAudio) {
					media.keepAudio = false;
					media.addAudio = false;
					media.removeAudio = false;
					media.audioSend = true;
				}
				if (config.myStream === null || config.myStream === undefined) {
					// No media stream: if we were asked to replace, it's actually an "add"
					if (media.replaceAudio) {
						media.keepAudio = false;
						media.replaceAudio = false;
						media.addAudio = true;
						media.audioSend = true;
					}
					if (isAudioSendEnabled(media)) {
						media.keepAudio = false;
						media.addAudio = true;
					}
				} else {
					if (config.myStream.getAudioTracks() === null ||
						config.myStream.getAudioTracks() === undefined ||
						config.myStream.getAudioTracks().length === 0) {
						// No audio track: if we were asked to replace, it's actually an "add"
						if (media.replaceAudio) {
							media.keepAudio = false;
							media.replaceAudio = false;
							media.addAudio = true;
							media.audioSend = true;
						}
						if (isAudioSendEnabled(media)) {
							media.keepVideo = false;
							media.addAudio = true;
						}
					} else {
						// We have an audio track: should we keep it as it is?
						if (isAudioSendEnabled(media) &&
							!media.removeAudio && !media.replaceAudio) {
							media.keepAudio = true;
						}
					}
				}
				// Check if there are changes on video
				if (media.addVideo) {
					media.keepVideo = false;
					media.replaceVideo = false;
					media.removeVideo = false;
					media.videoSend = true;
					if (config.myStream && config.myStream.getVideoTracks() && config.myStream.getVideoTracks().length) {
						Webrtcgw.error("Can't add video stream, there already is one");
						callbacks.error("Can't add video stream, there already is one");
						return;
					}
				} else if (media.removeVideo) {
					media.keepVideo = false;
					media.replaceVideo = false;
					media.addVideo = false;
					media.videoSend = false;
				} else if (media.replaceVideo) {
					media.keepVideo = false;
					media.addVideo = false;
					media.removeVideo = false;
					media.videoSend = true;
				}
				if (config.myStream === null || config.myStream === undefined) {
					// No media stream: if we were asked to replace, it's actually an "add"
					if (media.replaceVideo) {
						media.keepVideo = false;
						media.replaceVideo = false;
						media.addVideo = true;
						media.videoSend = true;
					}
					if (isVideoSendEnabled(media)) {
						media.keepVideo = false;
						media.addVideo = true;
					}
				} else {
					if (config.myStream.getVideoTracks() === null ||
						config.myStream.getVideoTracks() === undefined ||
						config.myStream.getVideoTracks().length === 0) {
						// No video track: if we were asked to replace, it's actually an "add"
						if (media.replaceVideo) {
							media.keepVideo = false;
							media.replaceVideo = false;
							media.addVideo = true;
							media.videoSend = true;
						}
						if (isVideoSendEnabled(media)) {
							media.keepVideo = false;
							media.addVideo = true;
						}
					} else {
						// We have a video track: should we keep it as it is?
						if (isVideoSendEnabled(media) &&
							!media.removeVideo && !media.replaceVideo) {
							media.keepVideo = true;
						}
					}
				}
				// Data channels can only be added
				if (media.addData) { media.data = true; }
			}
			// If we're updating and keeping all tracks, let's skip the getUserMedia part
			if ((isAudioSendEnabled(media) && media.keepAudio) &&
				(isVideoSendEnabled(media) && media.keepVideo)) {
				pluginHandle.consentDialog(false);
				streamsDone(handleId, jsep, media, callbacks, config.myStream);
				return;
			}
		}
		// If we're updating, check if we need to remove/replace one of the tracks
		if (media.update && !config.streamExternal) {
			if (media.removeAudio || media.replaceAudio) {
				if (config.myStream && config.myStream.getAudioTracks() && config.myStream.getAudioTracks().length) {
					var s = config.myStream.getAudioTracks()[0];
					Webrtcgw.log('Removing audio track:', s);
					config.myStream.removeTrack(s);
					try {
						s.stop();
					} catch (e) { console.log(e); }
				}
				if (config.pc.getSenders() && config.pc.getSenders().length) {
					var ra = true;
					if (media.replaceAudio && Webrtcgw.unifiedPlan) {
						// We can use replaceTrack
						ra = false;
					}
					if (ra) {
						for (var index in config.pc.getSenders()) {
							let s = config.pc.getSenders()[index];
							if (s && s.track && s.track.kind === 'audio') {
								Webrtcgw.log('Removing audio sender:', s);
								config.pc.removeTrack(s);
							}
						}
					}
				}
			}
			if (media.removeVideo || media.replaceVideo) {
				if (config.myStream && config.myStream.getVideoTracks() && config.myStream.getVideoTracks().length) {
					let s = config.myStream.getVideoTracks()[0];
					Webrtcgw.log('Removing video track:', s);
					config.myStream.removeTrack(s);
					try {
						s.stop();
					} catch (e) { console.log(e); }
				}
				if (config.pc.getSenders() && config.pc.getSenders().length) {
					var rv = true;
					if (media.replaceVideo && Webrtcgw.unifiedPlan) {
						// We can use replaceTrack
						rv = false;
					}
					if (rv) {
						for (let index in config.pc.getSenders()) {
							let s = config.pc.getSenders()[index];
							if (s && s.track && s.track.kind === 'video') {
								Webrtcgw.log('Removing video sender:', s);
								config.pc.removeTrack(s);
							}
						}
					}
				}
			}
		}
		// Was a MediaStream object passed, or do we need to take care of that?
		if (callbacks.stream !== null && callbacks.stream !== undefined) {
			var stream = callbacks.stream;
			Webrtcgw.log('MediaStream provided by the application');
			// If this is an update, let's check if we need to release the previous stream
			if (media.update) {
				if (config.myStream && config.myStream !== callbacks.stream && !config.streamExternal) {
					// We're replacing a stream we captured ourselves with an external one
					try {
						// Try a MediaStreamTrack.stop() for each track
						var tracks = config.myStream.getTracks();
						for (var i in tracks) {
							var mst = tracks[i];
							Webrtcgw.log(mst);
							if (mst !== null && mst !== undefined) { mst.stop(); }
						}
					} catch (e) {
						// Do nothing if this fails
					}
					config.myStream = null;
				}
			}
			// Skip the getUserMedia part
			config.streamExternal = true;
			pluginHandle.consentDialog(false);
			streamsDone(handleId, jsep, media, callbacks, stream);
			return;
		}
		if (isAudioSendEnabled(media) || isVideoSendEnabled(media)) {
			if (!Webrtcgw.isGetUserMediaAvailable()) {
				callbacks.error('getUserMedia not available');
				return;
			}
			var constraints = { mandatory: {}, optional: [] };
			pluginHandle.consentDialog(true);
			var audioSupport = isAudioSendEnabled(media);
			if (audioSupport === true && media !== undefined && media != null) {
				if (typeof media.audio === 'object') {
					audioSupport = media.audio;
				}
			}
			var videoSupport = isVideoSendEnabled(media);
			if (videoSupport === true && media !== undefined && media != null) {
				var simulcast = callbacks.simulcast === true;
				var simulcast2 = callbacks.simulcast2 === true;
				if ((simulcast || simulcast2) && !jsep && (media.video === undefined || media.video === false)) { media.video = 'hires'; }
				if (media.video && media.video !== 'screen' && media.video !== 'window') {
					if (typeof media.video === 'object') {
						videoSupport = media.video;
					} else {
						var width = 0;
						var height = 0;
						if (media.video === 'lowres') {
							// Small resolution, 4:3
							height = 240;
							width = 320;
						} else if (media.video === 'lowres-16:9') {
							// Small resolution, 16:9
							height = 180;
							width = 320;
						} else if (media.video === 'hires' || media.video === 'hires-16:9' || media.video === 'hdres') {
							// High(HD) resolution is only 16:9
							height = 720;
							width = 1280;
						} else if (media.video === 'fhdres') {
							// Full HD resolution is only 16:9
							height = 1080;
							width = 1920;
						} else if (media.video === '4kres') {
							// 4K resolution is only 16:9
							height = 2160;
							width = 3840;
						} else if (media.video === 'stdres') {
							// Normal resolution, 4:3
							height = 480;
							width = 640;
						} else if (media.video === 'stdres-16:9') {
							// Normal resolution, 16:9
							height = 360;
							width = 640;
						} else {
							Webrtcgw.log('Default video setting is stdres 4:3');
							height = 480;
							width = 640;
						}
						Webrtcgw.log('Adding media constraint:', media.video);
						videoSupport = {
							'height': { 'ideal': height },
							'width': { 'ideal': width }
						};
						Webrtcgw.log('Adding video constraint:', videoSupport);
					}
				} else if (media.video === 'screen' || media.video === 'window') {
					if (!media.screenshareFrameRate) {
						media.screenshareFrameRate = 3;
					}
					if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
						// The new experimental getDisplayMedia API is available, let's use that
						// https://groups.google.com/forum/#!topic/discuss-webrtc/Uf0SrR4uxzk
						// https://webrtchacks.com/chrome-screensharing-getdisplaymedia/
						navigator.mediaDevices.getDisplayMedia({ video: true })
							.then(function (stream) {
								console.log(stream.getTracks());
								pluginHandle.consentDialog(false);
								if (isAudioSendEnabled(media) && !media.keepAudio) {
									navigator.mediaDevices.getUserMedia({ audio: true, video: false })
										.then(function (audioStream) {
											stream.addTrack(audioStream.getAudioTracks()[0]);
											streamsDone(handleId, jsep, media, callbacks, stream);
										})
										.catch(function (error) {
											console.error(error);
											if (error && error.name && (error.name === 'NotReadableError' || error.name === 'NotAllowedError' || error.name === 'NotFoundError')) {
												streamsDone(handleId, jsep, media, callbacks, stream);
											}
										});
								} else {
									streamsDone(handleId, jsep, media, callbacks, stream);
								}
								// streamsDone(handleId, jsep, media, callbacks, stream);
							}, function (error) {
								pluginHandle.consentDialog(false);
								callbacks.error(error);
							});
						return;
					}
					// We're going to try and use the extension for Chrome 34+, the old approach
					// for older versions of Chrome, or the experimental support in Firefox 33+
					function callbackUserMedia(error, stream) {
						pluginHandle.consentDialog(false);
						if (error) {
							callbacks.error(error);
						} else {
							streamsDone(handleId, jsep, media, callbacks, stream);
						}
					}
					function getScreenMedia(constraints, gsmCallback, useAudio) {
						Webrtcgw.log('Adding media constraint (screen capture)');
						navigator.mediaDevices.getUserMedia(constraints)
							.then(function (stream) {
								if (useAudio) {
									navigator.mediaDevices.getUserMedia({ audio: true, video: false })
										.then(function (audioStream) {
											stream.addTrack(audioStream.getAudioTracks()[0]);
											gsmCallback(null, stream);
										});
								} else {
									gsmCallback(null, stream);
								}
							})
							.catch(function (error) { pluginHandle.consentDialog(false); gsmCallback(error); });
					}
					if (Webrtcgw.webRTCAdapter.browserDetails.browser === 'chrome') {
						var chromever = Webrtcgw.webRTCAdapter.browserDetails.version;
						var maxver = 33;
						if (window.navigator.userAgent.match('Linux')) { maxver = 35; }	// "known" crash in chrome 34 and 35 on linux
						if (chromever >= 26 && chromever <= maxver) {
							// Chrome 26->33 requires some awkward chrome://flags manipulation
							constraints = {
								video: {
									mandatory: {
										googLeakyBucket: true,
										maxWidth: window.screen.width,
										maxHeight: window.screen.height,
										minFrameRate: media.screenshareFrameRate,
										maxFrameRate: media.screenshareFrameRate,
										chromeMediaSource: 'screen'
									}
								},
								audio: isAudioSendEnabled(media) && !media.keepAudio
							};
							getScreenMedia(constraints, callbackUserMedia);
						} else {
							// Chrome 34+ requires an extension
							Webrtcgw.extension.getScreen(function (error, sourceId) {
								if (error) {
									pluginHandle.consentDialog(false);
									return callbacks.error(error);
								}
								constraints = {
									audio: false,
									video: {
										mandatory: {
											chromeMediaSource: 'desktop',
											maxWidth: window.screen.width,
											maxHeight: window.screen.height,
											minFrameRate: media.screenshareFrameRate,
											maxFrameRate: media.screenshareFrameRate
										},
										optional: [
											{ googLeakyBucket: true },
											{ googTemporalLayeredScreencast: true }
										]
									}
								};
								constraints.video.mandatory.chromeMediaSourceId = sourceId;
								getScreenMedia(constraints, callbackUserMedia,
									isAudioSendEnabled(media) && !media.keepAudio);
							});
						}
					} else if (Webrtcgw.webRTCAdapter.browserDetails.browser === 'firefox') {
						if (Webrtcgw.webRTCAdapter.browserDetails.version >= 33) {
							// Firefox 33+ has experimental support for screen sharing
							constraints = {
								video: {
									mozMediaSource: media.video,
									mediaSource: media.video
								},
								audio: isAudioSendEnabled(media) && !media.keepAudio
							};
							getScreenMedia(constraints, function (err, stream) {
								callbackUserMedia(err, stream);
								// Workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=1045810
								if (!err) {
									var lastTime = stream.currentTime;
									var polly = window.setInterval(function () {
										if (!stream) { window.clearInterval(polly); }
										if (stream.currentTime === lastTime) {
											window.clearInterval(polly);
											if (stream.onended) {
												stream.onended();
											}
										}
										lastTime = stream.currentTime;
									}, 500);
								}
							});
						} else {
							var error = new Error('NavigatorUserMediaError');
							error.name = 'Your version of Firefox does not support screen sharing, please install Firefox 33 (or more recent versions)';
							pluginHandle.consentDialog(false);
							callbacks.error(error);
							return;
						}
					}
					return;
				}
			}
			// If we got here, we're not screensharing
			if (media === null || media === undefined || media.video !== 'screen') {
				// Check whether all media sources are actually available or not
				navigator.mediaDevices.enumerateDevices().then(function (devices) {
					var audioExist = devices.some(function (device) {
						return device.kind === 'audioinput';
					});
					var videoExist = isScreenSendEnabled(media) || devices.some(function (device) {
						return device.kind === 'videoinput';
					});

					// Check whether a missing device is really a problem
					var audioSend = isAudioSendEnabled(media);
					var videoSend = isVideoSendEnabled(media);
					var needAudioDevice = isAudioSendRequired(media);
					var needVideoDevice = isVideoSendRequired(media);
					if (audioSend || videoSend || needAudioDevice || needVideoDevice) {
						// We need to send either audio or video
						var haveAudioDevice = audioSend ? audioExist : false;
						var haveVideoDevice = videoSend ? videoExist : false;
						if (!haveAudioDevice && !haveVideoDevice) {
							// FIXME Should we really give up, or just assume recvonly for both?
							pluginHandle.consentDialog(false);
							callbacks.error('No capture device found');
							return false;
						} else if (!haveAudioDevice && needAudioDevice) {
							pluginHandle.consentDialog(false);
							callbacks.error('Audio capture is required, but no capture device found');
							return false;
						} else if (!haveVideoDevice && needVideoDevice) {
							pluginHandle.consentDialog(false);
							callbacks.error('Video capture is required, but no capture device found');
							return false;
						}
					}

					var gumConstraints = {
						audio: (audioExist && !media.keepAudio) ? audioSupport : false,
						video: (videoExist && !media.keepVideo) ? videoSupport : false
					};
					Webrtcgw.log('getUserMedia constraints', gumConstraints);
					if (!gumConstraints.audio && !gumConstraints.video) {
						pluginHandle.consentDialog(false);
						streamsDone(handleId, jsep, media, callbacks, stream);
					} else {
						navigator.mediaDevices.getUserMedia(gumConstraints)
							.then(function (stream) {
								pluginHandle.consentDialog(false);
								streamsDone(handleId, jsep, media, callbacks, stream);
							}).catch(function (error) {
								pluginHandle.consentDialog(false);
								callbacks.error({ code: error.code, name: error.name, message: error.message });
							});
					}
				})
					.catch(function (error) {
						pluginHandle.consentDialog(false);
						callbacks.error('enumerateDevices error', error);
					});
			}
		} else {
			// No need to do a getUserMedia, create offer/answer right away
			streamsDone(handleId, jsep, media, callbacks);
		}
	}

	function prepareWebrtcPeer(handleId, callbacks) {
		callbacks = callbacks || {};
		callbacks.success = (typeof callbacks.success === 'function') ? callbacks.success : Webrtcgw.noop;
		callbacks.error = (typeof callbacks.error === 'function') ? callbacks.error : webrtcError;
		var jsep = callbacks.jsep;
		var pluginHandle = pluginHandles[handleId];
		if (pluginHandle === null || pluginHandle === undefined ||
			pluginHandle.webrtcStuff === null || pluginHandle.webrtcStuff === undefined) {
			Webrtcgw.warn('Invalid handle');
			callbacks.error('Invalid handle');
			return;
		}
		var config = pluginHandle.webrtcStuff;
		if (jsep !== undefined && jsep !== null) {
			if (config.pc === null) {
				Webrtcgw.warn('Wait, no PeerConnection?? if this is an answer, use createAnswer and not handleRemoteJsep');
				callbacks.error('No PeerConnection: if this is an answer, use createAnswer and not handleRemoteJsep');
				return;
			}
			let sdp = jsep.sdp;
			let videoBandwidth = null;
			// if (Webrtcgw.videoBandWidth === 512) {
			// 	videoBandwidth = 512;
			// } else if (Webrtcgw.videoBandWidth === 2000) {
			// 	videoBandwidth = 2000;
			// } else {
			// 	videoBandwidth = 1000;
			// }
			videoBandwidth = Webrtcgw.videoBandWidth ? parseInt(Webrtcgw.videoBandWidth) : 1000;
			let tias = parseInt(sdp.substr(sdp.indexOf('b=TIAS:') + 7, 8));
			// console.log(tias);
			let modifier = 'AS';
			if (tias > videoBandwidth * 1000) {
				sdp = sdp.replace(/b=TIAS:(.*)\r\n/g, '');
				sdp = sdp.replace(/m=video (.*)\r\n/g, 'm=video $1\r\nb=' + modifier + ':' + videoBandwidth + '\r\n');
				sdp = sdp.replace(/m=video (.*)\r\n/g, 'm=video $1\r\nb=' + 'TIAS' + ':' + videoBandwidth * 1000 + '\r\n');
			} else {
				sdp = sdp.replace(/b=TIAS:(.*)\r\n/g, 'b=TIAS:$1\r\nb=' + modifier + ':' + tias / 1000 + '\r\n');
			}
			if (Webrtcgw.audioIndex > Webrtcgw.videoIndex && Webrtcgw.videoIndex !== -1 & Webrtcgw.audioIndex !== -1) {
				let sdpaudio = sdp.substring(sdp.indexOf('m=audio'), sdp.indexOf('m=video'));
				let sdpvideo = sdp.substr(sdp.indexOf('m=video'));
				sdp = sdp.substring(0, sdp.indexOf('m=audio')) + sdpvideo + sdpaudio;
			}
			jsep.sdp = sdp;
			// console.log('answer', jsep.sdp);
			config.pc.setRemoteDescription(jsep)
				.then(function () {
					Webrtcgw.log('Remote description accepted!');
					config.remoteSdp = jsep.sdp;
					// Any trickle candidate we cached?
					if (config.candidates && config.candidates.length > 0) {
						for (var i = 0; i < config.candidates.length; i++) {
							var candidate = config.candidates[i];
							if (!candidate || candidate.completed === true) {
								// end-of-candidates
								config.pc.addIceCandidate(Webrtcgw.endOfCandidates);
							} else {
								// New candidatecreateOffer
								config.pc.addIceCandidate(candidate);
							}
						}
						config.candidates = [];
					}
					// Done
					callbacks.success();
				}, callbacks.error);
		} else {
			callbacks.error('Invalid JSEP');
		}
	}

	function createOffer(handleId, media, callbacks) {
		callbacks = callbacks || {};
		callbacks.success = (typeof callbacks.success === 'function') ? callbacks.success : Webrtcgw.noop;
		callbacks.error = (typeof callbacks.error === 'function') ? callbacks.error : Webrtcgw.noop;
		callbacks.customizeSdp = (typeof callbacks.customizeSdp === 'function') ? callbacks.customizeSdp : Webrtcgw.noop;
		var pluginHandle = pluginHandles[handleId];
		if (pluginHandle === null || pluginHandle === undefined ||
			pluginHandle.webrtcStuff === null || pluginHandle.webrtcStuff === undefined) {
			Webrtcgw.warn('Invalid handle');
			callbacks.error('Invalid handle');
			return;
		}
		var config = pluginHandle.webrtcStuff;
		var simulcast = callbacks.simulcast === true;
		if (!simulcast) {
			Webrtcgw.log('Creating offer (iceDone=' + config.iceDone + ')');
		} else {
			Webrtcgw.log('Creating offer (iceDone=' + config.iceDone + ', simulcast=' + simulcast + ')');
		}
		// https://code.google.com/p/webrtc/issues/detail?id=3508
		var mediaConstraints = {};
		if (Webrtcgw.unifiedPlan) {
			// We can use Transceivers
			var audioTransceiver = null;
			var videoTransceiver = null;
			var transceivers = config.pc.getTransceivers();
			if (transceivers && transceivers.length > 0) {
				for (var i in transceivers) {
					var t = transceivers[i];
					if ((t.sender && t.sender.track && t.sender.track.kind === 'audio') ||
						(t.receiver && t.receiver.track && t.receiver.track.kind === 'audio')) {
						if (!audioTransceiver) { audioTransceiver = t; }
						continue;
					}
					if ((t.sender && t.sender.track && t.sender.track.kind === 'video') ||
						(t.receiver && t.receiver.track && t.receiver.track.kind === 'video')) {
						if (!videoTransceiver) { videoTransceiver = t; }
						continue;
					}
				}
			}
			// Handle audio (and related changes, if any)
			var audioSend = isAudioSendEnabled(media);
			var audioRecv = isAudioRecvEnabled(media);
			if (!audioSend && !audioRecv) {
				// Audio disabled: have we removed it?
				if (media.removeAudio && audioTransceiver) {
					if (audioTransceiver.setDirection) {
						audioTransceiver.setDirection('inactive');
					} else {
						audioTransceiver.direction = 'inactive';
					}
					Webrtcgw.log('Setting audio transceiver to inactive:', audioTransceiver);
				}
			} else {
				// Take care of audio m-line
				if (audioSend && audioRecv) {
					if (audioTransceiver) {
						if (audioTransceiver.setDirection) {
							audioTransceiver.setDirection('sendrecv');
						} else {
							audioTransceiver.direction = 'sendrecv';
						}
						Webrtcgw.log('Setting audio transceiver to sendrecv:', audioTransceiver);
					}
				} else if (audioSend && !audioRecv) {
					if (audioTransceiver) {
						if (audioTransceiver.setDirection) {
							audioTransceiver.setDirection('sendonly');
						} else {
							audioTransceiver.direction = 'sendonly';
						}
						Webrtcgw.log('Setting audio transceiver to sendonly:', audioTransceiver);
					}
				} else if (!audioSend && audioRecv) {
					if (audioTransceiver) {
						if (audioTransceiver.setDirection) {
							audioTransceiver.setDirection('recvonly');
						} else {
							audioTransceiver.direction = 'recvonly';
						}
						Webrtcgw.log('Setting audio transceiver to recvonly:', audioTransceiver);
					} else {
						// In theory, this is the only case where we might not have a transceiver yet
						audioTransceiver = config.pc.addTransceiver('audio', { direction: 'recvonly' });
						Webrtcgw.log('Adding recvonly audio transceiver:', audioTransceiver);
					}
				}
			}
			// Handle video (and related changes, if any)
			var videoSend = isVideoSendEnabled(media);
			var videoRecv = isVideoRecvEnabled(media);
			if (!videoSend && !videoRecv) {
				// Video disabled: have we removed it?
				if (media.removeVideo && videoTransceiver) {
					if (videoTransceiver.setDirection) {
						videoTransceiver.setDirection('inactive');
					} else {
						videoTransceiver.direction = 'inactive';
					}
					Webrtcgw.log('Setting video transceiver to inactive:', videoTransceiver);
				}
			} else {
				// Take care of video m-line
				if (videoSend && videoRecv) {
					if (videoTransceiver) {
						if (videoTransceiver.setDirection) {
							videoTransceiver.setDirection('sendrecv');
						} else {
							videoTransceiver.direction = 'sendrecv';
						}
						Webrtcgw.log('Setting video transceiver to sendrecv:', videoTransceiver);
					}
				} else if (videoSend && !videoRecv) {
					if (videoTransceiver) {
						if (videoTransceiver.setDirection) {
							videoTransceiver.setDirection('sendonly');
						} else {
							videoTransceiver.direction = 'sendonly';
						}
						Webrtcgw.log('Setting video transceiver to sendonly:', videoTransceiver);
					}
				} else if (!videoSend && videoRecv) {
					if (videoTransceiver) {
						if (videoTransceiver.setDirection) {
							videoTransceiver.setDirection('recvonly');
						} else {
							videoTransceiver.direction = 'recvonly';
						}
						Webrtcgw.log('Setting video transceiver to recvonly:', videoTransceiver);
					} else {
						// In theory, this is the only case where we might not have a transceiver yet
						videoTransceiver = config.pc.addTransceiver('video', { direction: 'recvonly' });
						Webrtcgw.log('Adding recvonly video transceiver:', videoTransceiver);
					}
				}
			}
		} else {
			mediaConstraints['offerToReceiveAudio'] = isAudioRecvEnabled(media);
			mediaConstraints['offerToReceiveVideo'] = isVideoRecvEnabled(media);
		}
		var iceRestart = callbacks.iceRestart === true;
		if (iceRestart) {
			mediaConstraints['iceRestart'] = true;
		}
		// Check if this is Firefox and we've been asked to do simulcasting
		var sendVideo = isVideoSendEnabled(media);
		if (sendVideo && simulcast && Webrtcgw.webRTCAdapter.browserDetails.browser === 'firefox') {
			// FIXME Based on https://gist.github.com/voluntas/088bc3cc62094730647b
			Webrtcgw.log('Enabling Simulcasting for Firefox (RID)');
			var sender = config.pc.getSenders().find(function (s) { return s.track.kind === 'video'; });
			if (sender) {
				var parameters = sender.getParameters();
				if (!parameters) { parameters = {}; }

				const maxBitrates = getMaxBitrates(callbacks.simulcastMaxBitrates);
				parameters.encodings = [
					{ rid: 'h', active: true, maxBitrate: maxBitrates.high },
					{ rid: 'm', active: true, maxBitrate: maxBitrates.medium, scaleResolutionDownBy: 2 },
					{ rid: 'l', active: true, maxBitrate: maxBitrates.low, scaleResolutionDownBy: 4 }
				];
				sender.setParameters(parameters);
			}
		}
		// console.log(config.pc);
		config.pc.createOffer(mediaConstraints)
			.then(function (offer) {
				// JSON.stringify doesn't work on some WebRTC objects anymore
				// See https://code.google.com/p/chromium/issues/detail?id=467366
				var jsep = {
					'type': offer.type,
					'sdp': offer.sdp
				};
				callbacks.customizeSdp(jsep);
				offer.sdp = jsep.sdp;
				// console.log(offer.sdp);
				Webrtcgw.log('Setting local description');
				if (sendVideo && simulcast) {
					// This SDP munging only works with Chrome (Safari STP may support it too)
					if (Webrtcgw.webRTCAdapter.browserDetails.browser === 'chrome' ||
						Webrtcgw.webRTCAdapter.browserDetails.browser === 'safari') {
						Webrtcgw.log('Enabling Simulcasting for Chrome (SDP munging)');
						offer.sdp = mungeSdpForSimulcasting(offer.sdp);
					} else if (Webrtcgw.webRTCAdapter.browserDetails.browser !== 'firefox') {
						Webrtcgw.warn('simulcast=true, but this is not Chrome nor Firefox, ignoring');
					}
				}
				let sdp = offer.sdp;
				// let videoBandwidth = null;
				// if (Webrtcgw.videoBandWidth === 512) {
				// 	videoBandwidth = 512;
				// } else if (Webrtcgw.videoBandWidth === 2000) {
				// 	videoBandwidth = 2000;
				// } else {
				// 	videoBandwidth = 1000;
				// }
				// videoBandwidth = Webrtcgw.videoBandWidth ? parseInt(Webrtcgw.videoBandWidth) : 1000;
				// let modifier = 'AS';
				// if (sdp.indexOf('b=' + modifier + ':') === -1) {
				// 	// sdp = sdp.replace(/s=-\r\n/, 's=-\r\n' + 'b=AS:' + videoBandwidth + '\r\n');
				// 	// sdp = sdp.replace(/m=video (.*)\r\n/g, 'm=video $1\r\nb=' + modifier + ':' + videoBandwidth + '\r\n');
				// 	sdp = sdp.replace(/m=video (.*)\r\n/g, 'm=video $1\r\nb=' + 'TIAS' + ':' + videoBandwidth * 1000 + '\r\n');
				// }
				offer.sdp = sdp;
				// console.log('offer', offer.sdp);
				Webrtcgw.audioIndex = sdp.indexOf('m=audio');
				Webrtcgw.videoIndex = sdp.indexOf('m=video');
				config.mySdp = offer.sdp;
				config.pc.setLocalDescription(offer)
					.catch(callbacks.error);
				config.mediaConstraints = mediaConstraints;
				if (!config.iceDone && !config.trickle) {
					// Don't do anything until we have all candidates
					Webrtcgw.log('Waiting for all candidates...');
					return;
				}
				Webrtcgw.log('Offer ready');
				callbacks.success(offer);
			}, callbacks.error);
	}

	function createAnswer(handleId, media, callbacks) {
		callbacks = callbacks || {};
		callbacks.success = (typeof callbacks.success === 'function') ? callbacks.success : Webrtcgw.noop;
		callbacks.error = (typeof callbacks.error === 'function') ? callbacks.error : Webrtcgw.noop;
		callbacks.customizeSdp = (typeof callbacks.customizeSdp === 'function') ? callbacks.customizeSdp : Webrtcgw.noop;
		var pluginHandle = pluginHandles[handleId];
		if (pluginHandle === null || pluginHandle === undefined ||
			pluginHandle.webrtcStuff === null || pluginHandle.webrtcStuff === undefined) {
			Webrtcgw.warn('Invalid handle');
			callbacks.error('Invalid handle');
			return;
		}
		var config = pluginHandle.webrtcStuff;
		var simulcast = callbacks.simulcast === true;
		if (!simulcast) {
			Webrtcgw.log('Creating answer (iceDone=' + config.iceDone + ')');
		} else {
			Webrtcgw.log('Creating answer (iceDone=' + config.iceDone + ', simulcast=' + simulcast + ')');
		}
		var mediaConstraints = null;
		if (Webrtcgw.unifiedPlan) {
			// We can use Transceivers
			mediaConstraints = {};
			var audioTransceiver = null;
			var videoTransceiver = null;
			var transceivers = config.pc.getTransceivers();
			if (transceivers && transceivers.length > 0) {
				for (var i in transceivers) {
					var t = transceivers[i];
					if ((t.sender && t.sender.track && t.sender.track.kind === 'audio') ||
						(t.receiver && t.receiver.track && t.receiver.track.kind === 'audio')) {
						if (!audioTransceiver) { audioTransceiver = t; }
						continue;
					}
					if ((t.sender && t.sender.track && t.sender.track.kind === 'video') ||
						(t.receiver && t.receiver.track && t.receiver.track.kind === 'video')) {
						if (!videoTransceiver) { videoTransceiver = t; }
						continue;
					}
				}
			}
			// Handle audio (and related changes, if any)
			var audioSend = isAudioSendEnabled(media);
			var audioRecv = isAudioRecvEnabled(media);
			if (!audioSend && !audioRecv) {
				// Audio disabled: have we removed it?
				if (media.removeAudio && audioTransceiver) {
					try {
						if (audioTransceiver.setDirection) {
							audioTransceiver.setDirection('inactive');
						} else {
							audioTransceiver.direction = 'inactive';
						}
						Webrtcgw.log('Setting audio transceiver to inactive:', audioTransceiver);
					} catch (e) {
						Webrtcgw.error(e);
					}
				}
			} else {
				// Take care of audio m-line
				if (audioSend && audioRecv) {
					if (audioTransceiver) {
						try {
							if (audioTransceiver.setDirection) {
								audioTransceiver.setDirection('sendrecv');
							} else {
								audioTransceiver.direction = 'sendrecv';
							}
							Webrtcgw.log('Setting audio transceiver to sendrecv:', audioTransceiver);
						} catch (e) {
							Webrtcgw.error(e);
						}
					}
				} else if (audioSend && !audioRecv) {
					try {
						if (audioTransceiver) {
							if (audioTransceiver.setDirection) {
								audioTransceiver.setDirection('sendonly');
							} else {
								audioTransceiver.direction = 'sendonly';
							}
							Webrtcgw.log('Setting audio transceiver to sendonly:', audioTransceiver);
						}
					} catch (e) {
						Webrtcgw.error(e);
					}
				} else if (!audioSend && audioRecv) {
					if (audioTransceiver) {
						try {
							if (audioTransceiver.setDirection) {
								audioTransceiver.setDirection('recvonly');
							} else {
								audioTransceiver.direction = 'recvonly';
							}
							Webrtcgw.log('Setting audio transceiver to recvonly:', audioTransceiver);
						} catch (e) {
							Webrtcgw.error(e);
						}
					} else {
						// In theory, this is the only case where we might not have a transceiver yet
						audioTransceiver = config.pc.addTransceiver('audio', { direction: 'recvonly' });
						Webrtcgw.log('Adding recvonly audio transceiver:', audioTransceiver);
					}
				}
			}
			// Handle video (and related changes, if any)
			var videoSend = isVideoSendEnabled(media);
			var videoRecv = isVideoRecvEnabled(media);
			if (!videoSend && !videoRecv) {
				// Video disabled: have we removed it?
				if (media.removeVideo && videoTransceiver) {
					try {
						if (videoTransceiver.setDirection) {
							videoTransceiver.setDirection('inactive');
						} else {
							videoTransceiver.direction = 'inactive';
						}
						Webrtcgw.log('Setting video transceiver to inactive:', videoTransceiver);
					} catch (e) {
						Webrtcgw.error(e);
					}
				}
			} else {
				// Take care of video m-line
				if (videoSend && videoRecv) {
					if (videoTransceiver) {
						try {
							if (videoTransceiver.setDirection) {
								videoTransceiver.setDirection('sendrecv');
							} else {
								videoTransceiver.direction = 'sendrecv';
							}
							Webrtcgw.log('Setting video transceiver to sendrecv:', videoTransceiver);
						} catch (e) {
							Webrtcgw.error(e);
						}
					}
				} else if (videoSend && !videoRecv) {
					if (videoTransceiver) {
						try {
							if (videoTransceiver.setDirection) {
								videoTransceiver.setDirection('sendonly');
							} else {
								videoTransceiver.direction = 'sendonly';
							}
							Webrtcgw.log('Setting video transceiver to sendonly:', videoTransceiver);
						} catch (e) {
							Webrtcgw.error(e);
						}
					}
				} else if (!videoSend && videoRecv) {
					if (videoTransceiver) {
						try {
							if (videoTransceiver.setDirection) {
								videoTransceiver.setDirection('recvonly');
							} else {
								videoTransceiver.direction = 'recvonly';
							}
							Webrtcgw.log('Setting video transceiver to recvonly:', videoTransceiver);
						} catch (e) {
							Webrtcgw.error(e);
						}
					} else {
						// In theory, this is the only case where we might not have a transceiver yet
						videoTransceiver = config.pc.addTransceiver('video', { direction: 'recvonly' });
						Webrtcgw.log('Adding recvonly video transceiver:', videoTransceiver);
					}
				}
			}
		} else {
			if (Webrtcgw.webRTCAdapter.browserDetails.browser === 'firefox' || Webrtcgw.webRTCAdapter.browserDetails.browser === 'edge') {
				mediaConstraints = {
					offerToReceiveAudio: isAudioRecvEnabled(media),
					offerToReceiveVideo: isVideoRecvEnabled(media)
				};
			} else {
				mediaConstraints = {
					mandatory: {
						OfferToReceiveAudio: isAudioRecvEnabled(media),
						OfferToReceiveVideo: isVideoRecvEnabled(media)
					}
				};
			}
		}
		// Check if this is Firefox and we've been asked to do simulcasting
		var sendVideo = isVideoSendEnabled(media);
		if (sendVideo && simulcast && Webrtcgw.webRTCAdapter.browserDetails.browser === 'firefox') {
			// FIXME Based on https://gist.github.com/voluntas/088bc3cc62094730647b
			Webrtcgw.log('Enabling Simulcasting for Firefox (RID)');
			var sender = config.pc.getSenders()[1];
			Webrtcgw.log(sender);
			var parameters = sender.getParameters();
			Webrtcgw.log(parameters);

			const maxBitrates = getMaxBitrates(callbacks.simulcastMaxBitrates);
			sender.setParameters({
				encodings: [
					{ rid: 'high', active: true, priority: 'high', maxBitrate: maxBitrates.high },
					{ rid: 'medium', active: true, priority: 'medium', maxBitrate: maxBitrates.medium },
					{ rid: 'low', active: true, priority: 'low', maxBitrate: maxBitrates.low }
				]
			});
		}
		config.pc.createAnswer(mediaConstraints)
			.then(function (answer) {
				// JSON.stringify doesn't work on some WebRTC objects anymore
				// See https://code.google.com/p/chromium/issues/detail?id=467366
				var jsep = {
					'type': answer.type,
					'sdp': answer.sdp
				};
				// console.log(jsep.sdp);
				callbacks.customizeSdp(jsep);
				answer.sdp = jsep.sdp;
				Webrtcgw.log('Setting local description');
				if (sendVideo && simulcast) {
					// This SDP munging only works with Chrome
					if (Webrtcgw.webRTCAdapter.browserDetails.browser === 'chrome') {
						// FIXME Apparently trying to simulcast when answering breaks video in Chrome...
						// ~ Webrtcgw.log("Enabling Simulcasting for Chrome (SDP munging)");
						// ~ answer.sdp = mungeSdpForSimulcasting(answer.sdp);
						Webrtcgw.warn('simulcast=true, but this is an answer, and video breaks in Chrome if we enable it');
					} else if (Webrtcgw.webRTCAdapter.browserDetails.browser !== 'firefox') {
						Webrtcgw.warn('simulcast=true, but this is not Chrome nor Firefox, ignoring');
					}
				}
				config.mySdp = answer.sdp;
				config.pc.setLocalDescription(answer)
					.catch(callbacks.error);
				config.mediaConstraints = mediaConstraints;
				if (!config.iceDone && !config.trickle) {
					// Don't do anything until we have all candidates
					Webrtcgw.log('Waiting for all candidates...');
					return;
				}
				callbacks.success(answer);
			}, callbacks.error);
	}

	function sendSDP(handleId, callbacks) {
		callbacks = callbacks || {};
		callbacks.success = (typeof callbacks.success === 'function') ? callbacks.success : Webrtcgw.noop;
		callbacks.error = (typeof callbacks.error === 'function') ? callbacks.error : Webrtcgw.noop;
		var pluginHandle = pluginHandles[handleId];
		if (pluginHandle === null || pluginHandle === undefined ||
			pluginHandle.webrtcStuff === null || pluginHandle.webrtcStuff === undefined) {
			Webrtcgw.warn('Invalid handle, not sending anything');
			return;
		}
		var config = pluginHandle.webrtcStuff;
		Webrtcgw.log('Sending offer/answer SDP...');
		if (config.mySdp === null || config.mySdp === undefined) {
			Webrtcgw.warn('Local SDP instance is invalid, not sending anything...');
			return;
		}
		config.mySdp = {
			'type': config.pc.localDescription.type,
			'sdp': config.pc.localDescription.sdp
		};
		if (config.trickle === false) { config.mySdp['trickle'] = false; }
		config.sdpSent = true;
		callbacks.success(config.mySdp);
	}

	function getVolume(handleId, remote) {
		var pluginHandle = pluginHandles[handleId];
		if (pluginHandle === null || pluginHandle === undefined ||
			pluginHandle.webrtcStuff === null || pluginHandle.webrtcStuff === undefined) {
			Webrtcgw.warn('Invalid handle');
			return 0;
		}
		var stream = remote ? 'remote' : 'local';
		var config = pluginHandle.webrtcStuff;
		if (!config.volume[stream]) { config.volume[stream] = { value: 0 }; }
		// Start getting the volume, if getStats is supported
		if (config.pc.getStats && Webrtcgw.webRTCAdapter.browserDetails.browser === 'chrome') {
			if (remote && (config.remoteStream === null || config.remoteStream === undefined)) {
				Webrtcgw.warn('Remote stream unavailable');
				return 0;
			} else if (!remote && (config.myStream === null || config.myStream === undefined)) {
				Webrtcgw.warn('Local stream unavailable');
				return 0;
			}
			if (config.volume[stream].timer === null || config.volume[stream].timer === undefined) {
				Webrtcgw.log('Starting ' + stream + ' volume monitor');
				config.volume[stream].timer = setInterval(function () {
					config.pc.getStats(function (stats) {
						var results = stats.result();
						for (var i = 0; i < results.length; i++) {
							var res = results[i];
							if (res.type === 'ssrc') {
								if (remote && res.stat('audioOutputLevel')) { config.volume[stream].value = parseInt(res.stat('audioOutputLevel')); } else if (!remote && res.stat('audioInputLevel')) { config.volume[stream].value = parseInt(res.stat('audioInputLevel')); }
							}
						}
					});
				}, 200);
				return 0;	// We don't have a volume to return yet
			}
			return config.volume[stream].value;
		} else {
			// audioInputLevel and audioOutputLevel seem only available in Chrome? audioLevel
			// seems to be available on Chrome and Firefox, but they don't seem to work
			Webrtcgw.warn('Getting the ' + stream + ' volume unsupported by browser');
			return 0;
		}
	}

	function isMuted(handleId, video) {
		var pluginHandle = pluginHandles[handleId];
		if (pluginHandle === null || pluginHandle === undefined ||
			pluginHandle.webrtcStuff === null || pluginHandle.webrtcStuff === undefined) {
			Webrtcgw.warn('Invalid handle');
			return true;
		}
		var config = pluginHandle.webrtcStuff;
		if (config.pc === null || config.pc === undefined) {
			Webrtcgw.warn('Invalid PeerConnection');
			return true;
		}
		if (config.myStream === undefined || config.myStream === null) {
			Webrtcgw.warn('Invalid local MediaStream');
			return true;
		}
		if (video) {
			// Check video track
			if (config.myStream.getVideoTracks() === null ||
				config.myStream.getVideoTracks() === undefined ||
				config.myStream.getVideoTracks().length === 0) {
				Webrtcgw.warn('No video track');
				return true;
			}
			return !config.myStream.getVideoTracks()[0].enabled;
		} else {
			// Check audio track
			if (config.myStream.getAudioTracks() === null ||
				config.myStream.getAudioTracks() === undefined ||
				config.myStream.getAudioTracks().length === 0) {
				Webrtcgw.warn('No audio track');
				return true;
			}
			return !config.myStream.getAudioTracks()[0].enabled;
		}
	}

	function mute(handleId, video, mute) {
		var pluginHandle = pluginHandles[handleId];
		if (pluginHandle === null || pluginHandle === undefined ||
			pluginHandle.webrtcStuff === null || pluginHandle.webrtcStuff === undefined) {
			Webrtcgw.warn('Invalid handle');
			return false;
		}
		var config = pluginHandle.webrtcStuff;
		if (config.pc === null || config.pc === undefined) {
			Webrtcgw.warn('Invalid PeerConnection');
			return false;
		}
		if (config.myStream === undefined || config.myStream === null) {
			Webrtcgw.warn('Invalid local MediaStream');
			return false;
		}
		if (video) {
			// Mute/unmute video track
			if (config.myStream.getVideoTracks() === null ||
				config.myStream.getVideoTracks() === undefined ||
				config.myStream.getVideoTracks().length === 0) {
				Webrtcgw.warn('No video track');
				return false;
			}
			config.myStream.getVideoTracks()[0].enabled = !mute;
			return true;
		} else {
			// Mute/unmute audio track
			if (config.myStream.getAudioTracks() === null ||
				config.myStream.getAudioTracks() === undefined ||
				config.myStream.getAudioTracks().length === 0) {
				Webrtcgw.warn('No audio track');
				return false;
			}
			config.myStream.getAudioTracks()[0].enabled = !mute;
			return true;
		}
	}

	async function getBitrate(handleId) {
		var pluginHandle = pluginHandles[handleId];
		if (pluginHandle === null || pluginHandle === undefined ||
			pluginHandle.webrtcStuff === null || pluginHandle.webrtcStuff === undefined) {
			Webrtcgw.warn('Invalid handle');
			return 'Invalid handle';
		}
		var config = pluginHandle.webrtcStuff;
		if (config.pc === null || config.pc === undefined) { return 'Invalid PeerConnection'; }
		// Start getting the bitrate, if getStats is supported
		if (config.pc.getStats) {
			if (config.bitrate.timer === null || config.bitrate.timer === undefined) {
				// Webrtcgw.log('Starting bitrate timer (via getStats)');
				await config.pc.getStats()
					.then(function (stats) {
						stats.forEach(function (res) {
							if (!res) { return; }
							var inStats = false;
							// Check if these are statistics on incoming media
							if ((res.mediaType === 'video' || res.id.toLowerCase().indexOf('video') > -1) &&
								res.type === 'inbound-rtp' && res.id.indexOf('rtcp') < 0) {
								// New stats
								inStats = true;
							}
							// Parse stats now
							if (inStats) {
								config.bitrate.bsnow = res.bytesReceived;
								config.bitrate.tsnow = res.timestamp;
								config.bitrate.fsnow = res.framesDecoded;
								config.bitrate.psrnow = res.packetsReceived;
								config.bitrate.pslnow = res.packetsLost;
								// console.log('接收视频', res);
								if (config.bitrate.bsbefore === null || config.bitrate.tsbefore === null || config.bitrate.fsbefore === null) {
									// Skip this round
									config.bitrate.bsbefore = config.bitrate.bsnow;
									config.bitrate.tsbefore = config.bitrate.tsnow;
									config.bitrate.fsbefore = config.bitrate.fsnow;
									config.bitrate.psrbefore = config.bitrate.psrnow;
									config.bitrate.pslbefore = config.bitrate.pslnow;
								} else {
									// Calculate bitrate
									var timePassed = config.bitrate.tsnow - config.bitrate.tsbefore;
									if (Webrtcgw.webRTCAdapter.browserDetails.browser === 'safari') { timePassed = timePassed / 1000; }	// Apparently the timestamp is in microseconds, in Safari
									var bitRate = Math.round((config.bitrate.bsnow - config.bitrate.bsbefore) * 8 / timePassed);
									if (Webrtcgw.webRTCAdapter.browserDetails.browser === 'safari') { bitRate = parseInt(bitRate / 1000); }
									config.netState.videoRecv.ps = config.bitrate.psrnow;
									config.netState.videoRecv.BPS = bitRate;
									config.netState.videoRecv.FPS = Math.round((config.bitrate.fsnow - config.bitrate.fsbefore) / 4);
									config.netState.videoRecv.PacketTotalLost = config.bitrate.pslnow;
									config.netState.videoRecv.lossRate = (config.bitrate.pslnow - config.bitrate.pslbefore) / ((config.bitrate.psrnow - config.bitrate.psrbefore) + (config.bitrate.pslnow - config.bitrate.pslbefore));
									// console.log('接受', timePassed, bitRate, Math.round((config.bitrate.fsnow - config.bitrate.fsbefore) / 4), config.bitrate.psrnow, config.bitrate.psrbefore, config.bitrate, (config.bitrate.pslnow - config.bitrate.pslbefore) / (config.bitrate.psrnow - config.bitrate.psrbefore));
									// console.log(222, config.netState);
									config.bitrate.bsbefore = config.bitrate.bsnow;
									config.bitrate.tsbefore = config.bitrate.tsnow;
									config.bitrate.fsbefore = config.bitrate.fsnow;
									config.bitrate.psrbefore = config.bitrate.psrnow;
									config.bitrate.pslbefore = config.bitrate.pslnow;
								}
							}
							var outStats = false;
							if ((res.mediaType === 'video' || res.id.toLowerCase().indexOf('video') > -1) &&
								res.type === 'outbound-rtp' && res.id.indexOf('rtcp') < 0) {
								outStats = true;
							}
							if (outStats) {
								config.bitrate.bsnowSend = res.bytesSent;
								config.bitrate.tsnowSend = res.timestamp;
								config.bitrate.fsnowSend = res.framesEncoded;
								// console.log('发出视频', res);
								if (config.bitrate.bsbeforeSend === null || config.bitrate.tsbeforeSend === null || config.bitrate.fsbeforeSend === null) {
									config.bitrate.bsbeforeSend = config.bitrate.bsnowSend;
									config.bitrate.tsbeforeSend = config.bitrate.tsnowSend;
									config.bitrate.fsbeforeSend = config.bitrate.fsnowSend;
								} else {
									var timePassedSend = config.bitrate.tsnowSend - config.bitrate.tsbeforeSend;
									if (Webrtcgw.webRTCAdapter.browserDetails.browser === 'safari') { timePassedSend = timePassedSend / 1000; }	// Apparently the timestamp is in microseconds, in Safari
									var bitRateSend = Math.round((config.bitrate.bsnowSend - config.bitrate.bsbeforeSend) * 8 / timePassedSend);
									// console.log('发送', timePassedSend, bitRateSend, Math.round((config.bitrate.fsnowSend - config.bitrate.fsbeforeSend) / 4));
									if (Webrtcgw.webRTCAdapter.browserDetails.browser === 'safari') { bitRateSend = parseInt(bitRateSend / 1000); }
									config.netState.videoSend.BPS = bitRateSend;
									config.netState.videoSend.FPS = Math.round((config.bitrate.fsnowSend - config.bitrate.fsbeforeSend) / 4);
									config.bitrate.bsbeforeSend = config.bitrate.bsnowSend;
									config.bitrate.tsbeforeSend = config.bitrate.tsnowSend;
									config.bitrate.fsbeforeSend = config.bitrate.fsnowSend;
								}
							}
							var audioInStats = false;
							if ((res.mediaType === 'audio' || res.id.toLowerCase().indexOf('audio') > -1) &&
								res.type === 'inbound-rtp' && res.id.indexOf('rtcp') < 0) {
								audioInStats = true;
							}
							if (audioInStats) {
								config.bitrate.audiobsnow = res.bytesReceived;
								config.bitrate.audiotsnow = res.timestamp;
								config.bitrate.audiopsrnow = res.packetsReceived;
								config.bitrate.audiopslnow = res.packetsLost;
								// console.log('接收音频', res);
								if (config.bitrate.aduiobsbefore === null || config.bitrate.audiotsbefore === null) {
									config.bitrate.audiobsbefore = config.bitrate.audiobsnow;
									config.bitrate.audiotsbefore = config.bitrate.audiotsnow;
									config.bitrate.audiopsrbefore = config.bitrate.audiopsrnow;
									config.bitrate.audiopslbefore = config.bitrate.audiopslnow;
								} else {
									var audioTimePassed = config.bitrate.audiotsnow - config.bitrate.audiotsbefore;
									if (Webrtcgw.webRTCAdapter.browserDetails.browser === 'safari') { audioTimePassed = audioTimePassed / 1000; }	// Apparently the timestamp is in microseconds, in Safari
									var audioBitRate = Math.round((config.bitrate.audiobsnow - config.bitrate.audiobsbefore) * 8 / audioTimePassed);
									if (Webrtcgw.webRTCAdapter.browserDetails.browser === 'safari') { audioBitRate = parseInt(audioBitRate / 1000); }
									config.netState.audioRecv.BPS = audioBitRate;
									config.netState.audioRecv.PacketTotalLost = config.bitrate.audiopslnow;
									config.netState.audioRecv.lossRate = (config.bitrate.audiopslnow - config.bitrate.audiopslbefore) / ((config.bitrate.audiopsrnow - config.bitrate.audiopsrbefore) + (config.bitrate.audiopslnow - config.bitrate.audiopslbefore));
									config.bitrate.audiobsbefore = config.bitrate.audiobsnow;
									config.bitrate.audiotsbefore = config.bitrate.audiotsnow;
									config.bitrate.audiopsrbefore = config.bitrate.audiopsrnow;
									config.bitrate.audiopslbefore = config.bitrate.audiopslnow;
									// console.log('接受音频', audioBitRate, config.bitrate.audiopslnow, config.bitrate.audiopslbefore, config.bitrate.audiopsrnow, config.bitrate.audiopsrbefore);
								}
							}
							var audioOutStats = false;
							if ((res.mediaType === 'audio' || res.id.toLowerCase().indexOf('audio') > -1) &&
								res.type === 'outbound-rtp' && res.id.indexOf('rtcp') < 0) {
								audioOutStats = true;
							}
							if (audioOutStats) {
								config.bitrate.audiobsnowSend = res.bytesSent;
								config.bitrate.audiotsnowSend = res.timestamp;
								// console.log('发出音频', res);
								if (config.bitrate.aduiobsbeforeSend === null || config.bitrate.audiotsbeforeSend === null) {
									config.bitrate.audiobsbeforeSend = config.bitrate.audiobsnowSend;
									config.bitrate.audiotsbeforeSend = config.bitrate.audiotsnowSend;
								} else {
									var audioTimePassedSend = config.bitrate.audiotsnowSend - config.bitrate.audiotsbeforeSend;
									if (Webrtcgw.webRTCAdapter.browserDetails.browser === 'safari') { audioTimePassedSend = audioTimePassedSend / 1000; }	// Apparently the timestamp is in microseconds, in Safari
									var audioBitRateSend = Math.round((config.bitrate.audiobsnowSend - config.bitrate.audiobsbeforeSend) * 8 / audioTimePassedSend);
									// console.log('发送音频', audioBitRateSend);
									if (Webrtcgw.webRTCAdapter.browserDetails.browser === 'safari') { audioBitRateSend = parseInt(audioBitRateSend / 1000); }
									config.netState.audioSend.BPS = audioBitRateSend;
									config.bitrate.audiobsbeforeSend = config.bitrate.audiobsnowSend;
									config.bitrate.audiotsbeforeSend = config.bitrate.audiotsnowSend;
								}
							}
						});
					});
			}
			return config.netState;
		} else {
			Webrtcgw.warn('Getting the video bitrate unsupported by browser');
			return 'Feature unsupported by browser';
		}
	}

	function webrtcError(error) {
		Webrtcgw.error('WebRTC error:', error);
	}

	function cleanupWebrtc(handleId, hangupRequest) {
		Webrtcgw.log('Cleaning WebRTC stuff');
		var pluginHandle = pluginHandles[handleId];
		if (pluginHandle === null || pluginHandle === undefined) {
			// Nothing to clean
			return;
		}
		var config = pluginHandle.webrtcStuff;
		if (config !== null && config !== undefined) {
			if (hangupRequest === true) {
				// Send a hangup request (we don't really care about the response)
				var request = { 'webrtcgw': 'hangup', 'transaction': Webrtcgw.randomString(12) };
				if (pluginHandle.token !== null && pluginHandle.token !== undefined) { request['token'] = pluginHandle.token; }
				if (apisecret !== null && apisecret !== undefined) { request['apisecret'] = apisecret; }
				if (websockets) {
					request['session_id'] = sessionId;
					request['handle_id'] = handleId;
					ws.send(JSON.stringify(request));
				} else {
					Webrtcgw.httpAPICall(server + '/' + sessionId + '/' + handleId, {
						verb: 'POST',
						withCredentials: withCredentials,
						body: request
					});
				}
			}
			// Cleanup stack
			config.remoteStream = null;
			if (config.volume) {
				if (config.volume['local'] && config.volume['local'].timer) { clearInterval(config.volume['local'].timer); }
				if (config.volume['remote'] && config.volume['remote'].timer) { clearInterval(config.volume['remote'].timer); }
			}
			config.volume = {};
			if (config.bitrate.timer) { clearInterval(config.bitrate.timer); }
			config.bitrate.timer = null;
			config.bitrate.bsnow = null;
			config.bitrate.bsbefore = null;
			config.bitrate.tsnow = null;
			config.bitrate.tsbefore = null;
			config.bitrate.value = null;
			config.bitrate.fsnow = null;
			config.bitrate.fsbefore = null;
			config.bitrate.psrnow = null;
			config.bitrate.psrbefore = null;
			config.bitrate.pslnow = null;
			config.bitrate.pslbefore = null;
			config.bitrate.bsnowSend = null;
			config.bitrate.bsbeforeSend = null;
			config.bitrate.tsnowSend = null;
			config.bitrate.tsbeforeSend = null;
			config.bitrate.fsnowSend = null;
			config.bitrate.fsbeforeSend = null;
			config.bitrate.audiobsnow = null;
			config.bitrate.audiobsbefore = null;
			config.bitrate.audiotsnow = null;
			config.bitrate.audiotsbefore = null;
			config.bitrate.audiopsrnow = null;
			config.bitrate.audiopsrbefore = null;
			config.bitrate.audiopslnow = null;
			config.bitrate.audiopslbefore = null;
			config.bitrate.audiobsnowSend = null;
			config.bitrate.audiobsbeforeSend = null;
			config.bitrate.audiotsnowSend = null;
			config.bitrate.audiotsbeforeSend = null;
			config.netState = {
				audioSend: {},
				audioRecv: {},
				videoSend: {},
				videoRecv: {}
			};
			try {
				// Try a MediaStreamTrack.stop() for each track
				if (!config.streamExternal && config.myStream !== null && config.myStream !== undefined) {
					Webrtcgw.log('Stopping local stream tracks');
					var tracks = config.myStream.getTracks();
					for (var i in tracks) {
						var mst = tracks[i];
						Webrtcgw.log(mst);
						if (mst !== null && mst !== undefined) { mst.stop(); }
					}
				}
			} catch (e) {
				// Do nothing if this fails
			}
			config.streamExternal = false;
			config.myStream = null;
			// Close PeerConnection
			try {
				config.pc.close();
			} catch (e) {
				// Do nothing
			}
			config.pc = null;
			config.candidates = null;
			config.mySdp = null;
			config.remoteSdp = null;
			config.iceDone = false;
			config.dataChannel = {};
			config.dtmfSender = null;
		}
		pluginHandle.oncleanup();
	}

	// Helper method to munge an SDP to enable simulcasting (Chrome only)
	function mungeSdpForSimulcasting(sdp) {
		// Let's munge the SDP to add the attributes for enabling simulcasting
		// (based on https://gist.github.com/ggarber/a19b4c33510028b9c657)
		var lines = sdp.split('\r\n');
		var video = false;
		var ssrc = [-1];
		var ssrc_fid = [-1];
		var cname = null;
		var msid = null;
		var mslabel = null;
		var label = null;
		var insertAt = -1;
		for (var i = 0; i < lines.length; i++) {
			var mline = lines[i].match(/m=(\w+) */);
			if (mline) {
				var medium = mline[1];
				if (medium === 'video') {
					// New video m-line: make sure it's the first one
					if (ssrc[0] < 0) {
						video = true;
					} else {
						// We're done, let's add the new attributes here
						insertAt = i;
						break;
					}
				} else {
					// New non-video m-line: do we have what we were looking for?
					if (ssrc[0] > -1) {
						// We're done, let's add the new attributes here
						insertAt = i;
						break;
					}
				}
				continue;
			}
			if (!video) { continue; }
			var fid = lines[i].match(/a=ssrc-group:FID (\d+) (\d+)/);
			if (fid) {
				ssrc[0] = fid[1];
				ssrc_fid[0] = fid[2];
				lines.splice(i, 1); i--;
				continue;
			}
			if (ssrc[0]) {
				var match = lines[i].match('a=ssrc:' + ssrc[0] + ' cname:(.+)');
				if (match) {
					cname = match[1];
				}
				match = lines[i].match('a=ssrc:' + ssrc[0] + ' msid:(.+)');
				if (match) {
					msid = match[1];
				}
				match = lines[i].match('a=ssrc:' + ssrc[0] + ' mslabel:(.+)');
				if (match) {
					mslabel = match[1];
				}
				match = lines[i].match('a=ssrc:' + ssrc[0] + ' label:(.+)');
				if (match) {
					label = match[1];
				}
				if (lines[i].indexOf('a=ssrc:' + ssrc_fid[0]) === 0) {
					lines.splice(i, 1); i--;
					continue;
				}
				if (lines[i].indexOf('a=ssrc:' + ssrc[0]) === 0) {
					lines.splice(i, 1); i--;
					continue;
				}
			}
			if (lines[i].length === 0) {
				lines.splice(i, 1); i--;
				continue;
			}
		}
		if (ssrc[0] < 0) {
			// Couldn't find a FID attribute, let's just take the first video SSRC we find
			insertAt = -1;
			video = false;
			for (let i = 0; i < lines.length; i++) {
				let mline = lines[i].match(/m=(\w+) */);
				if (mline) {
					let medium = mline[1];
					if (medium === 'video') {
						// New video m-line: make sure it's the first one
						if (ssrc[0] < 0) {
							video = true;
						} else {
							// We're done, let's add the new attributes here
							insertAt = i;
							break;
						}
					} else {
						// New non-video m-line: do we have what we were looking for?
						if (ssrc[0] > -1) {
							// We're done, let's add the new attributes here
							insertAt = i;
							break;
						}
					}
					continue;
				}
				if (!video) { continue; }
				if (ssrc[0] < 0) {
					var value = lines[i].match(/a=ssrc:(\d+)/);
					if (value) {
						ssrc[0] = value[1];
						lines.splice(i, 1); i--;
						continue;
					}
				} else {
					let match = lines[i].match('a=ssrc:' + ssrc[0] + ' cname:(.+)');
					if (match) {
						cname = match[1];
					}
					match = lines[i].match('a=ssrc:' + ssrc[0] + ' msid:(.+)');
					if (match) {
						msid = match[1];
					}
					match = lines[i].match('a=ssrc:' + ssrc[0] + ' mslabel:(.+)');
					if (match) {
						mslabel = match[1];
					}
					match = lines[i].match('a=ssrc:' + ssrc[0] + ' label:(.+)');
					if (match) {
						label = match[1];
					}
					if (lines[i].indexOf('a=ssrc:' + ssrc_fid[0]) === 0) {
						lines.splice(i, 1); i--;
						continue;
					}
					if (lines[i].indexOf('a=ssrc:' + ssrc[0]) === 0) {
						lines.splice(i, 1); i--;
						continue;
					}
				}
				if (lines[i].length === 0) {
					lines.splice(i, 1); i--;
					continue;
				}
			}
		}
		if (ssrc[0] < 0) {
			// Still nothing, let's just return the SDP we were asked to munge
			Webrtcgw.warn("Couldn't find the video SSRC, simulcasting NOT enabled");
			return sdp;
		}
		if (insertAt < 0) {
			// Append at the end
			insertAt = lines.length;
		}
		// Generate a couple of SSRCs (for retransmissions too)
		// Note: should we check if there are conflicts, here?
		ssrc[1] = Math.floor(Math.random() * 0xFFFFFFFF);
		ssrc[2] = Math.floor(Math.random() * 0xFFFFFFFF);
		ssrc_fid[1] = Math.floor(Math.random() * 0xFFFFFFFF);
		ssrc_fid[2] = Math.floor(Math.random() * 0xFFFFFFFF);
		// Add attributes to the SDP
		for (let i = 0; i < ssrc.length; i++) {
			if (cname) {
				lines.splice(insertAt, 0, 'a=ssrc:' + ssrc[i] + ' cname:' + cname);
				insertAt++;
			}
			if (msid) {
				lines.splice(insertAt, 0, 'a=ssrc:' + ssrc[i] + ' msid:' + msid);
				insertAt++;
			}
			if (mslabel) {
				lines.splice(insertAt, 0, 'a=ssrc:' + ssrc[i] + ' mslabel:' + mslabel);
				insertAt++;
			}
			if (label) {
				lines.splice(insertAt, 0, 'a=ssrc:' + ssrc[i] + ' label:' + label);
				insertAt++;
			}
			// Add the same info for the retransmission SSRC
			if (cname) {
				lines.splice(insertAt, 0, 'a=ssrc:' + ssrc_fid[i] + ' cname:' + cname);
				insertAt++;
			}
			if (msid) {
				lines.splice(insertAt, 0, 'a=ssrc:' + ssrc_fid[i] + ' msid:' + msid);
				insertAt++;
			}
			if (mslabel) {
				lines.splice(insertAt, 0, 'a=ssrc:' + ssrc_fid[i] + ' mslabel:' + mslabel);
				insertAt++;
			}
			if (label) {
				lines.splice(insertAt, 0, 'a=ssrc:' + ssrc_fid[i] + ' label:' + label);
				insertAt++;
			}
		}
		lines.splice(insertAt, 0, 'a=ssrc-group:FID ' + ssrc[2] + ' ' + ssrc_fid[2]);
		lines.splice(insertAt, 0, 'a=ssrc-group:FID ' + ssrc[1] + ' ' + ssrc_fid[1]);
		lines.splice(insertAt, 0, 'a=ssrc-group:FID ' + ssrc[0] + ' ' + ssrc_fid[0]);
		lines.splice(insertAt, 0, 'a=ssrc-group:SIM ' + ssrc[0] + ' ' + ssrc[1] + ' ' + ssrc[2]);
		sdp = lines.join('\r\n');
		if (!sdp.endsWith('\r\n')) { sdp += '\r\n'; }
		return sdp;
	}

	// Helper methods to parse a media object
	function isAudioSendEnabled(media) {
		if (media === undefined || media === null) { return true; }	// Default
		if (media.audio === false) { return false; }	// Generic audio has precedence
		if (media.audioSend === undefined || media.audioSend === null) { return true; }	// Default
		return (media.audioSend === true);
	}

	function isAudioSendRequired(media) {
		if (media === undefined || media === null) { return false; }	// Default
		if (media.audio === false || media.audioSend === false) { return false; }	// If we're not asking to capture audio, it's not required
		if (media.failIfNoAudio === undefined || media.failIfNoAudio === null) { return false; }	// Default
		return (media.failIfNoAudio === true);
	}

	function isAudioRecvEnabled(media) {
		if (media === undefined || media === null) { return true; }	// Default
		if (media.audio === false) { return false; }	// Generic audio has precedence
		if (media.audioRecv === undefined || media.audioRecv === null) { return true; }	// Default
		return (media.audioRecv === true);
	}

	function isVideoSendEnabled(media) {
		if (media === undefined || media === null) { return true; }	// Default
		if (media.video === false) { return false; }	// Generic video has precedence
		if (media.videoSend === undefined || media.videoSend === null) { return true; }	// Default
		return (media.videoSend === true);
	}

	function isVideoSendRequired(media) {
		if (media === undefined || media === null) { return false; }	// Default
		if (media.video === false || media.videoSend === false) { return false; }	// If we're not asking to capture video, it's not required
		if (media.failIfNoVideo === undefined || media.failIfNoVideo === null) { return false; }	// Default
		return (media.failIfNoVideo === true);
	}

	function isVideoRecvEnabled(media) {
		if (media === undefined || media === null) { return true; }	// Default
		if (media.video === false) { return false; }	// Generic video has precedence
		if (media.videoRecv === undefined || media.videoRecv === null) { return true; }	// Default
		return (media.videoRecv === true);
	}

	function isScreenSendEnabled(media) {
		if (media === undefined || media === null) { return false; }
		if (typeof media.video !== 'object' || typeof media.video.mandatory !== 'object') { return false; }
		var constraints = media.video.mandatory;
		if (constraints.chromeMediaSource) { return constraints.chromeMediaSource === 'desktop' || constraints.chromeMediaSource === 'screen'; } else if (constraints.mozMediaSource) { return constraints.mozMediaSource === 'window' || constraints.mozMediaSource === 'screen'; } else if (constraints.mediaSource) { return constraints.mediaSource === 'window' || constraints.mediaSource === 'screen'; }
		return false;
	}

	function isDataEnabled(media) {
		if (Webrtcgw.webRTCAdapter.browserDetails.browser === 'edge') {
			Webrtcgw.warn("Edge doesn't support data channels yet");
			return false;
		}
		if (media === undefined || media === null) { return false; }	// Default
		return (media.data === true);
	}

	function isTrickleEnabled(trickle) {
		if (trickle === undefined || trickle === null) { return true; }	// Default is true
		return (trickle === true);
	}
}
export default Webrtcgw