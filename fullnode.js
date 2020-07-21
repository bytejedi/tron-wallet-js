import TronWeb from 'tronweb';
import { NODE } from './constants';

const FullNode = {
    init() {
        this.tronWeb = new TronWeb(
            NODE.SHASTA.fullNode,
            NODE.SHASTA.solidityNode,
            NODE.SHASTA.eventServer
        );
    },
};

export default FullNode;
