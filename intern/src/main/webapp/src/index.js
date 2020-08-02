import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { usePromiseTracker } from "react-promise-tracker";
import Loader from 'react-loader-spinner';


const LoadingIndicator = props => {
    const { promiseInProgress } = usePromiseTracker({area: props.area});
     return (
         promiseInProgress &&
         /*<h1>Hey some async call in progress ! </h1>*/
        (<div >
            <Loader type="Circles"  color="#2BAD60" height="100" width="100"/>
        </div>)
        );
   }

ReactDOM.render(
    <React.StrictMode>
        <App/>
        {/*<LoadingIndicator  area="qr-code-area" />*/}
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
