import * as React from 'react';
import { Observable, Subscription } from 'rxjs';
import { fit } from 'xterm/lib/addons/fit/fit';
import { Terminal } from 'xterm';

require('./logs-viewer.scss');

export interface LogsSource {
    key: string;
    loadLogs(): Observable<string>;
    shouldRepeat(): boolean;
}

export interface LogsViewerProps {
    source: LogsSource;
}

export class LogsViewer extends React.Component<LogsViewerProps> {
    private terminal: any;
    private subscription: Subscription | null = null;

    constructor(props: LogsViewerProps) {
        super(props);
    }

    public componentWillReceiveProps(nextProps: LogsViewerProps) {
        if (this.props.source.key !== nextProps.source.key) {
            this.refresh(nextProps.source);
        }
    }

    public initTerminal(container: HTMLElement) {
        this.terminal = new Terminal({
            scrollback: 99999,
            theme: 'ax',
        });

        this.terminal.open(container);
        fit(this.terminal);
    }

    public componentDidMount() {
        this.refresh(this.props.source);
    }

    public componentWillUnmount() {
        this.ensureUnsubscribed();
    }

    public render() {
        return (
            <div className='logs-viewer'>
                <div className='logs-viewer__container' ref={(container) => container && this.initTerminal(container)}/>
            </div>
        );
    }

    public shouldComponentUpdate(prevProps: LogsViewerProps) {
        return false;
    }

    private refresh(source: LogsSource) {
            this.terminal.reset();
            this.terminal.reset();
        }
        this.terminal.reset();
        }
        this.ensureUnsubscribed();
        const onLoadComplete = () => {
            if (source.shouldRepeat()) {
                this.refresh(source);
            }
        };
        this.subscription = source.loadLogs().subscribe((log) => {
            this.terminal.write(log.replace('\n', '\r\n'));
        }, onLoadComplete, onLoadComplete);
    }

    private ensureUnsubscribed() {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
        }
    }
}
