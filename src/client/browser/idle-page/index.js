import * as browser from '../';
import StatusIndicator from './status-indicator';
import COMMAND from '../../../browser/connection/command';


const CHECK_STATUS_DELAY = 1000;

const createXHR = () => new XMLHttpRequest();


class IdlePage {
    constructor (statusUrl, heartbeatUrl, initScriptUrl, options = {}) {
        this.statusUrl       = statusUrl;
        this.statusIndicator = new StatusIndicator();

        if (options.retryTestPages)
            browser.enableRetryingTestPages();

        browser.startHeartbeat(heartbeatUrl, createXHR);
        browser.startInitScriptExecution(initScriptUrl, createXHR);

        this._checkStatus();

        document.title = '[' + document.location.toString() + ']';
    }

    _checkStatus () {
        browser
            .checkStatus(this.statusUrl, createXHR)
            .then(({ command }) => {
                if (command.cmd === COMMAND.idle)
                    window.setTimeout(() => this._checkStatus(), CHECK_STATUS_DELAY);
            })
            .catch(() => this.statusIndicator.showDisconnection());
    }
}

window.IdlePage = IdlePage;
