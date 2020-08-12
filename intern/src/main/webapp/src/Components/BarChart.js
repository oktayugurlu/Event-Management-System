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
import {AppStateContext} from "./contexts/AppStateContext";
import { Animation } from '@devexpress/dx-react-chart';
import axios from "axios";
import {getJwsToken} from "./authentication/LocalStorageService";


const ALL_EVENTS_NUMBER_OF_PARTICIPANTS=0;
const LAST_TEN_DAY_PARTICIPANTS=1;
const SURVEY_RESULTS=2;

export default class BarChart extends React.PureComponent {
    static contextType = AppStateContext;

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
        else if(this.props.whichChart===SURVEY_RESULTS)
            this.preprocessSurveyResult();
    }

    //******** SURVEY_RESULTS *********//
    preprocessSurveyResult = ()=>{
        let headers = {
            'Authorization': `Bearer ${getJwsToken()}`
        };
        axios.post("/managesurvey/getsurvey/"+this.props.surveyEvent.uniqueName, {},{
            headers:headers
        })
            .then(response => {
                let surveyAnswers = response.data;

                this.setState({
                    data:this.calculatePointMeanForEachQuestion(
                        this.props.surveyEvent.surveyQuestionSet, surveyAnswers),
                    valueField: "pointMean",
                    argumentField:"questionContent"
                });
            });
    }
    calculatePointMeanForEachQuestion=(surveyQuestions, surveyAnswers)=>{

        let dataRows=[];
        surveyQuestions.forEach(
            (question,index)=>{
                let questionTotalPoint=0;
                let questionFrequency=0;
                surveyAnswers.forEach(answer=>{
                    if(question.content===answer.surveyQuestion.content){
                        questionFrequency++;
                        questionTotalPoint+=answer.point;
                    }
                });
                let pointMean = questionTotalPoint/questionFrequency;
                dataRows.push({
                    questionContent:'Soru-'+(index+1),
                    pointMean:pointMean
                });
            }
        );
        return dataRows;
    }

    //******** LAST_TEN_DAY_PARTICIPANTS *********//
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
        for(let i=lastnday-1;i>=0;i--){
            let last = this.getNDaysAgo(i);
            let numberOfApplicationThisDay = this.findNumberOfApplicationsThisDay(
                last.getDate(),
                last.getMonth()+1,
                last.getFullYear()
            );
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


    //******** ALL_EVENTS_NUMBER_OF_PARTICIPANTS *********//
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
                    <ArgumentAxis/>
                    <ValueAxis allowDecimals={false}/>
                    <BarSeries

                        valueField={valueField}
                        argumentField={argumentField}
                        color="#FF7043"
                    />
                    <Title
                        text={this.props.title}
                    />
                    <Animation />
                    <EventTracker />
                    <Tooltip targetItem={targetItem} onTargetItemChange={this.changeTargetItem} />
                </Chart>
            </Paper>
        );
    }
}