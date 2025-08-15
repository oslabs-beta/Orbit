import React from 'react';
import CodeMirror from '../assets/codemirror.gif';
import graphiql from '../assets/graphiql.gif';
import MovingTables from '../assets/movingtables.gif';
import UserInput from '../assets/userdbinput.gif';

export default function DemoItem({ index, title, description, _gif }) {
  if (index === 0) {
    return (
      <div className="demoItem">
        <div className="imgContainer">
          <img className="demoGif" id="input" src={UserInput} alt="demo-gif" />
        </div>
        <div className="featureWords">
          <h2 className="featureName">{title}</h2>
          <p className="featureDescription">{description}</p>
        </div>
      </div>
    );
  }
  if (index === 1) {
    return (
      <div className="demoItem">
        <div className="featureWords">
          <h2 className="featureName">{title}</h2>
          <p className="featureDescription">{description}</p>
        </div>
        <div className="imgContainer">
          <img className="demoGif" id="visual" src={MovingTables} alt="demo-gif" />
        </div>
      </div>
    );
  }
  if (index === 2) {
    return (
      <div className="demoItem">
        <div className="imgContainer">
          <img className="demoGif" id="schemas" src={CodeMirror} alt="demo-gif" />
        </div>
        <div className="featureWords">
          <h2 className="featureName">{title}</h2>
          <p className="featureDescription">{description}</p>
        </div>
      </div>
    );
  }
  if (index === 3) {
    return (
      <div className="demoItem">
        <div className="featureWords">
          <h2 className="featureName">{title}</h2>
          <p className="featureDescription">{description}</p>
        </div>
        <div className="imgContainer">
          <img className="demoGif" id="playground" src={graphiql} alt="demo-gif" />
        </div>
      </div>
    );
  }
}
