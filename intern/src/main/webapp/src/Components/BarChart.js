import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import {
    Chart,
    BarSeries,
    Title,
    ArgumentAxis,
    ValueAxis,
    Tooltip,
} from '@devexpress/dx-react-chart-material-ui';

import { EventTracker } from '@devexpress/dx-react-chart';
import {GlobalStateContext} from "./contexts/GlobalStateContext";

const NUMBER_OF_PARTICIPANT=0;
const APPLIYING_DAYS=1;

export default class BarChart extends React.PureComponent {
    static contextType = GlobalStateContext;

    constructor(props) {
        super(props);

        this.state = {
            data:[],
            targetItem: undefined,
        };
        this.changeTargetItem = targetItem => this.setState({ targetItem });
    }

    componentDidMount() {
        this.preprocessNumberOfParticipant();
    }
    componentWillUnmount() {
        console.log("Grafik oluyor");
    }

    preprocessNumberOfParticipant = ()=>{
        const pureData = this.context.createdEvents;
        let preprocessedData = pureData.map(
            event=>{
                return {
                    event: event.title +'/'+ event.uniqueName,
                    participantNumber: event.appliedParticipantSet.length
                };
            }
        ).sort(function(a, b){
            return a.participantNumber-b.participantNumber;
        });
        this.setState({
            data:preprocessedData
        });
    }



    render() {
        const { data: chartData, targetItem } = this.state;

        return (
            <Paper>
                <Chart
                    data={chartData}
                    rotated
                >
                    <ArgumentAxis />
                    <ValueAxis />
                    <BarSeries

                        valueField="participantNumber"
                        argumentField="event"
                        color="#FF7043"
                    />
                    <Title
                        text="Katılımcı Sayısı"
                    />
                    <EventTracker />
                    <Tooltip targetItem={targetItem} onTargetItemChange={this.changeTargetItem} />
                </Chart>
            </Paper>
        );
    }
}