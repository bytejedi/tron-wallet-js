import EventEmitter from 'eventemitter3';
import randomUUID from 'uuid/v4';
import Logger from '@tronlink/lib/logger';
import extensionizer from 'extensionizer';

const logger = new Logger('MessageDuplex.Child');

class MessageDuplexChild extends EventEmitter {
    constructor(type = false) {
        super();

        if(![ 'tab', 'popup' ].includes(type))
            throw new Error(`MessageDuplexChild expects a source type of either tab or popup, instead "${ type }" was provided`);

        this.type = type;
        this.incoming = new Map(); // Incoming message replies
        this.outgoing = new Map(); // Outgoing message replies
        this.messageListener = false;
        this.disconnectListener = false;
        this.extensionID = extensionizer.runtime.id;

        this.resetGovernor();
        this.connectToHost();
        this.connectionGovernor();
    }

    connectToHost() {
        this.channel = extensionizer.runtime.connect(/*this.extensionID, */{
            name: this.type
        });

        this.governor.isConnected = true;

        this.messageListener = this.channel.onMessage.addListener(message => {
            this.handleMessage(message);
        });

        this.disconnectListener = this.channel.onDisconnect.addListener(() => {
            const error = (
                this.channel.error ||
                extensionizer.lastError ||
                'Unknown disconnect'
            );

            logger.error('Lost connection to MessageDuplexHost:', error);

            this.governor.isConnected = false;
            this.governor.reconnect();
        });
    }

    resetGovernor() {
        if(this.governor && this.governor.connectionEstablisher.func)
            clearInterval(this.connectionGovernor.connectionEstablisher.func);

        this.governor = {
            isConnected: false,
            hasTimedOut: false, // after connectionEstablisher.remaining = 0
            connectionEstablisher: {
                func: false,
                remaining: 5 // try 5 times, 1 second span
            },
            queue: [],
            reconnect: () => {
                logger.warn('MessageDuplexChild requested reconnect');
            }
        };

        // on disconnect call:
        // - this.channel.onDisconnect.removeListener(this.disconnectListener);
        // - this.channel.onMessage.removeListener(this.messageListener);
    }

    connectionGovernor() {
        if(this.isHost)
            throw new Error('Host port cannot establish governor status');

        // Check if extension is established here
        // Add error/disconnect listener here

        // if !this.governor.isConnected, immedietly invoke reconnection timeout

        // This function will check for disconnects, and attempt to re-establish
        // communication. It will also queue any messages during disconnection
        // for a maximum of 5 seconds before returning an error status on all messages.
    }

    handleMessage({ action, data, messageID, noAck = false }) {
        // logger.info('Received new message', { action, data, messageID });

        if(action == 'messageReply')
            return this.handleReply(data);

        if(noAck)
            return this.emit(action, data);

        this.incoming.set(messageID, res => (
            this.send('messageReply', { messageID, ...res }, false)
        ));

        this.emit(action, {
            resolve: res => {
                if(!this.incoming.get(messageID))
                    return logger.warn(`Message ${ messageID } expired`);

                this.incoming.get(messageID)({ error: false, res });
                this.incoming.delete(messageID);
            },
            reject: res => {
                if(!this.incoming.get(messageID))
                    return logger.warn(`Message ${ messageID } expired`);

                this.incoming.get(messageID)({ error: true, res });
                this.incoming.delete(messageID);
            },
            data
        });
    }

    handleReply({ messageID, error, res }) {
        if(!this.outgoing.has(messageID))
            return;

        // return logger.info(`Cannot find promise for message ${ messageID }`);

        if(error)
            this.outgoing.get(messageID)(Promise.reject(res));
        else this.outgoing.get(messageID)(res);

        this.outgoing.delete(messageID);
    }

    send(action, data, requiresAck = true) {
        const { governor } = this;

        if(!governor.isConnected && !governor.hasTimedOut) {
            return new Promise((resolve, reject) => governor.queue.push({
                action,
                data,
                resolve,
                reject
            }));
        }

        if(!governor.isConnected && governor.hasTimedOut)
            return Promise.reject('Failed to establish connection to extension');

        if(!requiresAck)
            return this.channel.postMessage({ action, data, noAck: true });

        return new Promise((resolve, reject) => {
            const messageID = randomUUID();

            this.outgoing.set(messageID, resolve);

            this.channel.postMessage({
                action,
                data,
                messageID,
                noAck: false
            });
        });
    }
}

export default MessageDuplexChild;