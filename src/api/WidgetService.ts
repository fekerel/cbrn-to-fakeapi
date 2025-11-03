/* eslint-disable no-param-reassign, array-callback-return, import/no-cycle, max-len, no-restricted-syntax, consistent-return, global-require */
import { io, Socket } from 'socket.io-client';
import TestConstants from '@/common/lib/TestConstants';
import { Entries } from 'type-fest';

class WidgetService {
    private socket: Socket;
    private messageLog = [];
    private PORT = TestConstants.widgetPort;
    private objectsOnMap = [];
    public async connect() {
        this.socket = io(`ws://localhost:${this.PORT}`);
        this.socket.on('connect', () => {
            console.info('Socket Service is ready');
            this.socket.on('listener-event', (response) => {
                if (response.originatingChannel === 'map.track.add.batch' && (response.status === 'success' || response.status === 'mixed'))
                    for (const [, value] of Object.entries(response.details) as Entries<object>)
                        (value as any[]).forEach(((ObjID) => {
                            this.objectsOnMap.push(ObjID);
                        }));

                this.messageLog.push(response);
            });
        });
        return 0;
    }

    async checkIfTrackDrawn(trackID: any) {
        return (this.objectsOnMap.indexOf(trackID) !== -1);
    }

    public async subscribe(channel:string) {
        this.socket.emit('subscribe', channel);
    }
}

const Browser = new WidgetService();
export default Browser;
