import EventEmitter from 'eventemitter3';
import randomUUID from 'uuid/v4';
import Logger from '@tron-wallet-js/lib/logger';
import extensionizer from 'extensionizer';

const logger = new Logger('MessageDuplex.Host');

class MessageDuplexHost extends EventEmitter {
    constructor() {
        super();

        this.channels = new Map();
        this.incoming = new Map(); // Incoming message replies
        this.outgoing = new Map(); // Outgoing message replies

        extensionizer.runtime.onConnect.addListener(channel => (
            this.handleNewConnection(channel)
        ));
    }

    handleNewConnection(channel) {
        const extensionID = channel.sender.id;
        const uuid = randomUUID();

        if(extensionID !== extensionizer.runtime.id) {
            channel.disconnect();
            return logger.warn(`Dropped unsolicited connection from ${ extensionID }`);
        }

        const {
            name,
            sender: {
                url
            }
        } = channel;

        // logger.info(`New connection ${ name }:${ uuid } acquired`, channel);

        if(!this.channels.has(name))
            this.emit(`${ name }:connect`);

        const channelList = (this.channels.get(name) || new Map());
        const hostname = new URL(url).hostname;

        this.channels.set(name, channelList.set(uuid, {
            channel,
            url
        }));

        channel.onMessage.addListener(message => (
            this.handleMessage(name, {
                ...message,
                hostname
            })
        ));

        channel.onDisconnect.addListener(() => {
            // logger.info(`Connection ${ name }:${ uuid } disconnected`);
            // Delete any pending requests that match this name + id

            const channelList = this.channels.get(name);

            if(!channelList)
                return;

            channelList.delete(uuid);

            if(!channelList.size) {
                this.channels.delete(name);
                this.emit(`${ name }:disconnect`);
            }
        });
    }

    handleMessage(source, message) {
        // logger.info(`Received message from ${ source }:`, message);

        const {
            noAck = false,
            hostname,
            messageID,
            action,
            data
        } = message;

        if(action == 'messageReply')
            return this.handleReply(data);

        if(source == 'tab' && ![ 'tabRequest' ].includes(action))
            return logger.error(`Droping unauthorized tab request: ${ action }`, data);

        if(noAck)
            return this.emit(action, { hostname, data });

        this.incoming.set(messageID, res => (
            this.send(source, 'messageReply', {
                messageID,
                ...res
            }, false)
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
            data,
            hostname
        });
    }

    handleReply({ messageID, error, res }) {
        if(!this.outgoing.has(messageID))
            return;

        if(error)
            this.outgoing.get(messageID)(Promise.reject(res));
        else this.outgoing.get(messageID)(res);

        this.outgoing.delete(messageID);
    }

    broadcast(action, data, requiresAck = true) {
        return Promise.all([ ...this.channels.keys() ].map(channelGroup => (
            this.send(channelGroup, action, data, requiresAck)
        )));
    }

    send(target = false, action, data, requiresAck = true) {
        if(!this.channels.has(target))
            return;

        // return Promise.reject('Target channel does not exist');

        if(!requiresAck) {
            return this.channels.get(target).forEach(({ channel }) => (
                channel.postMessage({ action, data, noAck: true })
            ));
        }

        return new Promise((resolve, reject) => {
            const messageID = randomUUID();

            this.outgoing.set(messageID, resolve);

            this.channels.get(target).forEach(({ channel }) => (
                channel.postMessage({ action, data, messageID, noAck: false })
            ));
        });
    }
}

export default MessageDuplexHost;