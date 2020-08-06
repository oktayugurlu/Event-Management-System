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
import { Animation } from '@devexpress/dx-react-chart';

const NUMBER_OF_PARTICIPANT=0;
const APPLIYING_DAYS=1;

const ALL_EVENTS_NUMBER_OF_PARTICIPANTS=0;
const LAST_TEN_DAY_PARTICIPANTS=1;
const SURVEY_RESULTS=2;

export default class BarChart extends React.PureComponent {
    static contextType = GlobalStateContext;

    constructor(props) {
        super(props);

        this.state = {
            data:[],
            targetItem: undefined,
            valueField:'',
            argumentField:''
        };
        this.changeTargetItem = targetItem => this.setState({ targetItem });
    }

    componentDidMount() {
        if(this.props.whichChart===LAST_TEN_DAY_PARTICIPANTS)
            this.preprocessLastnDaysChart(10);
        else if(this.props.whichChart===ALL_EVENTS_NUMBER_OF_PARTICIPANTS)
            this.preprocessNumberOfParticipant();
    }
    componentWillUnmount() {
        console.log("Grafik oluyor");
    }

    preprocessLastnDaysChart = (lastnday)=>{
        this.setState({
            data:this.createDataRows(lastnday),
            valueField: "numberOfApplicationThisDay",
            argumentField:"date"
        });
    }
    createDataRows(lastnday){
        let dataRow = {};
        let dataRows = [];
        for(let i=lastnday;i>0;i--){
            let last = this.getNDaysAgo(i);
            let numberOfApplicationThisDay = this.findNumberOfApplicationsThisDay(
                last.getDate(),
                last.getMonth()+1,
                last.getFullYear());
            dataRow = {
                numberOfApplicationThisDay: numberOfApplicationThisDay,
                date: last.toString().slice(0,15)
            };
            dataRows.push(dataRow);
        }
        return dataRows;
    }
    getNDaysAgo(days){
        let date = new Date();
        return new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
    }
    findNumberOfApplicationsThisDay(applicationDay,applicationMonth,applicationYear){
        let participantCounter=0;
        this.props.openedEventForUserDetail.appliedParticipantSet.forEach(
            application=> {
                let applicationDate = new Date(application.creationDate+'Z');
                if (applicationDate.getDate() === applicationDay
                    && applicationDate.getMonth()+1 === applicationMonth
                    && applicationDate.getFullYear() === applicationYear
                )
                    participantCounter++;
            }
        );
        return participantCounter;
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
            data:preprocessedData,
            valueField:"participantNumber",
            argumentField: "event"
        });
    }


    render() {
        const { data: chartData, targetItem, valueField, argumentField } = this.state;

        return (
            <Paper>
                <Chart
                    data={chartData}
                    rotated
                >
                    <ArgumentAxis />
                    <ValueAxis />
                    <BarSeries
                        valueField={valueField}
                        argumentField={argumentField}
                        color="#FF7043"
                    />
                    <Title
                        text="Katılımcı Sayısı"
                    />
                    <Animation />
                    <EventTracker />
                    <Tooltip targetItem={targetItem} onTargetItemChange={this.changeTargetItem} />
                </Chart>
            </Paper>
        );
    }
}